# Amp SDK AI Provider Examples

This directory contains curated examples demonstrating the key features of the Amp SDK AI Provider for the Vercel AI SDK v5. Each example shows how to use Sourcegraph Amp through the official `@sourcegraph/amp-sdk` package.

> **Note**: These examples use the Vercel AI SDK v5 interface with the Amp SDK provider.

## Prerequisites

1. **Install dependencies:**
```bash
npm install
```

2. **Authenticate with Amp** (choose one):

   **Option A: Use Amp CLI (Recommended)**
   ```bash
   amp login
   ```

   **Option B: Set environment variable**
   ```bash
   export AMP_API_KEY=sgamp_your_api_key_here
   ```
   Get your API key from [ampcode.com/settings](https://ampcode.com/settings)

3. **Build the provider:**
```bash
npm run build
```

## Setup & Verification

### Check Authentication (`check-auth.ts`)
**Purpose**: Verify Amp CLI is installed and authenticated before running other examples.
```bash
npx tsx examples/check-auth.ts
```
**Key concepts**: Setup verification, troubleshooting, authentication testing

**Run this first!** It will confirm your environment is ready.

---

## Quick Start Examples

### 1. Basic Usage (`basic-usage.ts`)
**Purpose**: The simplest example - generate text with Amp and display metadata.
```bash
npm run example:basic
```
**Key concepts**: Text generation, token usage, provider metadata (session ID, cost, duration)

---

### 2. Streaming (`streaming.ts`)
**Purpose**: Demonstrate real-time streaming for responsive user experiences.
```bash
npm run example:streaming
```
**Key concepts**: Stream processing, chunk handling, real-time output, `streamText` API

---

### 3. Conversation History (`conversation-history.ts`)
**Purpose**: Show how to maintain context across multiple conversation turns.
```bash
npm run example:conversation
```
**Key concepts**: Message history, multi-turn conversations, context preservation

---

### 4. Custom Configuration (`custom-config.ts`)
**Purpose**: Configure Amp settings at provider and model levels.
```bash
npm run example:config
```
**Key concepts**: 
- Provider default settings
- Per-model settings override
- Verbose logging and debug output
- Custom working directory (`cwd`)
- Maximum turns limit
- Metadata capture

**Settings demonstrated**:
- `dangerouslyAllowAll` - Skip permission prompts
- `maxTurns` - Limit conversation turns
- `verbose` - Enable debug logging
- `logLevel` - Control log verbosity
- `cwd` - Set working directory

---

### 5. Object Generation - Basic (`generate-object-basic.ts`)
**Purpose**: Learn fundamental object generation patterns with progressive examples.
```bash
npx tsx examples/generate-object-basic.ts
```
**Key concepts**:
- Simple objects with primitive types (string, number, boolean)
- Arrays and optional fields
- Building complexity gradually
- Schema descriptions for better generation
- Best practices with clear prompts

**5 Progressive Examples**:
1. Simple object with primitives
2. Objects with arrays
3. Optional fields
4. Building complexity step-by-step
5. Best practices demonstration

---

### 6. Object Generation - Constraints (`generate-object-constraints.ts`)
**Purpose**: Master advanced validation with Zod constraints.
```bash
npx tsx examples/generate-object-constraints.ts
```
**Key concepts**:
- Enums and literal types for fixed value sets
- Number ranges (min, max, int, multipleOf)
- String patterns (regex, email, phone, URL)
- Array length constraints
- Complex combined validations

**5 Detailed Examples**:
1. Enums and status fields (task management)
2. Number constraints (game character stats)
3. String patterns (user registration with validation)
4. Array constraints (music playlist)
5. Complex validation (invoice with business rules)

---

### 7. Object Generation - Nested (`generate-object-nested.ts`)
**Purpose**: Generate complex hierarchical and nested structures.
```bash
npx tsx examples/generate-object-nested.ts
```
**Key concepts**:
- Deeply nested objects
- Arrays of objects
- Complex data relationships
- Hierarchical structures
- Recursive patterns (with depth limits)

**5 Complex Examples**:
1. Company with departments and teams
2. E-commerce order with nested items
3. Application configuration with nested settings
4. Social media post with engagement hierarchy
5. File system directory tree

---

## Error Handling & Control Flow

### 8. Abort Signal (`abort-signal.ts`)
**Purpose**: Cancel in-progress requests using AbortController.
```bash
npx tsx examples/abort-signal.ts
```
**Key concepts**:
- Request cancellation with AbortController
- Timeout implementation
- Streaming cancellation
- Cleanup and resource management

**Use cases**:
- User-initiated cancellation ("Stop generating" button)
- Timeout enforcement
- Component unmount cleanup (React/Vue/Svelte)
- Resource cleanup

---

### 7. Error Handling (`error-handling.ts`)
**Purpose**: Handle different error types gracefully.
```bash
npx tsx examples/error-handling.ts
```
**Key concepts**:
- Validation errors
- Authentication errors
- API errors
- Error categorization and recovery
- Retry patterns with exponential backoff

**Error types handled**:
- Settings validation errors
- Type validation errors
- Authentication failures
- Network/API errors

---

### 8. Long Running Tasks (`long-running-tasks.ts`)
**Purpose**: Manage long-running operations with progress tracking.
```bash
npx tsx examples/long-running-tasks.ts
```
**Key concepts**:
- Progress tracking and visualization
- Progress bars and ETAs
- Timeout handling
- Concurrent task execution
- Retry mechanisms

**Patterns demonstrated**:
- Real-time progress updates
- Estimated time remaining
- Graceful degradation on timeout
- Concurrent task management

---

## Advanced Examples

### 9. Session Management (`session-management.ts`)
**Purpose**: Reference documentation for session continuation patterns.

**Key patterns demonstrated**:
- New session (no continuation)
- Continue most recent conversation (`continue: true`)
- Resume specific session by ID (`resume: 'T-session-id'`)
- Multi-user session management
- Conversation branching

**Note**: This file contains documentation examples. Uncomment `main()` to run specific scenarios.

---

### 10. Session Settings Validation (`session-settings-validate.ts`)
**Purpose**: Validate session management settings and validation rules.
```bash
npx tsx examples/session-settings-validate.ts
```
**Tests**:
- ✅ `continue: true` creates model successfully
- ✅ `resume: 'session-id'` creates model successfully  
- ✅ Both settings together (resume takes precedence with warning)
- ✅ `continue: false` creates model without continuation
- ✅ Empty resume string validation (error)
- ✅ Non-boolean continue validation (error)

---

## Amp-Specific Features

### 11. Permissions (`permissions.ts`) 🔐 **KEY AMP FEATURE**
**Purpose**: Control tool usage with fine-grained permissions.
```bash
npx tsx examples/permissions.ts
```
**Key concepts**:
- Allow/reject/ask/delegate actions
- Glob patterns for tool matching
- Context-specific permissions (thread vs subagent)
- Complex matching conditions
- Production-safe permission templates

**Permission actions**:
- `allow` - Auto-approve tool usage
- `ask` - Prompt for user confirmation
- `reject` - Block tool usage
- `delegate` - Defer decision to external program

**This is a powerful Amp feature for security and control!**

---

### 12. MCP Integration (`mcp-integration.ts`) 🔌 **KEY AMP FEATURE**
**Purpose**: Extend Amp with Model Context Protocol servers.
```bash
npx tsx examples/mcp-integration.ts
```
**Key concepts**:
- MCP server configuration
- Multiple concurrent servers
- Environment variable configuration
- Combining MCP with permissions
- Production-ready MCP stacks

**Common MCP servers**:
- Playwright - Browser automation
- Filesystem - File operations
- Git - Version control
- Custom servers - Your own integrations

**This enables powerful extensibility!**

---

### 13. Toolbox (`toolbox.ts`) 🧰 **AMP FEATURE**
**Purpose**: Add custom tools via toolbox scripts.
```bash
npx tsx examples/toolbox.ts
```
**Key concepts**:
- Custom script integration
- Deployment automation
- Data processing tools
- API integration scripts
- Environment-specific toolboxes

**Toolbox use cases**:
- Deployment automation
- Testing and QA
- Data transformations
- API integrations
- Infrastructure management

---

## Logging & Debugging

### 14. Logging - Verbose (`logging-verbose.ts`)
**Purpose**: Enable detailed debug logging for development.
```bash
npx tsx examples/logging-verbose.ts
```
**Key concepts**: Debug logs, CLI command visibility, detailed execution trace

---

### 15. Logging - Disabled (`logging-disabled.ts`)
**Purpose**: Disable all logging for production/quiet mode.
```bash
npx tsx examples/logging-disabled.ts
```
**Key concepts**: Clean output, production mode, logger: false

---

### 16. Logging - Custom Logger (`logging-custom-logger.ts`)
**Purpose**: Integrate with existing logging infrastructure.
```bash
npx tsx examples/logging-custom-logger.ts
```
**Key concepts**:
- Custom logger implementation
- Winston/Pino/Bunyan integration patterns
- Structured logging (JSON)
- Timestamp and context addition
- File/remote logging

**Integration examples**:
- Winston logger wrapper
- Pino logger wrapper
- Structured JSON logging
- File-based logging
- Remote logging services

---

## Utility Examples

### 17. Debug JSON (`debug-json.ts`)
**Purpose**: Debug JSON generation and extraction from responses.
```bash
npx tsx examples/debug-json.ts
```
**Use cases**:
- Test JSON extraction from markdown code blocks
- Validate JSON parsing
- Debug object generation issues

---

## Running Examples

### Quick Run Commands
```bash
# Setup & verification
npx tsx examples/check-auth.ts

# Quick start examples
npm run example:basic
npm run example:streaming
npm run example:conversation
npm run example:config
npm run example:object

# Error handling & control flow
npx tsx examples/abort-signal.ts
npx tsx examples/error-handling.ts
npx tsx examples/long-running-tasks.ts

# Amp-specific features (⭐ KEY FEATURES)
npx tsx examples/permissions.ts
npx tsx examples/mcp-integration.ts
npx tsx examples/toolbox.ts

# Logging examples
npx tsx examples/logging-verbose.ts
npx tsx examples/logging-disabled.ts
npx tsx examples/logging-custom-logger.ts

# Utility examples
npx tsx examples/debug-json.ts
npx tsx examples/session-settings-validate.ts

# Run all quick-start examples in sequence
npm run example:all
```

### Manual Execution
You can also run any example directly with tsx:
```bash
npx tsx examples/<filename>.ts
```

---

## Example Categories

### 🚀 **Setup & Quick Start**
- `check-auth.ts` - Setup verification
- `basic-usage.ts` - Simple text generation
- `streaming.ts` - Real-time streaming
- `conversation-history.ts` - Multi-turn conversations
- `custom-config.ts` - Provider and model settings

### 🛡️ **Error Handling & Control**
- `abort-signal.ts` - Request cancellation and timeouts
- `error-handling.ts` - Error categorization and recovery
- `long-running-tasks.ts` - Progress tracking and management

### 🔐 **Amp-Specific Features** (⭐ KEY)
- `permissions.ts` - Fine-grained tool access control
- `mcp-integration.ts` - MCP server integration
- `toolbox.ts` - Custom tool scripts

### 📊 **Logging & Debugging**
- `logging-verbose.ts` - Debug/development logging
- `logging-disabled.ts` - Production quiet mode
- `logging-custom-logger.ts` - Custom logger integration

### ⚙️ **Session Management**
- `session-management.ts` - Session continuation patterns
- `session-settings-validate.ts` - Settings validation

### 🔧 **Structured Output & Utilities**
- `generate-object-basic.ts` - Progressive object generation examples
- `generate-object-constraints.ts` - Advanced Zod validation constraints
- `generate-object-nested.ts` - Complex nested and hierarchical structures
- `debug-json.ts` - JSON debugging

---

## Key Features Demonstrated

### Authentication
- Automatic credential detection (CLI or env var)
- Flexible authentication options
- No explicit API key management in code
- Setup verification and troubleshooting

### Session Management
- Continue most recent conversation
- Resume specific sessions by ID
- Multi-user session handling
- Conversation branching
- Settings validation

### Error Handling & Control Flow
- Request cancellation with AbortController
- Timeout implementation and enforcement
- Error categorization and recovery
- Retry patterns with exponential backoff
- Progress tracking for long operations

### Amp-Specific Features (⭐ KEY)
- **Permissions**: Fine-grained tool access control (allow/reject/ask/delegate)
- **MCP Integration**: Extend with Model Context Protocol servers
- **Toolbox**: Custom scripts for domain-specific functionality
- Context-specific permissions (thread vs subagent)
- Glob pattern matching for tools

### Configuration Options
- Provider-level defaults
- Per-model setting overrides
- Verbose logging and debugging
- Custom working directories
- Environment-specific configuration

### Logging System
- Verbose mode (debug/info/warn/error)
- Disabled mode (logger: false)
- Custom logger implementation
- Integration with Winston/Pino/Bunyan
- Structured JSON logging

### Streaming
- Real-time text streaming
- Chunk-by-chunk processing
- Usage and metadata tracking
- Progress visualization
- Stream cancellation

### Structured Output
- Type-safe object generation
- Zod schema validation
- Automatic JSON extraction from markdown
- Complex nested structures

### Metadata
- Session ID tracking
- Cost tracking (USD)
- Duration tracking (ms)
- Token usage (input/output/total)

---

## Troubleshooting

### Authentication Errors
If you see authentication errors:

1. **Check authentication**:
   ```bash
   # Verify Amp CLI is authenticated
   amp --version
   ```

2. **Try re-authenticating**:
   ```bash
   amp login
   ```

3. **Or set API key explicitly**:
   ```bash
   export AMP_API_KEY=sgamp_your_api_key_here
   ```

### Example Failures
- Ensure the provider is built: `npm run build`
- Check that dependencies are installed: `npm install`
- Verify Node.js version is 18 or higher

### Session Management Issues
- Use `continue: true` for most recent session
- Use `resume: 'session-id'` for specific session
- Don't use both (resume takes precedence, warning issued)
- Session IDs have format: `T-abc123-def456`

---

## Additional Resources

- [Main README](../README.md) - Provider overview and installation
- [Amp SDK Documentation](https://ampcode.com/manual/sdk) - Official Amp SDK docs
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs) - AI SDK documentation
- [Authentication Guide](../AUTHENTICATION.md) - Detailed authentication setup
- [Quick Start Guide](../QUICKSTART.md) - Getting started guide

---

## Example Output

Most examples produce rich output including:
- Generated text or structured data
- Token usage statistics
- Session metadata (ID, cost, duration)
- Timing information
- Debug logs (when verbose mode enabled)

Example session metadata:
```json
{
  "sessionId": "T-abc123-def456",
  "costUsd": 0.0042,
  "durationMs": 7110
}
```

---

## Contributing Examples

When adding new examples:
1. Focus on a single concept or pattern
2. Include clear comments explaining key points
3. Add error handling where appropriate
4. Update this README with the new example
5. Test the example before committing
6. Follow the existing code style

---

## Notes

- Examples use TypeScript (`.ts` files)
- All examples require authentication
- Build must complete before running examples
- Some examples may take longer (streaming, object generation)
- Session IDs are ephemeral and for demonstration only
