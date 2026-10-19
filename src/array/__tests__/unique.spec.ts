import { unique } from '~/array';

describe('[unique]: remove duplicate values from an array', () => {
  it('should remove the duplicates', () => {
    expect(unique([1, 2, 2, 3, 1, 4])).toStrictEqual([1, 2, 3, 4]);
    expect(unique(['a', 'b', 'a', 'c'])).toStrictEqual(['a', 'b', 'c']);
  });

  it('should keep each value where it first appears', () => {
    expect(unique([3, 1, 3, 2, 1])).toStrictEqual([3, 1, 2]);
  });

  it('should return the same values when there are no duplicates', () => {
    expect(unique([5, 4, 3])).toStrictEqual([5, 4, 3]);
  });

  it('should return one value when every value is the same', () => {
    expect(unique(['x', 'x', 'x'])).toStrictEqual(['x']);
  });

  it('should return an empty array for an empty array', () => {
    expect(unique([])).toStrictEqual([]);
  });

  it('should compare objects by reference', () => {
    const item = { id: 1 };

    const result = unique([item, item, { id: 1 }]);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(item);
    expect(result[1]).not.toBe(item);
  });

  it('should not treat values of different types as equal', () => {
    expect(unique<number | string | boolean>([1, '1', true, 1, '1'])).toStrictEqual([1, '1', true]);
    expect(unique([null, undefined, null, undefined])).toStrictEqual([null, undefined]);
  });

  it('should remove duplicate NaN', () => {
    expect(unique([NaN, 1, NaN])).toStrictEqual([NaN, 1]);
  });

  it('should return a new array and leave the input as it was', () => {
    const array = [1, 1, 2];

    const result = unique(array);

    expect(result).not.toBe(array);
    expect(array).toStrictEqual([1, 1, 2]);
  });
});
