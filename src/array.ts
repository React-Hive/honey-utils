import { assert } from './guards';

/**
 * Filters out `null`, `undefined`, and other falsy values from an array,
 * returning a typed array of only truthy `Item` values.
 *
 * Useful when working with optional or nullable items that need to be sanitized.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - An array of items that may include `null`, `undefined`, or falsy values.
 *
 * @returns A new array containing only truthy `Item` values.
 */
export const boolFilter = <T>(array: (T | false | null | undefined)[]): T[] =>
  array.filter(Boolean) as T[];

/**
 * Returns a new array with duplicate values removed.
 *
 * Uses Set for efficient duplicate removal while preserving the original order.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - The input array that may contain duplicate values.
 *
 * @returns A new array with only unique values, maintaining the original order.
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 1, 4]); // [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
 * ```
 */
export const unique = <T>(array: T[]): T[] => [...new Set(array)];

/**
 * Splits an array into chunks of the specified size.
 *
 * Useful for pagination, batch processing, or creating grid layouts.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - The input array to be chunked.
 * @param size - The size of each chunk. Must be greater than 0.
 *
 * @returns An array of chunks, where each chunk is an array of the specified size
 *          (except possibly the last chunk, which may be smaller).
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c', 'd'], 3); // [['a', 'b', 'c'], ['d']]
 * ```
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  assert(size > 0, 'Chunk size must be greater than 0');

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
};

/**
 * Returns an array containing elements that exist in all provided arrays.
 *
 * @template T - The type of the items in the arrays.
 *
 * @param arrays - Two or more arrays to find common elements from.
 *
 * @returns A new array containing only the elements that exist in all input arrays.
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'e']); // ['b']
 * ```
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    return [...arrays[0]];
  }

  const [first, ...rest] = arrays;
  const uniqueFirst = unique(first);

  return uniqueFirst.filter(item => rest.every(array => array.includes(item)));
};

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
