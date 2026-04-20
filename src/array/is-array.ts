/**
 * Checks if a value is an array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an array; otherwise, `false`.
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
