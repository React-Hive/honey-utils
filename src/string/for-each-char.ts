import type { Nullable } from '~/types';

/**
 * Context information for the currently processed character during string iteration.
 *
 * Provides the character index and access to adjacent characters in the input string.
 * All character values are UTF-16 code units.
 */
interface CharContext {
  /**
   * Zero-based index of the current character within the input string.
   */
  charIndex: number;
  /**
   * The previous character in the string, or `null` if the current character is the first one.
   */
  prevChar: Nullable<string>;
  /**
   * The next character in the string, or `null` if the current character is the last one.
   */
  nextChar: Nullable<string>;
}

/**
 * Callback invoked for each processed character during string iteration.
 */
type CharHandler = (char: string, context: CharContext) => void;

/**
 * Predicate used to conditionally skip characters during string iteration.
 *
 * Returning `true` indicates that the current character should be skipped.
 */
type CharPredicate = (char: string, context: CharContext) => boolean;

/**
 * Iterates over each character of a string and invokes a callback for each one.
 *
 * Iteration is performed over UTF-16 code units (not Unicode grapheme clusters).
 * Characters may be conditionally skipped using an optional predicate.
 *
 * @param input - The string to iterate over.
 * @param onChar - Invoked for each character that is not skipped.
 * @param shouldSkipChar - Optional predicate; returning `true` skips the character.
 */
export const forEachChar = (
  input: string,
  onChar: CharHandler,
  shouldSkipChar?: CharPredicate,
): void => {
  if (input.length === 0) {
    return;
  }

  const length = input.length;

  for (let charIndex = 0; charIndex < length; charIndex++) {
    const char = input[charIndex];

    const context: CharContext = {
      charIndex,
      prevChar: charIndex > 0 ? input[charIndex - 1] : null,
      nextChar: charIndex < length - 1 ? input[charIndex + 1] : null,
    };

    if (shouldSkipChar?.(char, context)) {
      continue;
    }

    onChar(char, context);
  }
};
