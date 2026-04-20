import { assert } from '~/guards';

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
