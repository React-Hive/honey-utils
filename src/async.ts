import { boolFilter } from './array';

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
 */
export const runParallel = async <Item, Result>(
  array: Item[],
  fn: (item: Item, index: number, array: Item[]) => Promise<Result>,
): Promise<Result[]> => Promise.all(array.map(fn));

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
  const results = await runParallel(array, async (item, index, array) =>
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
