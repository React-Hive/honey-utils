import { isString } from '~/string';

describe('[isString]: check whether a value is a string', () => {
  it('should return true for strings', () => {
    expect(isString('hello')).toBe(true);
    expect(isString(`template ${1}`)).toBe(true);
    expect(isString(String(42))).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(isString('')).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });

  it('should return false for numbers and booleans', () => {
    expect(isString(0)).toBe(false);
    expect(isString(42)).toBe(false);
    expect(isString(true)).toBe(false);
  });

  it('should return false for objects, arrays, functions and symbols', () => {
    expect(isString({})).toBe(false);
    expect(isString(['a'])).toBe(false);
    expect(isString(() => 'a')).toBe(false);
    expect(isString(Symbol('a'))).toBe(false);
  });

  it('should return false for a String object', () => {
    expect(isString(new String('a'))).toBe(false);
  });

  it('should narrow an unknown value to string', () => {
    const value: unknown = 'narrowed';

    if (isString(value)) {
      expect(value.toUpperCase()).toBe('NARROWED');
    } else {
      expect.unreachable();
    }
  });
});
