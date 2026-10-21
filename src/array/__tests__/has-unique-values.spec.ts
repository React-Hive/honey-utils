import { hasUniqueValues } from '~/array';

describe('[hasUniqueValues]: check that no value of an array repeats', () => {
  it('should be true when every value appears once', () => {
    expect(hasUniqueValues(['a', 'b', 'c'])).toBe(true);
    expect(hasUniqueValues([1, 2, 3])).toBe(true);
  });

  it('should be false when a value repeats', () => {
    expect(hasUniqueValues(['a', 'b', 'a'])).toBe(false);
    expect(hasUniqueValues([1, 2, 2, 3])).toBe(false);
  });

  it('should be true for an empty array and for one value', () => {
    expect(hasUniqueValues([])).toBe(true);
    expect(hasUniqueValues(['x'])).toBe(true);
  });

  it('should tell values of different types apart', () => {
    expect(hasUniqueValues([1, '1'])).toBe(true);
    expect(hasUniqueValues([null, undefined])).toBe(true);
  });

  it('should count NaN as one value', () => {
    expect(hasUniqueValues([NaN, NaN])).toBe(false);
  });

  it('should compare objects by reference', () => {
    const item = { id: 1 };

    expect(hasUniqueValues([item, { id: 1 }])).toBe(true);
    expect(hasUniqueValues([item, item])).toBe(false);
  });

  it('should take a readonly array', () => {
    const values: readonly string[] = ['a', 'b'];

    expect(hasUniqueValues(values)).toBe(true);
  });
});
