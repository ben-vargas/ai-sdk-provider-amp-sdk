/**
 * Check if Amp CLI is properly installed and authenticated
 * This example verifies the setup before running other examples
 * 
 * Run: npx tsx examples/check-auth.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function checkSetup() {
  console.log('🔍 Checking Amp CLI setup...\n');

  try {
    // Try a simple generation to verify everything works
    console.log('Testing Amp SDK connection...');

    const { text, usage, providerMetadata } = await generateText({
      model: amp('default'),
      prompt: 'Say "Hello from Amp" and nothing else.',
    });

    console.log('✅ Amp SDK is working properly!');
    console.log('Response:', text);
    
    if (usage) {
      console.log('Tokens used:', usage.totalTokens);
    }

    if (providerMetadata && providerMetadata['amp-sdk']) {
      const metadata = providerMetadata['amp-sdk'] as {
        sessionId?: string;
        durationMs?: number;
      };
      if (metadata.sessionId) {
        console.log('Session ID:', metadata.sessionId);
      }
      if (metadata.durationMs) {
        console.log('Duration:', metadata.durationMs + 'ms');
      }
    }

    console.log('\n🎉 You can run all the examples!');
  } catch (error: any) {
    console.error('❌ Failed to connect to Amp');
    console.error('Error:', error.message);

    if (error.message?.includes('not found') || error.message?.includes('ENOENT')) {
      console.log('\n💡 Make sure Amp CLI is installed:');
      console.log('   npm install -g @sourcegraph/amp');
      console.log('   Or use npx: npx @sourcegraph/amp');
    } else if (
      error.message?.includes('authentication') ||
      error.message?.includes('unauthorized') ||
      error.message?.includes('login')
    ) {
      console.log('\n🔐 Authentication required. Choose one:');
      console.log('   Option 1 (Recommended): amp login');
      console.log('   Option 2: export AMP_API_KEY=sgamp_your_key_here');
      console.log('\nGet your API key at: https://ampcode.com/settings');
    } else {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Install Amp CLI: npm install -g @sourcegraph/amp');
      console.log('2. Authenticate: amp login');
      console.log('   OR set: export AMP_API_KEY=sgamp_your_key_here');
      console.log('3. Verify installation: amp --version');
      console.log('4. Check provider build: npm run build');
    }

    process.exit(1);
  }
}

checkSetup().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
