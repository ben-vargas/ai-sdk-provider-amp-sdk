import type { AmpSettings } from './types.js';

/**
 * Result of settings validation.
 */
export interface ValidationResult {
  /**
   * Whether the settings are valid
   */
  valid: boolean;

  /**
   * List of validation errors
   */
  errors: string[];

  /**
   * List of validation warnings
   */
  warnings: string[];
}

/**
 * Validates Amp settings.
 *
 * @param settings - Settings to validate
 * @returns Validation result
 */
export function validateSettings(settings: AmpSettings): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate maxTurns
  if (settings.maxTurns !== undefined) {
    if (!Number.isInteger(settings.maxTurns) || settings.maxTurns < 1) {
      errors.push('maxTurns must be a positive integer');
    }
  }

  // Validate cwd
  if (settings.cwd !== undefined) {
    if (typeof settings.cwd !== 'string' || settings.cwd.trim() === '') {
      errors.push('cwd must be a non-empty string');
    }
  }

  // Validate logLevel
  if (settings.logLevel !== undefined) {
    const validLevels = ['debug', 'info', 'warn', 'error', 'audit'];
    if (!validLevels.includes(settings.logLevel)) {
      errors.push(`logLevel must be one of: ${validLevels.join(', ')}`);
    }
  }

  // Validate continue and resume (mutually exclusive)
  if (settings.continue && settings.resume) {
    errors.push('continue and resume cannot be used together');
  }

  // Validate permissions
  if (settings.permissions !== undefined) {
    if (!Array.isArray(settings.permissions)) {
      errors.push('permissions must be an array');
    }
  }

  // Warn about verbose with logger: false
  if (settings.verbose && settings.logger === false) {
    warnings.push('verbose is enabled but logger is disabled, no logs will be output');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a model ID.
 *
 * @param modelId - Model ID to validate
 * @returns Warning message if validation fails, undefined otherwise
 */
export function validateModelId(modelId: string): string | undefined {
  if (!modelId || typeof modelId !== 'string' || modelId.trim() === '') {
    return 'Model ID must be a non-empty string';
  }

  // Amp accepts any model string, so we just validate the format
  // No specific model validation needed unless Amp has specific requirements

  return undefined;
}

/**
 * Validates a prompt.
 *
 * @param prompt - Prompt to validate
 * @returns Warning message if validation fails, undefined otherwise
 */
export function validatePrompt(prompt: string): string | undefined {
  if (!prompt || typeof prompt !== 'string') {
    return 'Prompt must be a non-empty string';
  }

  const maxPromptLength = 500_000; // 500KB limit
  if (prompt.length > maxPromptLength) {
    return `Prompt exceeds maximum length of ${maxPromptLength} characters (got ${prompt.length})`;
  }

  return undefined;
}

/**
 * Validates a session ID.
 *
 * @param sessionId - Session ID to validate
 * @returns Warning message if validation fails, undefined otherwise
 */
export function validateSessionId(sessionId: string): string | undefined {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
    return 'Session ID must be a non-empty string';
  }

  return undefined;
}
