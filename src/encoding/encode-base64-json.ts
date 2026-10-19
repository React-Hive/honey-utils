import { encodeBase64 } from './encode-base64';

/**
 * Serialises a value as JSON and encodes it as base64 - a structured value carried in a URL query
 * parameter, a cookie or a header.
 *
 * @template Value - The type of the value.
 *
 * @param value - Any JSON-serialisable value.
 *
 * @returns The base64 encoding of the value's JSON.
 *
 * @example
 * ```ts
 * encodeBase64Json({ name: 'Mike', age: 33 });
 * // ➜ 'eyJuYW1lIjoiTWlrZSIsImFnZSI6MzN9'
 * ```
 */
export const encodeBase64Json = <Value>(value: Value): string =>
  encodeBase64(JSON.stringify(value));
