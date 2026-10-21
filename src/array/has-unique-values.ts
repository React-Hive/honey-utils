/**
 * Checks whether every value in an array appears in it only once.
 *
 * Compares values as a `Set` does - by identity, with `NaN` equal to itself - so it holds for the
 * primitives it is mostly used on (ids, keys, enum values), and two objects with the same contents
 * count as different values.
 *
 * @param array - The values to check.
 *
 * @returns `true` if no value appears more than once, including for an empty array.
 *
 * @example
 * ```ts
 * hasUniqueValues(['a', 'b', 'c']); // true
 * hasUniqueValues(['a', 'b', 'a']); // false
 * ```
 */
export const hasUniqueValues = (array: readonly unknown[]): boolean =>
  new Set(array).size === array.length;
