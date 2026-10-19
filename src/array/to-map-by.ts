/**
 * Indexes an array by a key: a `Map` from each item's key to the item itself.
 *
 * Items are added in order, so where two share a key the later one wins, as with
 * `new Map(entries)`.
 *
 * @template Item - The type of the items in the array.
 * @template Key - The type of the keys.
 *
 * @param items - The items to index.
 * @param getKey - Returns the key an item is stored under.
 *
 * @returns A new `Map` from each key to its item.
 *
 * @example
 * ```ts
 * const users = [{ id: 'u1', name: 'Ann' }, { id: 'u2', name: 'Bob' }];
 *
 * toMapBy(users, user => user.id);
 * // Map { 'u1' => { id: 'u1', name: 'Ann' }, 'u2' => { id: 'u2', name: 'Bob' } }
 * ```
 */
export function toMapBy<Item, Key>(
  items: readonly Item[],
  getKey: (item: Item, index: number) => Key,
): Map<Key, Item>;

/**
 * Indexes an array by a key: a `Map` from each item's key to what `getValue` returns for the item.
 *
 * Items are added in order, so where two share a key the later one wins, as with
 * `new Map(entries)`.
 *
 * @template Item - The type of the items in the array.
 * @template Key - The type of the keys.
 * @template Value - The type of the values.
 *
 * @param items - The items to index.
 * @param getKey - Returns the key an item is stored under.
 * @param getValue - Returns the value stored for an item.
 *
 * @returns A new `Map` from each key to its value.
 *
 * @example
 * ```ts
 * const users = [{ id: 'u1', name: 'Ann' }, { id: 'u2', name: 'Bob' }];
 *
 * toMapBy(users, user => user.id, user => user.name);
 * // Map { 'u1' => 'Ann', 'u2' => 'Bob' }
 * ```
 */
export function toMapBy<Item, Key, Value>(
  items: readonly Item[],
  getKey: (item: Item, index: number) => Key,
  getValue: (item: Item, index: number) => Value,
): Map<Key, Value>;

/**
 * Overloaded rather than given a default `Value`, which TypeScript would take from whatever type the
 * result is assigned to - so a map of items could be declared a map of anything.
 */
export function toMapBy<Item, Key, Value>(
  items: readonly Item[],
  getKey: (item: Item, index: number) => Key,
  getValue?: (item: Item, index: number) => Value,
): Map<Key, Item | Value> {
  const map = new Map<Key, Item | Value>();

  items.forEach((item, index) => {
    map.set(getKey(item, index), getValue ? getValue(item, index) : item);
  });

  return map;
}
