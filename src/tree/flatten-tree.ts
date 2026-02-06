import type { KeysWithArrayValues, KeysWithNonArrayValues } from '~/types';
import type { HoneyTreeFlatNode } from '~/tree';

/**
 * Flattens a hierarchical tree into a single preorder array.
 *
 * Each node in the returned list is stripped of its nested children property
 * (`childrenKey`) and enriched with hierarchy metadata:
 *
 * - `parentId` — identifier of the parent node (`undefined` for roots)
 * - `depthLevel` — nesting depth starting at `0`
 * - `childCount` — number of direct child nodes
 *
 * The flattening order is **preorder**, meaning parents always appear before
 * their descendants. This representation is especially useful for rendering
 * tree-based UIs such as TreeSelect components, nested menus, and folder pickers.
 *
 * @template OriginItem - Original node shape of the hierarchical structure.
 *
 * @param items - Root-level nodes to flatten. If undefined, an empty array is returned.
 * @param nodeIdKey - Key that uniquely identifies each node.
 * @param childrenKey - Key containing the nested child node array.
 *
 * @param flatTree - Internal accumulator used during recursion.
 * @param parentId - Parent identifier for the current recursion level.
 * @param depthLevel - Current depth level, where `0` represents the root.
 *
 * @returns A flat preorder list of tree nodes with hierarchy metadata attached,
 *          excluding the original children property.
 *
 * @example
 * ```ts
 * const tree = [
 *   {
 *     id: 1,
 *     name: 'Root',
 *     children: [{ id: 2, name: 'Child', children: [] }],
 *   },
 * ];
 *
 * const flatTree = flattenTree(tree, 'id', 'children');
 *
 * // [
 * //   { id: 1, name: 'Root', parentId: undefined, depthLevel: 0, childCount: 1 },
 * //   { id: 2, name: 'Child', parentId: 1, depthLevel: 1, childCount: 0 }
 * // ]
 * ```
 */
export const flattenTree = <OriginItem extends object>(
  items: OriginItem[] | undefined,
  nodeIdKey: KeysWithNonArrayValues<OriginItem>,
  childrenKey: KeysWithArrayValues<OriginItem>,
  ///
  flatTree: HoneyTreeFlatNode<OriginItem, typeof childrenKey>[] = [],
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>] | undefined = undefined,
  depthLevel = 0,
): HoneyTreeFlatNode<OriginItem, typeof childrenKey>[] => {
  items?.forEach(item => {
    const { [childrenKey]: _, ...nodeData } = item;

    const children = item[childrenKey];
    const hasChildrenArray = Array.isArray(children);

    flatTree.push({
      ...nodeData,
      parentId,
      depthLevel,
      childCount: hasChildrenArray ? children.length : 0,
    });

    if (hasChildrenArray) {
      const parentId = item[nodeIdKey];

      flattenTree(children, nodeIdKey, childrenKey, flatTree, parentId, depthLevel + 1);
    }
  });

  return flatTree;
};
