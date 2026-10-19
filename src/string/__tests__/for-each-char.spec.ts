import { forEachChar } from '~/string';

describe('[forEachChar]: iterate over the characters of a string', () => {
  it('should not invoke the callback for empty input', () => {
    const onChar = vi.fn();
    const shouldSkipChar = vi.fn();

    forEachChar('', onChar, shouldSkipChar);

    expect(onChar).not.toHaveBeenCalled();
    expect(shouldSkipChar).not.toHaveBeenCalled();
  });

  it('should invoke the callback for each character in order', () => {
    const chars: string[] = [];

    forEachChar('abc', char => {
      chars.push(char);
    });

    expect(chars).toStrictEqual(['a', 'b', 'c']);
  });

  it('should pass the index and the adjacent characters', () => {
    const onChar = vi.fn();

    forEachChar('abc', onChar);

    expect(onChar.mock.calls).toStrictEqual([
      ['a', { charIndex: 0, prevChar: null, nextChar: 'b' }],
      ['b', { charIndex: 1, prevChar: 'a', nextChar: 'c' }],
      ['c', { charIndex: 2, prevChar: 'b', nextChar: null }],
    ]);
  });

  it('should pass no adjacent characters for a single character', () => {
    const onChar = vi.fn();

    forEachChar('x', onChar);

    expect(onChar).toHaveBeenCalledOnce();
    expect(onChar).toHaveBeenCalledWith('x', { charIndex: 0, prevChar: null, nextChar: null });
  });

  it('should include spaces as characters', () => {
    const chars: string[] = [];

    forEachChar(' a ', char => {
      chars.push(char);
    });

    expect(chars).toStrictEqual([' ', 'a', ' ']);
  });

  it('should skip characters the predicate returns true for', () => {
    const chars: string[] = [];

    forEachChar(
      'a b c',
      char => {
        chars.push(char);
      },
      char => char === ' ',
    );

    expect(chars).toStrictEqual(['a', 'b', 'c']);
  });

  it('should keep the original indices and neighbours around skipped characters', () => {
    const onChar = vi.fn();

    forEachChar('a b', onChar, char => char === ' ');

    expect(onChar.mock.calls).toStrictEqual([
      ['a', { charIndex: 0, prevChar: null, nextChar: ' ' }],
      ['b', { charIndex: 2, prevChar: ' ', nextChar: null }],
    ]);
  });

  it('should pass the predicate the same context as the callback', () => {
    const shouldSkipChar = vi.fn(() => false);

    forEachChar('ab', vi.fn(), shouldSkipChar);

    expect(shouldSkipChar.mock.calls).toStrictEqual([
      ['a', { charIndex: 0, prevChar: null, nextChar: 'b' }],
      ['b', { charIndex: 1, prevChar: 'a', nextChar: null }],
    ]);
  });

  it('should skip by index from the context', () => {
    const chars: string[] = [];

    forEachChar(
      'abcd',
      char => {
        chars.push(char);
      },
      (_, { charIndex }) => charIndex % 2 === 1,
    );

    expect(chars).toStrictEqual(['a', 'c']);
  });

  it('should invoke nothing when every character is skipped', () => {
    const onChar = vi.fn();

    forEachChar('abc', onChar, () => true);

    expect(onChar).not.toHaveBeenCalled();
  });

  it('should iterate over UTF-16 code units', () => {
    const chars: string[] = [];

    forEachChar('😀', char => {
      chars.push(char);
    });

    expect(chars).toStrictEqual(['\ud83d', '\ude00']);
  });
});
