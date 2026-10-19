import type { HoneyTreeFlatNode } from '~/tree';
import { flattenTree, getTreeChildren } from '~/tree';

describe('[getTreeChildren]: direct children of a node in a flattened tree', () => {
  type Item = {
    id: number;
    name: string;
    children?: Item[] | null;
  };

  const flatTree: HoneyTreeFlatNode<Item, 'children'>[] = [
    {
      id: 1,
      name: 'Fruits',
      parentId: undefined,
      depthLevel: 0,
      childCount: 2,
    },
    {
      id: 2,
      name: 'Apple',
      parentId: 1,
      depthLevel: 1,
      childCount: 0,
    },
    {
      id: 3,
      name: 'Pear',
      parentId: 1,
      depthLevel: 1,
      childCount: 1,
    },
    {
      id: 4,
      name: 'Conference',
      parentId: 3,
      depthLevel: 2,
      childCount: 0,
    },
    {
      id: 5,
      name: 'Vegetables',
      parentId: undefined,
      depthLevel: 0,
      childCount: 1,
    },
    {
      id: 6,
      name: 'Carrot',
      parentId: 5,
      depthLevel: 1,
      childCount: 0,
    },
  ];

  it('should return the direct children of a node in tree order', () => {
    const children = getTreeChildren(flatTree, 1);

    expect(children).toStrictEqual([flatTree[1], flatTree[2]]);
  });

  it('should return the nodes themselves, not copies', () => {
    const children = getTreeChildren(flatTree, 5);

    expect(children).toHaveLength(1);
    expect(children[0]).toBe(flatTree[5]);
  });

  it('should leave out deeper descendants', () => {
    const children = getTreeChildren(flatTree, 1);

    expect(children.map(node => node.name)).not.toContain('Conference');
  });

  it('should return the children of a nested node', () => {
    const children = getTreeChildren(flatTree, 3);

    expect(children).toStrictEqual([flatTree[3]]);
  });

  it('should return an empty array for a leaf node', () => {
    expect(getTreeChildren(flatTree, 2)).toStrictEqual([]);
  });

  it('should return an empty array for an id that is not in the tree', () => {
    expect(getTreeChildren(flatTree, 99)).toStrictEqual([]);
  });

  it('should return an empty array for an empty tree', () => {
    const items: HoneyTreeFlatNode<Item, 'children'>[] = [];

    expect(getTreeChildren(items, 1)).toStrictEqual([]);
  });

  it('should match the parent id strictly', () => {
    expect(getTreeChildren(flatTree, '1')).toStrictEqual([]);
  });

  it('should keep only the children the predicate accepts', () => {
    const children = getTreeChildren(flatTree, 1, node => node.childCount > 0);

    expect(children).toStrictEqual([flatTree[2]]);
  });

  it('should return an empty array when the predicate accepts no child', () => {
    expect(getTreeChildren(flatTree, 1, () => false)).toStrictEqual([]);
  });

  it('should call the predicate with the direct children alone', () => {
    const predicate = vi.fn(() => true);

    getTreeChildren(flatTree, 1, predicate);

    expect(predicate).toHaveBeenCalledTimes(2);
    expect(predicate).toHaveBeenNthCalledWith(1, flatTree[1]);
    expect(predicate).toHaveBeenNthCalledWith(2, flatTree[2]);
  });

  it('should find the children in a tree flattened by flattenTree', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Fruits',
        children: [
          { id: 2, name: 'Apple', children: [] },
          { id: 3, name: 'Pear', children: [{ id: 4, name: 'Conference' }] },
        ],
      },
    ];

    const children = getTreeChildren(flattenTree(items, 'id', 'children'), 3);

    expect(children).toStrictEqual([
      {
        id: 4,
        name: 'Conference',
        parentId: 3,
        depthLevel: 2,
        childCount: 0,
      },
    ]);
  });

  it('should return a new array and leave the tree as it was', () => {
    const tree = [...flatTree];

    const children = getTreeChildren(tree, 1);

    expect(children).not.toBe(tree);
    expect(tree).toStrictEqual(flatTree);
  });
});
