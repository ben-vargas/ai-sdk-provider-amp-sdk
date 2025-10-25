import { describe, it, expect } from 'vitest';
import { createAmp, amp } from './amp-provider.js';
import { AmpLanguageModel } from './amp-language-model.js';

describe('AmpProvider', () => {
  describe('createAmp', () => {
    it('should create a provider instance', () => {
      const provider = createAmp();
      expect(provider).toBeDefined();
      expect(typeof provider).toBe('function');
    });

    it('should create a model with default settings', () => {
      const provider = createAmp();
      const model = provider('default');
      expect(model).toBeInstanceOf(AmpLanguageModel);
    });

    it('should throw error when called with new keyword', () => {
      const provider = createAmp();
      expect(() => {
        // @ts-expect-error - Testing runtime behavior
        new provider('default');
      }).toThrow('The Amp model function cannot be called with the new keyword.');
    });

    it('should merge default settings with model settings', () => {
      const provider = createAmp({
        defaultSettings: {
          maxTurns: 10,
          verbose: true,
        },
      });

      const model = provider('default', {
        maxTurns: 5,
      }) as AmpLanguageModel;

      expect(model.settings.maxTurns).toBe(5); // Model setting overrides default
      expect(model.settings.verbose).toBe(true); // Default setting preserved
    });

    it('should validate default settings', () => {
      expect(() => {
        createAmp({
          defaultSettings: {
            maxTurns: -1, // Invalid
          },
        });
      }).toThrow('Invalid default settings');
    });
  });

  describe('default amp instance', () => {
    it('should export a default provider instance', () => {
      expect(amp).toBeDefined();
      expect(typeof amp).toBe('function');
    });

    it('should create models using default instance', () => {
      const model = amp('default');
      expect(model).toBeInstanceOf(AmpLanguageModel);
    });
  });

  describe('provider methods', () => {
    it('should have languageModel method', () => {
      const provider = createAmp();
      expect(provider.languageModel).toBeDefined();
      const model = provider.languageModel('default');
      expect(model).toBeInstanceOf(AmpLanguageModel);
    });

    it('should have chat method as alias', () => {
      const provider = createAmp();
      expect(provider.chat).toBeDefined();
      const model = provider.chat('default');
      expect(model).toBeInstanceOf(AmpLanguageModel);
    });

    it('should throw NoSuchModelError for textEmbeddingModel', () => {
      const provider = createAmp();
      expect(() => {
        provider.textEmbeddingModel('default');
      }).toThrow();
    });

    it('should throw NoSuchModelError for imageModel', () => {
      const provider = createAmp();
      expect(() => {
        provider.imageModel('default');
      }).toThrow();
    });
  });
});
