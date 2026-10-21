import type { Nullable } from '~/types';

import { decodeBase64Bytes } from './decode-base64-bytes';

/**
 * Decodes a base64 string to the UTF-8 text it encodes - the reverse of `encodeBase64`.
 *
 * Never throws: a value that is not padded base64 of the standard alphabet, or whose bytes are not
 * valid UTF-8, decodes to `null`.
 *
 * Uses `Uint8Array.fromBase64` where the runtime has it, Node's `Buffer` otherwise, and `atob`
 * last.
 *
 * @param value - The base64 string to decode.
 *
 * @returns The decoded text, or `null` when the value is not valid base64 of UTF-8 text.
 *
 * @example
 * ```ts
 * decodeBase64('SGVsbG8=');
 * // ➜ 'Hello'
 *
 * decodeBase64('not base64!');
 * // ➜ null
 * ```
 */
export const decodeBase64 = (value: string): Nullable<string> => {
  const bytes = decodeBase64Bytes(value);

  if (bytes === null) {
    return null;
  }

  try {
    return new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true,
    }).decode(bytes);
  } catch {
    return null;
  }
};
