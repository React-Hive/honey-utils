// @vitest-environment jsdom
import type { Nullable } from '~/types';
import {
  blobToFile,
  fileListToFiles,
  isFile,
  readFilesFromDataTransfer,
  traverseFileSystemDirectory,
} from '~/file';

const createFile = (name: string, content = name) => new File([content], name);

const createFileEntry = (file: File): FileSystemFileEntry =>
  ({
    isFile: true,
    isDirectory: false,
    name: file.name,
    file: (successCallback: FileCallback) => {
      queueMicrotask(() => successCallback(file));
    },
  }) as unknown as FileSystemFileEntry;

/**
 * A directory whose reader hands its entries over in the given batches, then an empty batch, as
 * `readEntries` does until a directory is exhausted.
 */
const createBatchedDirectoryEntry = (name: string, batches: FileSystemEntry[][]) => {
  const readEntries = vi.fn();

  const entry = {
    isFile: false,
    isDirectory: true,
    name,
    createReader: () => {
      let batchIndex = 0;

      return {
        readEntries: readEntries.mockImplementation(
          (successCallback: FileSystemEntriesCallback) => {
            const batch = batches[batchIndex++] ?? [];

            queueMicrotask(() => successCallback(batch));
          },
        ),
      };
    },
  } as unknown as FileSystemDirectoryEntry;

  return { entry, readEntries };
};

const createDirectoryEntry = (name: string, entries: FileSystemEntry[]) =>
  createBatchedDirectoryEntry(name, [entries]).entry;

const getNames = (files: File[]) => files.map(file => file.name);

interface FakeDataTransferItem {
  webkitGetAsEntry?: () => Nullable<FileSystemEntry>;
  getAsFile: () => Nullable<File>;
}

const createItem = (file: Nullable<File>): FakeDataTransferItem => ({
  getAsFile: vi.fn(() => file),
});

const createEntryItem = (
  entry: Nullable<FileSystemEntry>,
  file: Nullable<File> = null,
): FakeDataTransferItem => ({
  webkitGetAsEntry: () => entry,
  getAsFile: vi.fn(() => file),
});

const createDataTransfer = (items: FakeDataTransferItem[]) =>
  ({ items }) as unknown as DataTransfer;

describe('[isFile]: whether a value is a File', () => {
  it('should return true for a File', () => {
    expect(isFile(new File(['data'], 'data.txt'))).toBe(true);
  });

  it('should return false for a Blob that is not a File', () => {
    expect(isFile(new Blob(['data']))).toBe(false);
  });

  it('should return false for an object shaped like a File', () => {
    expect(isFile({ name: 'data.txt', size: 4, type: 'text/plain', lastModified: 0 })).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isFile(null)).toBe(false);
    expect(isFile(undefined)).toBe(false);
    expect(isFile('data.txt')).toBe(false);
  });
});

describe('[fileListToFiles]: turn a FileList into an array', () => {
  it('should return the files in their order', () => {
    const first = createFile('first.txt');
    const second = createFile('second.txt');

    const fileList = {
      0: first,
      1: second,
      length: 2,
      item: (index: number) => [first, second][index] ?? null,
    } as unknown as FileList;

    const files = fileListToFiles(fileList);

    expect(Array.isArray(files)).toBe(true);
    expect(files).toHaveLength(2);
    expect(files[0]).toBe(first);
    expect(files[1]).toBe(second);
  });

  it('should return an empty array for an empty FileList', () => {
    const input = document.createElement('input');
    input.type = 'file';

    expect(fileListToFiles(input.files)).toStrictEqual([]);
  });

  it('should return an empty array for null', () => {
    expect(fileListToFiles(null)).toStrictEqual([]);
  });
});

describe('[blobToFile]: turn a Blob into a named File', () => {
  it('should return a File with the given name', () => {
    const file = blobToFile(new Blob(['Hello world'], { type: 'text/plain' }), 'hello.txt');

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('hello.txt');
  });

  it('should keep the content and type of the Blob', async () => {
    const blob = new Blob(['Hello world'], { type: 'text/plain' });

    const file = blobToFile(blob, 'hello.txt');

    expect(file.type).toBe('text/plain');
    expect(file.size).toBe(blob.size);
    expect(await file.text()).toBe('Hello world');
  });

  it('should keep an empty type empty', () => {
    expect(blobToFile(new Blob(['data']), 'data.bin').type).toBe('');
  });
});

