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
  input.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1-$2').toLowerCase();
