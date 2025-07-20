export const toKebabCase = (input: string): string =>
  input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const camelToDashCase = (input: string): string =>
  input.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

/**
 * Splits a string into an array of filtered from redundant spaces words.
 *
 * @param input - The input string to be split.
 *
 * @returns An array of words from the input string.
 */
export const splitStringIntoWords = (input: string): string[] => input.split(' ').filter(Boolean);

/**
 * Generates a short, consistent hash string from an input string using a DJB2-inspired algorithm.
 *
 * This function uses a variation of the DJB2 algorithm, which is a simple yet effective hashing algorithm
 * based on bitwise XOR (`^`) and multiplication by 33. It produces a non-negative 32-bit integer,
 * which is then converted to a base-36 string (digits + lowercase letters) to produce a compact output.
 *
 * Useful for:
 * - Generating stable class names in CSS-in-JS libraries.
 * - Producing consistent cache keys.
 * - Quick and lightweight hashing needs where cryptographic security is not required.
 *
 * ⚠️ This is not cryptographically secure and should not be used for hashing passwords or sensitive data.
 *
 * @param input - The input string to hash.
 *
 * @returns A short, base-36 encoded hash string.
 *
 * @example
 * ```ts
 * const className = hashString('background-color: red;');
 * // → 'e4k1z0x'
 * ```
 */
export const hashString = (input: string): string => {
  let hash = 5381;

  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }

  return (hash >>> 0).toString(36);
};
