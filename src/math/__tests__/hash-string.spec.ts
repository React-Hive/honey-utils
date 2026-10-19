import { hashString } from '~/math';

describe('[hashString]: short base-36 hash of a string', () => {
  it('should hash an empty string to the seed', () => {
    expect(hashString('')).toBe((5381).toString(36));
    expect(hashString('')).toBe('45h');
  });

  it('should give the known hash of a string', () => {
    expect(hashString('a')).toBe('3t1g');
    expect(hashString('hello')).toBe('2y0dev');
  });

  it('should give the same hash for the same input', () => {
    const input = 'display: flex; gap: 8px;';

    expect(hashString(input)).toBe(hashString(input));
  });

  it('should give different hashes for different inputs', () => {
    expect(hashString('a')).not.toBe(hashString('b'));
    expect(hashString('hello')).not.toBe(hashString('Hello'));
    expect(hashString('hello')).not.toBe(hashString('hello '));
  });

  it('should depend on the order of the characters', () => {
    expect(hashString('ab')).not.toBe(hashString('ba'));
  });

  it('should return only digits and lowercase letters', () => {
    const inputs = [
      '',
      'a',
      'Hello, World!',
      'background-color: red;',
      '😀 ünïcödé',
      'x'.repeat(10_000),
    ];

    inputs.forEach(input => {
      expect(hashString(input)).toMatch(/^[0-9a-z]+$/);
    });
  });

  it('should stay within an unsigned 32-bit integer for long input', () => {
    const hash = hashString('long input '.repeat(5_000));

    expect(hash.length).toBeLessThanOrEqual(7);

    const value = parseInt(hash, 36);

    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(2 ** 32 - 1);
  });
});

describe('[hashString]: the documented example', () => {
  it('should return the hash its JSDoc example shows', () => {
    expect(hashString('background-color: red;')).toBe('1s0s409');
  });
});
