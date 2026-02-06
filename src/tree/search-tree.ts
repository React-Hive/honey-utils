import type { KeysWithNonArrayValues, KeysWithStringValues } from '~/types';
import type { HoneyTreeFlatNode } from '~/tree';
import { assert, isNull, isUndefined } from '~/guards';
import { splitStringIntoWords } from '~/string';

/**
 * Performs a context-aware search over a flattened tree.
 *
 * Matching is applied to the provided string field (`nodeValueKey`) using
 * **case-insensitive, word-prefix comparison**:
 *
 * - The query is split into words
 * - Each query word must match the start of at least one word in the node value
 *
 * Unlike a simple filter, this function preserves hierarchical context:
 *
 * - When a nested node matches, all of its ancestor nodes are included, so the
 *   result remains navigable.
 * - When a root node matches, its full descendant subtree is included so the
 *   hierarchy stays intact.
 *
 * This makes the utility ideal for searchable tree-based UIs such as
 * TreeSelect components, folder pickers, nested menus, and grouped lists.
 *
 * @template OriginItem - Original node shape of the hierarchical structure.
 * @template ChildrenKey - Key of the removed nested children property.
 *
 * @param flatTree - Flat preorder list of tree nodes containing hierarchy metadata.
 * @param nodeIdKey - Key that uniquely identifies each node.
 * @param nodeValueKey - Key containing the searchable string value (e.g. `"name"`).
 * @param searchQuery - User input query. Split into words and matched by prefix.
 *
 * @returns A filtered flat list containing:
 * - all matching nodes
 * - their ancestor chain (for nested matches)
 * - full descendant subtrees (for root-level matches)
 *
 * @example
 * ```ts
 * const results = searchTree(flatTree, 'id', 'label', 'kit che');
 *
 * // Matches nodes where words start with "kit" and "che"
 * // (e.g. "Kitchen Chair"), including their parents.
 * ```
 *
 * @example
 * ```ts
 * // If a deep child matches, ancestors are included:
 * //
 * // Root
 * // └─ Category
 * //    └─ Item ← matches
 * //
 * // Result includes: Root, Category, Item
 * ```
 */
export const searchTree = <OriginItem extends object, ChildrenKey extends string>(
  flatTree: HoneyTreeFlatNode<OriginItem, ChildrenKey>[],
  nodeIdKey: KeysWithNonArrayValues<OriginItem>,
  nodeValueKey: KeysWithStringValues<OriginItem>,
  searchQuery: string,
) => {
  const searchWords = splitStringIntoWords(searchQuery.toLowerCase());
  if (!searchWords.length) {
    return flatTree;
  }

  const nodeIdToIndexMap = flatTree.reduce<Record<string, number>>((result, node, nodeIndex) => {
    // Map node id → index for fast ancestor lookup.
    result[node[nodeIdKey as never]] = nodeIndex;

    return result;
  }, {});

  return flatTree.reduce<HoneyTreeFlatNode<OriginItem, ChildrenKey>[]>((matchedNodes, node) => {
    const nodeValue = node[nodeValueKey as never];
    // If the item value is null, undefined or empty string
    if (!nodeValue) {
      return matchedNodes;
    }

    if (
      matchedNodes.some(matchedNode => matchedNode[nodeIdKey as never] === node[nodeIdKey as never])
    ) {
      return matchedNodes;
    }

    const nodeValueWords = splitStringIntoWords((nodeValue as string).toLowerCase());

    const isNodeMatched = searchWords.every(searchWord =>
      nodeValueWords.some(word => word.startsWith(searchWord)),
    );

    if (isNodeMatched) {
      if (isUndefined(node.parentId)) {
        matchedNodes.push(node);

        const insertNestedItems = (targetNode: HoneyTreeFlatNode<OriginItem, ChildrenKey>) => {
          if (!targetNode.childCount) {
            return;
          }

          flatTree.forEach(node => {
            if (node.parentId === targetNode[nodeIdKey as never]) {
              matchedNodes.push(node);

              insertNestedItems(node);
            }
          });
        };

        insertNestedItems(node);
      } else {
        const insertParentNodes = (targetNode: HoneyTreeFlatNode<OriginItem, ChildrenKey>) => {
          const parentNodeIndex = nodeIdToIndexMap[targetNode.parentId as never];
          const parentNode = flatTree[parentNodeIndex];

          if (!isUndefined(parentNode.parentId)) {
            insertParentNodes(parentNode);
          }

          const prevNodeParentId = matchedNodes.length
            ? matchedNodes[matchedNodes.length - 1].parentId
            : null;

          const shouldInsertParentNode =
            isNull(prevNodeParentId) || prevNodeParentId !== targetNode.parentId;

          if (shouldInsertParentNode) {
            assert(parentNode, '[@react-hive/honey-utils]: Parent node was not found.');

            matchedNodes.push(parentNode);
          }
        };

        insertParentNodes(node);

        matchedNodes.push(node);
      }
    }

    return matchedNodes;
  }, []);
};
