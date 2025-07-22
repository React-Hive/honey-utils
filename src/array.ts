import { assert } from './guards';

/**
 * Filters out `null`, `undefined`, and other falsy values from an array,
 * returning a typed array of only truthy `Item` values.
 *
 * Useful when working with optional or nullable items that need to be sanitized.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - An array of items that may include `null`, `undefined`, or falsy values.
 *
 * @returns A new array containing only truthy `Item` values.
 */
export const boolFilter = <T>(array: (T | false | null | undefined)[]): T[] =>
  array.filter(Boolean) as T[];

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

/**
 * Asynchronously iterates over an array and executes an async function on each item sequentially,
 * collecting the results.
 *
 * Unlike `Promise.all`, this runs each promise one after another (not in parallel).
 * Useful when order or timing matters (e.g., rate limits, UI updates, animations).
 *
 * @param array - The array of items to iterate over.
 * @param predicate - An async function to execute for each item. Must return a value.
 *
 * @returns A promise that resolves with an array of results from each predicate call.
 *
 * @example
 * ```ts
 * const results = await forAsync([1, 2, 3], async (item) => {
 *   await delay(100);
 *
 *   return item * 2;
 * });
 *
 * console.log(results); // [2, 4, 6]
 * ```
 */
export const forAsync = async <Item, Result>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<Result>,
): Promise<Result[]> => {
  const results: Result[] = [];

  for (let i = 0; i < array.length; i++) {
    results.push(await predicate(array[i], i, array));
  }

  return results;
};

/**
 * Executes an asynchronous operation on each element of an array and waits for all promises to resolve.
 *
 * @param array - The array of items to operate on.
 * @param predicate - The asynchronous operation to perform on each item.
 *
 * @returns A promise that resolves with an array of results after all operations are completed.
 */
export const mapAsync = async <Item, Return>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<Return>,
): Promise<Return[]> => Promise.all(array.map(predicate));

/**
 * A generic function that processes an array asynchronously and filters the results
 * based on the provided async condition.
 *
 * @template Item - The type of the items in the array.
 * @template Return - The type of the items returned by the condition.
 *
 * @param array - An array of items to be processed.
 * @param predicate - An async function that returns a condition for each item.
 *
 * @returns A Promise that resolves to an array of items that match the condition.
 */
export const filterAsync = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<Item[]> => {
  const results = await mapAsync(array, async (item, index, array) =>
    (await predicate(item, index, array)) ? item : false,
  );

  return boolFilter(results);
};

/**
 * Asynchronously checks if at least one element in the array satisfies the async condition.
 *
 * @param array - The array of items to check.
 * @param predicate - An async function that returns a boolean.
 *
 * @returns A promise that resolves to true if any item passes the condition.
 */
export const someAsync = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<boolean> => {
  for (let i = 0; i < array.length; i++) {
    if (await predicate(array[i], i, array)) {
      return true;
    }
  }

  return false;
};

/**
 * Asynchronously checks if all elements in the array satisfy the async condition.
 *
 * @param array - The array of items to check.
 * @param predicate - An async function that returns a boolean.
 *
 * @returns A promise that resolves to true if all items pass the condition.
 */
export const everyAsync = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<boolean> => {
  for (let i = 0; i < array.length; i++) {
    if (!(await predicate(array[i], i, array))) {
      return false;
    }
  }

  return true;
};

/**
 * Asynchronously reduces an array to a single accumulated value.
 *
 * @template Item - The type of items in the array.
 * @template Accumulator - The type of the accumulated result.
 *
 * @param array - The array to reduce.
 * @param predicate - The async reducer function that processes each item and returns the updated accumulator.
 * @param initialValue - The initial accumulator value.
 *
 * @returns A promise that resolves to the final accumulated result.
 */
export const reduceAsync = async <Item, Accumulator>(
  array: Item[],
  predicate: (
    accumulator: Accumulator,
    item: Item,
    index: number,
    array: Item[],
  ) => Promise<Accumulator>,
  initialValue: Accumulator,
): Promise<Accumulator> => {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await predicate(accumulator, array[i], i, array);
  }

  return accumulator;
};

/**
 * Asynchronously finds the first element that satisfies the async condition.
 *
 * @param array - The array of items to search.
 * @param predicate - An async function that returns a boolean.
 *
 * @returns A promise that resolves to the found item or null if none match.
 */
export const findAsync = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<Item | null> => {
  for (let i = 0; i < array.length; i++) {
    if (await predicate(array[i], i, array)) {
      return array[i];
    }
  }

  return null;
};

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
