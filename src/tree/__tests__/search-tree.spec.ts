import type { HoneyTreeFlatNode } from '~/tree';
import { searchTree } from '~/tree';

describe('[searchTree]: search flattened trees with context', () => {
  type Item = {
    id: number;
    name: string;
    children?: Item[] | null;
  };

  const items1: HoneyTreeFlatNode<Item, 'children'>[] = [
    {
      id: 1,
      name: 'Apple',
      parentId: undefined,
      childCount: 0,
      depthLevel: 0,
    },
    {
      id: 2,
      name: 'Pear',
      parentId: undefined,
      childCount: 0,
      depthLevel: 0,
    },
  ];

  const items2: HoneyTreeFlatNode<Item, 'children'>[] = [
    {
      id: 1,
      name: 'Apple',
      parentId: undefined,
      childCount: 0,
      depthLevel: 0,
    },
    {
      id: 2,
      name: 'Pear',
      parentId: undefined,
      childCount: 1,
      depthLevel: 0,
    },
    {
      id: 3,
      name: 'Banana',
      parentId: 2,
      childCount: 1,
      depthLevel: 1,
    },
    {
      id: 4,
      name: 'Pineapple',
      parentId: 3,
      childCount: 0,
      depthLevel: 2,
    },
  ];

  it('should return an empty array when the flat tree is empty', () => {
    const items: HoneyTreeFlatNode<Item, 'children'>[] = [];

    expect(searchTree(items, 'id', 'name', '')).toEqual([]);
  });

  it('should return the full tree when the query is empty', () => {
    expect(searchTree(items1, 'id', 'name', '')).toEqual(items1);
  });

  it('should match nodes by case-insensitive prefix search', () => {
    expect(searchTree(items1, 'id', 'name', 'App')).toEqual([items1[0]]);
  });

  it('should include ancestor nodes when a nested match is found', () => {
    expect(searchTree(items2, 'id', 'name', 'Banana')).toEqual([items2[1], items2[2]]);
  });

  it('should include the full ancestor chain for deep matches', () => {
    expect(searchTree(items2, 'id', 'name', 'Pine')).toEqual([items2[1], items2[2], items2[3]]);
  });

  it('should include the full subtree when a root node matches', () => {
    expect(searchTree(items2, 'id', 'name', 'Pear')).toEqual([items2[1], items2[2], items2[3]]);
  });
});
