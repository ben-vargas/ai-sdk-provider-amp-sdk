import type {
  LanguageModelV2,
  LanguageModelV2CallWarning,
  LanguageModelV2FinishReason,
  LanguageModelV2StreamPart,
  LanguageModelV2Usage,
  JSONValue,
} from '@ai-sdk/provider';
import { NoSuchModelError } from '@ai-sdk/provider';
import { generateId } from '@ai-sdk/provider-utils';
import type { AmpSettings, Logger } from './types.js';
import { convertToAmpMessages } from './convert-to-amp-messages.js';
import { extractJson } from './extract-json.js';
import { createAPICallError, createAuthenticationError, checkApiKey } from './errors.js';
import { mapAmpFinishReason } from './map-amp-finish-reason.js';
import { validateModelId, validatePrompt } from './validation.js';
import { getLogger, createVerboseLogger } from './logger.js';

import { execute } from '@sourcegraph/amp-sdk';
import type { ExecuteOptions } from '@sourcegraph/amp-sdk';

/**
 * Options for creating an Amp language model instance.
 *
 * @example
 * ```typescript
 * const model = new AmpLanguageModel({
 *   id: 'default',
 *   settings: {
 *     maxTurns: 10,
 *     dangerouslyAllowAll: true
 *   }
 * });
 * ```
 */
export interface AmpLanguageModelOptions {
  /**
   * The model identifier to use.
   */
  id: AmpModelId;

  /**
   * Optional settings to configure the model behavior.
   */
  settings?: AmpSettings;

  /**
   * Validation warnings from settings validation.
   * Used internally to pass warnings from provider.
   */
  settingsValidationWarnings?: string[];
}

/**
 * Supported Amp model identifiers.
 * Amp accepts any string as a model identifier.
 *
 * @example
 * ```typescript
 * const model = amp('default');
 * const customModel = amp('my-custom-model');
 * ```
 */
export type AmpModelId = string;

/**
 * Language model implementation for Amp SDK.
 * This class implements the AI SDK's LanguageModelV2 interface to provide
 * integration with Amp through the Amp SDK.
 *
 * Features:
 * - Supports streaming and non-streaming generation
 * - Handles JSON object generation mode
 * - Manages sessions for conversation continuity
 * - Provides detailed error handling and retry logic
 *
 * @example
 * ```typescript
 * const model = new AmpLanguageModel({
 *   id: 'default',
 *   settings: { maxTurns: 5 }
 * });
 *
 * const result = await model.doGenerate({
 *   prompt: [{ role: 'user', content: 'Hello!' }],
 *   mode: { type: 'regular' }
 * });
 * ```
 */
