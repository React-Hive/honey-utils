import { splitStringIntoWords } from '~/string';

describe('[splitStringIntoWords]: split a string into words on spaces', () => {
  it('should return an empty array for empty input', () => {
    expect(splitStringIntoWords('')).toStrictEqual([]);
  });

  it('should return an empty array for input of spaces only', () => {
    expect(splitStringIntoWords('   ')).toStrictEqual([]);
  });

  it('should split words separated by single spaces', () => {
    expect(splitStringIntoWords('the quick brown fox')).toStrictEqual([
      'the',
      'quick',
      'brown',
      'fox',
    ]);
  });

  it('should drop leading and trailing spaces', () => {
    expect(splitStringIntoWords('  hello world  ')).toStrictEqual(['hello', 'world']);
  });

  it('should drop repeated spaces between words', () => {
    expect(splitStringIntoWords('hello    world')).toStrictEqual(['hello', 'world']);
  });

  it('should return a single word as one item', () => {
    expect(splitStringIntoWords('hello')).toStrictEqual(['hello']);
    expect(splitStringIntoWords('a')).toStrictEqual(['a']);
  });

  it('should keep punctuation attached to its word', () => {
    expect(splitStringIntoWords('hello, world!')).toStrictEqual(['hello,', 'world!']);
  });

  it('should keep hyphenated words whole', () => {
    expect(splitStringIntoWords('well-known fact')).toStrictEqual(['well-known', 'fact']);
  });

  it('should keep the case of each word', () => {
    expect(splitStringIntoWords('Hello WORLD')).toStrictEqual(['Hello', 'WORLD']);
  });

  it('should split non-ASCII words', () => {
    expect(splitStringIntoWords('привіт  світ')).toStrictEqual(['привіт', 'світ']);
  });
});
