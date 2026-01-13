/**
 * Finds all zero-based indices where a given single character occurs in a string.
 *
 * The string is scanned once from start to end and each matching character position is collected.
 *
 * ⚠️ Character comparison is performed at the UTF-16 code unit level
 * (`String.charCodeAt`), not by Unicode grapheme clusters.
 *
 * @param inputString - The string to scan.
 * @param targetChar - A single character to search for.
 *
 * @returns An array of zero-based indices for each occurrence of `targetChar`.
 *  Returns an empty array if no matches are found.
 */
export const findCharIndices = (inputString: string, targetChar: string): number[] => {
  if (inputString.length === 0) {
    return [];
  }

  const targetCode = targetChar.charCodeAt(0);
  const indices: number[] = [];

  for (let i = 0; i < inputString.length; i++) {
    if (inputString.charCodeAt(i) === targetCode) {
      indices.push(i);
    }
  }

  return indices;
};
