import { decodeBase64Json } from '~/encoding';

describe('[decodeBase64Json]: decode base64 JSON string utility', () => {
  it('should decode and parse object JSON from base64', () => {
    const result = decodeBase64Json<{
      name: string;
      age: number;
    }>('eyJuYW1lIjoiTWlrZSIsImFnZSI6MzN9');

    expect(result).toStrictEqual({
      name: 'Mike',
      age: 33,
    });
  });

  it('should decode and parse array JSON from base64', () => {
    const result = decodeBase64Json<number[]>('WzEsMiwzXQ==');

    expect(result).toStrictEqual([1, 2, 3]);
  });

  it('should decode and parse string JSON from base64', () => {
    const result = decodeBase64Json<string>('IkhlbGxvIHdvcmxkIg==');

    expect(result).toBe('Hello world');
  });

  it('should decode and parse number JSON from base64', () => {
    const result = decodeBase64Json<number>('MTIz');

    expect(result).toBe(123);
  });

  it('should decode and parse boolean JSON from base64', () => {
    const result = decodeBase64Json<boolean>('dHJ1ZQ==');

    expect(result).toBe(true);
  });

  it('should decode and parse null JSON from base64', () => {
    const result = decodeBase64Json<null>('bnVsbA==');

    expect(result).toBeNull();
  });

  it('should decode and parse unicode JSON from base64', () => {
    const result = decodeBase64Json<{
      message: string;
    }>('eyJtZXNzYWdlIjoi0J/RgNC40LLQtdGCINC80LjRgCJ9');

    expect(result).toStrictEqual({
      message: 'Привет мир',
    });
  });

  it('should return null for invalid base64 input', () => {
    const result = decodeBase64Json('%%%');

    expect(result).toBeNull();
  });

  it('should return null when decoded value is not valid JSON', () => {
    const result = decodeBase64Json('SGVsbG8gd29ybGQ=');

    expect(result).toBeNull();
  });

  it('should return null for empty decoded value', () => {
    const result = decodeBase64Json('');

    expect(result).toBeNull();
  });

  it('should return null for malformed decoded JSON', () => {
    const result = decodeBase64Json('eyJuYW1lIjoiTWlrZSI=');

    expect(result).toBeNull();
  });
});
