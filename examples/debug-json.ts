/**
 * Debug JSON generation to see what's being returned
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';

async function main() {
  console.log('🔍 Debugging JSON generation\n');

  try {
    const { text } = await generateText({
      model: amp('default'),
      prompt: 'Generate a JSON object with a person\'s name and age. Format: {"name": "...", "age": ...}',
    });

    console.log('Raw text response:');
    console.log(text);
    console.log('\n---\n');

    // Try to parse it
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Successfully parsed as JSON:');
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('❌ Not valid JSON');
      console.log('Attempting extraction...');
      
      // Try to extract JSON from markdown
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        console.log('Found JSON in code block:');
        console.log(jsonMatch[1]);
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          console.log('✅ Successfully parsed extracted JSON:');
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e2) {
          console.log('❌ Still not valid JSON');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
