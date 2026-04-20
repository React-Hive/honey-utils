import { getAdjacentItems } from '~/array';

interface Item {
  id: number;
  name: string;
}

describe('[getAdjacentItems]: basic behavior', () => {
  const items: Item[] = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
    { id: 3, name: 'Three' },
  ];

  const isSameItem = (item: Item, targetItem: Item) => item.id === targetItem.id;

  it('should return null values when target item is null', () => {
    expect(getAdjacentItems(items, null, isSameItem)).toEqual({
      previousItem: null,
      currentItem: null,
      nextItem: null,
    });
  });

  it('should return null values when target item is not found', () => {
    expect(getAdjacentItems(items, { id: 999, name: 'Missing' }, isSameItem)).toEqual({
      previousItem: null,
      currentItem: null,
      nextItem: null,
    });
  });

  it('should return null as previous item for the first item', () => {
    expect(getAdjacentItems(items, { id: 1, name: 'One' }, isSameItem)).toEqual({
      previousItem: null,
      currentItem: { id: 1, name: 'One' },
      nextItem: { id: 2, name: 'Two' },
    });
  });

  it('should return previous, current, and next items for an item in the middle', () => {
    expect(getAdjacentItems(items, { id: 2, name: 'Two' }, isSameItem)).toEqual({
      previousItem: { id: 1, name: 'One' },
      currentItem: { id: 2, name: 'Two' },
      nextItem: { id: 3, name: 'Three' },
    });
  });

  it('should return null as next item for the last item', () => {
    expect(getAdjacentItems(items, { id: 3, name: 'Three' }, isSameItem)).toEqual({
      previousItem: { id: 2, name: 'Two' },
      currentItem: { id: 3, name: 'Three' },
      nextItem: null,
    });
  });
});
