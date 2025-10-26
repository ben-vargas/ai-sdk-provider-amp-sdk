# Quick Start Guide

Get up and running with `ai-sdk-provider-amp-sdk` in under 5 minutes.

## 1. Install

```bash
npm install ai-sdk-provider-amp-sdk ai zod
```

## 2. Authenticate

Choose one of these authentication methods:

**Option A: Use Amp CLI (Recommended)**
```bash
amp login
```

**Option B: Set environment variable**
```bash
export AMP_API_KEY=sgamp_your_api_key_here
```
Get your key from [ampcode.com/settings](https://ampcode.com/settings)

## 3. Basic Usage

### Simple Text Generation

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

const { text } = await generateText({
  model: amp('default'),
  prompt: 'What is the capital of France?',
});

console.log(text);
```

### Streaming Text

```typescript
import { streamText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

const result = await streamText({
  model: amp('default'),
  prompt: 'Tell me a story.',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### Generate Structured Data

```typescript
import { generateObject } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';
import { z } from 'zod';

const { object } = await generateObject({
  model: amp('default'),
  schema: z.object({
    name: z.string(),
    age: z.number(),
    city: z.string(),
  }),
  prompt: 'Generate a person profile for a 30-year-old software engineer from Paris.',
});

console.log(object);
// { name: "Alice", age: 30, city: "Paris" }
```

## 4. Configuration

### Provider-Level Defaults

```typescript
import { createAmp } from 'ai-sdk-provider-amp-sdk';

const ampProvider = createAmp({
  defaultSettings: {
    dangerouslyAllowAll: true,
    maxTurns: 10,
    verbose: true,
  },
});

const model = ampProvider('default');
```

### Model-Level Settings

```typescript
const model = amp('default', {
  cwd: '/path/to/project',
  maxTurns: 5,
  logLevel: 'debug',
});
```

## 5. Multi-Turn Conversations

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

// First message
const response1 = await generateText({
  model: amp('default'),
  messages: [
    { role: 'user', content: 'What is TypeScript?' },
  ],
});

// Continue conversation
const response2 = await generateText({
  model: amp('default'),
  messages: [
    { role: 'user', content: 'What is TypeScript?' },
    { role: 'assistant', content: response1.text },
    { role: 'user', content: 'What are its benefits?' },
  ],
});
```

## 6. Error Handling

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

## 7. Advanced Features

### Custom Logger

```typescript
const model = amp('default', {
  logger: {
    debug: (msg) => console.log('[DEBUG]', msg),
    info: (msg) => console.log('[INFO]', msg),
    warn: (msg) => console.warn('[WARN]', msg),
    error: (msg) => console.error('[ERROR]', msg),
  },
  verbose: true,
});
```

### MCP Server Configuration

```typescript
const model = amp('default', {
  mcpConfig: {
    playwright: {
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest', '--headless'],
    },
  },
});
```

### Session Management

```typescript
// Continue most recent conversation
const model = amp('default', {
  continue: true,
});

// Resume specific session
const model = amp('default', {
  resume: 'T-abc123-def456',
});
```

## 8. Run Examples

Try the included examples:

```bash
# Basic usage
npm run example:basic

# Streaming
npm run example:streaming

# Conversation history
npm run example:conversation

# Custom config
npm run example:config

# Object generation
npm run example:object-basic
npm run example:object-constraints
npm run example:object-nested

# Error handling
npm run example:error-handling
npm run example:abort-signal

# Run all examples
npm run example:all
```

## Next Steps

- Read the [full README](README.md) for comprehensive documentation
- Check out the [examples](examples/) directory
- Review the [implementation summary](IMPLEMENTATION_SUMMARY.md)

## Troubleshooting

### Authentication Failed

```
Error: Amp authentication failed
```

**Solution**: Authenticate with Amp:
```bash
# Option 1: Use Amp CLI (Recommended)
amp login

# Option 2: Set environment variable
export AMP_API_KEY=sgamp_your_api_key_here
```

### Build Errors

```bash
npm run clean
npm install
npm run build
```

### Test Failures

```bash
npm test
```

## Need Help?

- Check the [README](README.md)
- Review [examples](examples/)
- Open an issue on GitHub

Happy coding! 🚀
