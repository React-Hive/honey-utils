import { splitStringIntoWords } from './split-string-into-words';

/**
 * Returns the uppercase initials of the words in a string.
 *
 * The first character of each word is extracted, concatenated, and uppercased.
 *
 * @param input - The input string.
 * @param maxWords - Maximum number of words to include when generating initials.
 *   Defaults to `Infinity`.
 *
 * @returns A string containing the uppercase initials of the selected words.
 */
export const getWordsInitials = (input: string, maxWords = Infinity): string => {
  if (input.length === 0) {
    return '';
  }

  return splitStringIntoWords(input)
    .slice(0, maxWords)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};
