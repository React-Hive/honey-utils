import { isArray } from '~/array';
import { isDate, isError, isMap, isObject, isRegExp, isSet } from '~/guards';

/**
 * The pairs of objects a comparison is in the middle of, each object of the first value mapped to
 * those of the second it is being compared with.
 */
type ComparedPairs = WeakMap<object, WeakSet<object>>;

/**
 * `SameValueZero`, as `Array.prototype.includes` and `Map` compare: `===`, but `NaN` equal to itself.
 */
const isSameValueZero = (a: unknown, b: unknown): boolean =>
  a === b || (Number.isNaN(a) && Number.isNaN(b));

/**
 * The bytes of an `ArrayBuffer`, a typed array or a `DataView` - only those it views.
 */
const toBytes = (value: ArrayBuffer | ArrayBufferView): Uint8Array =>
  ArrayBuffer.isView(value)
    ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
    : new Uint8Array(value);

const isEqualWithin = (a: unknown, b: unknown, comparing: ComparedPairs): boolean => {
  if (isSameValueZero(a, b)) {
    return true;
  }

  if (!isObject(a) || !isObject(b) || Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  const pairs = comparing.get(a) ?? new WeakSet<object>();

  // A pair met again further down a circular structure holds as far as it has been compared
  if (pairs.has(b)) {
    return true;
  }

  comparing.set(a, pairs.add(b));

  if (isDate(a)) {
    return isSameValueZero(a.getTime(), (b as Date).getTime());
  }

  if (isRegExp(a)) {
    return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;
  }

  if (isMap(a)) {
    const other = b as Map<unknown, unknown>;

    return (
      a.size === other.size &&
      [...a].every(
        ([key, value]) => other.has(key) && isEqualWithin(value, other.get(key), comparing),
      )
    );
  }

  if (isSet(a)) {
    const other = b as Set<unknown>;

    return a.size === other.size && [...a].every(value => other.has(value));
  }

  if (a instanceof ArrayBuffer || ArrayBuffer.isView(a)) {
    const aBytes = toBytes(a);
    const bBytes = toBytes(b as ArrayBuffer | ArrayBufferView);

    return aBytes.length === bBytes.length && aBytes.every((byte, index) => byte === bBytes[index]);
  }

  if (isArray(a)) {
    const other = b as unknown[];

    return (
      a.length === other.length &&
      a.every((item, index) => isEqualWithin(item, other[index], comparing))
    );
  }

  if (isError(a) && (a.name !== (b as Error).name || a.message !== (b as Error).message)) {
    return false;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return (
    aKeys.length === bKeys.length &&
    aKeys.every(
      key =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        isEqualWithin(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
          comparing,
        ),
    )
  );
};

/**
 * Whether two values are equal in what they hold rather than in identity - a value worked out
 * again against the one stored, say, to write it only where it changed.
 *
 * - Primitives compare as `SameValueZero`: `===`, but `NaN` equal to `NaN`, and `0` to `-0`.
 * - Objects compare only with objects of the same prototype - an array never equals a plain object
 *   with the same keys, nor an instance of one class an instance of another.
 * - Arrays compare item by item, in order.
 * - Plain objects and class instances compare by their own enumerable string keys, in any order: a
 *   key holding `undefined` is not the same as a key left out.
 * - A `Date` compares by its time, a `RegExp` by its source and flags, an `Error` by its name and
 *   message as well as its keys, and an `ArrayBuffer`, a typed array or a `DataView` by its bytes.
 * - A `Map` compares by size and, for each key - found as the map finds it - its value. A `Set`
 *   compares by size and its members, found as the set finds them, so objects among them by
 *   identity.
 * - Functions, symbols and every other value compare by identity.
 *
 * A circular structure is compared without recursing forever.
 *
 * @param a - The first value.
 * @param b - The second value.
 *
 * @returns `true` where the two hold the same; otherwise, `false`.
 *
 * @example
 * ```ts
 * isEqual({ a: [1, { b: 2 }], c: null }, { c: null, a: [1, { b: 2 }] });
 * // -> true
 *
 * isEqual({ a: undefined }, {});
 * // -> false
 *
 * isEqual(new Date(0), new Date(0));
 * // -> true
 * ```
 */
export const isEqual = (a: unknown, b: unknown): boolean => isEqualWithin(a, b, new WeakMap());
