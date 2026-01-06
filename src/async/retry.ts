import { delay } from '~/async';

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
