import type { Logger } from './types.js';

/**
 * Silent logger that discards all messages.
 */
const silentLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/**
 * Console-based logger using standard console methods.
 */
const consoleLogger: Logger = {
  debug: (message: string) => console.debug(message),
  info: (message: string) => console.info(message),
  warn: (message: string) => console.warn(message),
  error: (message: string) => console.error(message),
};

/**
 * Gets a logger instance based on the provided configuration.
 * - If logger is false, returns a silent logger
 * - If logger is a Logger object, returns it
 * - Otherwise, returns the console logger
 *
 * @param logger - Logger configuration
 * @returns A Logger instance
 */
export function getLogger(logger?: Logger | false): Logger {
  if (logger === false) {
    return silentLogger;
  }
  if (logger && typeof logger === 'object') {
    return logger;
  }
  return consoleLogger;
}

/**
 * Creates a logger that respects the verbose setting.
 * When verbose is false, debug and info messages are suppressed.
 *
 * @param baseLogger - The underlying logger to use
 * @param verbose - Whether to enable verbose logging
 * @returns A Logger instance
 */
export function createVerboseLogger(baseLogger: Logger, verbose: boolean): Logger {
  if (verbose) {
    return baseLogger;
  }

  // When not verbose, suppress debug and info messages
  return {
    debug: () => {},
    info: () => {},
    warn: baseLogger.warn,
    error: baseLogger.error,
  };
}
