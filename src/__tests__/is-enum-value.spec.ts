import { isEnumValue } from '~/guards';

enum Fruit {
  APPLE = 'apple',
  PEAR = 'pear',
}

describe('[isEnumValue]: check a value against a string enum', () => {
  it('should return true for each of the enum values', () => {
    expect(isEnumValue(Fruit, 'apple')).toBe(true);
    expect(isEnumValue(Fruit, 'pear')).toBe(true);
  });

  it('should return false for a member name', () => {
    const result = isEnumValue(Fruit, 'APPLE');

    expect(result).toBe(false);
  });

  it('should return false for a string outside the enum', () => {
    const result = isEnumValue(Fruit, 'plum');

    expect(result).toBe(false);
  });

  it('should return false for values that are not strings', () => {
    expect(isEnumValue(Fruit, null)).toBe(false);
    expect(isEnumValue(Fruit, undefined)).toBe(false);
    expect(isEnumValue(Fruit, 1)).toBe(false);
    expect(isEnumValue(Fruit, { apple: 'apple' })).toBe(false);
  });

  it('should accept a plain object of allowed strings', () => {
    const sizes = { SMALL: 'small', LARGE: 'large' } as const;

    expect(isEnumValue(sizes, 'large')).toBe(true);
    expect(isEnumValue(sizes, 'medium')).toBe(false);
  });

  it('should narrow the value to the enum type', () => {
    const value: unknown = 'pear';

    if (isEnumValue(Fruit, value)) {
      const fruit: Fruit = value;

      expect(fruit).toBe(Fruit.PEAR);
    }
  });
});
