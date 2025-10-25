import { describe, it, expect } from 'vitest';
import { validateSettings } from './validation.js';

describe('validateSettings', () => {
  describe('resume validation', () => {
    it('should error when resume is an empty string', () => {
      const result = validateSettings({ resume: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('resume must be a non-empty string (session ID)');
    });

    it('should error when resume is whitespace only', () => {
      const result = validateSettings({ resume: '   ' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('resume must be a non-empty string (session ID)');
    });

    it('should error when resume is not a string', () => {
      // @ts-expect-error - Testing runtime validation
      const result = validateSettings({ resume: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('resume must be a non-empty string (session ID)');
    });

    it('should pass when resume is a valid session ID', () => {
      const result = validateSettings({ resume: 'T-abc123-def456' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when resume is undefined', () => {
      const result = validateSettings({});
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('continue validation', () => {
    it('should error when continue is not a boolean or string', () => {
      // @ts-expect-error - Testing runtime validation
      const result = validateSettings({ continue: 123 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('continue must be a boolean or a string (session ID)');
    });

    it('should pass when continue is a non-empty string (session ID)', () => {
      const result = validateSettings({ continue: 'T-abc123-def456' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should error when continue is an empty string', () => {
      const result = validateSettings({ continue: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('continue must be a non-empty string (session ID) when used as a string');
    });

    it('should pass when continue is true', () => {
      const result = validateSettings({ continue: true });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when continue is false', () => {
      const result = validateSettings({ continue: false });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('continue and resume interaction', () => {
    it('should warn when both continue and resume are set (both valid)', () => {
      const result = validateSettings({ 
        continue: true, 
        resume: 'T-session-id' 
      });
      expect(result.valid).toBe(true); // Not an error, just a warning
      expect(result.warnings).toContain(
        'Both `continue` and `resume` are set. Using `resume`; ignoring `continue`.'
      );
    });

    it('should not warn when only continue is set', () => {
      const result = validateSettings({ continue: true });
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should not warn when only resume is set', () => {
      const result = validateSettings({ resume: 'T-session-id' });
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn when continue is false and resume is set (both defined)', () => {
      const result = validateSettings({ 
        continue: false, 
        resume: 'T-session-id' 
      });
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        'Both `continue` and `resume` are set. Using `resume`; ignoring `continue`.'
      );
    });

    it('should not warn when continue is true but resume is invalid (non-string)', () => {
      // @ts-expect-error - Testing runtime validation
      const result = validateSettings({ 
        continue: true, 
        resume: 123 
      });
      expect(result.valid).toBe(false); // Error for invalid resume
      expect(result.errors).toContain('resume must be a non-empty string (session ID)');
      expect(result.warnings).toHaveLength(0); // No warning since resume is invalid
    });

    it('should not warn when continue is true but resume is empty string', () => {
      const result = validateSettings({ 
        continue: true, 
        resume: '' 
      });
      expect(result.valid).toBe(false); // Error for invalid resume
      expect(result.errors).toContain('resume must be a non-empty string (session ID)');
      expect(result.warnings).toHaveLength(0); // No warning since resume is invalid
    });
  });

  describe('maxTurns validation', () => {
    it('should error when maxTurns is negative', () => {
      const result = validateSettings({ maxTurns: -1 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('maxTurns must be a positive integer');
    });

    it('should error when maxTurns is zero', () => {
      const result = validateSettings({ maxTurns: 0 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('maxTurns must be a positive integer');
    });

    it('should error when maxTurns is not an integer', () => {
      const result = validateSettings({ maxTurns: 5.5 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('maxTurns must be a positive integer');
    });

    it('should pass when maxTurns is 1 (minimum valid value)', () => {
      const result = validateSettings({ maxTurns: 1 });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when maxTurns is a positive integer', () => {
      const result = validateSettings({ maxTurns: 10 });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('cwd validation', () => {
    it('should error when cwd is an empty string', () => {
      const result = validateSettings({ cwd: '' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('cwd must be a non-empty string');
    });

    it('should error when cwd is whitespace only', () => {
      const result = validateSettings({ cwd: '   ' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('cwd must be a non-empty string');
    });

    it('should pass when cwd is a valid path', () => {
      const result = validateSettings({ cwd: '/path/to/project' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('logLevel validation', () => {
    it('should error when logLevel is invalid', () => {
      // @ts-expect-error - Testing runtime validation
      const result = validateSettings({ logLevel: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('logLevel must be one of: debug, info, warn, error, audit');
    });

    it('should pass when logLevel is "debug"', () => {
      const result = validateSettings({ logLevel: 'debug' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when logLevel is "info"', () => {
      const result = validateSettings({ logLevel: 'info' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when logLevel is "warn"', () => {
      const result = validateSettings({ logLevel: 'warn' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when logLevel is "error"', () => {
      const result = validateSettings({ logLevel: 'error' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass when logLevel is "audit"', () => {
      const result = validateSettings({ logLevel: 'audit' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('verbose with logger: false', () => {
    it('should warn when verbose is true but logger is disabled', () => {
      const result = validateSettings({ 
        verbose: true, 
        logger: false 
      });
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        'verbose is enabled but logger is disabled, no logs will be output'
      );
    });

    it('should not warn when verbose is false with logger disabled', () => {
      const result = validateSettings({ 
        verbose: false, 
        logger: false 
      });
      expect(result.valid).toBe(true);
      expect(result.warnings).not.toContain(
        'verbose is enabled but logger is disabled, no logs will be output'
      );
    });
  });

  describe('permissions validation', () => {
    it('should error when permissions is not an array', () => {
      // @ts-expect-error - Testing runtime validation
      const result = validateSettings({ permissions: 'not-an-array' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('permissions must be an array');
    });

    it('should pass when permissions is an array', () => {
      const result = validateSettings({ 
        permissions: [
          { tool: 'Bash', action: 'allow' }
        ] 
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
