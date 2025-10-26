# AI SDK Provider for Amp SDK

> **Vercel AI SDK v5 provider for Amp via the Amp SDK (`@sourcegraph/amp-sdk`)**

<p align="center">
  <img src="https://img.shields.io/badge/status-alpha-00A79E" alt="alpha status">
  <a href="https://www.npmjs.com/package/ai-sdk-provider-amp-sdk"><img src="https://img.shields.io/npm/v/ai-sdk-provider-amp-sdk?color=00A79E" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/ai-sdk-provider-amp-sdk"><img src="https://img.shields.io/npm/unpacked-size/ai-sdk-provider-amp-sdk?color=00A79E" alt="unpacked size" /></a>
  <a href="https://www.npmjs.com/package/ai-sdk-provider-amp-sdk"><img src="https://img.shields.io/npm/dm/ai-sdk-provider-amp-sdk?color=00A79E" alt="monthly downloads" /></a>
  <img src="https://img.shields.io/badge/AI%20SDK-v5-00A79E" alt="AI SDK v5">
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/badge/node-%3E%3D18-00A79E" alt="Node.js ≥ 18" /></a>
  <a href="https://www.npmjs.com/package/ai-sdk-provider-amp-sdk"><img src="https://img.shields.io/npm/l/ai-sdk-provider-amp-sdk?color=00A79E" alt="License: MIT" /></a>
</p>

