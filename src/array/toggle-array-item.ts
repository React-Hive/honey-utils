import { difference } from './difference';

/**
 * Adds an item to an array or removes it from the array, without changing the source array.
 *
 * With `isIncluded` given, the item ends up in the array or out of it as asked - what a checkbox
 * in a list of them reports. Without it, the item's presence is flipped.
 *
 * The source array itself is returned when it already is as asked, and an item already present is
 * never added a second time. Items are matched as `includes()` matches them.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - The source array.
 * @param item - The item to add or remove.
 * @param isIncluded - Whether the item should be in the array. Flips its presence when omitted.
 *
 * @returns The array with the item in it or out of it.
 *
 * @example
 * ```ts
 * toggleArrayItem(['a', 'b'], 'c', true); // ['a', 'b', 'c']
 * toggleArrayItem(['a', 'b'], 'b', false); // ['a']
 * toggleArrayItem(['a', 'b'], 'a'); // ['b']
 * toggleArrayItem(['a', 'b'], 'c'); // ['a', 'b', 'c']
 * ```
 */
export const toggleArrayItem = <T>(array: T[], item: T, isIncluded?: boolean): T[] => {
  const isPresent = array.includes(item);

  if (isPresent === (isIncluded ?? !isPresent)) {
    return array;
  }

  return isPresent ? difference(array, [item]) : [...array, item];
};
