import { compact } from '~/array';

describe('[compact]: remove falsy values from an array', () => {
  it('should remove every falsy value', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toStrictEqual([1, 2, 3]);
  });

  it('should remove negative zero', () => {
    expect(compact([-0, 1])).toStrictEqual([1]);
  });

  it('should keep truthy values that look empty', () => {
    const emptyObject = {};
    const emptyArray: never[] = [];

    expect(compact(['0', ' ', 'false', emptyObject, emptyArray, -1, Infinity])).toStrictEqual([
      '0',
      ' ',
      'false',
      emptyObject,
      emptyArray,
      -1,
      Infinity,
    ]);
  });

  it('should keep the order and the duplicates of the items', () => {
    expect(compact(['b', null, 'a', 'b', undefined, 'a'])).toStrictEqual(['b', 'a', 'b', 'a']);
  });

  it('should keep the items themselves, not copies', () => {
    const item = { id: 1 };

    expect(compact([null, item])[0]).toBe(item);
  });

  it('should return an empty array when every value is falsy', () => {
    expect(compact([null, undefined, false, 0, ''])).toStrictEqual([]);
  });

  it('should return an empty array for an empty array', () => {
    expect(compact([])).toStrictEqual([]);
  });

  it('should return a new array and leave the input as it was', () => {
    const array = [1, null, 2];

    const result = compact(array);

    expect(result).not.toBe(array);
    expect(array).toStrictEqual([1, null, 2]);
  });

  it('should type the result as the truthy items', () => {
    const values: (string | null | undefined)[] = ['a', null, undefined];

    const result = compact(values);

    expectTypeOf(result).toEqualTypeOf<string[]>();
    expect(result).toStrictEqual(['a']);
  });
});
