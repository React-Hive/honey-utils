import { parseJson } from '~/json';

describe('[parseJson]: parse JSON string utility', () => {
  it('should parse object JSON', () => {
    const result = parseJson<{
      fruit: string;
      quantity: number;
    }>('{"fruit":"apple","quantity":3}');

    expect(result).toStrictEqual({
      fruit: 'apple',
      quantity: 3,
    });
  });

  it('should parse array JSON', () => {
    const result = parseJson<string[]>('["apple","banana","orange"]');

    expect(result).toStrictEqual(['apple', 'banana', 'orange']);
  });

  it('should parse string JSON', () => {
    const result = parseJson<string>('"apple"');

    expect(result).toBe('apple');
  });

  it('should parse number JSON', () => {
    const result = parseJson<number>('3');

    expect(result).toBe(3);
  });

  it('should parse boolean JSON', () => {
    const result = parseJson<boolean>('true');

    expect(result).toBe(true);
  });

  it('should parse null JSON', () => {
    const result = parseJson<null>('null');

    expect(result).toBeNull();
  });

  it('should return null for empty string', () => {
    const result = parseJson('');

    expect(result).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    const result = parseJson('{fruit:"apple"}');

    expect(result).toBeNull();
  });

  it('should return null for malformed JSON', () => {
    const result = parseJson('{"fruit":"apple"');

    expect(result).toBeNull();
  });
});
