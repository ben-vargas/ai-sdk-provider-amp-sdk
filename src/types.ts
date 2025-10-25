/**
 * Logger interface for custom logging.
 * Allows consumers to provide their own logging implementation
 * or disable logging entirely.
 *
 * @example
 * ```typescript
 * const customLogger: Logger = {
 *   debug: (message) => myLoggingService.debug(message),
 *   info: (message) => myLoggingService.info(message),
 *   warn: (message) => myLoggingService.warn(message),
 *   error: (message) => myLoggingService.error(message),
 * };
 * ```
 */
export interface Logger {
  /**
   * Log a debug message. Only logged when verbose mode is enabled.
   * Used for detailed execution tracing and troubleshooting.
   */
  debug: (message: string) => void;

  /**
   * Log an informational message. Only logged when verbose mode is enabled.
   * Used for general execution flow information.
   */
  info: (message: string) => void;

  /**
   * Log a warning message.
   */
  warn: (message: string) => void;

  /**
   * Log an error message.
   */
  error: (message: string) => void;
}

/**
 * Configuration settings for Amp SDK behavior.
 * These settings control how the Amp SDK executes, what permissions it has,
 * and which tools are available during conversations.
 *
 * @example
 * ```typescript
 * const settings: AmpSettings = {
 *   cwd: '/path/to/project',
 *   dangerouslyAllowAll: true,
 *   maxTurns: 10
 * };
 * ```
 */
export interface AmpSettings {
  /**
   * Working directory for Amp operations
   */
  cwd?: string;

  /**
   * Skip permission prompts for automation scenarios
   * @default false
   */
  dangerouslyAllowAll?: boolean;

  /**
   * Continue a conversation thread.
   * - `true`: Continue the most recent thread
   * - `string`: Continue a specific thread by session ID (e.g., 'T-abc123-def456')
   * - `undefined`: Start a new thread (default)
   * 
   * Note: The provider also accepts a `resume` setting for convenience,
   * which is mapped to this `continue` parameter internally.
   * 
   * @see {@link https://ampcode.com/manual/sdk#thread-continuity}
   */
  continue?: boolean | string;

  /**
   * Resume a specific session by ID (provider convenience alias).
   * 
   * This is a provider-level convenience setting that gets mapped to
   * the Amp SDK's `continue` parameter. Provide a session ID
   * (e.g., 'T-abc123-def456') to continue that specific thread.
   * 
   * Takes precedence over `continue` if both are set.
   * 
   * Note: Internally mapped to `continue: string`
   * 
   * @see {@link https://ampcode.com/manual/sdk#thread-continuity}
   */
  resume?: string;

  /**
   * Maximum number of turns for the conversation
   */
  maxTurns?: number;

  /**
   * Logging verbosity level
   * @default 'info'
   */
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'audit';

  /**
   * Path to write logs
   */
  logFile?: string;

  /**
   * Custom prompt to guide the agent
   */
  prompt?: string;

  /**
   * MCP server configuration
   */
  mcpConfig?: Record<string, MCPServer>;

  /**
   * Additional environment variables to set
   */
  env?: Record<string, string | undefined>;

  /**
   * Folder path with toolbox scripts
   */
  toolbox?: string;

  /**
   * Permission rules for tool usage
   */
  permissions?: Permission[];

  /**
   * Enable verbose logging for debugging
   * @default false
   */
  verbose?: boolean;

  /**
   * Custom logger for handling warnings and errors.
   * - Set to `false` to disable all logging
   * - Provide a Logger object to use custom logging
   * - Leave undefined to use console (default)
   *
   * @default console
   * @example
   * ```typescript
   * // Disable logging
   * const settings = { logger: false };
   *
   * // Custom logger
   * const settings = {
   *   logger: {
   *     warn: (msg) => myLogger.warn(msg),
   *     error: (msg) => myLogger.error(msg),
   *   }
   * };
   * ```
   */
  logger?: Logger | false;

  /**
   * Delay between operations (ms)
   */
  delay?: number;

  /**
   * Maximum number of pages to crawl/discover
   */
  limit?: number;

  /**
   * Maximum discovery depth
   */
  maxDiscoveryDepth?: number;
}

/**
 * MCP server configuration
 */
export interface MCPServer {
  /**
   * Command to start the MCP server
   */
  command: string;

  /**
   * Command line arguments
   */
  args?: string[];

  /**
   * Environment variables for the server
   */
  env?: Record<string, string>;
}

/**
 * Permission rule for controlling tool usage
 */
export interface Permission {
  /**
   * Tool name (supports glob patterns)
   */
  tool: string;

  /**
   * Match conditions for tool arguments
   */
  matches?: Record<string, PermissionMatchCondition>;

  /**
   * How Amp should proceed when matched
   */
  action: 'allow' | 'reject' | 'ask' | 'delegate';

  /**
   * Apply rule only in main thread or sub-agents
   */
  context?: 'thread' | 'subagent';

  /**
   * Command to delegate to (required when action is 'delegate')
   */
  to?: string;
}

/**
 * Match condition for tool arguments
 */
export type PermissionMatchCondition =
  | string
  | PermissionMatchCondition[]
  | { [key: string]: PermissionMatchCondition }
  | boolean
  | number
  | null
  | undefined;
