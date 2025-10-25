/**
 * Request Cancellation with AbortController
 *
 * This example demonstrates how to cancel in-progress requests using AbortSignal.
 * Useful for implementing timeouts, user cancellations, or cleaning up on unmount.
 *
 * Run: npx tsx examples/abort-signal.ts
 */

import { generateText, streamText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('🚀 Testing request cancellation with AbortController\n');

  // Example 1: Cancel a non-streaming request after 3 seconds
  console.log('1. Testing cancellation of generateText after 3 seconds...');
  try {
    const controller = new AbortController();

    // Cancel after 3 seconds
    const timeout = setTimeout(() => {
      console.log('   ⏱️  Cancelling request...');
      controller.abort();
    }, 3000);

    const { text } = await generateText({
      model: amp('default'),
      prompt:
        'Write a very long detailed essay about the history of programming languages. Include at least 10 paragraphs covering FORTRAN, COBOL, C, Java, Python, and JavaScript.',
      abortSignal: controller.signal,
    });

    clearTimeout(timeout);
    console.log('   ✅ Completed:', text.slice(0, 100) + '...');
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.log('   ✅ Request successfully cancelled');
    } else {
      console.error('   ❌ Error:', error.message);
    }
  }

  console.log('\n2. Testing immediate cancellation (before request starts)...');
  try {
    const controller = new AbortController();

    // Cancel immediately
    controller.abort();

    await generateText({
      model: amp('default'),
      prompt: 'This should not execute',
      abortSignal: controller.signal,
    });

    console.log('   ❌ This should not be reached');
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.log('   ✅ Request cancelled before execution');
    } else {
      console.error('   ❌ Error:', error.message);
    }
  }

  console.log('\n3. Testing streaming cancellation after partial response...');
  try {
    const controller = new AbortController();
    let charCount = 0;

    const { textStream } = streamText({
      model: amp('default'),
      prompt: 'Count from 1 to 50, explaining each number in detail.',
      abortSignal: controller.signal,
    });

    console.log('   Streaming response: ');
    for await (const chunk of textStream) {
      process.stdout.write(chunk);
      charCount += chunk.length;

      // Cancel after receiving 150 characters
      if (charCount > 150) {
        console.log('\n   ⏱️  Cancelling stream after', charCount, 'characters...');
        controller.abort();
        break;
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.log('   ✅ Stream successfully cancelled');
    } else {
      console.error('   ❌ Error:', error.message);
    }
  }

  console.log('\n4. Testing timeout helper function...');
  try {
    // Helper function for timeout-based cancellation
    async function generateWithTimeout(prompt: string, timeoutMs: number) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const result = await generateText({
          model: amp('default'),
          prompt,
          abortSignal: controller.signal,
        });
        clearTimeout(timeout);
        return result;
      } catch (error: any) {
        clearTimeout(timeout);
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
          throw new Error(`Request timed out after ${timeoutMs}ms`);
        }
        throw error;
      }
    }

    await generateWithTimeout(
      'Write a comprehensive guide to distributed systems with 20 chapters.',
      2000
    );
    console.log('   ❌ Should have timed out');
  } catch (error: any) {
    if (error.message?.includes('timed out')) {
      console.log('   ✅ Timeout helper works:', error.message);
    } else {
      console.error('   ❌ Unexpected error:', error.message);
    }
  }

  console.log('\n✅ AbortSignal examples completed');
  console.log('\nUse cases for AbortSignal:');
  console.log('- User-initiated cancellations (e.g., "Stop generating" button)');
  console.log('- Component unmount cleanup in React/Vue/Svelte');
  console.log('- Request timeouts for long-running operations');
  console.log('- Rate limiting and request management');
  console.log('- Resource cleanup in error scenarios');

  console.log('\nBest practices:');
  console.log('- Always clean up timeouts with clearTimeout()');
  console.log('- Handle AbortError specifically in catch blocks');
  console.log('- Consider using AbortSignal.timeout() for simple timeouts (Node 18+)');
  console.log('- Test both streaming and non-streaming cancellation');
}

main().catch(console.error);
