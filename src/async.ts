import { compact } from './array';

/**
 * Asynchronously iterates over an array and executes an async function on each item sequentially,
 * collecting the results.
 *
 * Useful when order or timing matters (e.g., rate limits, UI updates, animations).
 *
 * @param array - The array of items to iterate over.
 * @param fn - An async function to execute for each item. Must return a value.
 *
 * @returns A promise that resolves with an array of results from each function call.
 *
 * @example
 * ```ts
 * const results = await runSequential([1, 2, 3], async (item) => {
 *   await delay(100);
 *
 *   return item * 2;
 * });
 *
 * console.log(results); // [2, 4, 6]
 * ```
 */
export const runSequential = async <Item, Result>(
  array: Item[],
  fn: (item: Item, index: number, array: Item[]) => Promise<Result>,
): Promise<Result[]> => {
  const results: Result[] = [];

  for (let i = 0; i < array.length; i++) {
    results.push(await fn(array[i], i, array));
  }

  return results;
};

/**
 * Executes an asynchronous operation on each element of an array and waits for all promises to resolve.
 *
 * @param array - The array of items to operate on.
 * @param fn - The asynchronous operation to perform on each item.
 *
 * @returns A promise that resolves with an array of results after all operations are completed.
 *
 * @example
 * ```ts
 * const results = await runParallel([1, 2, 3], async (item) => {
 *   await delay(100);
 *
 *   return item * 2;
 * });
 *
 * console.log(results); // [2, 4, 6]
 * ```
 */
export const runParallel = async <Item, Result>(
  array: Item[],
  fn: (item: Item, index: number, array: Item[]) => Promise<Result>,
): Promise<Result[]> => Promise.all(array.map(fn));

/**
 * Asynchronously filters an array using a predicate function, executing **sequentially**.
 *
 * Useful for rate-limited or stateful async operations where execution order matters.
 *
 * @template Item - The type of the items in the input array.
 *
 * @param array - The array of items to filter.
 * @param predicate - An async function that returns a `boolean` indicating whether to keep each item.
 *
 * @returns A promise that resolves to a new array containing only the items for which the predicate returned `true`.
 *
 * @example
 * ```ts
 * // Sequentially filter even numbers with delay
 * const result = await filterSequential([1, 2, 3, 4], async (num) => {
 *   await delay(100);
 *
 *   return num % 2 === 0;
 * });
 *
 * console.log(result); // [2, 4]
 * ```
 */
export const filterSequential = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<Item[]> => {
  const results: Item[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    if (await predicate(item, i, array)) {
      results.push(item);
    }
  }

  return results;
};

/**
 * Asynchronously filters an array based on a provided async predicate function.
 *
 * Each item is passed to the `predicate` function in parallel, and only the items
 * for which the predicate resolves to `true` are included in the final result.
 *
 * Useful for filtering based on asynchronous conditions such as API calls,
 * file system access, or any other delayed operations.
 *
 * @template Item - The type of the items in the input array.
 *
 * @param array - The array of items to filter.
 * @param predicate - An async function that returns a boolean indicating whether to keep each item.
 *
 * @returns A promise that resolves to a new array containing only the items for which the predicate returned `true`.
 *
 * @example
 * ```ts
 * // Filter numbers that are even after a simulated delay
 * const result = await filterParallel([1, 2, 3, 4], async (num) => {
 *   await delay(100);
 *
 *   return num % 2 === 0;
 * });
 *
 * console.log(result); // [2, 4]
 * ```
 */
export const filterParallel = async <Item>(
  array: Item[],
  predicate: (item: Item, index: number, array: Item[]) => Promise<boolean>,
): Promise<Item[]> => {
  const results = await runParallel(array, async (item, index, array) =>
    (await predicate(item, index, array)) ? item : false,
  );

  return compact(results);
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
 * @param fn - The async reducer function that processes each item and returns the updated accumulator.
 * @param initialValue - The initial accumulator value.
 *
 * @returns A promise that resolves to the final accumulated result.
 */
export const reduceAsync = async <Item, Accumulator>(
  array: Item[],
  fn: (accumulator: Accumulator, item: Item, index: number, array: Item[]) => Promise<Accumulator>,
  initialValue: Accumulator,
): Promise<Accumulator> => {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i++) {
    accumulator = await fn(accumulator, array[i], i, array);
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
