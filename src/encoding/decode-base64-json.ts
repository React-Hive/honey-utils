import type { Nullable } from '~/types';
import { parseJson } from '~/json';
import { decodeBase64 } from './decode-base64';

/**
 * Decodes a base64 string and parses the JSON it holds - the reverse of `encodeBase64Json`.
 *
 * Never throws: a value that is not valid base64, or does not decode to valid JSON, gives `null`.
 * The result is only cast to `Value`, not checked against it.
 *
 * @template Value - The type the JSON is expected to have.
 *
 * @param value - The base64 string to decode.
 *
 * @returns The parsed value, or `null` when the value cannot be decoded or parsed.
 *
 * @example
 * ```ts
 * decodeBase64Json<{ name: string; age: number }>('eyJuYW1lIjoiTWlrZSIsImFnZSI6MzN9');
 * // ➜ { name: 'Mike', age: 33 }
 *
 * decodeBase64Json('SGVsbG8=');
 * // ➜ null - "Hello" is not JSON
 * ```
 */
export const decodeBase64Json = <Value>(value: string): Nullable<Value> => {
  const decodedValue = decodeBase64(value);
  if (decodedValue === null) {
    return null;
  }

  return parseJson<Value>(decodedValue);
};
