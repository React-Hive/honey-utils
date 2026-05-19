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
    const result = decodeBase64('SGVsbG8sIE1pa2UhIDElICQjQA==');

    expect(result).toBe('Hello, Mike! 1% $#@');
  });

  it('should decode JSON string from base64', () => {
    const result = decodeBase64('eyJuYW1lIjoiTWlrZSIsImFnZSI6MzN9');

    expect(result).toBe('{"name":"Mike","age":33}');
  });

  it('should decode unicode text from base64', () => {
    const result = decodeBase64('0J/RgNC40LLQtdGCINC80LjRgA==');

    expect(result).toBe('Привет мир');
  });

  it('should decode emoji text from base64', () => {
    const result = decodeBase64('SGVsbG8g8J+Riw==');

    expect(result).toBe('Hello 👋');
  });

  it('should return null for invalid base64 input', () => {
    const result = decodeBase64('%%%');

    expect(result).toBeNull();
  });
});
