import type { LanguageModelV2FinishReason } from '@ai-sdk/provider';

/**
 * Maps Amp SDK result subtypes to AI SDK finish reasons.
 *
 * @param subtype - Amp SDK result subtype
 * @returns AI SDK finish reason
 */
export function mapAmpFinishReason(
  subtype?: string
): LanguageModelV2FinishReason {
  switch (subtype) {
    case 'success':
      return 'stop';
    case 'error_max_turns':
      return 'length';
    case 'error_during_execution':
      return 'error';
    default:
      return 'unknown';
  }
}
