type PipeFn = (arg: unknown) => unknown;

/**
 * Any unary function: one taking a typed argument is assignable here, where it is not to `PipeFn`.
 */
type AnyUnaryFn = (arg: never) => unknown;

type Pipe = {
  <A, B>(fn1: (a: A) => B): (a: A) => B;
  <A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
  <A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D;
  <A, B, C, D, E>(
    fn1: (a: A) => B,
    fn2: (b: B) => C,
    fn3: (c: C) => D,
    fn4: (d: D) => E,
  ): (a: A) => E;
  <A, B, C, D, E, F>(
    fn1: (a: A) => B,
    fn2: (b: B) => C,
    fn3: (c: C) => D,
    fn4: (d: D) => E,
    fn5: (e: E) => F,
  ): (a: A) => F;
  (...fns: AnyUnaryFn[]): (arg: unknown) => unknown;
};

/**
 * Composes multiple unary functions into a single function, applying them from left to right.
 *
 * Useful for building a data processing pipeline where the output of one function becomes the input of the next.
 *
 * Types are inferred up to 5 chained functions for full type safety. Beyond that, it falls back to the unknown.
 *
 * @param fns - A list of unary functions to compose.
 *
 * @returns A new function that applies all functions from left to right.
 *
 * @example
 * ```ts
 * const add = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const toStr = (x: number) => `Result: ${x}`;
 *
 * const result = pipe(add, double, toStr)(2);
 * // => 'Result: 6'
 * ```
 */
export const pipe: Pipe =
  (...fns: AnyUnaryFn[]) =>
  (arg: unknown) =>
    (fns as PipeFn[]).reduce((prev, fn) => fn(prev), arg);
