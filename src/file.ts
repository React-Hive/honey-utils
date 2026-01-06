import type { Nullable } from '~/types';
import { runParallel } from '~/async';

/**
 * Checks if a value is a `File` object.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a `File` object; otherwise, `false`.
 */
export const isFile = (value: unknown): value is File => value instanceof File;

/**
 * Converts a `FileList` object to an array of `File` objects.
 *
 * @param fileList - The `FileList` object to convert.
 *
 * @returns An array of `File` objects.
 */
export const fileListToFiles = (fileList: Nullable<FileList>): File[] => {
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

/**
 * Reads all entries from a file system directory asynchronously.
 *
 * @param directoryEntry - The directory entry to read.
 *
 * @returns A promise that resolves to all `FileSystemEntry` items in the directory.
 */
const readFileSystemDirectoryEntries = async (
  directoryEntry: FileSystemDirectoryEntry,
): Promise<FileSystemEntry[]> => {
  const directoryReader = directoryEntry.createReader();

  const readAll = async (): Promise<FileSystemEntry[]> =>
    new Promise((resolve, reject) => {
      directoryReader.readEntries(async entries => {
        if (!entries.length) {
          resolve([]);
          return;
        }

        try {
          const restEntries = await readAll();

          resolve([...entries, ...restEntries]);
        } catch (e) {
          reject(e);
        }
      }, reject);
    });

  return readAll();
};

interface TraverseDirectoryOptions {
  /**
   * A list of file names that should be ignored during traversal.
   * Any file whose name matches an entry will be skipped entirely.
   *
   * Common values include OS-generated metadata files such as:
   * `.DS_Store`, `Thumbs.db`, `desktop.ini`, `.Spotlight-V100`, etc.
   */
  skipFiles?: string[];
}

/**
 * Recursively scans a directory using the File System API and collects all nested files.
 *
 * This function walks through all subdirectories, resolving each file into a `File` object.
 * Directories themselves are not returned. To avoid unnecessary noise, certain system or
 * OS-generated files can be excluded via the `skipFiles` option.
 *
 * @param directoryEntry - The starting directory entry to traverse.
 * @param options - Optional settings that control traversal behavior.
 *
 * @returns A promise resolving to a flat array of all collected `File` objects.
 */
export const traverseFileSystemDirectory = async (
  directoryEntry: FileSystemDirectoryEntry,
  {
    skipFiles = [
      '.DS_Store',
      'Thumbs.db',
      'desktop.ini',
      'ehthumbs.db',
      '.Spotlight-V100',
      '.Trashes',
      '.fseventsd',
      '__MACOSX',
    ],
  }: TraverseDirectoryOptions = {},
): Promise<File[]> => {
  const skipFilesSet = new Set(skipFiles);
  const entries = await readFileSystemDirectoryEntries(directoryEntry);

  const filePromises = await runParallel(entries, async entry => {
    if (entry.isDirectory) {
      return traverseFileSystemDirectory(entry as FileSystemDirectoryEntry, {
        skipFiles,
      });
    } else if (!skipFilesSet.has(entry.name)) {
      const file = await new Promise<File>((resolve, reject) => {
        (entry as FileSystemFileEntry).file(resolve, reject);
      });

      return [file];
    }

    return [];
  });

  return filePromises.flat();
};

/**
 * Reads files from a `DataTransfer` object, supporting both individual files
 * and entire directories (when available through the non-standard `webkitGetAsEntry` API).
 *
 * This function is typically used in drag-and-drop or paste handlers to obtain
 * all `File` objects contained in the user's action. When directories are dropped,
 * they are traversed recursively using `traverseFileSystemDirectory`, returning a
 * fully flattened list of nested files.
 *
 * @param dataTransfer - The `DataTransfer` instance from a drop or paste event.
 *   If `null` or missing items, an empty array is returned.
 * @param traverseOptions - Optional settings passed to directory traversal.
 *
 * @returns A promise that resolves to a flat array of all extracted `File` objects.
 *   This includes:
 *   - direct files from the drag event,
 *   - files extracted from directory entries via `webkitGetAsEntry`,
 *   - and files found recursively within nested subdirectories.
 */
export const readFilesFromDataTransfer = async (
  dataTransfer: Nullable<DataTransfer>,
  traverseOptions: TraverseDirectoryOptions = {},
) => {
  const items = dataTransfer?.items;
  if (!items) {
    return [];
  }

  const tasks: Promise<File[]>[] = [];

  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];

    // Prefer using webkitGetAsEntry when available (directory support)
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry#browser_compatibility
    if ('webkitGetAsEntry' in item) {
      // ?.() -> avoids throwing on Safari weirdness
      const entry = item.webkitGetAsEntry?.();

      if (entry?.isDirectory) {
        tasks.push(traverseFileSystemDirectory(entry as FileSystemDirectoryEntry, traverseOptions));

        continue;
      }

      if (entry?.isFile) {
        tasks.push(
          new Promise<File[]>((resolve, reject) =>
            (entry as FileSystemFileEntry).file(file => resolve([file]), reject),
          ),
        );

        continue;
      }
    }

    // Fallback to standard API
    const file = item.getAsFile();
    if (file) {
      tasks.push(Promise.resolve([file]));
    }
  }

  return (await Promise.all(tasks)).flat();
};
