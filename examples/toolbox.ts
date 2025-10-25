/**
 * Custom Toolbox Example
 *
 * Demonstrates how to extend Amp's capabilities with custom tools
 * by providing a directory of toolbox scripts.
 *
 * Toolboxes allow you to add domain-specific functionality to Amp.
 *
 * Run: npx tsx examples/toolbox.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';
import * as path from 'path';

async function main() {
  console.log('🧰 Testing Custom Toolbox Integration\n');

  // Example 1: Basic toolbox configuration
  console.log('1. Basic toolbox configuration...');
  try {
    const toolboxPath = path.join(process.cwd(), 'toolbox');

    console.log('   ✅ Toolbox path configured:', toolboxPath);
    console.log('      Note: Toolbox scripts would be loaded from this directory');
    console.log('      Example structure:');
    console.log('      toolbox/');
    console.log('        ├── deploy.sh         - Deployment automation');
    console.log('        ├── test-runner.js    - Custom test execution');
    console.log('        ├── db-query.py       - Database queries');
    console.log('        └── api-call.ts       - API integrations');

    // Example configuration (not executed to avoid needing actual toolbox)
    /*
    const { text } = await generateText({
      model: amp('default', {
        toolbox: toolboxPath,
        dangerouslyAllowAll: true,
      }),
      prompt: 'Use the deployment tool to deploy to staging',
    });
    console.log('   Response:', text);
    */
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 2: Deployment toolbox
  console.log('\n2. Deployment automation toolbox...');
  try {
    console.log('   Example deployment toolbox structure:');
    console.log('   toolbox/deployment/');
    console.log('     ├── deploy-staging.sh   - Deploy to staging environment');
    console.log('     ├── deploy-prod.sh      - Deploy to production');
    console.log('     ├── rollback.sh         - Rollback deployment');
    console.log('     ├── health-check.sh     - Check deployment health');
    console.log('     └── smoke-test.sh       - Run smoke tests');
    console.log('');
    console.log('   Usage example:');
    console.log('   "Deploy the latest changes to staging and run smoke tests"');
    console.log('   → Amp would use deploy-staging.sh and smoke-test.sh');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 3: Data processing toolbox
  console.log('\n3. Data processing toolbox...');
  try {
    console.log('   Example data toolbox structure:');
    console.log('   toolbox/data/');
    console.log('     ├── transform-csv.py    - CSV transformation');
    console.log('     ├── validate-json.js    - JSON validation');
    console.log('     ├── merge-datasets.py   - Dataset merging');
    console.log('     ├── generate-report.js  - Report generation');
    console.log('     └── export-to-db.py     - Database export');
    console.log('');
    console.log('   Usage example:');
    console.log('   "Transform the sales.csv and generate a monthly report"');
    console.log('   → Amp would use transform-csv.py and generate-report.js');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 4: Testing toolbox
  console.log('\n4. Testing and QA toolbox...');
  try {
    console.log('   Example testing toolbox structure:');
    console.log('   toolbox/testing/');
    console.log('     ├── run-unit-tests.sh   - Unit test execution');
    console.log('     ├── run-e2e-tests.sh    - E2E test execution');
    console.log('     ├── coverage-report.sh  - Generate coverage');
    console.log('     ├── lint-check.sh       - Code quality check');
    console.log('     └── performance-test.js - Performance testing');
    console.log('');
    console.log('   Usage example:');
    console.log('   "Run all tests and generate a coverage report"');
    console.log('   → Amp would use run-unit-tests.sh, run-e2e-tests.sh, coverage-report.sh');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 5: API integration toolbox
  console.log('\n5. API integration toolbox...');
  try {
    console.log('   Example API toolbox structure:');
    console.log('   toolbox/api/');
    console.log('     ├── slack-notify.js     - Send Slack notifications');
    console.log('     ├── github-pr.js        - Create GitHub PR');
    console.log('     ├── jira-ticket.js      - Create JIRA ticket');
    console.log('     ├── datadog-event.js    - Send Datadog event');
    console.log('     └── stripe-payment.js   - Process Stripe payment');
    console.log('');
    console.log('   Usage example:');
    console.log('   "Create a JIRA ticket for this bug and notify the team on Slack"');
    console.log('   → Amp would use jira-ticket.js and slack-notify.js');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 6: Toolbox with permissions
  console.log('\n6. Combining toolbox with permissions...');
  try {
    const toolboxPath = './toolbox/deployment';

    const permissions = [
      // Allow toolbox scripts
      {
        tool: 'Bash',
        action: 'allow' as const,
        matches: { cmd: './toolbox/*' },
      },
      // Ask before production deployments
      {
        tool: 'Bash',
        action: 'ask' as const,
        matches: { cmd: './toolbox/deployment/deploy-prod.sh*' },
      },
      // Reject rollbacks (require manual intervention)
      {
        tool: 'Bash',
        action: 'reject' as const,
        matches: { cmd: './toolbox/deployment/rollback.sh*' },
      },
    ];

    console.log('   ✅ Toolbox + Permissions configured:');
    console.log('      - Toolbox path:', toolboxPath);
    console.log('      - Staging deployments: Allowed');
    console.log('      - Production deployments: Ask for confirmation');
    console.log('      - Rollbacks: Rejected (manual only)');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  // Example 7: Environment-specific toolbox
  console.log('\n7. Environment-specific toolbox configuration...');
  try {
    const env = process.env.NODE_ENV || 'development';

    const toolboxConfig = {
      development: './toolbox/dev',
      staging: './toolbox/staging',
      production: './toolbox/prod',
    };

    const toolboxPath = toolboxConfig[env as keyof typeof toolboxConfig];

    console.log('   ✅ Environment-based toolbox:');
    console.log('      - Environment:', env);
    console.log('      - Toolbox path:', toolboxPath);
    console.log('      - Development: Full toolset with debugging');
    console.log('      - Staging: Limited toolset for testing');
    console.log('      - Production: Minimal, audited toolset');
  } catch (error: any) {
    console.error('   ❌ Error:', error.message);
  }

  console.log('\n✅ Toolbox examples completed');
  console.log('\nKey concepts:');
  console.log('- Toolbox extends Amp with custom scripts');
  console.log('- Scripts can be in any language (bash, python, node, etc.)');
  console.log('- Amp discovers and uses tools automatically');
  console.log('- Combine with permissions for security');
  console.log('- Use different toolboxes per environment');

  console.log('\nToolbox script requirements:');
  console.log('- Must be executable (chmod +x)');
  console.log('- Should handle arguments properly');
  console.log('- Should exit with proper status codes');
  console.log('- Should provide clear output/errors');
  console.log('- Should be idempotent when possible');

  console.log('\nBest practices:');
  console.log('1. Organize scripts by domain (deployment, testing, data)');
  console.log('2. Add descriptive comments/help text to each script');
  console.log('3. Use environment variables for configuration');
  console.log('4. Implement proper error handling and logging');
  console.log('5. Test scripts independently before adding to toolbox');
  console.log('6. Version control your toolbox scripts');
  console.log('7. Document required permissions and dependencies');

  console.log('\nCommon use cases:');
  console.log('- Deployment automation');
  console.log('- Database operations');
  console.log('- API integrations');
  console.log('- Testing and QA');
  console.log('- Data processing');
  console.log('- Infrastructure management');
  console.log('- Custom business logic');
}

main().catch(console.error);
