import type { Nullable } from '~/types';

export interface AdjacentItems<T> {
  previousItem: Nullable<T>;
  currentItem: Nullable<T>;
  nextItem: Nullable<T>;
}

/**
 * Returns previous, current, and next items for the matched item.
 *
 * @param items - Source items.
 * @param targetItem - Item to find in the source array.
 * @param isSameItem - Comparator used to match items.
 *
 * @returns Adjacent items around the matched item.
 */
export const getAdjacentItems = <T>(
  items: Nullable<T[]> | undefined,
  targetItem: Nullable<T> | undefined,
  isSameItem: (item: T, targetItem: T) => boolean,
): AdjacentItems<T> => {
  if (!items?.length || !targetItem) {
    return {
      previousItem: null,
      currentItem: null,
      nextItem: null,
    };
  }

  const currentItemIndex = items.findIndex(item => isSameItem(item, targetItem));

  if (currentItemIndex === -1) {
    return {
      previousItem: null,
      currentItem: null,
      nextItem: null,
    };
  }

  return {
    previousItem: currentItemIndex > 0 ? items[currentItemIndex - 1] : null,
    currentItem: items[currentItemIndex],
    nextItem: currentItemIndex < items.length - 1 ? items[currentItemIndex + 1] : null,
  };
};
