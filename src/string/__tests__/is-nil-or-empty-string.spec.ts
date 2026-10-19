import { isNilOrEmptyString } from '~/string';

describe('[isNilOrEmptyString]: check for null, undefined or an empty string', () => {
  it('should return true for null', () => {
    expect(isNilOrEmptyString(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNilOrEmptyString(undefined)).toBe(true);
  });

  it('should return true for an empty string', () => {
    expect(isNilOrEmptyString('')).toBe(true);
  });

  it('should return false for a whitespace-only string', () => {
    expect(isNilOrEmptyString(' ')).toBe(false);
    expect(isNilOrEmptyString('\t\n')).toBe(false);
  });

  it('should return false for a non-empty string', () => {
    expect(isNilOrEmptyString('a')).toBe(false);
    expect(isNilOrEmptyString('null')).toBe(false);
  });

  it('should return false for other falsy values', () => {
    expect(isNilOrEmptyString(0)).toBe(false);
    expect(isNilOrEmptyString(false)).toBe(false);
    expect(isNilOrEmptyString(NaN)).toBe(false);
  });

  it('should return false for empty arrays and objects', () => {
    expect(isNilOrEmptyString([])).toBe(false);
    expect(isNilOrEmptyString({})).toBe(false);
  });

  it('should return false for an empty String object', () => {
    expect(isNilOrEmptyString(new String(''))).toBe(false);
  });
});

describe('[isNilOrEmptyString]: narrowing', () => {
  it('should narrow a string to the empty string, not drop it', () => {
    const value = '' as string | null;

    if (isNilOrEmptyString(value)) {
      const narrowed: null | '' = value;

      expect(narrowed).toBe('');
    } else {
      expect.unreachable();
    }
  });
});
