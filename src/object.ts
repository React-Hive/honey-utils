export type DefinedProps<T extends object> = {
  [K in keyof T as T[K] extends undefined ? never : K]: Exclude<T[K], undefined>;
};

/**
 * Create a new object by removing properties whose values are `undefined`.
 *
 * Example:
 * ```ts
 * definedProps({ a: 1, b: undefined, c: 'x' });
 * // -> { a: number; c: string }
 * ```
 *
 * @template T - Input object shape.
 *
 * @param obj - The source object to clean.
 *
 * @returns A new object containing only keys whose runtime values are not `undefined`.
 */
export const definedProps = <T extends object>(obj: T): DefinedProps<T> =>
  Object.entries(obj).reduce((result, [key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }

    return result;
  }, {} as any);
