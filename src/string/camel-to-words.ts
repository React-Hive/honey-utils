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
