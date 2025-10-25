/**
 * Custom configuration example for ai-sdk-provider-amp-sdk
 *
 * This example demonstrates how to configure the Amp provider
 * with custom settings like working directory, permissions, etc.
 *
 * Prerequisites:
 * - Authenticate with Amp (run `amp login` or set AMP_API_KEY)
 * - Install dependencies: npm install
 *
 * Run: npm run example:config
 */

import { generateText } from 'ai';
import { createAmp } from '../dist/index.js';

async function main() {
  console.log('🚀 Custom Configuration Example\n');

  try {
    // Create a custom provider with default settings
    const ampProvider = createAmp({
      defaultSettings: {
        dangerouslyAllowAll: true, // Skip permission prompts
        maxTurns: 5, // Limit conversation turns
        verbose: true, // Enable verbose logging
        logLevel: 'debug', // Set log level
      },
    });

    // Use the custom provider
    console.log('📝 Generating text with custom settings...\n');
    const { text, usage, providerMetadata } = await generateText({
      model: ampProvider('default'),
      prompt: 'Explain what makes a good API design in 3 sentences.',
    });

    console.log('Generated Text:');
    console.log(text);
    console.log('\n📊 Usage:');
    console.log(`  Input tokens: ${usage.inputTokens}`);
    console.log(`  Output tokens: ${usage.outputTokens}`);

    if (providerMetadata && providerMetadata['amp-sdk']) {
      const metadata = providerMetadata['amp-sdk'] as {
        sessionId?: string;
        costUsd?: number;
        durationMs?: number;
      };
      console.log('\n🔧 Provider Metadata:');
      if (metadata.sessionId) console.log(`  Session ID: ${metadata.sessionId}`);
      if (metadata.costUsd) console.log(`  Cost: $${metadata.costUsd.toFixed(4)}`);
      if (metadata.durationMs) console.log(`  Duration: ${metadata.durationMs}ms`);
    }

    // Example with per-model settings
    console.log('\n\n📝 Generating text with per-model settings...\n');
    const { text: text2 } = await generateText({
      model: ampProvider('default', {
        cwd: process.cwd(), // Set working directory
        maxTurns: 3, // Override default maxTurns
      }),
      prompt: 'What are the benefits of TypeScript?',
    });

    console.log('Generated Text:');
    console.log(text2);
    console.log('\n✅ Custom configuration example completed!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
