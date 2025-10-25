/**
 * MCP (Model Context Protocol) Server Integration Example
 *
 * Demonstrates how to extend Amp's capabilities with MCP servers.
 * MCP servers can provide custom tools, data sources, and functionality.
 *
 * This is a KEY Amp SDK feature for extensibility.
 *
 * Run: npx tsx examples/mcp-integration.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';
import type { MCPServer } from '../dist/index.js';

async function main() {
  console.log('🔌 Testing MCP Server Integration\n');

  // Example 1: Playwright MCP for browser automation
  console.log('1. Configuring Playwright MCP server...');
  try {
    // Note: Verify actual @playwright/mcp flags and env vars from its documentation
    const mcpConfig: Record<string, MCPServer> = {
      playwright: {
        command: 'npx',
        args: ['-y', '@playwright/mcp@latest', '--headless'],
        env: {
          NODE_ENV: 'production',
        },
      },
    };

    console.log('   ✅ Playwright MCP configured');
    console.log('      Command:', mcpConfig.playwright.command);
    console.log('      Args:', mcpConfig.playwright.args.join(' '));
    console.log('      Note: This would enable browser automation tools');

    // Example usage (commented to avoid actually launching browser)
    /*
    const { text } = await generateText({
      model: amp('default', {
        mcpConfig,
        dangerouslyAllowAll: true,
      }),
      prompt: 'Navigate to example.com and take a screenshot',
    });
    console.log('   Response:', text);
    */
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 2: Custom database MCP server
  console.log('\n2. Configuring custom database MCP server...');
  try {
    const mcpConfig: Record<string, MCPServer> = {
      database: {
        command: 'node',
        args: ['./custom-mcp-server.js'],
        env: {
          DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
          DB_POOL_SIZE: '10',
        },
      },
    };

    console.log('   ✅ Database MCP configured');
    console.log('      Command: node ./custom-mcp-server.js');
    console.log('      Environment:');
    console.log('         DATABASE_URL:', mcpConfig.database.env?.DATABASE_URL);
    console.log('         DB_POOL_SIZE:', mcpConfig.database.env?.DB_POOL_SIZE);
    console.log('      Note: This would enable database query tools');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 3: Multiple MCP servers
  console.log('\n3. Configuring multiple MCP servers...');
  try {
    // Note: Verify actual server package names, env vars, and args from MCP server documentation
    const mcpConfig: Record<string, MCPServer> = {
      // Browser automation
      playwright: {
        command: 'npx',
        args: ['-y', '@playwright/mcp@latest', '--headless'],
      },

      // File system operations
      filesystem: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem'],
        env: {
          // Verify actual env var name from @modelcontextprotocol/server-filesystem docs
          ALLOWED_PATHS: process.cwd(),
        },
      },

      // Git operations
      git: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-git'],
      },
    };

    console.log('   ✅ Multiple MCP servers configured:');
    console.log('      1. Playwright - Browser automation');
    console.log('      2. Filesystem - File operations');
    console.log('      3. Git - Version control');
    console.log('      Note: All tools from all servers would be available');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 4: Custom MCP server with environment variables
  console.log('\n4. MCP server with extensive environment configuration...');
  try {
    const mcpConfig: Record<string, MCPServer> = {
      'api-service': {
        command: 'node',
        args: ['./mcp-servers/api-service/index.js'],
        env: {
          API_BASE_URL: 'https://api.example.com',
          API_KEY: process.env.EXTERNAL_API_KEY || '',
          TIMEOUT_MS: '30000',
          RETRY_COUNT: '3',
          LOG_LEVEL: 'debug',
        },
      },
    };

    console.log('   ✅ API service MCP configured');
    console.log('      Environment variables:');
    Object.entries(mcpConfig['api-service'].env || {}).forEach(([key, value]) => {
      console.log(`         ${key}: ${key.includes('KEY') ? '***' : value}`);
    });
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 5: Conditional MCP configuration
  console.log('\n5. Environment-based MCP configuration...');
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const mcpConfig: Record<string, MCPServer> = {
      // Always include core servers
      filesystem: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem'],
        env: {
          ALLOWED_PATHS: process.cwd(),
        },
      },

      // Include debugging tools only in development
      ...(isDevelopment && {
        debugger: {
          command: 'node',
          args: ['./mcp-servers/debugger/index.js'],
          env: {
            DEBUG: 'true',
            VERBOSE: 'true',
          },
        },
      }),
    };

    console.log('   ✅ Conditional MCP configuration:');
    console.log('      - Filesystem: Always enabled');
    console.log(`      - Debugger: ${isDevelopment ? 'Enabled (dev mode)' : 'Disabled (production)'}`);
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 6: Using MCP with permissions
  console.log('\n6. Combining MCP with permission management...');
  try {
    const mcpConfig: Record<string, MCPServer> = {
      playwright: {
        command: 'npx',
        args: ['-y', '@playwright/mcp@latest', '--headless'],
      },
    };

    const permissions = [
      // Allow Playwright to navigate
      {
        tool: 'mcp__playwright__navigate',
        action: 'allow' as const,
      },
      // Ask before clicking
      {
        tool: 'mcp__playwright__click',
        action: 'ask' as const,
      },
      // Reject form submissions
      {
        tool: 'mcp__playwright__submit',
        action: 'reject' as const,
      },
      // Allow screenshots
      {
        tool: 'mcp__playwright__screenshot',
        action: 'allow' as const,
      },
    ];

    console.log('   ✅ MCP + Permissions configured:');
    console.log('      - Navigate: Allowed');
    console.log('      - Click: Ask for confirmation');
    console.log('      - Submit: Rejected');
    console.log('      - Screenshot: Allowed');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 7: Real-world production configuration
  console.log('\n7. Production-ready MCP configuration...');
  try {
    const mcpConfig: Record<string, MCPServer> = {
      // Monitoring and observability
      monitoring: {
        command: 'node',
        args: ['./mcp-servers/monitoring/index.js'],
        env: {
          DATADOG_API_KEY: process.env.DATADOG_API_KEY || '',
          SERVICE_NAME: 'amp-integration',
          ENVIRONMENT: process.env.NODE_ENV || 'development',
        },
      },

      // Database access (read-only)
      database: {
        command: 'node',
        args: ['./mcp-servers/database/index.js'],
        env: {
          DATABASE_URL: process.env.DATABASE_URL || '',
          READ_ONLY: 'true',
          POOL_SIZE: '5',
          TIMEOUT_MS: '10000',
        },
      },

      // Internal API access
      api: {
        command: 'node',
        args: ['./mcp-servers/api-gateway/index.js'],
        env: {
          API_GATEWAY_URL: process.env.API_GATEWAY_URL || '',
          SERVICE_TOKEN: process.env.SERVICE_TOKEN || '',
          RATE_LIMIT: '100',
        },
      },
    };

    console.log('   ✅ Production MCP stack configured:');
    console.log('      1. Monitoring - Datadog integration');
    console.log('      2. Database - Read-only access');
    console.log('      3. API Gateway - Internal service access');
    console.log('      Note: All servers use secure environment variables');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n✅ MCP integration examples completed');
  console.log('\nKey concepts:');
  console.log('- MCP servers extend Amp with custom tools');
  console.log('- Configure servers with command, args, and environment');
  console.log('- Multiple servers can run simultaneously');
  console.log('- Combine with permissions for fine-grained control');
  console.log('- Use environment variables for configuration');

  console.log('\nCommon MCP servers:');
  console.log('- @playwright/mcp - Browser automation');
  console.log('- @modelcontextprotocol/server-filesystem - File operations');
  console.log('- @modelcontextprotocol/server-git - Git integration');
  console.log('- Custom servers - Your own tools and integrations');

  console.log('\nBest practices:');
  console.log('1. Keep sensitive data in environment variables');
  console.log('2. Use permissions to control MCP tool access');
  console.log('3. Test MCP servers independently before integration');
  console.log('4. Configure different servers for dev/staging/prod');
  console.log('5. Monitor MCP server health and performance');
  console.log('6. Document custom MCP server capabilities');

  console.log('\nSecurity tips:');
  console.log('- Never hardcode API keys or secrets');
  console.log('- Use read-only database connections where possible');
  console.log('- Implement rate limiting in custom servers');
  console.log('- Validate all inputs in custom MCP servers');
  console.log('- Use permissions to restrict MCP tool usage');
}

main().catch(console.error);
