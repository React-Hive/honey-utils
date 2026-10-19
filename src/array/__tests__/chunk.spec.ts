import { chunk } from '~/array';

describe('[chunk]: split an array into chunks of a size', () => {
  it('should split into chunks of the size with a smaller last chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toStrictEqual([[1, 2], [3, 4], [5]]);
    expect(chunk(['a', 'b', 'c', 'd'], 3)).toStrictEqual([['a', 'b', 'c'], ['d']]);
  });

  it('should split into equal chunks when the length divides by the size', () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('should put every item in a chunk of its own for a size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toStrictEqual([[1], [2], [3]]);
  });

  it('should return one chunk when the size is the length or more', () => {
    expect(chunk([1, 2, 3], 3)).toStrictEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 10)).toStrictEqual([[1, 2, 3]]);
  });

  it('should return no chunks for an empty array', () => {
    expect(chunk([], 2)).toStrictEqual([]);
  });

  it('should keep the order and the duplicates of the items', () => {
    expect(chunk([3, 1, 3, 2, 1], 2)).toStrictEqual([[3, 1], [3, 2], [1]]);
  });

  it('should keep the items themselves, not copies', () => {
    const first = { id: 1 };
    const second = { id: 2 };

    const result = chunk([first, second], 1);

    expect(result[0][0]).toBe(first);
    expect(result[1][0]).toBe(second);
  });

  it('should return new arrays and leave the input as it was', () => {
    const array = [1, 2, 3];

    const result = chunk(array, 3);

    expect(result[0]).not.toBe(array);
    expect(array).toStrictEqual([1, 2, 3]);
  });

  it('should throw for a size of 0', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be a positive whole number');
  });

  it('should throw for a negative size', () => {
    expect(() => chunk([1, 2, 3], -2)).toThrow('Chunk size must be a positive whole number');
  });

  it('should throw for a size of NaN', () => {
    expect(() => chunk([1, 2, 3], NaN)).toThrow('Chunk size must be a positive whole number');
  });
});

describe('[chunk]: sizes that are not whole numbers', () => {
  it('should throw for a fractional size', () => {
    expect(() => chunk([1, 2, 3, 4, 5], 2.5)).toThrow('Chunk size must be a positive whole number');
  });

  it('should throw for an infinite size', () => {
    expect(() => chunk([1, 2, 3], Infinity)).toThrow('Chunk size must be a positive whole number');
  });
});
