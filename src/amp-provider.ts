import type { LanguageModelV2, ProviderV2 } from '@ai-sdk/provider';
import { NoSuchModelError } from '@ai-sdk/provider';
import { AmpLanguageModel, type AmpModelId } from './amp-language-model.js';
import type { AmpSettings } from './types.js';
import { validateSettings } from './validation.js';
import { getLogger } from './logger.js';

/**
 * Amp provider interface that extends the AI SDK's ProviderV2.
 * Provides methods to create language models for interacting with Amp.
 *
 * @example
 * ```typescript
 * import { amp } from 'ai-sdk-provider-amp-sdk';
 *
 * // Create a model instance
 * const model = amp('default');
 *
 * // Or use the explicit methods
 * const chatModel = amp.chat('default');
 * const languageModel = amp.languageModel('default', { maxTurns: 10 });
 * ```
 */
export interface AmpProvider extends ProviderV2 {
  /**
   * Creates a language model instance for the specified model ID.
   * This is a shorthand for calling `languageModel()`.
   *
   * @param modelId - The Amp model to use
   * @param settings - Optional settings to configure the model
   * @returns A language model instance
   */
  (modelId: AmpModelId, settings?: AmpSettings): LanguageModelV2;

  /**
   * Creates a language model instance for text generation.
   *
   * @param modelId - The Amp model to use
   * @param settings - Optional settings to configure the model
   * @returns A language model instance
   */
  languageModel(modelId: AmpModelId, settings?: AmpSettings): LanguageModelV2;

  /**
   * Alias for `languageModel()` to maintain compatibility with AI SDK patterns.
   *
   * @param modelId - The Amp model to use
   * @param settings - Optional settings to configure the model
   * @returns A language model instance
   */
  chat(modelId: AmpModelId, settings?: AmpSettings): LanguageModelV2;

  imageModel(modelId: string): never;
}

/**
 * Configuration options for creating an Amp provider instance.
 * These settings will be applied as defaults to all models created by the provider.
 *
 * @example
 * ```typescript
 * const provider = createAmp({
 *   defaultSettings: {
 *     maxTurns: 5,
 *     cwd: '/path/to/project'
 *   }
 * });
 * ```
 */
export interface AmpProviderSettings {
  /**
   * Default settings to use for all models created by this provider.
   * Individual model settings will override these defaults.
   */
  defaultSettings?: AmpSettings;
}

/**
 * Creates an Amp provider instance with the specified configuration.
 * The provider can be used to create language models for interacting with Amp.
 *
 * @param options - Provider configuration options
 * @returns Amp provider instance
 *
 * @example
 * ```typescript
 * const provider = createAmp({
 *   defaultSettings: {
 *     dangerouslyAllowAll: true,
 *     maxTurns: 10
 *   }
 * });
 *
 * const model = provider('default');
 * ```
 */
export function createAmp(options: AmpProviderSettings = {}): AmpProvider {
  // Get logger from default settings if provided
  const logger = getLogger(options.defaultSettings?.logger);

  // Validate default settings if provided
  if (options.defaultSettings) {
    const validation = validateSettings(options.defaultSettings);
    if (!validation.valid) {
      throw new Error(`Invalid default settings: ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      validation.warnings.forEach((warning) => logger.warn(`Amp Provider: ${warning}`));
    }
  }

  const createModel = (modelId: AmpModelId, settings: AmpSettings = {}): LanguageModelV2 => {
    const mergedSettings = {
      ...options.defaultSettings,
      ...settings,
    };

    // Validate merged settings
    const validation = validateSettings(mergedSettings);
    if (!validation.valid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    return new AmpLanguageModel({
      id: modelId,
      settings: mergedSettings,
      settingsValidationWarnings: validation.warnings,
    });
  };

  const provider = function (modelId: AmpModelId, settings?: AmpSettings) {
    if (new.target) {
      throw new Error('The Amp model function cannot be called with the new keyword.');
    }

    return createModel(modelId, settings);
  };

  provider.languageModel = createModel;
  provider.chat = createModel; // Alias for languageModel

  // Add textEmbeddingModel method that throws NoSuchModelError
  provider.textEmbeddingModel = (modelId: string) => {
    throw new NoSuchModelError({
      modelId,
      modelType: 'textEmbeddingModel',
    });
  };

  provider.imageModel = (modelId: string) => {
    throw new NoSuchModelError({
      modelId,
      modelType: 'imageModel',
    });
  };

  return provider as AmpProvider;
}

/**
 * Default Amp provider instance.
 * Pre-configured provider for quick usage without custom settings.
 *
 * @example
 * ```typescript
 * import { amp } from 'ai-sdk-provider-amp-sdk';
 * import { generateText } from 'ai';
 *
 * const { text } = await generateText({
 *   model: amp('default'),
 *   prompt: 'Hello, Amp!'
 * });
 * ```
 */
export const amp = createAmp();
