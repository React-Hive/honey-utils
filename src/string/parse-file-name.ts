/**
 * Splits a file name into its base name and extension.
 *
 * Special cases:
 * - Files without a dot return `[fileName, ""]`
 * - Hidden files like `.gitignore` return `[".gitignore", ""]`
 * - Names ending with a trailing dot (e.g., `"file."`) return `["file.", ""]`
 * - Multi-dot names (e.g., `"archive.tar.gz"`) split on the last dot
 *
 * @param fileName - The full file name to parse.
 *
 * @returns A tuple where:
 *  - index 0 is the base name
 *  - index 1 is the file extension (lowercased), or an empty string if none exists
 */
export const parseFileName = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.');

  // No dot or leading dot with no extension (e.g., ".gitignore")
  if (lastDotIndex <= 0 || lastDotIndex === fileName.length - 1) {
    return [fileName, ''];
  }

  return [fileName.slice(0, lastDotIndex), fileName.slice(lastDotIndex + 1).toLowerCase()];
};
