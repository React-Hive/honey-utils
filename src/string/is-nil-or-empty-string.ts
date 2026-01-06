import { isNil } from '~/guards';

/**
 * Checks whether the provided value is considered "empty".
 *
 * A value is considered empty if it is:
 * - `null`
 * - `undefined`
 * - `''`
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is empty; otherwise, `false`.
 */
export const isNilOrEmptyString = (value: unknown): value is null | undefined =>
  value === '' || isNil(value);
