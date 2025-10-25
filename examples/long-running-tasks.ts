/**
 * Long-Running Tasks Example
 *
 * Demonstrates patterns for handling long-running Amp operations:
 * - Progress tracking
 * - Timeouts
 * - Cancellation
 * - Interactive feedback
 *
 * Run: npx tsx examples/long-running-tasks.ts
 */

import { streamText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('⏱️  Testing Long-Running Task Patterns\n');

  // Example 1: Progress tracking with streaming
  console.log('1. Progress tracking with streaming...');
  try {
    console.log('   Starting long-running task...\n');

    const startTime = Date.now();
    let charCount = 0;
    let chunkCount = 0;

    const { textStream } = streamText({
      model: amp('default'),
      prompt:
        'Analyze the architecture of a distributed microservices system with API gateway, service mesh, and event-driven communication. Explain in detail.',
    });

    // Track progress as chunks arrive
    for await (const chunk of textStream) {
      charCount += chunk.length;
      chunkCount++;

      // Show progress every 10 chunks
      if (chunkCount % 10 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(`\r   Progress: ${chunkCount} chunks, ${charCount} chars, ${elapsed}s elapsed`);
      }
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n   ✅ Completed in ${totalTime}s`);
    console.log(`      Total: ${chunkCount} chunks, ${charCount} characters`);
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 2: Timeout with graceful degradation
  console.log('\n\n2. Timeout with graceful degradation...');
  try {
    const TIMEOUT_MS = 5000;
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      console.log('\n   ⏱️  Timeout reached, cancelling...');
      controller.abort();
    }, TIMEOUT_MS);

    let accumulated = '';
    const { textStream } = streamText({
      model: amp('default'),
      prompt:
        'Write a comprehensive guide to Kubernetes with 20 chapters covering every aspect in extreme detail.',
      abortSignal: controller.signal,
    });

    try {
      for await (const chunk of textStream) {
        accumulated += chunk;
        process.stdout.write('.');
      }
      clearTimeout(timeout);
      console.log('\n   ✅ Completed before timeout');
    } catch (error: any) {
      clearTimeout(timeout);
      if (error.message?.includes('aborted')) {
        console.log(`\n   ⚠️  Timed out after ${TIMEOUT_MS}ms`);
        console.log(`   📝 Partial response (${accumulated.length} chars):`);
        console.log('      ' + accumulated.slice(0, 200) + '...');
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 3: Progress bar visualization
  console.log('\n\n3. Progress bar visualization...');
  try {
    console.log('   Executing task with visual progress...\n');

    const TARGET_CHARS = 500;
    let charCount = 0;

    const { textStream } = streamText({
      model: amp('default'),
      prompt: 'Explain machine learning in detail with examples.',
    });

    for await (const chunk of textStream) {
      charCount += chunk.length;
      const progress = Math.min(charCount / TARGET_CHARS, 1);
      const barLength = 40;
      const filled = Math.floor(progress * barLength);
      const empty = barLength - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      const percent = (progress * 100).toFixed(0);

      process.stdout.write(`\r   [${bar}] ${percent}% (${charCount}/${TARGET_CHARS} chars)`);

      if (charCount >= TARGET_CHARS) break;
    }

    console.log('\n   ✅ Task completed');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 4: Estimated time remaining
  console.log('\n\n4. Estimated time remaining...');
  try {
    console.log('   Calculating ETA...\n');

    const startTime = Date.now();
    const TARGET_CHUNKS = 50;
    let chunkCount = 0;

    const { textStream } = streamText({
      model: amp('default'),
      prompt: 'Describe the history of the internet in chronological order.',
    });

    for await (const chunk of textStream) {
      chunkCount++;

      if (chunkCount >= 5) {
        // Start calculating ETA after a few chunks
        const elapsed = Date.now() - startTime;
        const avgTimePerChunk = elapsed / chunkCount;
        const remaining = (TARGET_CHUNKS - chunkCount) * avgTimePerChunk;
        const eta = (remaining / 1000).toFixed(1);

        process.stdout.write(
          `\r   Chunk ${chunkCount}/${TARGET_CHUNKS} - ETA: ${eta}s         `
        );
      }

      if (chunkCount >= TARGET_CHUNKS) break;
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n   ✅ Completed in ${totalTime}s`);
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 5: Concurrent long-running tasks
  console.log('\n\n5. Managing concurrent long-running tasks...');
  try {
    console.log('   Running 3 tasks concurrently...\n');

    const tasks = [
      {
        name: 'Task 1: Summary',
        prompt: 'Summarize cloud computing in 3 paragraphs',
      },
      {
        name: 'Task 2: Comparison',
        prompt: 'Compare SQL and NoSQL databases',
      },
      {
        name: 'Task 3: Tutorial',
        prompt: 'Explain REST APIs in simple terms',
      },
    ];

    const results = await Promise.all(
      tasks.map(async (task, index) => {
        const startTime = Date.now();

        const { textStream } = streamText({
          model: amp('default'),
          prompt: task.prompt,
        });

        let charCount = 0;
        for await (const chunk of textStream) {
          charCount += chunk.length;
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   ✅ ${task.name} completed in ${duration}s (${charCount} chars)`);

        return { task: task.name, duration, charCount };
      })
    );

    console.log('\n   📊 Summary:');
    const totalChars = results.reduce((sum, r) => sum + r.charCount, 0);
    console.log(`      Total characters: ${totalChars}`);
    console.log(`      Average per task: ${(totalChars / results.length).toFixed(0)}`);
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 6: Retry mechanism for long tasks
  console.log('\n\n6. Retry mechanism for failed long tasks...');
  try {
    async function executeWithRetry(prompt: string, maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`   Attempt ${attempt}/${maxRetries}...`);

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          const { textStream } = streamText({
            model: amp('default'),
            prompt,
            abortSignal: controller.signal,
          });

          let text = '';
          for await (const chunk of textStream) {
            text += chunk;
          }

          clearTimeout(timeout);
          return text;
        } catch (error: any) {
          console.log(`   Attempt ${attempt} failed: ${error.message}`);

          if (attempt < maxRetries) {
            const backoff = Math.pow(2, attempt) * 1000;
            console.log(`   Waiting ${backoff}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, backoff));
          } else {
            throw error;
          }
        }
      }
    }

    const result = await executeWithRetry('Explain TypeScript briefly');
    console.log(`   ✅ Success after retry: ${result.slice(0, 100)}...`);
  } catch (error: any) {
    console.error('   ❌ All retries failed:', error.message);
  }

  console.log('\n\n✅ Long-running task examples completed');
  console.log('\nKey patterns:');
  console.log('- Stream processing for real-time feedback');
  console.log('- Progress tracking with counters and bars');
  console.log('- Timeout handling with AbortController');
  console.log('- ETA calculation based on current progress');
  console.log('- Concurrent task execution with Promise.all');
  console.log('- Retry mechanisms with exponential backoff');

  console.log('\nBest practices:');
  console.log('1. Always provide feedback to users during long tasks');
  console.log('2. Implement timeouts for tasks that might hang');
  console.log('3. Allow users to cancel long-running operations');
  console.log('4. Calculate and display estimated time remaining');
  console.log('5. Use streaming to show progress in real-time');
  console.log('6. Implement retry logic for transient failures');
  console.log('7. Consider breaking very long tasks into smaller chunks');

  console.log('\nUse cases:');
  console.log('- Large codebase analysis');
  console.log('- Comprehensive documentation generation');
  console.log('- Multi-step refactoring tasks');
  console.log('- Batch processing operations');
  console.log('- Complex data transformations');
}

main().catch(console.error);
