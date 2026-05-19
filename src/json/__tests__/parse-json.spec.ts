import { parseJson } from '~/json';

describe('[parseJson]: parse JSON string utility', () => {
  it('should parse object JSON', () => {
    const result = parseJson<{
      name: string;
      age: number;
    }>('{"name":"Mike","age":33}');

    expect(result).toStrictEqual({
      name: 'Mike',
      age: 33,
    });
  });

  it('should parse array JSON', () => {
    const result = parseJson<number[]>('[1,2,3]');

    expect(result).toStrictEqual([1, 2, 3]);
  });

  it('should parse string JSON', () => {
    const result = parseJson<string>('"Hello world"');

    expect(result).toBe('Hello world');
  });

  it('should parse number JSON', () => {
    const result = parseJson<number>('123');

    expect(result).toBe(123);
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
    const result = parseJson('{name:"Mike"}');

    expect(result).toBeNull();
  });

  it('should return null for malformed JSON', () => {
    const result = parseJson('{"name":"Mike"');

    expect(result).toBeNull();
  });
});
