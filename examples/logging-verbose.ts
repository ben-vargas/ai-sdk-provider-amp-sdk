/**
 * Verbose Logging Example
 *
 * Demonstrates verbose logging mode for debugging and development.
 * When verbose: true, you'll see detailed debug and info logs
 * showing what's happening under the hood.
 *
 * Run: npx tsx examples/logging-verbose.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('=== Verbose Logging Mode ===\n');
  console.log('Expected behavior:');
  console.log('- Debug logs showing internal details');
  console.log('- Info logs about execution flow');
  console.log('- CLI command visibility');
  console.log('- Full visibility into provider operations\n');

  try {
    const { text, usage, providerMetadata } = await generateText({
      model: amp('default', {
        verbose: true, // Enable verbose logging (provider-only option)
        logLevel: 'debug', // Set log level to debug
      }),
      prompt: 'Say hello in 5 words',
    });

    console.log('\n📝 Response:');
    console.log(text);

    if (usage) {
      console.log('\n📊 Usage:');
      console.log('Input tokens:', usage.inputTokens);
      console.log('Output tokens:', usage.outputTokens);
      console.log('Total tokens:', usage.totalTokens);
    }

    if (providerMetadata && providerMetadata['amp-sdk']) {
      const metadata = providerMetadata['amp-sdk'] as {
        sessionId?: string;
        durationMs?: number;
        costUsd?: number;
      };

      console.log('\n🔧 Metadata:');
      if (metadata.sessionId) console.log('Session ID:', metadata.sessionId);
      if (metadata.durationMs) console.log('Duration:', metadata.durationMs + 'ms');
      if (metadata.costUsd) console.log('Cost: $' + metadata.costUsd.toFixed(4));
    }

    console.log('\n✓ Notice: Debug and info logs appeared above');
    console.log('  Verbose mode shows:');
    console.log('  - Amp CLI command being executed');
    console.log('  - Message types received (system, user, assistant, result)');
    console.log('  - Session initialization and completion');
    console.log('  - Internal processing steps');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Ensure Amp CLI is installed and authenticated');
    console.log('2. Run: amp login');
    console.log('3. Or set: export AMP_API_KEY=sgamp_your_key');
    console.log('4. Verify: npm run build');
  }

  console.log('\n📚 Use verbose logging when:');
  console.log('- Debugging integration issues');
  console.log('- Understanding provider behavior');
  console.log('- Developing and testing');
  console.log('- Troubleshooting errors');
  console.log('- Learning how the provider works');
}

main().catch(console.error);
