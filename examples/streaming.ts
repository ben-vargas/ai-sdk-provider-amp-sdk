/**
 * Streaming example for ai-sdk-provider-amp-sdk
 *
 * This example demonstrates how to use streaming with the Amp provider
 * to receive text as it's generated.
 *
 * Prerequisites:
 * - Authenticate with Amp (run `amp login` or set AMP_API_KEY)
 * - Install dependencies: npm install
 *
 * Run: npm run example:streaming
 */

import { streamText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('🚀 Streaming Amp SDK Example\n');

  try {
    const result = streamText({
      model: amp('default'),
      prompt: 'Write a short story about a robot learning to paint.',
    });

    console.log('📝 Streaming text:\n');

    // Stream the text as it's generated
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }

    console.log('\n\n📊 Usage:');
    const usage = await result.usage;
    console.log(`  Input tokens: ${usage.inputTokens}`);
    console.log(`  Output tokens: ${usage.outputTokens}`);
    console.log(`  Total tokens: ${usage.totalTokens}`);

    const finishReason = await result.finishReason;
    console.log(`\n✅ Finish reason: ${finishReason}`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
