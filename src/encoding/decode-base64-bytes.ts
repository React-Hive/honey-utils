import type { Nullable } from '~/types';

const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

/**
 * Decodes base64 to the bytes it encodes - the reverse of `encodeBase64Bytes`, for a binary file
 * that travelled in JSON.
 *
 * Never throws: a value that is not padded base64 of the standard alphabet decodes to `null`, in
 * every runtime alike - where `atob`, `Buffer` and `Uint8Array.fromBase64` would otherwise each
 * treat it differently.
 *
 * Uses `Uint8Array.fromBase64` where the runtime has it, Node's `Buffer` otherwise, and `atob`
 * last. The result is always a plain `Uint8Array`, never a `Buffer`.
 *
 * @param value - The base64 string to decode.
 *
 * @returns The decoded bytes, or `null` when the value is not valid base64.
 *
 * @example
 * ```ts
 * decodeBase64Bytes('SGVsbG8=');
 * // ➜ Uint8Array [72, 101, 108, 108, 111]
 *
 * decodeBase64Bytes('not base64!');
 * // ➜ null
 * ```
 */
export const decodeBase64Bytes = (value: string): Nullable<Uint8Array> => {
  if (!BASE64_PATTERN.test(value)) {
    return null;
  }

  try {
    if (typeof Uint8Array.fromBase64 === 'function') {
      return Uint8Array.fromBase64(value);
    }

    if (typeof Buffer !== 'undefined') {
      const buffer = Buffer.from(value, 'base64');

      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }

    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  } catch {
    return null;
  }
};