export class AmpLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'v2' as const;
  readonly defaultObjectGenerationMode = 'json' as const;
  readonly supportsImageUrls = false;
  readonly supportedUrls = {};
  readonly supportsStructuredOutputs = false;

  readonly modelId: AmpModelId;
  readonly settings: AmpSettings;

  private sessionId?: string;
  private modelValidationWarning?: string;
  private settingsValidationWarnings: string[];
  private logger: Logger;

  constructor(options: AmpLanguageModelOptions) {
    this.modelId = options.id;
    this.settings = options.settings ?? {};
    this.settingsValidationWarnings = options.settingsValidationWarnings ?? [];

    // Create logger that respects verbose setting
    const baseLogger = getLogger(this.settings.logger);
    this.logger = createVerboseLogger(baseLogger, this.settings.verbose ?? false);

    // Validate model ID format
    if (!this.modelId || typeof this.modelId !== 'string' || this.modelId.trim() === '') {
      throw new NoSuchModelError({
        modelId: this.modelId,
        modelType: 'languageModel',
      });
    }

    // Additional model ID validation
    this.modelValidationWarning = validateModelId(this.modelId);
    if (this.modelValidationWarning) {
      this.logger.warn(`Amp Model: ${this.modelValidationWarning}`);
    }
  }

  get provider(): string {
    return 'amp-sdk';
  }

  private getModel(): string {
    return this.modelId;
  }

  private setSessionId(sessionId: string): void {
    if (sessionId && !this.sessionId) {
      this.sessionId = sessionId;
      this.logger.debug(`[amp-sdk] Session ID set: ${sessionId}`);
    }
  }

  private generateAllWarnings(
    options:
      | Parameters<LanguageModelV2['doGenerate']>[0]
      | Parameters<LanguageModelV2['doStream']>[0],
    prompt: string
  ): LanguageModelV2CallWarning[] {
    const warnings: LanguageModelV2CallWarning[] = [];
    const unsupportedParams: string[] = [];

    // Check for unsupported parameters
    if (options.temperature !== undefined) unsupportedParams.push('temperature');
    if (options.topP !== undefined) unsupportedParams.push('topP');
    if (options.topK !== undefined) unsupportedParams.push('topK');
    if (options.presencePenalty !== undefined) unsupportedParams.push('presencePenalty');
    if (options.frequencyPenalty !== undefined) unsupportedParams.push('frequencyPenalty');
    if (options.stopSequences !== undefined && options.stopSequences.length > 0)
      unsupportedParams.push('stopSequences');
    if (options.seed !== undefined) unsupportedParams.push('seed');

    if (unsupportedParams.length > 0) {
      for (const param of unsupportedParams) {
        warnings.push({
          type: 'unsupported-setting',
          setting: param,
        });
      }
    }

    // Add settings validation warnings
    for (const warning of this.settingsValidationWarnings) {
      warnings.push({
        type: 'other',
        message: warning,
      });
    }

    // Add model validation warning
    if (this.modelValidationWarning) {
      warnings.push({
        type: 'other',
        message: this.modelValidationWarning,
      });
    }

    // Add prompt validation warning
    const promptWarning = validatePrompt(prompt);
    if (promptWarning) {
      warnings.push({
        type: 'other',
        message: promptWarning,
      });
    }

    return warnings;
  }

  private handleAmpError(error: unknown, prompt: string): Error {
    this.logger.error(`[amp-sdk] Error occurred: ${error}`);

    // Check for authentication errors
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      const message = error.message.toLowerCase();
      if (
        message.includes('unauthorized') ||
        message.includes('authentication') ||
        message.includes('api key') ||
        message.includes('not authenticated') ||
        message.includes('login required')
      ) {
        return createAuthenticationError(
          'Amp authentication failed.',
          error
        );
      }
    }

    // General API error
    return createAPICallError({
      message: error instanceof Error ? error.message : String(error),
      cause: error,
      metadata: {
        originalError: error instanceof Error ? error.message : String(error),
        prompt: prompt.substring(0, 100),
      },
    });
  }

  async doGenerate(
    options: Parameters<LanguageModelV2['doGenerate']>[0]
  ): Promise<{
    content: Array<{ type: 'text'; text: string }>;
    finishReason: LanguageModelV2FinishReason;
    usage: LanguageModelV2Usage;
    warnings: LanguageModelV2CallWarning[];
    rawResponse?: {
      headers?: Record<string, string>;
    };
    request?: { body: string };
    response?: { headers?: Record<string, string> };
    providerMetadata?: Record<string, Record<string, JSONValue>>;
  }> {
    // Note: Authentication is handled by the Amp CLI automatically
    // The CLI will use AMP_API_KEY env var or credentials from 'amp login'
    checkApiKey(); // No-op, but kept for future extensibility

    const messagesPrompt = convertToAmpMessages(options.prompt, options.responseFormat);
    const warnings = this.generateAllWarnings(options, messagesPrompt);

    this.logger.debug(`[amp-sdk] Starting doGenerate with prompt: ${messagesPrompt.substring(0, 100)}...`);

    // Build Amp SDK options
    const ampOptions: ExecuteOptions['options'] = {
      dangerouslyAllowAll: this.settings.dangerouslyAllowAll,
      cwd: this.settings.cwd,
      continue: this.settings.continue ? (this.settings.resume ?? this.sessionId) : undefined,
      logLevel: this.settings.logLevel,
      logFile: this.settings.logFile,
      mcpConfig: this.settings.mcpConfig,
      env: this.settings.env ? Object.fromEntries(
        Object.entries(this.settings.env).filter(([_, v]) => v !== undefined)
      ) as Record<string, string> : undefined,
      toolbox: this.settings.toolbox,
      permissions: this.settings.permissions,
    };

    let accumulatedText = '';
    let usage: LanguageModelV2Usage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };
    let finishReason: LanguageModelV2FinishReason = 'unknown';
    let sessionId: string | undefined;
    let costUsd: number | undefined;
    let durationMs: number | undefined;

    try {
      const response = execute({
        prompt: messagesPrompt,
        options: ampOptions,
        signal: options.abortSignal,
      });

      for await (const message of response) {
        this.logger.debug(`[amp-sdk] Received message type: ${message.type}`);

        if (message.type === 'system' && message.subtype === 'init') {
          // Store session ID
          this.setSessionId(message.session_id);
          sessionId = message.session_id;
          this.logger.info(`[amp-sdk] Session initialized: ${sessionId}`);
        } else if (message.type === 'assistant') {
          // Accumulate assistant text
          if (message.message?.content) {
            const content = message.message.content;
            const text = content
              .map((c: { type: string; text?: string }) => (c.type === 'text' ? c.text : ''))
              .join('');
            if (text) {
              accumulatedText += text;
            }
          }
        } else if (message.type === 'result') {
          // Extract final result
          this.logger.info(
            `[amp-sdk] Generation completed - Session: ${message.session_id}, Duration: ${message.duration_ms ?? 'N/A'}ms`
          );

          sessionId = message.session_id;
          this.setSessionId(message.session_id);
          durationMs = message.duration_ms;

          if (!message.is_error) {
            // Success result
            // Note: Don't overwrite accumulatedText with message.result
            // The accumulatedText from assistant messages is what we want
            // message.result is the formatted final answer which may include markdown

            // Extract usage if available
            if ('usage' in message && message.usage) {
              const rawUsage = message.usage as {
                input_tokens?: number;
                output_tokens?: number;
                cache_creation_input_tokens?: number;
                cache_read_input_tokens?: number;
              };
              usage = {
                inputTokens:
                  (rawUsage.cache_creation_input_tokens ?? 0) +
                  (rawUsage.cache_read_input_tokens ?? 0) +
                  (rawUsage.input_tokens ?? 0),
                outputTokens: rawUsage.output_tokens ?? 0,
                totalTokens:
                  (rawUsage.cache_creation_input_tokens ?? 0) +
                  (rawUsage.cache_read_input_tokens ?? 0) +
                  (rawUsage.input_tokens ?? 0) +
                  (rawUsage.output_tokens ?? 0),
              };
            }

            // Extract cost if available
            if ('total_cost_usd' in message) {
              const msg = message as { total_cost_usd?: number };
              if (typeof msg.total_cost_usd === 'number') {
                costUsd = msg.total_cost_usd;
              }
            }

            finishReason = mapAmpFinishReason(message.subtype);
          } else {
            // Error result
            const errorMsg = 'error' in message ? String(message.error) : 'Unknown error';
            throw createAPICallError({
              message: errorMsg,
              metadata: {
                originalError: errorMsg,
                prompt: messagesPrompt.substring(0, 100),
                sessionId: message.session_id,
                durationMs: message.duration_ms,
                numTurns: message.num_turns,
              },
            });
          }
        }
      }

      // Handle JSON mode
      if (options.responseFormat?.type === 'json' && accumulatedText) {
        const extractedJson = extractJson(accumulatedText);
        try {
          JSON.parse(extractedJson);
          accumulatedText = extractedJson;
        } catch (error) {
          warnings.push({
            type: 'other',
            message: 'Failed to extract valid JSON from response',
          });
          this.logger.warn('[amp-sdk] Failed to extract valid JSON from response');
        }
      }

      this.logger.debug(`[amp-sdk] Generation complete. Text length: ${accumulatedText.length}`);

      return {
        content: [{ type: 'text' as const, text: accumulatedText }],
        finishReason,
        usage,
        warnings,
        request: { body: messagesPrompt },
        providerMetadata: {
          'amp-sdk': {
            sessionId: sessionId as JSONValue,
            ...(costUsd !== undefined && { costUsd: costUsd as JSONValue }),
            ...(durationMs !== undefined && { durationMs: durationMs as JSONValue }),
          },
        },
      };
    } catch (error: unknown) {
      throw this.handleAmpError(error, messagesPrompt);
    }
  }

  async doStream(
    options: Parameters<LanguageModelV2['doStream']>[0]
  ): Promise<{
    stream: ReadableStream<LanguageModelV2StreamPart>;
    request: { body: string };
  }> {
    // Note: Authentication is handled by the Amp CLI automatically
    // The CLI will use AMP_API_KEY env var or credentials from 'amp login'
    checkApiKey(); // No-op, but kept for future extensibility

    const messagesPrompt = convertToAmpMessages(options.prompt, options.responseFormat);
    const warnings = this.generateAllWarnings(options, messagesPrompt);

    this.logger.debug(`[amp-sdk] Starting doStream with prompt: ${messagesPrompt.substring(0, 100)}...`);

    // Build Amp SDK options
    const ampOptions: ExecuteOptions['options'] = {
      dangerouslyAllowAll: this.settings.dangerouslyAllowAll,
      cwd: this.settings.cwd,
      continue: this.settings.continue ? (this.settings.resume ?? this.sessionId) : undefined,
      logLevel: this.settings.logLevel,
      logFile: this.settings.logFile,
      mcpConfig: this.settings.mcpConfig,
      env: this.settings.env ? Object.fromEntries(
        Object.entries(this.settings.env).filter(([_, v]) => v !== undefined)
      ) as Record<string, string> : undefined,
      toolbox: this.settings.toolbox,
      permissions: this.settings.permissions,
    };

    const self = this;
    const stream = new ReadableStream<LanguageModelV2StreamPart>({
      async start(controller) {
        let accumulatedText = '';
        let textPartId: string | undefined;
        let usage: LanguageModelV2Usage = {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        };

        try {
          // Always emit stream-start for consistent stream lifecycle
          controller.enqueue({
            type: 'stream-start',
            warnings,
          });

          const response = execute({
            prompt: messagesPrompt,
            options: ampOptions,
            signal: options.abortSignal,
          });

          for await (const message of response) {
            if (message.type === 'system' && message.subtype === 'init') {
              // Store session ID
              self.setSessionId(message.session_id);
              
              // Emit response metadata
              controller.enqueue({
                type: 'response-metadata',
                id: message.session_id,
                timestamp: new Date(),
                modelId: self.getModel(),
              });
            } else if (message.type === 'assistant') {
              // Stream assistant text
              if (message.message?.content) {
                const content = message.message.content;
                const text = content
                  .map((c: { type: string; text?: string }) => (c.type === 'text' ? c.text : ''))
                  .join('');

                if (text) {
                  accumulatedText += text;

                  // In JSON mode, we accumulate the text and extract JSON at the end
                  // Otherwise, stream the text as it comes
                  if (options.responseFormat?.type !== 'json') {
                    // Emit text-start if this is the first text
                    if (!textPartId) {
                      textPartId = generateId();
                      controller.enqueue({
                        type: 'text-start',
                        id: textPartId,
                      });
                    }

                    controller.enqueue({
                      type: 'text-delta',
                      id: textPartId,
                      delta: text,
                    });
                  }
                }
              }
            } else if (message.type === 'result') {
              // Handle final result
              const sessionId = message.session_id;
              self.setSessionId(sessionId);

              if (!message.is_error) {
                // Extract usage if available
                if ('usage' in message && message.usage) {
                  const rawUsage = message.usage as {
                    input_tokens?: number;
                    output_tokens?: number;
                    cache_creation_input_tokens?: number;
                    cache_read_input_tokens?: number;
                  };
                  usage = {
                    inputTokens:
                      (rawUsage.cache_creation_input_tokens ?? 0) +
                      (rawUsage.cache_read_input_tokens ?? 0) +
                      (rawUsage.input_tokens ?? 0),
                    outputTokens: rawUsage.output_tokens ?? 0,
                    totalTokens:
                      (rawUsage.cache_creation_input_tokens ?? 0) +
                      (rawUsage.cache_read_input_tokens ?? 0) +
                      (rawUsage.input_tokens ?? 0) +
                      (rawUsage.output_tokens ?? 0),
                  };
                }

                // Handle JSON mode
                if (options.responseFormat?.type === 'json' && accumulatedText) {
                  const extractedJson = extractJson(accumulatedText);
                  const jsonTextId = generateId();
                  controller.enqueue({
                    type: 'text-start',
                    id: jsonTextId,
                  });
                  controller.enqueue({
                    type: 'text-delta',
                    id: jsonTextId,
                    delta: extractedJson,
                  });
                  controller.enqueue({
                    type: 'text-end',
                    id: jsonTextId,
                  });
                } else if (textPartId) {
                  // Close the text part if it was opened
                  controller.enqueue({
                    type: 'text-end',
                    id: textPartId,
                  });
                }

                const finishReason = mapAmpFinishReason(message.subtype);

                controller.enqueue({
                  type: 'finish',
                  finishReason,
                  usage,
                  providerMetadata: {
                    'amp-sdk': {
                      sessionId: sessionId as JSONValue,
                      ...('total_cost_usd' in message && typeof (message as { total_cost_usd?: number }).total_cost_usd === 'number' && {
                        costUsd: (message as { total_cost_usd?: number }).total_cost_usd as JSONValue,
                      }),
                      ...(message.duration_ms !== undefined && { durationMs: message.duration_ms as JSONValue }),
                    },
                  },
                });
              } else {
                // Error result
                const errorMsg = 'error' in message ? String(message.error) : 'Unknown error';
                throw createAPICallError({
                  message: errorMsg,
                  metadata: {
                    originalError: errorMsg,
                    sessionId: message.session_id,
                    durationMs: message.duration_ms,
                    numTurns: message.num_turns,
                  },
                });
              }
            }
          }

          controller.close();
        } catch (error: unknown) {
          controller.enqueue({
            type: 'error',
            error: self.handleAmpError(error, messagesPrompt),
          });
          controller.close();
        }
      },
    });

    return {
      stream,
      request: {
        body: messagesPrompt,
      },
    };
  }
}
