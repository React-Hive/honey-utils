/**
 * A function that does nothing and returns `undefined` - a default for an optional callback, so the
 * caller can call it without checking it is there.
 *
 * @example
 * ```ts
 * const { onClose = noop } = props;
 *
 * onClose();
 * ```
 */
export const noop = () => {};

/**
 * Checks if a value is a function.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a function; otherwise, `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- what `typeof value === 'function'` narrows `unknown` to
export const isFunction = (value: unknown): value is Function => typeof value === 'function';

/**
 * Creates a function that negates the result of the given predicate function.
 *
 * @template Args - Argument types of the predicate function.
 *
 * @param fn - A function that returns any value.
 *
 * @returns A new function that returns the negated result of the original function.
 *
 * @example
 * ```ts
 * const isEven = (n: number) => n % 2 === 0;
 * const isOdd = not(isEven);
 *
 * console.log(isOdd(2)); // false
 * console.log(isOdd(3)); // true
 * ```
 */
export const not =
  <Args extends unknown[]>(fn: (...args: Args) => any): ((...args: Args) => boolean) =>
  (...args: Args) =>
    !fn(...args);

/**
 * Wraps a function so that it can only be executed once.
 * The wrapped function remembers (caches) the result of the first invocation
 * and returns that same result for all subsequent calls, regardless of the arguments provided.
 * Where the first invocation throws, every call throws that same error - `fn` is not run again.
 *
 * Common use cases include:
 * - initializing singletons
 * - running setup logic only once
 * - avoiding repeated expensive computations
 *
 * @template T - A function type whose return value should be cached.
 *
 * @param fn - The function to execute at most once.
 *
 * @returns A new function with the same signature as `fn`, but guaranteed to
 *          execute `fn` only on the first call and return the cached result
 *          thereafter.
 */
export const once = <T extends (...args: any[]) => any>(fn: T): T => {
  let called = false;
  let result: ReturnType<T>;
  let hasThrown = false;
  let error: unknown;

  return function (this: any, ...args: Parameters<T>) {
    if (!called) {
      called = true;

      try {
        result = fn.apply(this, args);
      } catch (e) {
        hasThrown = true;
        error = e;
      }
    }

    if (hasThrown) {
      throw error;
    }

    return result;
  } as T;
};
