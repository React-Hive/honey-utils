import { unique } from '~/array';

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
