import type { Nullable, TimeoutId } from '~/types';
import { delay } from '~/async';

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
