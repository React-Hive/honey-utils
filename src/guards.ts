export const isString = (value: unknown): value is string => typeof value === 'string';

export const isObject = (value: unknown): value is object => typeof value === 'object';

export const isFunction = (value: unknown) => typeof value === 'function';

/**
 * Checks if a value is null or undefined.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;
