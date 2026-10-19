import { invokeIfFunction } from '~/function';

describe('[invokeIfFunction]: call a function or return a value as-is', () => {
  it('should call a function with the given arguments and return its result', () => {
    const fn = vi.fn((x: number, y: number) => x * y);

    const result = invokeIfFunction(fn, 2, 5);

    expect(result).toBe(10);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith(2, 5);
  });

  it('should call a function that takes no arguments', () => {
    const result = invokeIfFunction(() => 'value');

    expect(result).toBe('value');
  });

  it('should return a value that is not a function as-is', () => {
    expect(invokeIfFunction('not a function', 5)).toBe('not a function');
    expect(invokeIfFunction(42)).toBe(42);
  });

  it('should return the same object reference', () => {
    const value = { key: 'value' };

    const result = invokeIfFunction(value);

    expect(result).toBe(value);
  });

  it('should return falsy values as-is', () => {
    expect(invokeIfFunction(null)).toBeNull();
    expect(invokeIfFunction(undefined)).toBeUndefined();
    expect(invokeIfFunction(0)).toBe(0);
    expect(invokeIfFunction(false)).toBe(false);
    expect(invokeIfFunction('')).toBe('');
  });

  it('should return a function result that is itself undefined', () => {
    const result = invokeIfFunction(() => undefined);

    expect(result).toBeUndefined();
  });

  it('should throw what the function throws', () => {
    const fn = () => {
      throw new Error('Failed');
    };

    expect(() => invokeIfFunction(fn)).toThrow('Failed');
  });

  it('should type the arguments from the function', () => {
    const double = (x: number) => x * 2;

    // @ts-expect-error - a string is not the number the function takes
    const result = invokeIfFunction(double, 'x');

    expect(result).toBeNaN();
  });
});
