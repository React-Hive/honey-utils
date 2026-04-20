type ComposeFn = (arg: unknown) => unknown;

type Compose = {
  <A, R>(fn1: (a: A) => R): (a: A) => R;
  <A, B, R>(fn1: (b: B) => R, fn2: (a: A) => B): (a: A) => R;
  <A, B, C, R>(fn1: (c: C) => R, fn2: (b: B) => C, fn3: (a: A) => B): (a: A) => R;
  <A, B, C, D, R>(
    fn1: (d: D) => R,
    fn2: (c: C) => D,
    fn3: (b: B) => C,
    fn4: (a: A) => B,
  ): (a: A) => R;
  <A, B, C, D, E, R>(
    fn1: (e: E) => R,
    fn2: (d: D) => E,
    fn3: (c: C) => D,
    fn4: (b: B) => C,
    fn5: (a: A) => B,
  ): (a: A) => R;
  (...fns: ComposeFn[]): (arg: unknown) => unknown;
};

/**
 * Composes multiple unary functions into a single function, applying them from **right to left**.
 *
 * Often used for building functional pipelines where the innermost function runs first.
 * Types are inferred up to 5 chained functions for full type safety.
 *
 * @param fns - A list of unary functions to compose.
 *
 * @returns A new function that applies all functions from right to left.
 *
 * @example
 * ```ts
 * const add = (x: number) => x + 1;
 * const double = (x: number) => x * 2;
 * const toStr = (x: number) => `Result: ${x}`;
 *
 * const result = compose(toStr, double, add)(2);
 * // => 'Result: 6'
 * ```
 */
export const compose: Compose =
  (...fns: ComposeFn[]) =>
  (arg: unknown) =>
    fns.reduceRight((prev, fn) => fn(prev), arg);
