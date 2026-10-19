import { compose } from '~/array';

describe('[compose]: combine unary functions from right to left', () => {
  const add = (x: number) => x + 1;
  const double = (x: number) => x * 2;
  const toStr = (x: number) => `Result: ${x}`;

  it('should apply the functions from right to left', () => {
    expect(compose(toStr, double, add)(2)).toBe('Result: 6');
    expect(compose(toStr, add, double)(2)).toBe('Result: 5');
  });

  it('should call each function once, the last one first', () => {
    const calls: string[] = [];

    const first = vi.fn((x: number) => {
      calls.push('first');

      return x + 1;
    });
    const second = vi.fn((x: number) => {
      calls.push('second');

      return x * 10;
    });

    expect(compose(first, second)(3)).toBe(31);
    expect(calls).toStrictEqual(['second', 'first']);
    expect(second).toHaveBeenCalledExactlyOnceWith(3);
    expect(first).toHaveBeenCalledExactlyOnceWith(30);
  });

  it('should pass each result on as the next argument', () => {
    const composed = compose(
      (words: string[]) => words.join('-'),
      (text: string) => text.split(' '),
      (text: string) => text.toLowerCase(),
    );

    expect(composed('Hello Big World')).toBe('hello-big-world');
  });

  it('should return what a single function returns', () => {
    expect(compose(double)(4)).toBe(8);
  });

  it('should compose five functions', () => {
    const composed = compose(toStr, add, double, add, double);

    expect(composed(1)).toBe('Result: 7');
  });

  it('should compose more than five functions, still from right to left', () => {
    const append = (letter: string) => (text: unknown) => `${text}${letter}`;

    const composed = compose(
      append('f'),
      append('e'),
      append('d'),
      append('c'),
      append('b'),
      append('a'),
    );

    expect(composed('')).toBe('abcdef');
  });

  it('should return the argument when no functions are given', () => {
    const value = { id: 1 };

    expect(compose()(value)).toBe(value);
  });

  it('should not call the functions until the composed function is called', () => {
    const fn = vi.fn(add);

    const composed = compose(fn);

    expect(fn).not.toHaveBeenCalled();

    composed(1);

    expect(fn).toHaveBeenCalledOnce();
  });

  it('should run the functions again on every call', () => {
    const composed = compose(double, add);

    expect(composed(1)).toBe(4);
    expect(composed(5)).toBe(12);
  });

  it('should infer the argument and result types from the functions', () => {
    const composed = compose(toStr, double, add);

    expectTypeOf(composed).toEqualTypeOf<(a: number) => string>();
  });
});

describe('[compose]: more than five typed functions', () => {
  it('should take typed functions past five, falling back to unknown', () => {
    const add = (x: number) => x + 1;
    const double = (x: number) => x * 2;

    expect(compose(double, add, add, add, add, add)(1)).toBe(12);
  });
});
