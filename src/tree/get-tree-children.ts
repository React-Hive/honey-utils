import type { KeysWithNonArrayValues } from '~/types';
import type { HoneyTreeFlatNode } from '~/tree';

/**
 * Returns the direct children of a given parent node from a flattened tree.
 *
 * This helper filters a flat tree representation (`HoneyTreeFlatNode`) and
 * selects only nodes whose `parentId` matches the provided identifier.
 *
 * ⚠️ Only direct children are returned - descendants at deeper levels are not included.
 *
 * An optional predicate may be provided to further narrow the result set
 * (e.g. filtering by depth, type, or custom node flags).
 *
 * @template OriginItem - Original node shape of the hierarchical structure.
 * @template ChildrenKey - Key of the removed nested children property.
 *
 * @param flatTree - Flat preorder list of tree nodes containing hierarchy metadata.
 * @param parentId - Identifier of the parent node whose direct children should be returned.
 * @param predicate - Optional additional filter applied to each matched child node.
 *
 * @returns An array of nodes that are direct children of the specified parent.
 *
 * @example
 * ```ts
 * const children = getTreeChildren(flatTree, 1);
 *
 * // Returns all nodes where parentId === 1
 * ```
 *
 * @example
 * ```ts
 * const shallowChildren = getTreeChildren(
 *   flatTree,
 *   1,
 *   node => node.depthLevel <= 2,
 * );
 *
 * // Returns only children of node 1 that satisfy the predicate.
 * ```
 */
export const getTreeChildren = <OriginItem extends object, ChildrenKey extends string>(
  flatTree: HoneyTreeFlatNode<OriginItem, ChildrenKey>[],
  parentId: OriginItem[KeysWithNonArrayValues<OriginItem>],
  predicate?: (node: HoneyTreeFlatNode<OriginItem, ChildrenKey>) => boolean,
) => flatTree.filter(node => node.parentId === parentId && (!predicate || predicate(node)));
