import { decodeBase64, encodeBase64 } from '~/encoding';

describe('[encodeBase64]: encode string to base64 utility', () => {
  it('should encode empty string', () => {
    const result = encodeBase64('');

    expect(result).toBe('');
  });

  it('should encode plain text to base64', () => {
    const result = encodeBase64('Hello world');

    expect(result).toBe('SGVsbG8gd29ybGQ=');
  });

  it('should encode text with spaces and special characters', () => {
    const result = encodeBase64('Apple, banana! 1% $#');

    expect(result).toBe('QXBwbGUsIGJhbmFuYSEgMSUgJCM=');
  });

  it('should encode JSON string to base64', () => {
    const result = encodeBase64('{"fruit":"apple","quantity":3}');

    expect(result).toBe('eyJmcnVpdCI6ImFwcGxlIiwicXVhbnRpdHkiOjN9');
  });

  it('should encode unicode text as UTF-8', () => {
    const result = encodeBase64('яблоко');

    expect(result).toBe('0Y/QsdC70L7QutC+');
  });

  it('should encode emoji text as UTF-8', () => {
    const result = encodeBase64('Apple 🍎');

    expect(result).toBe('QXBwbGUg8J+Njg==');
  });

  it('should keep a leading byte order mark', () => {
    const result = encodeBase64('﻿A');

    expect(result).toBe('77u/QQ==');
  });

  it('should encode a lone surrogate as the replacement character', () => {
    const result = encodeBase64('\uD800');

    expect(result).toBe('77+9');
  });

  it('should round-trip through decodeBase64', () => {
    const value = 'Apple, яблоко 🍎 - 100% "fresh"';

    const result = decodeBase64(encodeBase64(value));

    expect(result).toBe(value);
  });

  describe('without Buffer', () => {
    beforeEach(() => {
      vi.stubGlobal('Buffer', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should encode plain text to base64', () => {
      const result = encodeBase64('Hello world');

      expect(result).toBe('SGVsbG8gd29ybGQ=');
    });

    it('should encode unicode text as UTF-8', () => {
      const result = encodeBase64('яблоко');

      expect(result).toBe('0Y/QsdC70L7QutC+');
    });

    it('should encode emoji text as UTF-8', () => {
      const result = encodeBase64('Apple 🍎');

      expect(result).toBe('QXBwbGUg8J+Njg==');
    });

    it('should encode a lone surrogate as the replacement character', () => {
      const result = encodeBase64('\uD800');

      expect(result).toBe('77+9');
    });
  });
});
