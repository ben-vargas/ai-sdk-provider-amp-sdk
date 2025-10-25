# AI SDK Provider for Amp SDK

> **Vercel AI SDK v5 provider for Amp via the Amp SDK (`@sourcegraph/amp-sdk`)**

**ai-sdk-provider-amp-sdk** lets you use Amp through the [Vercel AI SDK](https://sdk.vercel.ai/docs) with the official `@sourcegraph/amp-sdk` package.

## 📦 Installation

### 1. Install the provider

```bash
npm install ai-sdk-provider-amp-sdk ai
```

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

const result = streamText({
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

The `examples/` directory contains several working examples:

- **basic-usage.ts** - Simple text generation
- **streaming.ts** - Streaming responses
- **conversation-history.ts** - Multi-turn conversations
- **custom-config.ts** - Custom provider configuration
- **generate-object.ts** - Structured object generation

Run examples:

```bash
npm run example:basic
npm run example:streaming
npm run example:conversation
npm run example:config
npm run example:object
npm run example:all  # Run all examples
```

## 🔍 Error Handling

The provider includes built-in error handling:

```typescript
import { 
  isAuthenticationError, 
  isTimeoutError, 
  getErrorMetadata 
} from 'ai-sdk-provider-amp-sdk';

try {
  const { text } = await generateText({
    model: amp('default'),
    prompt: 'Hello!',
  });
} catch (error) {
  if (isAuthenticationError(error)) {
    console.error('Authentication failed. Check your AMP_API_KEY.');
  } else if (isTimeoutError(error)) {
    console.error('Request timed out. Please try again.');
  } else {
    const metadata = getErrorMetadata(error);
    console.error('Error:', error.message);
    console.error('Metadata:', metadata);
  }
}
```

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
