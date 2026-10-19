import type { Nullable } from '~/types';

const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

const decodeBase64Bytes = (value: string): Uint8Array => {
  if (typeof Uint8Array.fromBase64 === 'function') {
    return Uint8Array.fromBase64(value);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64');
  }

  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

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
  if (!BASE64_PATTERN.test(value)) {
    return null;
  }

  try {
    return new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true,
    }).decode(decodeBase64Bytes(value));
  } catch {
    return null;
  }
};
