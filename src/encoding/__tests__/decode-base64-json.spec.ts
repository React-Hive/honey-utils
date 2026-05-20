import { decodeBase64Json } from '~/encoding';

describe('[decodeBase64Json]: decode base64 JSON string utility', () => {
  it('should decode and parse object JSON from base64', () => {
    const result = decodeBase64Json<{
      fruit: string;
      quantity: number;
    }>('eyJmcnVpdCI6ImFwcGxlIiwicXVhbnRpdHkiOjN9');

    expect(result).toStrictEqual({
      fruit: 'apple',
      quantity: 3,
    });
  });

  it('should decode and parse array JSON from base64', () => {
    const result = decodeBase64Json<string[]>('WyJhcHBsZSIsImJhbmFuYSIsIm9yYW5nZSJd');

    expect(result).toStrictEqual(['apple', 'banana', 'orange']);
  });

  it('should decode and parse string JSON from base64', () => {
    const result = decodeBase64Json<string>('ImFwcGxlIg==');

    expect(result).toBe('apple');
  });

  it('should decode and parse number JSON from base64', () => {
    const result = decodeBase64Json<number>('Mw==');

    expect(result).toBe(3);
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
      fruit: string;
    }>('eyJmcnVpdCI6ItGP0LHQu9C+0LrQviJ9');

    expect(result).toStrictEqual({
      fruit: 'яблоко',
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
    const result = decodeBase64Json('eyJmcnVpdCI6ImFwcGxlIg==');

    expect(result).toBeNull();
  });
});
