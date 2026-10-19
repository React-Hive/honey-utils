import { noop, isFunction, not, once } from '~/function';

describe('[noop]: do nothing', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
  });

  it('should stand in for an optional callback', () => {
    const props: { onClose?: () => void } = {};
    const { onClose = noop } = props;

    expect(() => onClose()).not.toThrow();
  });
});

describe('[isFunction]: check a value is a function', () => {
  it('should return true for arrow and regular functions', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function named() {})).toBe(true);
  });

  it('should return true for async and generator functions', () => {
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction(function* generator() {})).toBe(true);
  });

  it('should return true for classes, bound functions and built-ins', () => {
    class Fruit {
      name = 'apple';
    }

    expect(isFunction(Fruit)).toBe(true);
    expect(isFunction(noop.bind(null))).toBe(true);
    expect(isFunction(Math.max)).toBe(true);
  });

  it('should return false for objects with a call method', () => {
    expect(isFunction({ call: () => {} })).toBe(false);
  });

  it('should return false for non-function values', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction('function')).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
  });
});

describe('[not]: negate a predicate', () => {
  it('should return the negated result of the predicate', () => {
    const isEven = (n: number) => n % 2 === 0;
    const isOdd = not(isEven);

    expect(isOdd(2)).toBe(false);
    expect(isOdd(3)).toBe(true);
  });

  it('should pass every argument to the predicate', () => {
    const predicate = vi.fn((a: number, b: string) => a > 0 && b !== '');
    const negated = not(predicate);

    const result = negated(1, 'a');

    expect(predicate).toHaveBeenCalledOnce();
    expect(predicate).toHaveBeenCalledWith(1, 'a');
    expect(result).toBe(false);
  });

  it('should return a boolean for a predicate returning truthy values', () => {
    expect(not(() => 'text')()).toBe(false);
    expect(not(() => 1)()).toBe(false);
    expect(not(() => ({}))()).toBe(false);
  });

  it('should return a boolean for a predicate returning falsy values', () => {
    expect(not(() => '')()).toBe(true);
    expect(not(() => 0)()).toBe(true);
    expect(not(() => null)()).toBe(true);
    expect(not(() => undefined)()).toBe(true);
  });

  it('should keep only the items the predicate rejects when used as a filter', () => {
    const isEmpty = (value: string) => value === '';

    const result = ['a', '', 'b', ''].filter(not(isEmpty));

    expect(result).toStrictEqual(['a', 'b']);
  });

  it('should call the predicate again on every call', () => {
    const predicate = vi.fn(() => true);
    const negated = not(predicate);

    negated();
    negated();

    expect(predicate).toHaveBeenCalledTimes(2);
  });
});

describe('[once]: run a function on the first call only', () => {
  it('should call the function only once', () => {
    const fn = vi.fn(() => 'result');
    const onceFn = once(fn);

    onceFn();
    onceFn();
    onceFn();

    expect(fn).toHaveBeenCalledOnce();
  });

  it('should return the first result on every call', () => {
    let count = 0;
    const onceFn = once(() => ++count);

    expect(onceFn()).toBe(1);
    expect(onceFn()).toBe(1);
    expect(count).toBe(1);
  });

  it('should pass the first call its arguments and ignore later ones', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const onceFn = once(fn);

    expect(onceFn(1, 2)).toBe(3);
    expect(onceFn(10, 20)).toBe(3);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  it('should not call the function again when its first result is undefined', () => {
    const fn = vi.fn(() => undefined);
    const onceFn = once(fn);

    onceFn();
    onceFn();

    expect(fn).toHaveBeenCalledOnce();
  });

  it('should return the same reference on every call', () => {
    const onceFn = once(() => ({ value: 1 }));

    expect(onceFn()).toBe(onceFn());
  });

  it('should call the function with the this of the first call', () => {
    const counter = {
      count: 5,
      getCount: once(function (this: { count: number }) {
        return this.count;
      }),
    };

    expect(counter.getCount()).toBe(5);
  });

  it('should throw what the first call throws', () => {
    const onceFn = once(() => {
      throw new Error('Setup failed');
    });

    expect(() => onceFn()).toThrow('Setup failed');
  });

  it('should keep a separate state for each wrapped function', () => {
    const fn = vi.fn((value: string) => value);
    const first = once(fn);
    const second = once(fn);

    expect(first('a')).toBe('a');
    expect(second('b')).toBe('b');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('[isFunction]: narrowing', () => {
  it('should narrow an unknown value to a function', () => {
    const value: unknown = () => 'called';

    if (isFunction(value)) {
      // Calling it compiles only because it is narrowed - `unknown` cannot be called
      expect(value()).toBe('called');
    } else {
      expect.unreachable();
    }
  });
});

describe('[once]: a first call that throws', () => {
  it('should throw the same error on every later call without calling fn again', () => {
    const error = new Error('Setup failed');
    const fn = vi.fn(() => {
      throw error;
    });

    const setup = once(fn);

    expect(() => setup()).toThrow(error);
    expect(() => setup()).toThrow(error);
    expect(() => setup()).toThrow(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
