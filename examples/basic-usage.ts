/**
 * Basic usage example for ai-sdk-provider-amp-sdk
 *
 * This example demonstrates the simplest way to use the Amp provider
 * with the Vercel AI SDK to generate text.
 *
 * Prerequisites:
 * - Authenticate with Amp (run `amp login` or set AMP_API_KEY)
 * - Install dependencies: npm install
 *
 * Run: npm run example:basic
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('🚀 Basic Amp SDK Usage Example\n');

  try {
    const { text, usage, finishReason } = await generateText({
      model: amp('default'),
      prompt: 'Write a haiku about coding.',
    });

    console.log('📝 Generated Text:');
    console.log(text);
    console.log('\n📊 Usage:');
    console.log(`  Input tokens: ${usage.inputTokens}`);
    console.log(`  Output tokens: ${usage.outputTokens}`);
    console.log(`  Total tokens: ${usage.totalTokens}`);
    console.log(`\n✅ Finish reason: ${finishReason}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
