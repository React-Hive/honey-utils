import { findCharIndices } from '~/string';

describe('[findCharIndices]: find every index of a character', () => {
  it('should return an empty array for empty input', () => {
    expect(findCharIndices('', 'a')).toStrictEqual([]);
  });

  it('should return an empty array when the character does not occur', () => {
    expect(findCharIndices('hello', 'z')).toStrictEqual([]);
  });

  it('should return every index where the character occurs', () => {
    expect(findCharIndices('hello world', 'o')).toStrictEqual([4, 7]);
    expect(findCharIndices('banana', 'a')).toStrictEqual([1, 3, 5]);
  });

  it('should find occurrences at the first and last positions', () => {
    expect(findCharIndices('abca', 'a')).toStrictEqual([0, 3]);
  });

  it('should find adjacent occurrences', () => {
    expect(findCharIndices('a  b', ' ')).toStrictEqual([1, 2]);
  });

  it('should match a single-character input', () => {
    expect(findCharIndices('a', 'a')).toStrictEqual([0]);
    expect(findCharIndices('a', 'b')).toStrictEqual([]);
  });

  it('should compare case-sensitively', () => {
    expect(findCharIndices('AaAa', 'a')).toStrictEqual([1, 3]);
  });

  it('should find non-ASCII characters', () => {
    expect(findCharIndices('naïve ï', 'ï')).toStrictEqual([2, 6]);
  });

  it('should report UTF-16 code unit indices for characters outside the BMP', () => {
    expect(findCharIndices('x😀y😀', '😀')).toStrictEqual([1, 4]);
  });
});
