/**
 * Error Handling Example
 *
 * Demonstrates how to handle different types of errors when using the Amp SDK provider.
 * Shows authentication errors, API errors, validation errors, and how to handle them gracefully.
 *
 * Run: npx tsx examples/error-handling.ts
 */

import { generateText } from 'ai';
import { amp, createAmp } from '../dist/index.js';

async function main() {
  console.log('🔍 Testing error handling patterns\n');

  // Example 1: Handling validation errors
  console.log('1. Testing validation errors...');
  try {
    const provider = createAmp();
    // Empty resume string should fail validation
    const model = provider('default', { resume: '' });
    await generateText({
      model,
      prompt: 'Hello',
    });
    console.log('   ❌ Should have failed validation');
  } catch (error: any) {
    if (error.message?.includes('resume must be a non-empty string')) {
      console.log('   ✅ Validation error caught:', error.message);
    } else {
      console.error('   ❌ Unexpected error:', error.message);
    }
  }

  // Example 2: Handling invalid continue type
  console.log('\n2. Testing type validation errors...');
  try {
    const provider = createAmp();
    // @ts-expect-error - Testing runtime validation  
    const model = provider('default', { continue: 123 });
    await generateText({
      model,
      prompt: 'Hello',
    });
    console.log('   ❌ Should have failed type validation');
  } catch (error: any) {
    if (error.message?.includes('continue must be a boolean or a string')) {
      console.log('   ✅ Type validation error caught:', error.message);
    } else {
      console.error('   ❌ Unexpected error:', error.message);
    }
  }

  // Example 3: Handling general API errors
  console.log('\n3. Testing graceful error handling...');
  try {
    const { text, warnings } = await generateText({
      model: amp('default'),
      prompt: 'Say hello in one sentence.',
    });

    if (warnings?.length) {
      console.log('   ⚠️  Warnings received:');
      for (const warning of warnings) {
        console.log('      -', warning.type, ':', warning.message || warning.setting);
      }
    }

    console.log('   ✅ Success:', text);
  } catch (error: any) {
    console.error('   ❌ API error:', error.message);

    // Check for specific error types
    if (error.message?.includes('authentication') || error.message?.includes('unauthorized')) {
      console.log('\n   💡 Authentication error detected');
      console.log('   Fix: Run "amp login" or set AMP_API_KEY');
    } else if (error.message?.includes('not found') || error.message?.includes('ENOENT')) {
      console.log('\n   💡 CLI not found error detected');
      console.log('   Fix: Install Amp CLI with "npm install -g @sourcegraph/amp"');
    } else {
      console.log('\n   💡 General API error - check error message above');
    }
  }

  // Example 4: Proper error recovery pattern
  console.log('\n4. Testing error recovery pattern...');
  async function generateWithRetry(prompt: string, maxRetries = 3): Promise<string> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { text } = await generateText({
          model: amp('default'),
          prompt,
        });
        return text;
      } catch (error: any) {
        lastError = error;
        console.log(`   Attempt ${attempt} failed:`, error.message);

        // Don't retry on validation errors
        if (error.message?.includes('validation') || error.message?.includes('must be')) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const waitMs = Math.pow(2, attempt) * 1000;
          console.log(`   Waiting ${waitMs}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  try {
    const text = await generateWithRetry('Say hello', 2);
    console.log('   ✅ Success with retry pattern:', text);
  } catch (error: any) {
    console.log('   ⚠️  All retries failed:', error.message);
  }

  // Example 5: Structured error information
  console.log('\n5. Testing structured error handling...');
  interface ErrorInfo {
    type: 'validation' | 'authentication' | 'api' | 'timeout' | 'unknown';
    message: string;
    recoverable: boolean;
    suggestion: string;
  }

  function categorizeError(error: any): ErrorInfo {
    const message = error.message || String(error);

    if (message.includes('must be') || message.includes('validation')) {
      return {
        type: 'validation',
        message,
        recoverable: false,
        suggestion: 'Fix the validation error in your code',
      };
    }

    if (message.includes('authentication') || message.includes('unauthorized')) {
      return {
        type: 'authentication',
        message,
        recoverable: true,
        suggestion: 'Run "amp login" or set AMP_API_KEY',
      };
    }

    if (message.includes('timed out') || message.includes('aborted')) {
      return {
        type: 'timeout',
        message,
        recoverable: true,
        suggestion: 'Try again or increase timeout',
      };
    }

    if (message.includes('API') || message.includes('network')) {
      return {
        type: 'api',
        message,
        recoverable: true,
        suggestion: 'Check network connection and retry',
      };
    }

    return {
      type: 'unknown',
      message,
      recoverable: false,
      suggestion: 'Check error message and logs',
    };
  }

  try {
    const provider = createAmp();
    const model = provider('default', { maxTurns: -1 });
    await generateText({ model, prompt: 'test' });
  } catch (error: any) {
    const errorInfo = categorizeError(error);
    console.log('   Error categorized:');
    console.log('      Type:', errorInfo.type);
    console.log('      Message:', errorInfo.message);
    console.log('      Recoverable:', errorInfo.recoverable);
    console.log('      Suggestion:', errorInfo.suggestion);
  }

  console.log('\n✅ Error handling examples completed');
  console.log('\nKey takeaways:');
  console.log('- Always check error.message for specific error types');
  console.log('- Validation errors should not be retried');
  console.log('- Authentication errors need user action (login)');
  console.log('- API errors may be transient and can be retried');
  console.log('- Use warnings array to catch non-fatal issues');
  console.log('- Categorize errors for better user feedback');
}

main().catch(console.error);
