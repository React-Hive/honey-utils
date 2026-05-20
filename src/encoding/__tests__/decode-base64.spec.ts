import { decodeBase64 } from '~/encoding';

describe('[decodeBase64]: decode base64 string utility', () => {
  it('should decode empty string', () => {
    const result = decodeBase64('');

    expect(result).toBe('');
  });

  it('should decode plain text from base64', () => {
    const result = decodeBase64('SGVsbG8gd29ybGQ=');

    expect(result).toBe('Hello world');
  });

  it('should decode text with spaces and special characters', () => {
    const result = decodeBase64('QXBwbGUsIGJhbmFuYSEgMSUgJCM=');

    expect(result).toBe('Apple, banana! 1% $#');
  });

  it('should decode JSON string from base64', () => {
    const result = decodeBase64('eyJmcnVpdCI6ImFwcGxlIiwicXVhbnRpdHkiOjN9');

    expect(result).toBe('{"fruit":"apple","quantity":3}');
  });

  it('should decode unicode text from base64', () => {
    const result = decodeBase64('0Y/QsdC70L7QutC+');

    expect(result).toBe('яблоко');
  });

  it('should decode emoji text from base64', () => {
    const result = decodeBase64('QXBwbGUg8J+Njg==');

    expect(result).toBe('Apple 🍎');
  });

  it('should return null for invalid base64 input', () => {
    const result = decodeBase64('%%%');

    expect(result).toBeNull();
  });
});
