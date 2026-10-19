import { isArray } from './is-array';

/**
 * Checks if a value is an empty array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an empty array; otherwise, `false`.
 *
 * @example
 * ```ts
 * isEmptyArray([]); // true
 * isEmptyArray([1]); // false
 * isEmptyArray({}); // false
 * ```
 */
export const isEmptyArray = (value: unknown): value is [] => isArray(value) && value.length === 0;
