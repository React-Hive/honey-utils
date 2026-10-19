/**
 * `T` without the keys `definedProps` drops: a key that can only be `undefined` is gone, and one
 * that may be `undefined` becomes optional, as it is left out wherever its value is.
 */
export type DefinedProps<T extends object> = {
  [K in keyof T as T[K] extends undefined ? never : undefined extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as T[K] extends undefined ? never : undefined extends T[K] ? K : never]?: Exclude<
    T[K],
    undefined
  >;
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
export const definedProps = <T extends object>(obj: T): DefinedProps<T> => {
  const result: Record<PropertyKey, unknown> = {};

  Reflect.ownKeys(obj).forEach(key => {
    if (!Object.prototype.propertyIsEnumerable.call(obj, key)) {
      return;
    }

    const value = (obj as Record<PropertyKey, unknown>)[key];

    if (value !== undefined) {
      result[key] = value;
    }
  });

  return result as DefinedProps<T>;
};
