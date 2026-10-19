/**
 * Checks if a value is an array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an array; otherwise, `false`.
 *
 * @example
 * ```ts
 * isArray([1, 2]); // true
 * isArray('12'); // false
 * ```
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
