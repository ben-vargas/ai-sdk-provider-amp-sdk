/**
 * Disabled Logging Example
 *
 * Demonstrates how to disable all logging for production or quiet mode.
 * Useful when you want clean output without any provider logs.
 *
 * Run: npx tsx examples/logging-disabled.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('=== Disabled Logging Mode ===\n');
  console.log('Expected behavior:');
  console.log('- No debug logs');
  console.log('- No info logs');
  console.log('- No warn logs (except for critical issues)');
  console.log('- Clean, production-ready output\n');

  try {
    const { text, usage } = await generateText({
      model: amp('default', {
        logger: false, // Disable all logging (provider-only option)
      }),
      prompt: 'Explain what TypeScript is in one sentence.',
    });

    console.log('📝 Response (with no provider logs):');
    console.log(text);

    if (usage) {
      console.log('\n📊 Usage:');
      console.log('Tokens:', usage.totalTokens);
    }

    console.log('\n✓ Notice: No provider logs appeared above');
    console.log('  This is ideal for:');
    console.log('  - Production environments');
    console.log('  - Clean CLI tools');
    console.log('  - Automated scripts');
    console.log('  - Log-sensitive applications');
  } catch (error: any) {
    // Errors will still be thrown, but no logging beforehand
    console.error('❌ Error:', error.message);
  }

  console.log('\n📚 Comparison with other logging modes:');
  console.log('- Default: Warnings and errors only');
  console.log('- Verbose: All logs (debug, info, warn, error)');
  console.log('- Disabled: No logs at all (logger: false)');
  console.log('- Custom: Your own logging implementation');
}

main().catch(console.error);
