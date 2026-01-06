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

  // Convert the first character to the lowercase without adding a hyphen
  const firstCharProcessed = firstChar.toLowerCase();

  // Process the rest of the string normally, adding hyphens before uppercase letters
  const restProcessed = restOfString.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

  return firstCharProcessed + restProcessed;
};
