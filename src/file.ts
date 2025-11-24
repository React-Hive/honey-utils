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

/**
 * Converts a `FileList` object to an array of `File` objects.
 *
 * @param fileList - The `FileList` object to convert.
 *
 * @returns An array of `File` objects.
 */
export const fileListToFiles = (fileList: FileList | null): File[] => {
  if (!fileList) {
    return [];
  }

  const files: File[] = [];

  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  return files;
};

/**
 * Converts a `Blob` object into a `File` object with the specified name.
 *
 * This is useful when you receive a `Blob` (e.g., from canvas, fetch, or file manipulation)
 * and need to convert it into a `File` to upload via `FormData` or file inputs.
 *
 * @param blob - The `Blob` to convert.
 * @param fileName - The desired name for the resulting file (including extension).
 *
 * @returns A `File` instance with the same content and MIME type as the input `Blob`.
 *
 * @example
 * ```ts
 * const blob = new Blob(['Hello world'], { type: 'text/plain' });
 * const file = blobToFile(blob, 'hello.txt');
 *
 * console.log(file instanceof File); // true
 * ```
 */
export const blobToFile = (blob: Blob, fileName: string): File =>
  new File([blob], fileName, {
    type: blob.type,
  });
