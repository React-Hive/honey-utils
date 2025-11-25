import { isNil } from './guards';

/**
 * Checks if a value is a string.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a string; otherwise, `false`.
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks whether the provided value is considered "empty".
 *
 * A value is considered empty if it is:
 * - `null`
 * - `undefined`
 * - `''`
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is empty; otherwise, `false`.
 */
export const isNilOrEmptyString = (value: unknown): value is null | undefined =>
  value === '' || isNil(value);

/**
 * Converts a string to kebab-case format.
 *
 * This function transforms camelCase or PascalCase strings into kebab-case by inserting
 * hyphens between lowercase and uppercase letters, then converting everything to lowercase.
 *
 * @param input - The string to convert to kebab-case.
 *
 * @returns The kebab-case formatted string.
 *
 * @example
 * ```ts
 * toKebabCase('helloWorld'); // → 'hello-world'
 * toKebabCase('HelloWorld'); // → 'hello-world'
 * toKebabCase('hello123World'); // → 'hello123-world'
 * ```
 */
export const toKebabCase = (input: string): string =>
  input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Converts a camelCase string to dash-case format.
 *
 * This function transforms camelCase strings into dash-case by inserting
 * hyphens before uppercase letters and converting them to lowercase.
 * The function ensures that no hyphen is added at the start of the output string,
 * even if the input begins with an uppercase letter.
 *
 * @param input - The camelCase string to convert to dash-case.
 *
 * @returns The dash-case formatted string.
 *
 * @example
 * ```ts
 * camelToDashCase('helloWorld'); // → 'hello-world'
 * camelToDashCase('HelloWorld'); // → 'hello-world'
 * camelToDashCase('backgroundColor'); // → 'background-color'
 * ```
 */
export const camelToDashCase = (input: string): string => {
  // First handle the first character separately to avoid adding a hyphen at the start
  const firstChar = input.charAt(0);
  const restOfString = input.slice(1);

  // Convert the first character to lowercase without adding a hyphen
  const firstCharProcessed = firstChar.toLowerCase();

  // Process the rest of the string normally, adding hyphens before uppercase letters
  const restProcessed = restOfString.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

  return firstCharProcessed + restProcessed;
};

/**
 * Splits a camelCase or PascalCase string into separate words with spaces.
 *
 * This function inserts spaces between lowercase and uppercase letters,
 * making camelCase or PascalCase strings more human-readable without
 * altering their original capitalization.
 *
 * @param input - The camelCase or PascalCase string to split into words.
 *
 * @returns The string with spaces inserted between words.
 *
 * @example
 * ```ts
 * camelToWords('helloWorld'); // → 'hello World'
 * camelToWords('HelloWorld'); // → 'Hello World'
 * camelToWords('userIDNumber'); // → 'user ID Number'
 * ```
 */
export const camelToWords = (input: string) => input.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

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
