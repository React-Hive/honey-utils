import { isArray } from '~/array';

describe('[isArray]: check whether a value is an array', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 'a', null])).toBe(true);
    expect(isArray(new Array(3))).toBe(true);
    expect(isArray(Array.from('abc'))).toBe(true);
  });

  it('should return false for array-like values', () => {
    expect(isArray({ length: 0 })).toBe(false);
    expect(isArray({ 0: 'a', length: 1 })).toBe(false);
    expect(isArray('abc')).toBe(false);
    expect(isArray(new Uint8Array(2))).toBe(false);
    expect(isArray(new Set([1]))).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(undefined)).toBe(false);
    expect(isArray(0)).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(() => [])).toBe(false);
  });

  it('should narrow an unknown value to an array', () => {
    const value: unknown = ['a', 'b'];

    expect(isArray(value) && value.length).toBe(2);

    if (isArray(value)) {
      expectTypeOf(value).toEqualTypeOf<unknown[]>();
    }
  });
});
