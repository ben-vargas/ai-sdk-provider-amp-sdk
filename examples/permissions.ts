/**
 * Permission Management Example
 *
 * Demonstrates Amp's powerful permission system for controlling tool usage.
 * Permissions let you allow, reject, ask for confirmation, or delegate tool usage.
 *
 * This is a KEY Amp SDK feature that sets it apart from other providers.
 *
 * Run: npx tsx examples/permissions.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';
import type { Permission } from '../dist/index.js';

async function main() {
  console.log('🔒 Testing Amp Permission Management\n');
  console.log('⚠️  Note: Tool names and match keys in these examples are illustrative.');
  console.log('   Verify actual tool names from Amp documentation or runtime inspection.\n');

  // Example 1: Allow specific commands
  console.log('1. Allow only safe read-only commands...');
  try {
    const permissions: Permission[] = [
      // Allow listing files
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'ls *' },
      },
      // Allow git status/log
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git status' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git log*' },
      },
      // Allow reading files
      {
        tool: 'Read',
        action: 'allow',
      },
      // Reject all other Bash commands
      {
        tool: 'Bash',
        action: 'reject',
      },
    ];

    const { text } = await generateText({
      model: amp('default', {
        permissions,
        dangerouslyAllowAll: false, // Ensure permissions are enforced
      }),
      prompt: 'List the files in the current directory',
    });

    console.log('   ✅ Response:', text.slice(0, 100) + '...');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 2: Ask before sensitive operations
  console.log('\n2. Request confirmation for sensitive paths...');
  try {
    const permissions: Permission[] = [
      // Ask before reading sensitive directories
      {
        tool: 'Read',
        action: 'ask',
        matches: {
          path: '/etc/*',
        },
      },
      {
        tool: 'Read',
        action: 'ask',
        matches: {
          path: '~/.ssh/*',
        },
      },
      // Allow reading other files
      {
        tool: 'Read',
        action: 'allow',
      },
    ];

    console.log('   Note: This would prompt user for confirmation when reading /etc or ~/.ssh');
    console.log('   Skipping actual execution to avoid interactive prompt');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 3: Context-specific permissions (thread vs subagent)
  console.log('\n3. Different permissions for main thread vs subagents...');
  try {
    const permissions: Permission[] = [
      // Main thread can use Bash freely
      {
        tool: 'Bash',
        action: 'allow',
        context: 'thread',
      },
      // Subagents must ask before using Bash
      {
        tool: 'Bash',
        action: 'ask',
        context: 'subagent',
      },
      // Everyone can read files
      {
        tool: 'Read',
        action: 'allow',
      },
    ];

    console.log('   ✅ Permissions configured for context-specific control');
    console.log('      - Main thread: Bash allowed');
    console.log('      - Subagents: Bash requires confirmation');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 4: Glob patterns for tool names
  console.log('\n4. Using glob patterns to control MCP tools...');
  try {
    const permissions: Permission[] = [
      // Allow all filesystem tools
      {
        tool: 'Read',
        action: 'allow',
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'ls *' },
      },
      // Reject all MCP tools except specific ones
      {
        tool: 'mcp__playwright__*',
        action: 'reject',
      },
      {
        tool: 'mcp__database__*',
        action: 'reject',
      },
    ];

    console.log('   ✅ Permissions configured with glob patterns');
    console.log('      - Core tools: Allowed');
    console.log('      - MCP tools: Rejected');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 5: Delegate tool usage to external program
  console.log('\n5. Delegating tool decisions to external program...');
  try {
    const permissions: Permission[] = [
      // Delegate all web browsing decisions to a custom script
      {
        tool: 'mcp__playwright__*',
        action: 'delegate',
        to: 'node ./approval-script.js',
      },
    ];

    console.log('   ✅ Permissions configured for delegation');
    console.log('      - Playwright tools → delegated to approval-script.js');
    console.log('      Note: The external script would receive tool use details');
    console.log('            and return allow/reject decision');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 6: Complex matching conditions
  console.log('\n6. Complex permission matching...');
  try {
    const permissions: Permission[] = [
      // Allow npm commands but only specific ones
      {
        tool: 'Bash',
        action: 'allow',
        matches: {
          cmd: ['npm install', 'npm test', 'npm run build'],
        },
      },
      // Allow git commands except destructive ones
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git status' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git log*' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git diff*' },
      },
      // Reject destructive git commands
      {
        tool: 'Bash',
        action: 'reject',
        matches: { cmd: 'git push*' },
      },
      {
        tool: 'Bash',
        action: 'reject',
        matches: { cmd: 'git reset*' },
      },
    ];

    console.log('   ✅ Complex permissions configured');
    console.log('      - npm: Only install, test, build');
    console.log('      - git: Read-only commands allowed');
    console.log('      - git push/reset: Rejected');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 7: Production-safe defaults
  console.log('\n7. Production-safe permission template...');
  try {
    const productionPermissions: Permission[] = [
      // Allow read-only operations
      {
        tool: 'Read',
        action: 'allow',
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'ls *' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'cat *' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git status' },
      },
      {
        tool: 'Bash',
        action: 'allow',
        matches: { cmd: 'git log*' },
      },

      // Ask before any write operations
      {
        tool: 'edit_file',
        action: 'ask',
      },
      {
        tool: 'create_file',
        action: 'ask',
      },

      // Reject destructive operations
      {
        tool: 'Bash',
        action: 'reject',
        matches: { cmd: 'rm *' },
      },
      {
        tool: 'Bash',
        action: 'reject',
        matches: { cmd: 'git push*' },
      },

      // Reject all other bash commands by default
      {
        tool: 'Bash',
        action: 'reject',
      },
    ];

    console.log('   ✅ Production template created');
    console.log('      - Read operations: Allowed');
    console.log('      - Write operations: Ask for confirmation');
    console.log('      - Destructive operations: Rejected');
    console.log('      - Unknown bash commands: Rejected');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n✅ Permission examples completed');
  console.log('\nKey concepts:');
  console.log('- Permissions are evaluated in order (first match wins)');
  console.log('- Use "allow" for safe, known operations');
  console.log('- Use "ask" for operations that need user confirmation');
  console.log('- Use "reject" to block dangerous operations');
  console.log('- Use "delegate" to offload decisions to external programs');
  console.log('- Use glob patterns (*) for matching multiple tools');
  console.log('- Use context to separate main thread from subagent permissions');
  console.log('- Always include a catch-all rule at the end');

  console.log('\nBest practices:');
  console.log('1. Start with restrictive defaults');
  console.log('2. Explicitly allow known-safe operations');
  console.log('3. Use ask for potentially risky operations');
  console.log('4. Test permissions thoroughly before production');
  console.log('5. Document your permission rules');
  console.log('6. Consider context-specific permissions for subagents');

  console.log('\nCommon patterns:');
  console.log('- Development: dangerouslyAllowAll: true (no restrictions)');
  console.log('- Staging: Ask before writes, allow reads');
  console.log('- Production: Strict allowlist, reject by default');
}

main().catch(console.error);
