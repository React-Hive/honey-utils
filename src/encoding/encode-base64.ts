import { encodeBase64Bytes } from './encode-base64-bytes';

/**
 * Encodes a string as base64, by its UTF-8 bytes - so text outside Latin-1 (accents, emoji, any
 * script), which `btoa` throws on, encodes as well.
 *
 * Uses `Uint8Array.prototype.toBase64` where the runtime has it, Node's `Buffer` otherwise, and
 * `btoa` last.
 *
 * @param value - The string to encode.
 *
 * @returns The base64 encoding of the string's UTF-8 bytes.
 *
 * @example
 * ```ts
 * encodeBase64('Hello');
 * // ➜ 'SGVsbG8='
 *
 * encodeBase64('Привіт');
 * // ➜ '0J/RgNC40LLRltGC'
 * ```
 */
export const encodeBase64 = (value: string): string =>
  encodeBase64Bytes(new TextEncoder().encode(value));
