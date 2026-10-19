import { isEmptyArray } from '~/array';

describe('[isEmptyArray]: check whether a value is an empty array', () => {
  it('should return true for an empty array', () => {
    expect(isEmptyArray([])).toBe(true);
    expect(isEmptyArray(new Array(0))).toBe(true);
  });

  it('should return false for an array with items', () => {
    expect(isEmptyArray([1])).toBe(false);
    expect(isEmptyArray([undefined])).toBe(false);
    expect(isEmptyArray([null])).toBe(false);
  });

  it('should return false for a sparse array with a length', () => {
    expect(isEmptyArray(new Array(3))).toBe(false);
  });

  it('should return false for empty values that are not arrays', () => {
    expect(isEmptyArray('')).toBe(false);
    expect(isEmptyArray({})).toBe(false);
    expect(isEmptyArray({ length: 0 })).toBe(false);
    expect(isEmptyArray(new Set())).toBe(false);
    expect(isEmptyArray(new Uint8Array(0))).toBe(false);
  });

  it('should return false for null, undefined and primitives', () => {
    expect(isEmptyArray(null)).toBe(false);
    expect(isEmptyArray(undefined)).toBe(false);
    expect(isEmptyArray(0)).toBe(false);
    expect(isEmptyArray(false)).toBe(false);
  });

  it('should narrow the value to an empty array', () => {
    const value: unknown = [];

    if (isEmptyArray(value)) {
      expectTypeOf(value).toEqualTypeOf<[]>();
    }

    expect(isEmptyArray(value)).toBe(true);
  });
});
