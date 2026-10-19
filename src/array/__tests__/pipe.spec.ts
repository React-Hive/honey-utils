import { pipe } from '~/array';

describe('[pipe]: combine unary functions from left to right', () => {
  const add = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const toStr = (x: number) => `Result: ${x}`;

  it('should apply the functions from left to right', () => {
    expect(pipe(add, double, toStr)(2)).toBe('Result: 6');
    expect(pipe(double, add, toStr)(2)).toBe('Result: 5');
  });

  it('should call each function once, the first one first', () => {
    const calls: string[] = [];

    const first = vi.fn((x: number) => {
      calls.push('first');

      return x + 1;
    });
    const second = vi.fn((x: number) => {
      calls.push('second');

      return x * 10;
    });

    expect(pipe(first, second)(3)).toBe(40);
    expect(calls).toStrictEqual(['first', 'second']);
    expect(first).toHaveBeenCalledExactlyOnceWith(3);
    expect(second).toHaveBeenCalledExactlyOnceWith(4);
  });

  it('should pass each result on as the next argument', () => {
    const piped = pipe(
      (text: string) => text.toLowerCase(),
      (text: string) => text.split(' '),
      (words: string[]) => words.join('-'),
    );

    expect(piped('Hello Big World')).toBe('hello-big-world');
  });

  it('should return what a single function returns', () => {
    expect(pipe(double)(4)).toBe(8);
  });

  it('should pipe five functions', () => {
    const piped = pipe(double, add, double, add, toStr);

    expect(piped(1)).toBe('Result: 7');
  });

  it('should pipe more than five functions, still from left to right', () => {
    const append = (letter: string) => (text: unknown) => `${text}${letter}`;

    const piped = pipe(
      append('a'),
      append('b'),
      append('c'),
      append('d'),
      append('e'),
      append('f'),
    );

    expect(piped('')).toBe('abcdef');
  });

  it('should return the argument when no functions are given', () => {
    const value = { id: 1 };

    expect(pipe()(value)).toBe(value);
  });

  it('should not call the functions until the piped function is called', () => {
    const fn = vi.fn(add);

    const piped = pipe(fn);

    expect(fn).not.toHaveBeenCalled();

    piped(1);

    expect(fn).toHaveBeenCalledOnce();
  });

  it('should run the functions again on every call', () => {
    const piped = pipe(add, double);

    expect(piped(1)).toBe(4);
    expect(piped(5)).toBe(12);
  });

  it('should infer the argument and result types from the functions', () => {
    const piped = pipe(add, double, toStr);

    expectTypeOf(piped).toEqualTypeOf<(a: number) => string>();
  });
});

describe('[pipe]: more than five typed functions', () => {
  it('should take typed functions past five, falling back to unknown', () => {
    const add = (x: number) => x + 1;
    const double = (x: number) => x * 2;

    expect(pipe(add, add, add, add, add, double)(1)).toBe(12);
  });
});
