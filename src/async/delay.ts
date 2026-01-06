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
