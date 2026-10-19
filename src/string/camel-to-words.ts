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
export const camelToWords = (input: string): string =>
  input.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2').replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2');
