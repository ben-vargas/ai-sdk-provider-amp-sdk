# Authentication Guide

The `ai-sdk-provider-amp-sdk` provider uses the Amp CLI for authentication, which provides flexible authentication options.

## How It Works

The provider spawns the Amp CLI process, which handles authentication automatically. The CLI checks for credentials in this order:

1. **AMP_API_KEY environment variable** (if set)
2. **Local credentials** from `amp login` (stored in `~/.local/share/amp/secrets.json`)

## Authentication Methods

### Method 1: Amp CLI Login (Recommended)

This is the recommended approach as it stores your credentials securely and works across all tools that use the Amp CLI.

```bash
amp login
```

**Advantages:**
- ✅ Credentials stored securely locally
- ✅ Works for all Amp CLI usage
- ✅ No need to set environment variables
- ✅ Easy to switch between different API keys

**Credential Location:**
- Linux/macOS: `~/.local/share/amp/secrets.json`
- Windows: `%LOCALAPPDATA%\amp\secrets.json`

### Method 2: Environment Variable

Set the `AMP_API_KEY` environment variable:

```bash
export AMP_API_KEY=sgamp_your_api_key_here
```

**Advantages:**
- ✅ Good for CI/CD environments
- ✅ Easy to override for different projects
- ✅ Takes precedence over stored credentials

**Get Your API Key:**
Visit [ampcode.com/settings](https://ampcode.com/settings) to get your API key.

## Usage Examples

### Using CLI Login

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

// No API key needed - uses credentials from 'amp login'
const { text } = await generateText({
  model: amp('default'),
  prompt: 'Hello!',
});
```

### Using Environment Variable

```typescript
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

// Make sure AMP_API_KEY is set before running
// export AMP_API_KEY=sgamp_your_key

const { text } = await generateText({
  model: amp('default'),
  prompt: 'Hello!',
});
```

### Checking Authentication

The provider doesn't check authentication upfront. Instead, authentication is verified when the CLI runs:

```typescript
import { 
  generateText,
} from 'ai';
import { 
  amp, 
  isAuthenticationError 
} from 'ai-sdk-provider-amp-sdk';

try {
  const { text } = await generateText({
    model: amp('default'),
    prompt: 'Hello!',
  });
  console.log(text);
} catch (error) {
  if (isAuthenticationError(error)) {
    console.error('Authentication failed!');
    console.error('Please run: amp login');
    console.error('Or set: export AMP_API_KEY=your_key');
  } else {
    throw error;
  }
}
```

## Troubleshooting

### Authentication Failed Error

If you see:
```
Error: Amp authentication failed.

To authenticate with Amp, you can either:
1. Set AMP_API_KEY environment variable: export AMP_API_KEY=sgamp_your_key
2. Run 'amp login' to store credentials locally

Get your API key from https://ampcode.com/settings
```

**Solutions:**

1. **Check if you're logged in:**
   ```bash
   amp whoami
   ```

2. **Login with the CLI:**
   ```bash
   amp login
   ```

3. **Or set the environment variable:**
   ```bash
   export AMP_API_KEY=sgamp_your_api_key_here
   ```

### Expired Credentials

If your stored credentials have expired:

```bash
# Re-authenticate
amp login
```

### Multiple API Keys

If you need to use different API keys for different projects:

**Option 1: Environment variable (per-project)**
```bash
# In project A
export AMP_API_KEY=sgamp_project_a_key

# In project B
export AMP_API_KEY=sgamp_project_b_key
```

**Option 2: .env files**
```bash
# .env
AMP_API_KEY=sgamp_your_project_key
```

Then use a tool like `dotenv` to load it:
```typescript
import 'dotenv/config';
import { generateText } from 'ai';
import { amp } from 'ai-sdk-provider-amp-sdk';

const { text } = await generateText({
  model: amp('default'),
  prompt: 'Hello!',
});
```

## CI/CD Environments

For CI/CD pipelines, use the environment variable approach:

### GitHub Actions

```yaml
- name: Generate text
  env:
    AMP_API_KEY: ${{ secrets.AMP_API_KEY }}
  run: npm run generate
```

### Docker

```dockerfile
ENV AMP_API_KEY=sgamp_your_key
```

Or pass it at runtime:
```bash
docker run -e AMP_API_KEY=sgamp_your_key myapp
```

### Vercel/Netlify

Add `AMP_API_KEY` to your environment variables in the project settings.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** in CI/CD
3. **Rotate keys regularly** at [ampcode.com/settings](https://ampcode.com/settings)
4. **Use different keys** for development and production
5. **Add to .gitignore**:
   ```
   .env
   .env.local
   .env.*.local
   ```

## Implementation Details

The provider:
- ✅ Does **NOT** require `AMP_API_KEY` to be set
- ✅ Does **NOT** check authentication upfront
- ✅ Lets the Amp CLI handle authentication
- ✅ Catches authentication errors from the CLI
- ✅ Provides helpful error messages when authentication fails

This design ensures the provider works seamlessly with the Amp CLI's built-in authentication system.
