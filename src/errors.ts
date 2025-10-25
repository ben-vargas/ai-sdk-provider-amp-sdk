import { APICallError, LoadAPIKeyError } from '@ai-sdk/provider';

/**
 * Metadata associated with Amp errors.
 * Contains additional context about SDK execution failures.
 */
export interface AmpErrorMetadata {
  /**
   * The original error message from Amp SDK
   */
  originalError?: string;

  /**
   * The prompt that was sent to Amp
   */
  prompt?: string;

  /**
   * Session ID if available
   */
  sessionId?: string;

  /**
   * Duration of the request in milliseconds
   */
  durationMs?: number;

  /**
   * Number of conversation turns completed
   */
  numTurns?: number;
}

/**
 * Creates an API call error with Amp-specific metadata.
 *
 * @param options - Error options
 * @returns An APICallError instance
 */
export function createAPICallError(options: {
  message: string;
  cause?: unknown;
  metadata?: AmpErrorMetadata;
}): APICallError {
  return new APICallError({
    message: options.message,
    url: 'amp-sdk',
    requestBodyValues: options.metadata || {},
    cause: options.cause,
  });
}

/**
 * Creates an authentication error for missing or invalid API key.
 *
 * @param message - Error message
 * @param cause - Original error cause
 * @returns An APICallError instance
 */
export function createAuthenticationError(message: string, cause?: unknown): APICallError {
  const enhancedMessage = `${message}\n\nTo authenticate with Amp, you can either:\n1. Set AMP_API_KEY environment variable: export AMP_API_KEY=sgamp_your_key\n2. Run 'amp login' to store credentials locally\n\nGet your API key from https://ampcode.com/settings`;
  
  return new APICallError({
    message: enhancedMessage,
    url: 'amp-sdk',
    requestBodyValues: {},
    statusCode: 401,
    cause,
  });
}

/**
 * Creates a timeout error.
 *
 * @param message - Error message
 * @param cause - Original error cause
 * @returns An APICallError instance
 */
export function createTimeoutError(message: string, cause?: unknown): APICallError {
  return new APICallError({
    message,
    url: 'amp-sdk',
    requestBodyValues: {},
    isRetryable: true,
    cause,
  });
}

/**
 * Checks if an error is an authentication error.
 *
 * @param error - The error to check
 * @returns true if the error is an authentication error
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof APICallError) {
    return error.statusCode === 401 || error.statusCode === 403;
  }
  if (error instanceof LoadAPIKeyError) {
    return true;
  }
  return false;
}

/**
 * Checks if an error is a timeout error.
 *
 * @param error - The error to check
 * @returns true if the error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof APICallError) {
    return error.isRetryable === true && error.message.toLowerCase().includes('timeout');
  }
  return false;
}

/**
 * Extracts error metadata from an error.
 *
 * @param error - The error to extract metadata from
 * @returns Error metadata if available
 */
export function getErrorMetadata(error: unknown): AmpErrorMetadata | undefined {
  if (error instanceof APICallError) {
    return error.requestBodyValues as AmpErrorMetadata | undefined;
  }
  return undefined;
}

/**
 * Checks if authentication is likely configured.
 * This is now a no-op since the Amp CLI handles authentication automatically.
 * The CLI will use credentials from either:
 * 1. AMP_API_KEY environment variable (if set)
 * 2. ~/.local/share/amp/secrets.json (from `amp login`)
 * 
 * Authentication errors will be caught when the CLI actually runs.
 */
export function checkApiKey(): void {
  // No-op: Let the Amp CLI handle authentication
  // The CLI will fail with a proper error if not authenticated
}
