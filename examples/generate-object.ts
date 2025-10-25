/**
 * Object generation example for ai-sdk-provider-amp-sdk
 *
 * This example demonstrates how to generate structured objects
 * using Zod schemas with the Amp provider.
 *
 * Prerequisites:
 * - Authenticate with Amp (run `amp login` or set AMP_API_KEY)
 * - Install dependencies: npm install
 *
 * Run: npm run example:object
 */

import { generateObject } from 'ai';
import { amp } from '../dist/index.js';
import { z } from 'zod';

async function main() {
  console.log('🚀 Object Generation Example\n');

  try {
    // Define a schema for a recipe
    const recipeSchema = z.object({
      name: z.string().describe('Name of the recipe'),
      ingredients: z
        .array(
          z.object({
            name: z.string(),
            amount: z.string(),
          })
        )
        .describe('List of ingredients'),
      instructions: z.array(z.string()).describe('Step-by-step instructions'),
      prepTime: z.string().describe('Preparation time'),
      difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level'),
    });

    console.log('📝 Generating a recipe object...\n');

    const { object, usage } = await generateObject({
      model: amp('default'),
      schema: recipeSchema,
      prompt: 'Generate a simple recipe for chocolate chip cookies.',
    });

    console.log('🍪 Generated Recipe:');
    console.log(JSON.stringify(object, null, 2));

    console.log('\n📊 Usage:');
    console.log(`  Input tokens: ${usage.inputTokens}`);
    console.log(`  Output tokens: ${usage.outputTokens}`);

    // Another example with a different schema
    const userProfileSchema = z.object({
      name: z.string(),
      age: z.number(),
      occupation: z.string(),
      hobbies: z.array(z.string()),
      bio: z.string(),
    });

    console.log('\n\n📝 Generating a user profile object...\n');

    const { object: profile } = await generateObject({
      model: amp('default'),
      schema: userProfileSchema,
      prompt: 'Generate a fictional user profile for a software engineer who loves hiking.',
    });

    console.log('👤 Generated User Profile:');
    console.log(JSON.stringify(profile, null, 2));

    console.log('\n✅ Object generation example completed!');
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
