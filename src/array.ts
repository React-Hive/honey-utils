import { assert } from './guards';

/**
 * Checks if a value is an array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an array; otherwise, `false`.
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

/**
 * Checks if a value is an empty array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an empty array; otherwise, `false`.
 */
export const isEmptyArray = (value: unknown): value is [] => isArray(value) && value.length === 0;

/**
 * Represents all falsy values.
 */
type Falsy = false | null | undefined | 0 | '';

/**
 * Removes all falsy values from an array.
 *
 * Falsy values include: `false`, `0`, `''` (empty string), `null`, `undefined`, and `NaN`.
 *
 * Useful for cleaning up arrays with optional, nullable, or conditionally included items.
 *
 * @template T - The type of the truthy items.
 *
 * @param array - An array possibly containing falsy values.
 *
 * @returns A new array containing only truthy values of type `T`.
 *
 * @example
 * ```ts
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
 * ```
 */
export const compact = <T>(array: (T | Falsy)[]): T[] => array.filter(Boolean) as T[];

/**
 * Returns a new array with duplicate values removed.
 *
 * Uses Set for efficient duplicate removal while preserving the original order.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - The input array that may contain duplicate values.
 *
 * @returns A new array with only unique values, maintaining the original order.
 *
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 1, 4]); // [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
 * ```
 */
export const unique = <T>(array: T[]): T[] => [...new Set(array)];

/**
 * Splits an array into chunks of the specified size.
 *
 * Useful for pagination, batch processing, or creating grid layouts.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - The input array to be chunked.
 * @param size - The size of each chunk. Must be greater than 0.
 *
 * @returns An array of chunks, where each chunk is an array of the specified size
 *          (except possibly the last chunk, which may be smaller).
 *
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * chunk(['a', 'b', 'c', 'd'], 3); // [['a', 'b', 'c'], ['d']]
 * ```
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  assert(size > 0, 'Chunk size must be greater than 0');

  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
};

/**
 * Returns an array containing elements that exist in all provided arrays.
 *
 * @template T - The type of the items in the arrays.
 *
 * @param arrays - Two or more arrays to find common elements from.
 *
 * @returns A new array containing only the elements that exist in all input arrays.
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
 * intersection(['a', 'b', 'c'], ['b', 'c', 'd'], ['b', 'e']); // ['b']
 * ```
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    return [...arrays[0]];
  }

  const [first, ...rest] = arrays;
  const uniqueFirst = unique(first);

  return uniqueFirst.filter(item => rest.every(array => array.includes(item)));
};

/**
 * Returns elements from the first array that don't exist in the second array.
 *
 * @template T - The type of the items in the arrays.
 *
 * @param array - The source array.
 * @param exclude - The array containing elements to exclude.
 *
 * @returns A new array with elements from the first array that don't exist in the second array.
 *
 * @example
 * ```ts
 * difference([1, 2, 3, 4], [2, 4]); // [1, 3]
 * difference(['a', 'b', 'c'], ['b']); // ['a', 'c']
 * ```
 */
export const difference = <T>(array: T[], exclude: T[]): T[] =>
  array.filter(item => !exclude.includes(item));

type PipeFn = (arg: unknown) => unknown;

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
  (...fns: PipeFn[]): (arg: unknown) => unknown;
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
  (...fns: PipeFn[]) =>
  (arg: unknown) =>
    fns.reduce((prev, fn) => fn(prev), arg);

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
