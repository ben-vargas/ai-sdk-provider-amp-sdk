/**
 * Session Management Examples
 * 
 * This file demonstrates the correct usage of session management
 * with the Amp SDK AI Provider.
 */

import { amp } from '../dist/index.js';
import { generateText } from 'ai';

/**
 * Example 1: Start a new session (no session management)
 */
async function example1_NewSession() {
  console.log('\n=== Example 1: New Session ===');
  
  const { text } = await generateText({
    model: amp('default'),
    prompt: 'What is the capital of France?',
  });
  
  console.log('Response:', text);
}

/**
 * Example 2: Continue the most recent conversation
 * 
 * Use this when you want to automatically resume the last conversation
 * without knowing its session ID.
 */
async function example2_ContinueMostRecent() {
  console.log('\n=== Example 2: Continue Most Recent Session ===');
  
  // First conversation
  await generateText({
    model: amp('default'),
    prompt: 'Remember this number: 42',
  });
  
  // Continue the most recent conversation
  const { text } = await generateText({
    model: amp('default', { 
      continue: true // ← Continues most recent conversation
    }),
    prompt: 'What number did I ask you to remember?',
  });
  
  console.log('Response:', text);
  // Expected: The model should remember "42"
}

/**
 * Example 3: Resume a specific session by ID
 * 
 * Use this when you have a specific session ID you want to continue.
 * This is useful for:
 * - Multi-user applications where each user has their own session
 * - Resuming a conversation from a previous run
 * - Testing or debugging specific sessions
 */
async function example3_ResumeSpecificSession() {
  console.log('\n=== Example 3: Resume Specific Session ===');
  
  // First conversation - save the session ID
  let sessionId: string | undefined;
  
  const result1 = await generateText({
    model: amp('default'),
    prompt: 'My favorite color is blue',
  });
  
  // Extract session ID from provider metadata (if available)
  // Note: You would typically store this in your database
  sessionId = 'T-abc123-def456'; // Example session ID
  
  console.log('Session ID:', sessionId);
  
  // Later, resume this specific session
  const { text } = await generateText({
    model: amp('default', { 
      resume: sessionId // ← Resumes specific session
    }),
    prompt: 'What is my favorite color?',
  });
  
  console.log('Response:', text);
  // Expected: The model should remember "blue"
}

/**
 * Example 4: Multi-user application pattern
 * 
 * Shows how to manage sessions for different users.
 */
async function example4_MultiUserSessions() {
  console.log('\n=== Example 4: Multi-User Sessions ===');
  
  // Simulate a database of user sessions
  const userSessions = new Map<string, string>();
  
  async function chatWithUser(userId: string, message: string) {
    const sessionId = userSessions.get(userId);
    
    const { text } = await generateText({
      model: amp('default', {
        ...(sessionId && { resume: sessionId }), // Resume if session exists
      }),
      prompt: message,
    });
    
    // In a real application, you would extract and store the new session ID
    // from the response metadata
    
    return text;
  }
  
  // User 1's conversation
  await chatWithUser('user1', 'My name is Alice');
  const response1 = await chatWithUser('user1', 'What is my name?');
  console.log('User 1:', response1); // Expected: "Alice"
  
  // User 2's conversation (separate session)
  await chatWithUser('user2', 'My name is Bob');
  const response2 = await chatWithUser('user2', 'What is my name?');
  console.log('User 2:', response2); // Expected: "Bob"
}

/**
 * Example 5: Conversation branching
 * 
 * Shows how to create branches from a single session.
 */
async function example5_ConversationBranching() {
  console.log('\n=== Example 5: Conversation Branching ===');
  
  // Start a base conversation
  const base = await generateText({
    model: amp('default'),
    prompt: 'We are planning a trip',
  });
  
  const baseSessionId = 'T-base-session'; // Example session ID
  
  // Branch 1: Continue planning for Paris
  const paris = await generateText({
    model: amp('default', { resume: baseSessionId }),
    prompt: 'Let\'s go to Paris',
  });
  console.log('Paris branch:', paris.text);
  
  // Branch 2: Continue planning for Tokyo (from same base)
  const tokyo = await generateText({
    model: amp('default', { resume: baseSessionId }),
    prompt: 'Actually, let\'s go to Tokyo instead',
  });
  console.log('Tokyo branch:', tokyo.text);
}

/**
 * Example 6: Settings validation
 * 
 * Shows what happens when settings are invalid.
 */
async function example6_ValidationErrors() {
  console.log('\n=== Example 6: Settings Validation ===');
  
  try {
    // This will trigger a validation warning (both continue and resume set)
    // However, resume will take precedence
    const { text } = await generateText({
      model: amp('default', {
        continue: true,
        resume: 'T-specific-session', // Resume takes precedence
      }),
      prompt: 'Test message',
    });
    
    console.log('Response received (resume took precedence)');
  } catch (error) {
    console.error('Validation error:', error);
  }
}

/**
 * Run all examples
 */
async function main() {
  console.log('Session Management Examples\n');
  console.log('These examples demonstrate the corrected session management implementation.');
  
  // Uncomment the examples you want to run:
  
  // await example1_NewSession();
  // await example2_ContinueMostRecent();
  // await example3_ResumeSpecificSession();
  // await example4_MultiUserSessions();
  // await example5_ConversationBranching();
  // await example6_ValidationErrors();
}

// Uncomment to run examples
// main().catch(console.error);

/**
 * Key Takeaways:
 * 
 * 1. Use no session settings for new conversations
 * 2. Use { continue: true } to resume the most recent conversation
 * 3. Use { resume: 'session-id' } to resume a specific conversation
 * 4. When both are set, resume takes precedence
 * 5. Store session IDs in your database for multi-user applications
 * 6. Each user should have their own session ID
 * 7. You can create conversation branches by resuming from the same base session
 */