describe('[traverseFileSystemDirectory]: collect the files of a directory and its subdirectories', () => {
  it('should resolve each file entry to its File', async () => {
    const report = createFile('report.pdf');
    const photo = createFile('photo.jpg');

    const files = await traverseFileSystemDirectory(
      createDirectoryEntry('documents', [createFileEntry(report), createFileEntry(photo)]),
    );

    expect(files).toHaveLength(2);
    expect(files[0]).toBe(report);
    expect(files[1]).toBe(photo);
  });

  it('should read entries handed over in several batches', async () => {
    const { entry, readEntries } = createBatchedDirectoryEntry('documents', [
      [createFileEntry(createFile('a.txt')), createFileEntry(createFile('b.txt'))],
      [createFileEntry(createFile('c.txt'))],
    ]);

    const files = await traverseFileSystemDirectory(entry);

    expect(getNames(files)).toStrictEqual(['a.txt', 'b.txt', 'c.txt']);
    expect(readEntries).toHaveBeenCalledTimes(3);
  });

  it('should flatten the files of nested directories', async () => {
    const root = createDirectoryEntry('root', [
      createFileEntry(createFile('a.txt')),
      createDirectoryEntry('models', [
        createFileEntry(createFile('b.stl')),
        createDirectoryEntry('parts', [createFileEntry(createFile('c.stl'))]),
      ]),
      createFileEntry(createFile('d.txt')),
    ]);

    expect(getNames(await traverseFileSystemDirectory(root))).toStrictEqual([
      'a.txt',
      'b.stl',
      'c.stl',
      'd.txt',
    ]);
  });

  it('should read the batches of a nested directory', async () => {
    const { entry: models, readEntries } = createBatchedDirectoryEntry('models', [
      [createFileEntry(createFile('a.stl'))],
      [createFileEntry(createFile('b.stl'))],
    ]);

    const files = await traverseFileSystemDirectory(createDirectoryEntry('root', [models]));

    expect(getNames(files)).toStrictEqual(['a.stl', 'b.stl']);
    expect(readEntries).toHaveBeenCalledTimes(3);
  });

  it('should return an empty array for an empty directory', async () => {
    expect(await traverseFileSystemDirectory(createDirectoryEntry('empty', []))).toStrictEqual([]);
  });

  it('should not return directories themselves', async () => {
    const root = createDirectoryEntry('root', [
      createDirectoryEntry('empty', []),
      createFileEntry(createFile('a.txt')),
    ]);

    expect(getNames(await traverseFileSystemDirectory(root))).toStrictEqual(['a.txt']);
  });

  it('should skip OS metadata files by default, in nested directories too', async () => {
    const root = createDirectoryEntry('root', [
      createFileEntry(createFile('.DS_Store')),
      createFileEntry(createFile('a.txt')),
      createFileEntry(createFile('Thumbs.db')),
      createDirectoryEntry('models', [
        createFileEntry(createFile('desktop.ini')),
        createFileEntry(createFile('ehthumbs.db')),
        createFileEntry(createFile('b.stl')),
      ]),
    ]);

    expect(getNames(await traverseFileSystemDirectory(root))).toStrictEqual(['a.txt', 'b.stl']);
  });

  it('should skip only the given files when skipFiles is set, in nested directories too', async () => {
    const root = createDirectoryEntry('root', [
      createFileEntry(createFile('.DS_Store')),
      createFileEntry(createFile('notes.txt')),
      createDirectoryEntry('models', [
        createFileEntry(createFile('notes.txt')),
        createFileEntry(createFile('b.stl')),
      ]),
    ]);

    expect(
      getNames(await traverseFileSystemDirectory(root, { skipFiles: ['notes.txt'] })),
    ).toStrictEqual(['.DS_Store', 'b.stl']);
  });

  it('should skip nothing for an empty skipFiles', async () => {
    const root = createDirectoryEntry('root', [
      createFileEntry(createFile('.DS_Store')),
      createFileEntry(createFile('a.txt')),
    ]);

    expect(getNames(await traverseFileSystemDirectory(root, { skipFiles: [] }))).toStrictEqual([
      '.DS_Store',
      'a.txt',
    ]);
  });
});

