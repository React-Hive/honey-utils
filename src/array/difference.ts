/**
 * Returns elements from the first array that don't exist in the second array.
 *
 * @template T - The type of the items in the arrays.
 *
 * @param array - The source array.
 * @param exclude - The array containing elements to exclude.
 *
 * @returns A new array with elements from the first array that don't exist in the second array.
 *
 * @example
 * ```ts
 * difference([1, 2, 3, 4], [2, 4]); // [1, 3]
 * difference(['a', 'b', 'c'], ['b']); // ['a', 'c']
 * ```
 */
export const difference = <T>(array: T[], exclude: T[]): T[] =>
  array.filter(item => !exclude.includes(item));
