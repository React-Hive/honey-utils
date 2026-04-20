import { flattenTree } from '~/tree';

describe('[flattenTree]: flatten hierarchical trees', () => {
  type Item = {
    id: number;
    name: string;
    children?: Item[] | null;
  };

  it('should return an empty array for undefined input', () => {
    const items: Item[] | undefined = undefined;

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([]);
  });

  it('should return an empty array for an empty tree', () => {
    const items: Item[] = [];

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([]);
  });

  it('should flatten nodes in preorder and omit the children field', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: [
          {
            id: 2,
            name: 'Pear',
            children: [],
          },
          {
            id: 3,
            name: 'Banana',
            children: [],
          },
        ],
      },
    ];

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        childCount: 2,
      },
      {
        id: 2,
        name: 'Pear',
        parentId: 1,
        depthLevel: 1,
        childCount: 0,
      },
      {
        id: 3,
        name: 'Banana',
        parentId: 1,
        depthLevel: 1,
        childCount: 0,
      },
    ]);
  });

  it('should preserve parentId and depthLevel for deeply nested nodes', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: [
          {
            id: 2,
            name: 'Pear',
            children: [
              {
                id: 3,
                name: 'Banana',
                children: [
                  {
                    id: 4,
                    name: 'Mango',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        childCount: 1,
      },
      {
        id: 2,
        name: 'Pear',
        parentId: 1,
        depthLevel: 1,
        childCount: 1,
      },
      {
        id: 3,
        name: 'Banana',
        parentId: 2,
        depthLevel: 2,
        childCount: 1,
      },
      {
        id: 4,
        name: 'Mango',
        parentId: 3,
        depthLevel: 3,
        childCount: 0,
      },
    ]);
  });

  it('should treat missing children as leaf nodes', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
      },
      {
        id: 2,
        name: 'Banana',
      },
    ];

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        childCount: 0,
      },
      {
        id: 2,
        name: 'Banana',
        parentId: undefined,
        depthLevel: 0,
        childCount: 0,
      },
    ]);
  });

  it('should treat null or undefined children as empty child lists', () => {
    const items: Item[] = [
      {
        id: 1,
        name: 'Apple',
        children: undefined,
      },
      {
        id: 2,
        name: 'Banana',
        children: null,
      },
    ];

    const flatList = flattenTree(items, 'id', 'children');

    expect(flatList).toStrictEqual([
      {
        id: 1,
        name: 'Apple',
        parentId: undefined,
        depthLevel: 0,
        childCount: 0,
      },
      {
        id: 2,
        name: 'Banana',
        parentId: undefined,
        depthLevel: 0,
        childCount: 0,
      },
    ]);
  });
});
