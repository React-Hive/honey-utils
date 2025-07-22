export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Checks if a value is null.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is null; otherwise, `false`.
 */
export const isNull = (value: unknown): value is null => value === null;

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

/**
 * Checks if a value is neither `null` nor `undefined`.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is defined (not `null` or `undefined`); otherwise, `false`.
 */
export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== null && value !== undefined;

/**
 * Checks if a value is a string.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a string; otherwise, `false`.
 */
export const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Checks if a value is a number.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a number; otherwise, `false`.
 */
export const isNumber = (value: unknown): value is number => typeof value === 'number';

/**
 * Checks if a value is a boolean.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a boolean; otherwise, `false`.
 */
export const isBool = (value: unknown): value is boolean => typeof value === 'boolean';

/**
 * Checks if a value is an object.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an object; otherwise, `false`.
 */
export const isObject = (value: unknown): value is object => typeof value === 'object';

/**
 * Checks if a value is an empty object (no own enumerable properties).
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an empty object; otherwise, `false`.
 */
export const isEmptyObject = (value: unknown): value is Record<string, never> =>
  isObject(value) && !isNull(value) && Object.keys(value).length === 0;

/**
 * Checks if a value is an array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an array; otherwise, `false`.
 */
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

/**
 * Checks if a value is an empty array.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an empty array; otherwise, `false`.
 */
export const isEmptyArray = (value: unknown): value is [] => isArray(value) && value.length === 0;

/**
 * Checks if a value is a function.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a function; otherwise, `false`.
 */
export const isFunction = (value: unknown) => typeof value === 'function';

/**
 * Checks if a value is a Promise.
 *
 * @template T - The type of the value that the Promise resolves to.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a Promise; otherwise, `false`.
 */
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> =>
  isFunction((value as Promise<T>)?.then);

/**
 * Checks if a value is a Date object.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a Date object; otherwise, `false`.
 */
export const isDate = (value: unknown): value is Date => value instanceof Date;

/**
 * Checks if a value is a valid Date object (not Invalid Date).
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a valid Date object; otherwise, `false`.
 */
export const isValidDate = (value: unknown): value is Date =>
  isDate(value) && !isNaN(value.getTime());

/**
 * Checks if a value is a RegExp object.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a RegExp object; otherwise, `false`.
 */
export const isRegExp = (value: unknown): value is RegExp => value instanceof RegExp;

/**
 * Checks if a value is a Map.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a Map; otherwise, `false`.
 */
export const isMap = (value: unknown): value is Map<unknown, unknown> => value instanceof Map;

/**
 * Checks if a value is a Set.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a Set; otherwise, `false`.
 */
export const isSet = (value: unknown): value is Set<unknown> => value instanceof Set;

/**
 * Checks if a value is a Symbol.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a Symbol; otherwise, `false`.
 */
export const isSymbol = (value: unknown): value is symbol => typeof value === 'symbol';

/**
 * Checks if a value is undefined.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is undefined; otherwise, `false`.
 */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/**
 * Checks if a value is a finite number.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a finite number; otherwise, `false`.
 */
export const isFiniteNumber = (value: unknown): value is number =>
  isNumber(value) && isFinite(value);

/**
 * Checks if a value is an integer.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is an integer; otherwise, `false`.
 */
export const isInteger = (value: unknown): value is number =>
  isNumber(value) && Number.isInteger(value);
