/**
 * Conversation history example for ai-sdk-provider-amp-sdk
 *
 * This example demonstrates how to maintain conversation history
 * across multiple turns with the Amp provider.
 *
 * Prerequisites:
 * - Authenticate with Amp (run `amp login` or set AMP_API_KEY)
 * - Install dependencies: npm install
 *
 * Run: npm run example:conversation
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('🚀 Conversation History Example\n');

  try {
    // First turn
    console.log('👤 User: What is the capital of France?');
    const firstResponse = await generateText({
      model: amp('default'),
      messages: [
        {
          role: 'user',
          content: 'What is the capital of France?',
        },
      ],
    });

    console.log(`🤖 Assistant: ${firstResponse.text}\n`);

    // Second turn - continuing the conversation
    console.log('👤 User: What is its population?');
    const secondResponse = await generateText({
      model: amp('default'),
      messages: [
        {
          role: 'user',
          content: 'What is the capital of France?',
        },
        {
          role: 'assistant',
          content: firstResponse.text,
        },
        {
          role: 'user',
          content: 'What is its population?',
        },
      ],
    });

    console.log(`🤖 Assistant: ${secondResponse.text}\n`);

    // Third turn - continuing the conversation
    console.log('👤 User: What are some famous landmarks there?');
    const thirdResponse = await generateText({
      model: amp('default'),
      messages: [
        {
          role: 'user',
          content: 'What is the capital of France?',
        },
        {
          role: 'assistant',
          content: firstResponse.text,
        },
        {
          role: 'user',
          content: 'What is its population?',
        },
        {
          role: 'assistant',
          content: secondResponse.text,
        },
        {
          role: 'user',
          content: 'What are some famous landmarks there?',
        },
      ],
    });

    console.log(`🤖 Assistant: ${thirdResponse.text}\n`);

    console.log('✅ Conversation completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
