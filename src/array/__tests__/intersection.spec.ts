import { intersection } from '~/array';

describe('[intersection]: items found in every array', () => {
  it('should return the items two arrays share', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toStrictEqual([2, 3]);
  });

  it('should return the items every one of several arrays shares', () => {
    expect(intersection(['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'e'])).toStrictEqual(['b']);
  });

  it('should keep the order of the first array', () => {
    expect(intersection([3, 1, 2], [1, 2, 3])).toStrictEqual([3, 1, 2]);
    expect(intersection([1, 2, 3], [3, 2, 1])).toStrictEqual([1, 2, 3]);
  });

  it('should return each shared item once', () => {
    expect(intersection([1, 2, 1, 2, 3], [2, 1, 1])).toStrictEqual([1, 2]);
    expect(intersection([1, 1], [1], [1, 1, 1])).toStrictEqual([1]);
  });

  it('should return an empty array when the arrays share nothing', () => {
    expect(intersection([1, 2], [3, 4])).toStrictEqual([]);
  });

  it('should return an empty array when one of the arrays is empty', () => {
    expect(intersection([1, 2], [])).toStrictEqual([]);
    expect(intersection([], [1, 2])).toStrictEqual([]);
    expect(intersection([1, 2], [1, 2], [])).toStrictEqual([]);
  });

  it('should return an empty array for no arrays', () => {
    expect(intersection()).toStrictEqual([]);
  });

  it('should return a copy of a single array', () => {
    const array = [3, 1, 2];

    const result = intersection(array);

    expect(result).toStrictEqual([3, 1, 2]);
    expect(result).not.toBe(array);
  });

  it('should compare objects by reference', () => {
    const shared = { id: 1 };

    const result = intersection([shared, { id: 2 }], [{ id: 2 }, shared]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(shared);
  });

  it('should not treat values of different types as equal', () => {
    expect(intersection<number | string>([1, '2', 3], ['1', 2, 3])).toStrictEqual([3]);
  });

  it('should match NaN', () => {
    expect(intersection([NaN, 1], [2, NaN])).toStrictEqual([NaN]);
  });

  it('should leave the arrays as they were', () => {
    const first = [1, 1, 2];
    const second = [2, 1];

    intersection(first, second);

    expect(first).toStrictEqual([1, 1, 2]);
    expect(second).toStrictEqual([2, 1]);
  });
});

describe('[intersection]: one array', () => {
  it('should remove duplicates from a single array, as from several', () => {
    expect(intersection([1, 1, 2])).toStrictEqual([1, 2]);
  });
});
