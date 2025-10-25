/**
 * Provider exports for creating and configuring Amp instances.
 * @module amp-sdk
 */

/**
 * Creates a new Amp provider instance and the default provider instance.
 * @see {@link createAmp} for creating custom provider instances
 * @see {@link amp} for the default provider instance
 */
export { createAmp, amp } from './amp-provider.js';

/**
 * Type definitions for the Amp provider.
 * @see {@link AmpProvider} for the provider interface
 * @see {@link AmpProviderSettings} for provider configuration options
 */
export type { AmpProvider, AmpProviderSettings } from './amp-provider.js';

/**
 * Language model implementation for Amp.
 * This class implements the AI SDK's LanguageModelV2 interface.
 */
export { AmpLanguageModel } from './amp-language-model.js';

/**
 * Type definitions for Amp language models.
 * @see {@link AmpModelId} for supported model identifiers
 * @see {@link AmpLanguageModelOptions} for model configuration options
 */
export type { AmpModelId, AmpLanguageModelOptions } from './amp-language-model.js';

/**
 * Settings for configuring Amp behavior.
 * Includes options for customizing the SDK execution, permissions, and tool usage.
 */
export type { AmpSettings, Logger, MCPServer, Permission } from './types.js';

/**
 * Error handling utilities for Amp.
 * These functions help create and identify specific error types.
 *
 * @see {@link isAuthenticationError} to check for authentication failures
 * @see {@link isTimeoutError} to check for timeout errors
 * @see {@link getErrorMetadata} to extract error metadata
 * @see {@link createAPICallError} to create general API errors
 * @see {@link createAuthenticationError} to create authentication errors
 * @see {@link createTimeoutError} to create timeout errors
 */
export {
  isAuthenticationError,
  isTimeoutError,
  getErrorMetadata,
  createAPICallError,
  createAuthenticationError,
  createTimeoutError,
  checkApiKey,
} from './errors.js';

/**
 * Metadata associated with Amp errors.
 * Contains additional context about SDK execution failures.
 */
export type { AmpErrorMetadata } from './errors.js';