describe('[readFilesFromDataTransfer]: read the files and directories of a drop', () => {
  it('should return an empty array for null', async () => {
    expect(await readFilesFromDataTransfer(null)).toStrictEqual([]);
  });

  it('should return an empty array for a DataTransfer without items', async () => {
    expect(
      await readFilesFromDataTransfer({ items: undefined } as unknown as DataTransfer),
    ).toStrictEqual([]);
  });

  it('should read a file through its entry', async () => {
    const file = createFile('report.pdf');
    const item = createEntryItem(createFileEntry(file), file);

    const files = await readFilesFromDataTransfer(createDataTransfer([item]));

    expect(files).toHaveLength(1);
    expect(files[0]).toBe(file);
    expect(item.getAsFile).not.toHaveBeenCalled();
  });

  it('should read every file of a dropped directory', async () => {
    const directory = createDirectoryEntry('models', [
      createFileEntry(createFile('a.stl')),
      createDirectoryEntry('parts', [createFileEntry(createFile('b.stl'))]),
    ]);

    const files = await readFilesFromDataTransfer(createDataTransfer([createEntryItem(directory)]));

    expect(getNames(files)).toStrictEqual(['a.stl', 'b.stl']);
  });

  it('should skip OS metadata files of a dropped directory by default', async () => {
    const directory = createDirectoryEntry('models', [
      createFileEntry(createFile('.DS_Store')),
      createFileEntry(createFile('a.stl')),
    ]);

    const files = await readFilesFromDataTransfer(createDataTransfer([createEntryItem(directory)]));

    expect(getNames(files)).toStrictEqual(['a.stl']);
  });

  it('should pass the traverse options to the directory traversal', async () => {
    const directory = createDirectoryEntry('models', [
      createFileEntry(createFile('notes.txt')),
      createFileEntry(createFile('a.stl')),
    ]);

    const files = await readFilesFromDataTransfer(
      createDataTransfer([createEntryItem(directory)]),
      {
        skipFiles: ['notes.txt'],
      },
    );

    expect(getNames(files)).toStrictEqual(['a.stl']);
  });

  it('should fall back to getAsFile for an item without webkitGetAsEntry', async () => {
    const file = createFile('report.pdf');

    const files = await readFilesFromDataTransfer(createDataTransfer([createItem(file)]));

    expect(files).toHaveLength(1);
    expect(files[0]).toBe(file);
  });

  it('should fall back to getAsFile when webkitGetAsEntry returns no entry', async () => {
    const file = createFile('report.pdf');
    const item = createEntryItem(null, file);

    const files = await readFilesFromDataTransfer(createDataTransfer([item]));

    expect(item.getAsFile).toHaveBeenCalledTimes(1);
    expect(files).toHaveLength(1);
    expect(files[0]).toBe(file);
  });

  it('should leave out items that hold no file', async () => {
    const files = await readFilesFromDataTransfer(
      createDataTransfer([createItem(null), createEntryItem(null)]),
    );

    expect(files).toStrictEqual([]);
  });

  it('should combine the files of every item in item order', async () => {
    const directory = createDirectoryEntry('models', [
      createFileEntry(createFile('b.stl')),
      createFileEntry(createFile('c.stl')),
    ]);

    const files = await readFilesFromDataTransfer(
      createDataTransfer([
        createEntryItem(createFileEntry(createFile('a.txt'))),
        createEntryItem(directory),
        createItem(createFile('d.txt')),
        createItem(null),
      ]),
    );

    expect(getNames(files)).toStrictEqual(['a.txt', 'b.stl', 'c.stl', 'd.txt']);
  });
});

describe('[traverseFileSystemDirectory]: skipped folders', () => {
  it('should not enter a folder named in skipFiles', async () => {
    const root = createDirectoryEntry('root', [
      createFileEntry(createFile('photo.jpg')),
      createDirectoryEntry('__MACOSX', [createFileEntry(createFile('._photo.jpg'))]),
    ]);

    expect(getNames(await traverseFileSystemDirectory(root))).toStrictEqual(['photo.jpg']);
  });
});
