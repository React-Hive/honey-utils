import type { Nullable, TimeoutId } from './types';

export const noop = () => {};

/**
 * Checks if a value is a function.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a function; otherwise, `false`.
 */
export const isFunction = (value: unknown) => typeof value === 'function';

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
 * Invokes the given input if it is a function, passing the provided arguments.
 * Otherwise, returns the input as-is.
 *
 * @template Args - Tuple of argument types to pass to the function.
 * @template Result - Return type of the function or the value.
 *
 * @param input - A function to invoke with `args`, or a direct value of type `Result`.
 * @param args - Arguments to pass if `input` is a function.
 *
 * @returns The result of invoking the function, or the original value if it's not a function.
 */
export const invokeIfFunction = <Args extends unknown[], Result>(
  input: ((...args: Args) => Result) | Result,
  ...args: Args
): Result => (typeof input === 'function' ? (input as (...args: Args) => Result)(...args) : input);

/**
 * Creates a promise that resolves after the specified delay.
 *
 * Useful for creating artificial delays, implementing timeouts, or spacing operations.
 *
 * @param delayMs - The delay in milliseconds.
 *
 * @returns A promise that resolves after the specified delay.
 *
 * @example
 * ```ts
 * // Wait for 1 second
 * await delay(1000);
 * console.log('This logs after 1 second');
 *
 * // Use with other async operations
 * const fetchWithTimeout = async () => {
 *   const timeoutPromise = delay(5000).then(() => {
 *     throw new Error('Request timed out');
 *   });
 *
 *   return Promise.race([fetchData(), timeoutPromise]);
 * }
 * ```
 */
export const delay = (delayMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, delayMs));

/**
 * Wraps a promise with a timeout. If the promise does not settle within the specified time,
 * it will reject with a timeout error.
 *
 * @template T - The type of the promise result.
 *
 * @param promise - The promise to wrap.
 * @param timeoutMs - Timeout duration in milliseconds.
 * @param errorMessage - Optional custom error message.
 *
 * @returns A promise that resolves or rejects with the original promise,
 *          or rejects with a timeout error if the duration is exceeded.
 *
 * @example
 * ```ts
 * // Rejects if fetch takes longer than 3 seconds
 * const response = await timeout(fetch('/api/data'), 3000);
 *
 * // With custom message
 * await timeout(fetchData(), 2000, 'Too long');
 * ```
 */
export const timeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out',
): Promise<T> => {
  const timeoutId: Nullable<TimeoutId> = null;

  try {
    return await Promise.race([
      promise,
      delay(timeoutMs).then(() => Promise.reject(new Error(errorMessage))),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

interface RetryOptions {
  /**
   * Maximum number of retry attempts before failing.
   *
   * @default 3
   */
  maxAttempts?: number;
  /**
   * Delay in milliseconds between retry attempts.
   * If `backoff` is true, this is the base delay for exponential backoff.
   *
   * @default 300
   */
  delayMs?: number;
  /**
   * Whether to use exponential backoff for delays between attempts.
   * When enabled, the delay is multiplied by 2 ^ (`attempt` - 1).
   *
   * @default true
   */
  backoff?: boolean;
  /**
   * Optional callback triggered before each retry attempt.
   *
   * @param attempt - The current attempt number (starting from 1).
   * @param error - The error that caused the retry.
   */
  onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * Wraps an asynchronous function with retry logic.
 *
 * The returned function will attempt to call the original function up to `maxAttempts` times,
 * with a delay between retries. If all attempts fail, the last encountered error is thrown.
 *
 * Useful for operations that may fail intermittently, such as network requests.
 *
 * @template Task - The type of the async function to wrap.
 * @template TaskResult - The result type of the async function.
 *
 * @param task - The async function to wrap with retry logic.
 * @param options - Configuration options for retry behavior.
 *
 * @returns A function that wraps the original function with retry support.
 *
 * @example
 * ```ts
 * async function fetchData() {
 *   const response = await fetch('/api/data');
 *
 *   if (!response.ok) {
 *    throw new Error('Network error');
 *   }
 *
 *   return await response.json();
 * }
 *
 * const fetchWithRetry = retry(fetchData, {
 *   maxAttempts: 5,
 *   delayMs: 500,
 *   onRetry: (attempt, error) => {
 *     console.warn(`Attempt ${attempt} failed:`, error);
 *   }
 * });
 *
 * fetchWithRetry()
 *   .then(data => console.log('Success:', data))
 *   .catch(error => console.error('Failed after retries:', error));
 * ```
 */
export const retry = <Task extends (...args: unknown[]) => Promise<TaskResult>, TaskResult>(
  task: Task,
  { maxAttempts = 3, delayMs = 300, backoff = true, onRetry }: RetryOptions = {},
): ((...args: Parameters<Task>) => Promise<TaskResult>) => {
  return async (...args: Parameters<Task>): Promise<TaskResult> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await task(...args);
      } catch (e) {
        lastError = e;

        if (attempt < maxAttempts) {
          onRetry?.(attempt, e);

          const delayTime = backoff ? delayMs * 2 ** (attempt - 1) : delayMs;
          await delay(delayTime);
        }
      }
    }

    throw lastError;
  };
};

/**
 * Wraps a function so that it can only be executed once.
 * The wrapped function remembers (caches) the result of the first invocation
 * and returns that same result for all subsequent calls, regardless of the arguments provided.
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

  return function (this: any, ...args: Parameters<T>) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }

    return result;
  } as T;
};