**ai-sdk-provider-amp-sdk** lets you use Amp through the [Vercel AI SDK](https://sdk.vercel.ai/docs) with the official `@sourcegraph/amp-sdk` package.

> **⚠️ Compatibility**: This provider targets **Vercel AI SDK v5**. AI SDK v5 uses split versioning: the core `ai` package is v5.x while provider helper packages have independent major versions:
> - `ai`: `^5.0.0`
> - `@ai-sdk/provider`: `^2.0.0`
> - `@ai-sdk/provider-utils`: `^3.0.0`
> 
> Seeing `@ai-sdk/provider: ^2.x` or `@ai-sdk/provider-utils: ^3.x` in package.json is expected and fully compatible with `ai@^5`. You don't need to install the `@ai-sdk/*` packages yourself—this provider depends on them.
> 
> **Not compatible** with AI SDK v4 or earlier. **Not tested** with AI SDK v6 beta releases.

## 📦 Installation

### 1. Install the provider

```bash
npm install ai-sdk-provider-amp-sdk ai zod
```

> **Note**: `zod` is a peer dependency required for object generation features. Install it to use `generateObject` and structured output capabilities.

### 2. Authenticate with Amp

You have two options to authenticate:

**Option A: Use the Amp CLI (Recommended)**
```bash
amp login
```
This stores your credentials locally in `~/.local/share/amp/secrets.json`

**Option B: Set an environment variable**
```bash
export AMP_API_KEY=sgamp_your_api_key_here
```
Get your API key from [ampcode.com/settings](https://ampcode.com/settings)

> **Note**: The provider will automatically use whichever authentication method is available. If both are set, `AMP_API_KEY` takes precedence.

## 🚀 Quick Start

### Basic Text Generation

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

const { text } = await generateText({
  model: amp('default'),
  prompt: 'Write a haiku about coding.',
});

console.log(text);
```

### Streaming

```typescript
import { streamText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

const result = await streamText({
  model: amp('default'),
  prompt: 'Tell me a story about a robot.',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### Object Generation with Zod

```typescript
import { generateObject } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';
import { z } from 'zod';

const { object } = await generateObject({
  model: amp('default'),
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
  }),
  prompt: 'Generate a recipe for chocolate chip cookies.',
});

console.log(object);
```

> **Learn More**: For comprehensive object generation examples, see the [examples/README.md](examples/README.md):
> - **Basic patterns** (`example:object-basic`) - Progressive examples from simple objects to best practices
> - **Advanced constraints** (`example:object-constraints`) - Enums, number ranges, string patterns, array validation
> - **Nested structures** (`example:object-nested`) - Complex hierarchical and recursive patterns

## 🎯 Models

The provider accepts any string as a model identifier. Amp SDK will use the model you specify:

```typescript
// Use default model
const model = amp('default');

// Use custom model identifier
const customModel = amp('my-custom-model');
```

## ⚙️ Configuration

### Provider-Level Configuration

Set default settings for all models created by the provider:

```typescript
import { createAmp } from 'ai-sdk-provider-amp-sdk';

const ampProvider = createAmp({
  defaultSettings: {
    dangerouslyAllowAll: true, // Skip permission prompts
    maxTurns: 10,              // Max conversation turns
    verbose: true,              // Enable verbose logging
    logLevel: 'debug',          // Set log level
  },
});

const model = ampProvider('default');
```

### Model-Level Configuration

Override settings for individual models:

```typescript
const model = amp('default', {
  cwd: '/path/to/project',   // Working directory
  maxTurns: 5,               // Override default
  dangerouslyAllowAll: true, // Skip permissions
});
```

### Available Settings

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `cwd` | `string` | Working directory for operations | `process.cwd()` |
| `dangerouslyAllowAll` | `boolean` | Skip permission prompts | `false` |
| `continue` | `boolean` | Continue most recent conversation | `false` |
| `resume` | `string` | Resume specific session by ID | - |
| `maxTurns` | `number` | Maximum conversation turns | - |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error' \| 'audit'` | Logging level | `'info'` |
| `logFile` | `string` | Path to write logs | - |
| `mcpConfig` | `Record<string, MCPServer>` | MCP server configuration | - |
| `env` | `Record<string, string>` | Environment variables | - |
| `toolbox` | `string` | Path to toolbox scripts | - |
| `permissions` | `Permission[]` | Tool permission rules | - |
| `verbose` | `boolean` | Enable verbose logging | `false` |
| `logger` | `Logger \| false` | Custom logger or disable logging | `console` |

## 🔧 Advanced Features

### Session Management

Resume previous conversations:

```typescript
// Continue the most recent conversation
const model = amp('default', {
  continue: true,
});

// Resume a specific session
const model = amp('default', {
  resume: 'T-abc123-def456',
});
```

### Custom Logging

Provide your own logger:

```typescript
const model = amp('default', {
  logger: {
    debug: (msg) => myLogger.debug(msg),
    info: (msg) => myLogger.info(msg),
    warn: (msg) => myLogger.warn(msg),
    error: (msg) => myLogger.error(msg),
  },
});

// Or disable logging
const silentModel = amp('default', {
  logger: false,
});
```

### MCP Server Configuration

Configure MCP servers for extended functionality:

```typescript
const model = amp('default', {
  mcpConfig: {
    playwright: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest', '--headless'],
      env: { NODE_ENV: 'production' },
    },
  },
});
```

### Provider Metadata

Access Amp-specific metadata from responses:

```typescript
const { text, providerMetadata } = await generateText({
  model: amp('default'),
  prompt: 'Hello!',
});

const ampMetadata = providerMetadata?.['amp-sdk'];
console.log('Session ID:', ampMetadata?.sessionId);
console.log('Cost:', ampMetadata?.costUsd);
console.log('Duration:', ampMetadata?.durationMs);
```

## 🔐 Authentication

For detailed authentication information, see [AUTHENTICATION.md](AUTHENTICATION.md).

Quick summary:
- **Option A**: Run `amp login` (stores credentials locally)
- **Option B**: Set `export AMP_API_KEY=your_key`
- The provider automatically uses whichever is available

## 📚 Examples

The `examples/` directory contains **20+ comprehensive examples** covering all provider features:

### Quick Example Commands

```bash
npm run example:basic               # Simple text generation
npm run example:streaming           # Real-time streaming
npm run example:conversation        # Multi-turn conversations
npm run example:object-basic        # Object generation basics
npm run example:object-constraints  # Advanced Zod validation
npm run example:object-nested       # Complex nested structures
npm run example:error-handling      # Error handling patterns
npm run example:abort-signal        # Request cancellation
npm run example:all                 # Run all examples
```

### Example Categories

- 🚀 **Quick Start** - Basic usage, streaming, conversations, configuration
- 🏗️ **Structured Output** - Object generation (basic, constraints, nested)
- 🛡️ **Error Handling** - Abort signals, error recovery, long-running tasks
- ⭐ **Amp Features** - Permissions, MCP integration, toolbox scripts
- 📊 **Session Management** - Continue conversations, resume sessions
- 🔧 **Logging** - Verbose, disabled, and custom logger configurations

**📖 See [examples/README.md](examples/README.md) for detailed documentation, usage instructions, and all 20+ examples.**

## 🔍 Error Handling

Handle errors using standard try/catch blocks:

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

try {
  const { text } = await generateText({
    model: amp('default'),
    prompt: 'Hello!',
  });
  console.log(text);
} catch (error) {
  // TypeScript: error is 'unknown' in catch blocks
  if (error instanceof Error) {
    console.error('Error:', error.message);
    
    // Check for specific error types by examining the error message
    if (error.message.includes('authentication')) {
      console.error('Authentication failed. Run `amp login` or set AMP_API_KEY.');
    } else if (error.message.includes('timeout')) {
      console.error('Request timed out. Please try again.');
    } else if (error.message.includes('abort')) {
      console.error('Request was cancelled.');
    }
  } else {
    console.error('Unknown error:', error);
  }
}
```

> **See examples for comprehensive patterns**:
> - [`error-handling.ts`](examples/error-handling.ts) - Error categorization, validation, retry logic with exponential backoff
> - [`abort-signal.ts`](examples/abort-signal.ts) - Request cancellation, timeout management, cleanup

## ⚠️ Limitations

- Requires Node.js ≥ 18
- Some AI SDK parameters are not supported by Amp SDK:
  - `temperature`
  - `topP`
  - `topK`
  - `presencePenalty`
  - `frequencyPenalty`
  - `stopSequences`
  - `seed`
- Image URL support is limited (base64/data URLs preferred)

## 🧪 Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Lint & Format

```bash
npm run lint
npm run format
```

### Type Check

```bash
npm run typecheck
```

## 📄 License

MIT

## 👤 Author

**Ben Vargas**
- 𝕏 [@ben_vargas](https://x.com/ben_vargas)
- GitHub [@ben-vargas](https://github.com/ben-vargas)

## 🙏 Acknowledgments

This provider is built following patterns from:
- [ai-sdk-provider-claude-code](https://github.com/ben-vargas/ai-sdk-provider-claude-code)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Amp SDK](https://ampcode.com/manual/sdk)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## ⚖️ Disclaimer

This is an unofficial community provider and is not affiliated with or endorsed by Sourcegraph or Vercel. By using this provider:

- You understand that your data will be sent to Amp's servers through the Amp SDK
- You agree to comply with [Amp's Terms of Service](https://ampcode.com/terms)
- You acknowledge this software is provided "as is" without warranties of any kind
