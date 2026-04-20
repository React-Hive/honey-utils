/**
 * Represents all falsy values.
 */
type Falsy = false | null | undefined | 0 | '';

/**
 * Removes all falsy values from an array.
 *
 * Falsy values include: `false`, `0`, `''` (empty string), `null`, `undefined`, and `NaN`.
 *
 * Useful for cleaning up arrays with optional, nullable, or conditionally included items.
 *
 * @template T - The type of the truthy items.
 *
 * @param array - An array possibly containing falsy values.
 *
 * @returns A new array containing only truthy values of type `T`.
 *
 * @example
 * ```ts
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
 * ```
 */
export const compact = <T>(array: (T | Falsy)[]): T[] => array.filter(Boolean) as T[];
