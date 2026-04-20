import { splitMapJoin } from '~/string';

describe('[splitMapJoin]: split + map + join string utility', () => {
  it('should return empty string for empty input', () => {
    const result = splitMapJoin('', ',', part => part);

    expect(result).toBe('');
  });

  it('should split by separator and map each part', () => {
    const result = splitMapJoin('a,b,c', ',', part => part.toUpperCase());

    expect(result).toBe('A,B,C');
  });

  it('should trim whitespace around parts before mapping', () => {
    const result = splitMapJoin('  a ,  b , c  ', ',', part => part);

    expect(result).toBe('a,b,c');
  });

  it('should preserve commas with custom join formatting', () => {
    const result = splitMapJoin('a,b,c', ',', part => part.toUpperCase(), '.');

    expect(result).toBe('A.B.C');
  });

  it('should provide correct index to mapFn', () => {
    const indices: number[] = [];

    splitMapJoin('x,y,z', ',', (_, index) => {
      indices.push(index);

      return String(index);
    });

    expect(indices).toStrictEqual([0, 1, 2]);
  });

  it('should handle multiple-character separators', () => {
    const result = splitMapJoin('a || b || c', '||', part => part);

    expect(result).toBe('a||b||c');
  });

  it('should handle repeated separators producing empty parts', () => {
    const result = splitMapJoin('a,,b', ',', part => part || 'EMPTY');

    expect(result).toBe('a,EMPTY,b');
  });

  it('should allow custom join separator different from split separator', () => {
    const result = splitMapJoin('a,b,c', ',', part => part, ', ');

    expect(result).toBe('a, b, c');
  });
});
