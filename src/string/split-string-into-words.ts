/**
 * Splits a string into an array of filtered from redundant spaces words.
 *
 * @param input - The input string to be split.
 *
 * @returns An array of words from the input string.
 */
export const splitStringIntoWords = (input: string): string[] => {
  if (input.length === 0) {
    return [];
  }

  return input.split(' ').filter(Boolean);
};
