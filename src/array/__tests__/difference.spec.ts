import { difference } from '~/array';

describe('[difference]: items of an array missing from another', () => {
  it('should leave out the items found in the second array', () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toStrictEqual([1, 3]);
    expect(difference(['a', 'b', 'c'], ['b'])).toStrictEqual(['a', 'c']);
  });

  it('should keep the order of the first array', () => {
    expect(difference([5, 1, 4, 2, 3], [4])).toStrictEqual([5, 1, 2, 3]);
  });

  it('should keep the duplicates of the first array', () => {
    expect(difference([1, 2, 1, 3, 1], [3])).toStrictEqual([1, 2, 1, 1]);
  });

  it('should leave out every copy of an excluded item', () => {
    expect(difference([1, 2, 1, 2], [1])).toStrictEqual([2, 2]);
  });

  it('should return a copy of the first array when nothing is excluded', () => {
    const array = [1, 2, 3];

    const result = difference(array, []);

    expect(result).toStrictEqual([1, 2, 3]);
    expect(result).not.toBe(array);
  });

  it('should return an empty array when every item is excluded', () => {
    expect(difference([1, 2, 2], [2, 1])).toStrictEqual([]);
  });

  it('should return an empty array for an empty first array', () => {
    expect(difference([], [1, 2])).toStrictEqual([]);
  });

  it('should ignore excluded items that are not in the first array', () => {
    expect(difference([1, 2], [3, 4])).toStrictEqual([1, 2]);
  });

  it('should compare objects by reference', () => {
    const first = { id: 1 };
    const second = { id: 2 };

    const result = difference([first, second], [{ id: 1 }, second]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(first);
  });

  it('should not treat values of different types as equal', () => {
    expect(difference<number | string>([1, '1', 2], ['1'])).toStrictEqual([1, 2]);
    expect(difference<number | string | boolean | null>([0, '', false, null], [0])).toStrictEqual([
      '',
      false,
      null,
    ]);
  });

  it('should exclude NaN', () => {
    expect(difference([1, NaN, 2], [NaN])).toStrictEqual([1, 2]);
  });

  it('should leave both arrays as they were', () => {
    const array = [1, 2, 3];
    const exclude = [2];

    difference(array, exclude);

    expect(array).toStrictEqual([1, 2, 3]);
    expect(exclude).toStrictEqual([2]);
  });
});
