type ComposeFn = (arg: unknown) => unknown;

/**
 * Any unary function: one taking a typed argument is assignable here, where it is not to
 * `ComposeFn`.
 */
type AnyUnaryFn = (arg: never) => unknown;

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
  (...fns: AnyUnaryFn[]): (arg: unknown) => unknown;
};

/**
 * Composes multiple unary functions into a single function, applying them from **right to left**.
 *
 * Often used for building functional pipelines where the innermost function runs first.
 * Types are inferred up to 5 chained functions for full type safety. Beyond that, it falls back to the unknown.
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
  (...fns: AnyUnaryFn[]) =>
  (arg: unknown) =>
    (fns as ComposeFn[]).reduceRight((prev, fn) => fn(prev), arg);
