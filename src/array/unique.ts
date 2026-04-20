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
