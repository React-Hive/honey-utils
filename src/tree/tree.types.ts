import type { KeysWithNonArrayValues } from '~/types';

/**
 * A flattened representation of a node from a hierarchical tree structure.
 *
 * This type is produced when converting nested data (e.g. folders, categories,
 * grouped lists) into a flat array while preserving hierarchy metadata.
 *
 * The original nested children property (`ChildrenKey`) is removed, and each node is augmented with:
 *  - `parentId` — reference to the parent node (undefined for root nodes).
 *  - `depthLevel` — nesting depth, starting at `0`.
 *  - `childCount` — number of direct child nodes.
 *
 * This structure is ideal for rendering tree-based UIs (TreeSelect, menus, expandable lists)
 * and for performing operations such as searching, filtering, or reconstructing parent-child relationships.
 *
 * @template OriginItem - The original node shape from the hierarchical structure.
 * @template ChildrenKey - Key of the property that contains nested child nodes.
 */
export type HoneyTreeFlatNode<OriginItem extends object, ChildrenKey extends string> = Omit<
  OriginItem,
  ChildrenKey
> & {
  /**
   * Identifier of the parent node in the flattened structure.
   *
   * Root-level nodes have `parentId` set to `undefined`.
   */
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>] | undefined;
  /**
   * Depth of the node within the hierarchy.
   *
   * - `0` → root level
   * - `1` → direct child
   * - `2+` → deeper descendants
   */
  depthLevel: number;
  /**
   * Number of direct nested child nodes contained within this node.
   *
   * This value is `0` for leaf nodes.
   */
  childCount: number;
};
