/**
 * Custom Logger Example
 *
 * Demonstrates how to implement a custom logger to integrate with
 * your existing logging infrastructure (e.g., Winston, Pino, Datadog).
 *
 * Run: npx tsx examples/logging-custom-logger.ts
 */

import { generateText } from 'ai';
import { amp } from '../dist/index.js';
import type { Logger } from '../dist/index.js';

async function main() {
  console.log('=== Custom Logger Mode ===\n');

  // Example 1: Simple custom logger with prefixes
  console.log('1. Simple custom logger with prefixes...\n');

  const simpleLogger: Logger = {
    debug: (message: string) => console.log(`[🔍 DEBUG] ${message}`),
    info: (message: string) => console.log(`[ℹ️  INFO]  ${message}`),
    warn: (message: string) => console.log(`[⚠️  WARN]  ${message}`),
    error: (message: string) => console.log(`[❌ ERROR] ${message}`),
  };

  try {
    const { text } = await generateText({
      model: amp('default', {
        logger: simpleLogger, // Provider-only option: custom logger
        verbose: true, // Provider-only option: enable verbose to see debug/info logs
      }),
      prompt: 'Say hello',
    });

    console.log('\n📝 Response:', text);
    console.log('✓ Notice custom log prefixes above');
  } catch (error: any) {
    console.error('Error:', error.message);
  }

  // Example 2: Logger with timestamp
  console.log('\n\n2. Logger with timestamps...\n');

  const timestampLogger: Logger = {
    debug: (message: string) => {
      const time = new Date().toISOString();
      console.log(`[${time}] [DEBUG] ${message}`);
    },
    info: (message: string) => {
      const time = new Date().toISOString();
      console.log(`[${time}] [INFO]  ${message}`);
    },
    warn: (message: string) => {
      const time = new Date().toISOString();
      console.log(`[${time}] [WARN]  ${message}`);
    },
    error: (message: string) => {
      const time = new Date().toISOString();
      console.log(`[${time}] [ERROR] ${message}`);
    },
  };

  try {
    const { text } = await generateText({
      model: amp('default', {
        logger: timestampLogger,
        verbose: true,
      }),
      prompt: 'Count to three',
    });

    console.log('\n📝 Response:', text);
    console.log('✓ Notice timestamps in logs above');
  } catch (error: any) {
    console.error('Error:', error.message);
  }

  // Example 3: Logger that writes to file
  console.log('\n\n3. Logger that writes to file...\n');

  // Simulated file logger (in real app, use fs.appendFileSync or a logging library)
  const logBuffer: string[] = [];

  const fileLogger: Logger = {
    debug: (message: string) => {
      const entry = `DEBUG: ${message}`;
      logBuffer.push(entry);
      console.log(`[Logged to buffer] ${entry}`);
    },
    info: (message: string) => {
      const entry = `INFO: ${message}`;
      logBuffer.push(entry);
      console.log(`[Logged to buffer] ${entry}`);
    },
    warn: (message: string) => {
      const entry = `WARN: ${message}`;
      logBuffer.push(entry);
      console.log(`[Logged to buffer] ${entry}`);
    },
    error: (message: string) => {
      const entry = `ERROR: ${message}`;
      logBuffer.push(entry);
      console.log(`[Logged to buffer] ${entry}`);
    },
  };

  try {
    const { text } = await generateText({
      model: amp('default', {
        logger: fileLogger,
        verbose: true,
      }),
      prompt: 'Say goodbye',
    });

    console.log('\n📝 Response:', text);
    console.log(`\n📄 Log buffer contains ${logBuffer.length} entries`);
    console.log('   (In production, these would be written to a file)');
  } catch (error: any) {
    console.error('Error:', error.message);
  }

  // Example 4: Integration with popular logging library pattern
  console.log('\n\n4. Pattern for popular logging libraries...\n');

  // This shows how you'd integrate with Winston, Pino, etc.
  class ProductionLogger implements Logger {
    // In real app, this would be: private logger: Winston.Logger
    private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

    constructor(level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
      this.logLevel = level;
    }

    debug(message: string): void {
      if (this.shouldLog('debug')) {
        // In real app: this.logger.debug(message)
        console.log(`[Winston/Pino] DEBUG: ${message}`);
      }
    }

    info(message: string): void {
      if (this.shouldLog('info')) {
        // In real app: this.logger.info(message)
        console.log(`[Winston/Pino] INFO: ${message}`);
      }
    }

    warn(message: string): void {
      if (this.shouldLog('warn')) {
        // In real app: this.logger.warn(message)
        console.log(`[Winston/Pino] WARN: ${message}`);
      }
    }

    error(message: string): void {
      if (this.shouldLog('error')) {
        // In real app: this.logger.error(message)
        console.log(`[Winston/Pino] ERROR: ${message}`);
      }
    }

    private shouldLog(level: string): boolean {
      const levels = ['debug', 'info', 'warn', 'error'];
      const currentLevel = levels.indexOf(this.logLevel);
      const messageLevel = levels.indexOf(level);
      return messageLevel >= currentLevel;
    }
  }

  try {
    const prodLogger = new ProductionLogger('info');

    const { text } = await generateText({
      model: amp('default', {
        logger: prodLogger,
        verbose: true,
      }),
      prompt: 'Say thanks',
    });

    console.log('\n📝 Response:', text);
    console.log('✓ Notice only info/warn/error logs (debug filtered)');
  } catch (error: any) {
    console.error('Error:', error.message);
  }

  // Example 5: Logger with structured logging (JSON)
  console.log('\n\n5. Structured JSON logging...\n');

  const jsonLogger: Logger = {
    debug: (message: string) => {
      console.log(
        JSON.stringify({
          level: 'debug',
          timestamp: new Date().toISOString(),
          source: 'amp-sdk-provider',
          message,
        })
      );
    },
    info: (message: string) => {
      console.log(
        JSON.stringify({
          level: 'info',
          timestamp: new Date().toISOString(),
          source: 'amp-sdk-provider',
          message,
        })
      );
    },
    warn: (message: string) => {
      console.log(
        JSON.stringify({
          level: 'warn',
          timestamp: new Date().toISOString(),
          source: 'amp-sdk-provider',
          message,
        })
      );
    },
    error: (message: string) => {
      console.log(
        JSON.stringify({
          level: 'error',
          timestamp: new Date().toISOString(),
          source: 'amp-sdk-provider',
          message,
        })
      );
    },
  };

  try {
    const { text } = await generateText({
      model: amp('default', {
        logger: jsonLogger,
        verbose: true,
      }),
      prompt: 'What is AI?',
    });

    console.log('\n📝 Response:', text);
    console.log('✓ Notice structured JSON logs above (ideal for log aggregators)');
  } catch (error: any) {
    console.error('Error:', error.message);
  }

  console.log('\n\n✅ Custom logger examples completed');
  console.log('\nIntegration examples:');
  console.log('- Winston: Pass winston.createLogger() instance');
  console.log('- Pino: Wrap pino() logger with Logger interface');
  console.log('- Bunyan: Wrap bunyan.createLogger() instance');
  console.log('- Console: Use custom console wrapper');
  console.log('- File: Write to log files');
  console.log('- Remote: Send to Datadog, Splunk, etc.');

  console.log('\nBest practices:');
  console.log('1. Match your existing logging infrastructure');
  console.log('2. Include timestamps for production logs');
  console.log('3. Use structured logging (JSON) for parsing');
  console.log('4. Filter by log level appropriately');
  console.log('5. Consider async logging for performance');
  console.log('6. Add context (request IDs, user IDs, etc.)');
}

main().catch(console.error);
