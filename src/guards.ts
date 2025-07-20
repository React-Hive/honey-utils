export const isString = (value: unknown): value is string => typeof value === 'string';

export const isNumber = (value: unknown): value is number => typeof value === 'number';

export const isBool = (value: unknown): value is boolean => typeof value === 'boolean';

export const isObject = (value: unknown): value is object => typeof value === 'object';

export const isFunction = (value: unknown) => typeof value === 'function';

export const isPromise = <T = unknown>(value: unknown): value is Promise<T> =>
  isFunction((value as Promise<T>)?.then);

/**
 * Checks if a value is null or undefined.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

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
