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
