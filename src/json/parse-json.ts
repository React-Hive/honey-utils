import type { Nullable } from '~/types';

/**
 * Parses a JSON string without throwing.
 *
 * The result is only cast to `Value`, not checked against it - check its shape before relying on
 * it where the string comes from outside the program.
 *
 * @template Value - The type the JSON is expected to have.
 *
 * @param value - The JSON string to parse.
 *
 * @returns The parsed value, or `null` when the string is not valid JSON.
 *
 * @example
 * ```ts
 * parseJson<{ name: string }>('{"name":"Mike"}');
 * // ➜ { name: 'Mike' }
 *
 * parseJson('{name:"Mike"}');
 * // ➜ null
 * ```
 */
export const parseJson = <Value>(value: string): Nullable<Value> => {
  try {
    return JSON.parse(value) as Value;
  } catch {
    return null;
  }
};
