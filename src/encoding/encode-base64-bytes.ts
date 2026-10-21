/**
 * Encodes bytes as base64 - a binary file carried in JSON, say.
 *
 * Uses `Uint8Array.prototype.toBase64` where the runtime has it, Node's `Buffer` otherwise, and
 * `btoa` last. Only the bytes the array views are encoded, so a `subarray` encodes its own part.
 *
 * @param bytes - The bytes to encode.
 *
 * @returns The base64 encoding of the bytes.
 *
 * @example
 * ```ts
 * encodeBase64Bytes(new Uint8Array([72, 101, 108, 108, 111]));
 * // ➜ 'SGVsbG8='
 * ```
 */
export const encodeBase64Bytes = (bytes: Uint8Array): string => {
  if (typeof bytes.toBase64 === 'function') {
    return bytes.toBase64();
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
  }

  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
};
