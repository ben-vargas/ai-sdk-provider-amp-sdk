/**
 * Test the extractJson function directly
 */

// Import from source
import { extractJson } from '../src/extract-json.js';

const testText = `Here's a JSON object with a person's name and age:

\`\`\`json
{"name": "Alice Johnson", "age": 28}
\`\`\``;

console.log('Input text:');
console.log(testText);
console.log('\n---\n');

const extracted = extractJson(testText);
console.log('Extracted:');
console.log(extracted);
console.log('\n---\n');

try {
  const parsed = JSON.parse(extracted);
  console.log('✅ Valid JSON!');
  console.log(JSON.stringify(parsed, null, 2));
} catch (e) {
  console.log('❌ Not valid JSON');
  console.log('Error:', e);
}
