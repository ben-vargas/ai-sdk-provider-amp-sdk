import type { LanguageModelV2Prompt } from '@ai-sdk/provider';

/**
 * Converts AI SDK v5 prompt to Amp SDK prompt format.
 *
 * @param prompt - AI SDK v5 prompt
 * @param responseFormat - Response format configuration
 * @returns Amp SDK prompt string
 */
export function convertToAmpMessages(
  prompt: LanguageModelV2Prompt,
  responseFormat?: { type: 'json' | 'text'; schema?: unknown }
): string {
  const messages: string[] = [];

  // If JSON mode is requested, add instructions at the beginning
  if (responseFormat?.type === 'json') {
    messages.push(
      'IMPORTANT: You must respond with ONLY valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Return ONLY the raw JSON object.'
    );
    if (responseFormat.schema) {
      messages.push(`\nThe JSON must match this schema: ${JSON.stringify(responseFormat.schema)}`);
    }
    messages.push('');  // Add blank line for separation
  }

  for (const message of prompt) {
    if (message.role === 'system') {
      // System messages are included as part of the prompt
      for (const part of message.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (typeof part === 'string') {
          messages.push(`System: ${part}`);
        } else if (p.type === 'text') {
          messages.push(`System: ${p.text}`);
        }
      }
    } else if (message.role === 'user') {
      // User messages
      const userParts: string[] = [];
      for (const part of message.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (typeof part === 'string') {
          userParts.push(part);
        } else if (p.type === 'text') {
          userParts.push(p.text);
        } else if (p.type === 'image') {
          // Handle image parts - Amp SDK supports images via base64 encoding
          if (typeof p.image === 'string') {
            userParts.push(`[Image: ${p.image.substring(0, 50)}...]`);
          } else if (typeof p.image === 'object' && p.image) {
            if (p.image.url) {
              userParts.push(`[Image URL: ${p.image.url}]`);
            } else if (p.image.base64) {
              userParts.push(`[Image: base64 data]`);
            }
          }
        }
      }
      if (userParts.length > 0) {
        messages.push(userParts.join('\n'));
      }
    } else if (message.role === 'assistant') {
      // Assistant messages
      const assistantParts: string[] = [];
      for (const part of message.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (p.type === 'text') {
          assistantParts.push(p.text);
        } else if (p.type === 'tool-call') {
          // Handle tool calls if Amp supports them
          assistantParts.push(
            `[Tool Call: ${p.toolName} with args ${JSON.stringify(p.args || {})}]`
          );
        }
      }
      if (assistantParts.length > 0) {
        messages.push(`Assistant: ${assistantParts.join('\n')}`);
      }
    } else if (message.role === 'tool') {
      // Tool results
      for (const part of message.content) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (p.type === 'tool-result') {
          const resultStr =
            typeof p.result === 'string'
              ? p.result
              : JSON.stringify(p.result);
          messages.push(`Tool Result (${p.toolName}): ${resultStr}`);
        }
      }
    }
  }

  return messages.join('\n\n');
}
