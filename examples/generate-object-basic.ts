/**
 * Basic Object Generation Examples
 *
 * This example demonstrates fundamental object generation patterns using
 * the Amp provider with JSON schema validation.
 *
 * Topics covered:
 * - Simple objects with primitive types
 * - Basic arrays
 * - Optional fields
 * - Schema descriptions for better generation
 *
 * Run: npx tsx examples/generate-object-basic.ts
 */

import { generateObject } from 'ai';
import { amp } from '../dist/index.js';
import { z } from 'zod';

console.log('=== Amp SDK: Basic Object Generation ===\n');

// Example 1: Simple object with primitives
async function example1_simpleObject() {
  console.log('1️⃣  Simple Object with Primitives\n');

  const { object } = await generateObject({
    model: amp('default'),
    schema: z.object({
      name: z.string().describe('Full name of the person'),
      age: z.number().describe('Age in years'),
      email: z.string().email().describe('Valid email address'),
      isActive: z.boolean().describe('Whether the account is active'),
    }),
    prompt: 'Generate a profile for a software developer named Sarah.',
  });

  console.log('Generated profile:');
  console.log(JSON.stringify(object, null, 2));
  console.log();
}

// Example 2: Object with arrays
async function example2_arrays() {
  console.log('2️⃣  Object with Arrays\n');

  const { object } = await generateObject({
    model: amp('default'),
    schema: z.object({
      teamName: z.string().describe('Name of the development team'),
      members: z.array(z.string()).describe('List of team member names'),
      technologies: z.array(z.string()).describe('Technologies used by the team'),
      projectCount: z.number().int().min(0).describe('Number of active projects'),
    }),
    prompt: 'Generate data for a web development team working on e-commerce projects.',
  });

  console.log('Generated team:');
  console.log(JSON.stringify(object, null, 2));
  console.log();
}

// Example 3: Optional fields
async function example3_optionalFields() {
  console.log('3️⃣  Object with Optional Fields\n');

  const { object } = await generateObject({
    model: amp('default'),
    schema: z.object({
      productName: z.string().describe('Name of the product'),
      price: z.number().positive().multipleOf(0.01).describe('Price in USD'),
      description: z.string().describe('Product description'),
      discount: z.number().min(0).max(1).optional().describe('Discount rate between 0 and 1 (e.g., 0.15 for 15% off)'),
      tags: z.array(z.string()).optional().describe('Product tags for categorization'),
      inStock: z.boolean().describe('Whether the product is in stock'),
    }),
    prompt: 'Generate a product listing for a wireless keyboard.',
  });

  console.log('Generated product:');
  console.log(JSON.stringify(object, null, 2));
  console.log();
}

// Example 4: Building complexity gradually
async function example4_gradualComplexity() {
  console.log('4️⃣  Building Complexity Gradually\n');

  // Start simple
  console.log('Step 1 - Basic user:');
  const { object: basicUser } = await generateObject({
    model: amp('default'),
    schema: z.object({
      username: z.string(),
      email: z.string().email(),
    }),
    prompt: 'Generate a basic user account.',
  });
  console.log(JSON.stringify(basicUser, null, 2));

  // Add more fields
  console.log('\nStep 2 - Enhanced user:');
  const { object: enhancedUser } = await generateObject({
    model: amp('default'),
    schema: z.object({
      username: z.string(),
      email: z.string().email(),
      profile: z.object({
        firstName: z.string(),
        lastName: z.string(),
        bio: z.string().optional(),
      }),
      settings: z.object({
        theme: z.string(),
        notifications: z.boolean(),
      }),
    }),
    prompt: 'Generate a user account with profile and settings.',
  });
  console.log(JSON.stringify(enhancedUser, null, 2));
  console.log();
}

// Example 5: Best practices demonstration
async function example5_bestPractices() {
  console.log('5️⃣  Best Practices\n');

  // Good: Clear descriptions and specific prompt
  const { object: good } = await generateObject({
    model: amp('default'),
    schema: z.object({
      title: z.string().min(50).max(100).describe('Article title (50-100 characters)'),
      summary: z.string().max(200).describe('Brief summary (max 200 characters)'),
      readingTime: z.number().int().positive().describe('Estimated reading time in minutes'),
      tags: z.array(z.string()).describe('3-5 relevant tags').min(3).max(5),
    }),
    prompt:
      'Generate metadata for a technical blog post about TypeScript best practices. Make it engaging and informative.',
  });

  console.log('Well-structured generation:');
  console.log(JSON.stringify(good, null, 2));
  console.log('\nNotice how clear descriptions and specific prompts lead to better results!\n');
}

// Main execution
async function main() {
  try {
    await example1_simpleObject();
    await example2_arrays();
    await example3_optionalFields();
    await example4_gradualComplexity();
    await example5_bestPractices();

    console.log('✅ All basic examples completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('- Try generate-object-nested.ts for complex structures');
    console.log('- See generate-object-constraints.ts for validation examples');
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n💡 Tip: Make sure Amp is authenticated with: amp login');
    process.exit(1);
  }
}

main().catch(console.error);
