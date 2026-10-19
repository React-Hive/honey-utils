import { parseFileName } from '~/string';

describe('[parseFileName]: split a file name into base name and extension', () => {
  it('should split a name on its dot', () => {
    expect(parseFileName('document.pdf')).toStrictEqual(['document', 'pdf']);
  });

  it('should split a multi-dot name on the last dot', () => {
    expect(parseFileName('archive.tar.gz')).toStrictEqual(['archive.tar', 'gz']);
    expect(parseFileName('my.report.final.docx')).toStrictEqual(['my.report.final', 'docx']);
  });

  it('should lowercase the extension and keep the base name as it is', () => {
    expect(parseFileName('Photo.JPG')).toStrictEqual(['Photo', 'jpg']);
    expect(parseFileName('README.Md')).toStrictEqual(['README', 'md']);
  });

  it('should return an empty extension for a name without a dot', () => {
    expect(parseFileName('README')).toStrictEqual(['README', '']);
  });

  it('should return an empty extension for a hidden file', () => {
    expect(parseFileName('.gitignore')).toStrictEqual(['.gitignore', '']);
    expect(parseFileName('.env')).toStrictEqual(['.env', '']);
  });

  it('should split a hidden file that has an extension', () => {
    expect(parseFileName('.env.local')).toStrictEqual(['.env', 'local']);
  });

  it('should return an empty extension for a name ending with a dot', () => {
    expect(parseFileName('file.')).toStrictEqual(['file.', '']);
    expect(parseFileName('archive.tar.')).toStrictEqual(['archive.tar.', '']);
  });

  it('should return an empty extension for dot-only names', () => {
    expect(parseFileName('.')).toStrictEqual(['.', '']);
    expect(parseFileName('..')).toStrictEqual(['..', '']);
  });

  it('should return two empty strings for an empty name', () => {
    expect(parseFileName('')).toStrictEqual(['', '']);
  });

  it('should split a one-character base name and extension', () => {
    expect(parseFileName('a.b')).toStrictEqual(['a', 'b']);
  });

  it('should keep spaces in the base name', () => {
    expect(parseFileName('my holiday photo.png')).toStrictEqual(['my holiday photo', 'png']);
  });

  it('should keep non-ASCII characters', () => {
    expect(parseFileName('résumé.PDF')).toStrictEqual(['résumé', 'pdf']);
  });
});

describe('[parseFileName]: return type', () => {
  it('should be typed as a pair of base name and extension', () => {
    const parts: [string, string] = parseFileName('report.pdf');

    expect(parts).toStrictEqual(['report', 'pdf']);
  });
});
