import React, { useState } from "react";
import "./tree.css";
import type { TreeNode, TreeNodeId } from "./TreeView.types";
import { initialTreeData, loadChildrenForNode } from "./mockTreeData";
import { TreeNodeItem } from "./TreeNode";

// Update a single node in the tree and return a new tree array.
function updateNode(
  nodes: TreeNode[],
  targetId: TreeNodeId,
  updater: (node: TreeNode) => TreeNode
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: updateNode(node.children, targetId, updater)
      };
    }
    return node;
  });
}

// Remove a node (and its children) from the tree.
function deleteNode(nodes: TreeNode[], targetId: TreeNodeId): TreeNode[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) =>
      node.children
        ? {
            ...node,
            children: deleteNode(node.children, targetId)
          }
        : node
    );
}

// Walk the tree and return the first node and its parent for a given id.
function findNodeAndParent(
  nodes: TreeNode[],
  targetId: TreeNodeId,
  parent: TreeNode | null = null
): { node: TreeNode; parent: TreeNode | null } | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return { node, parent };
    }
    if (node.children) {
      const found = findNodeAndParent(node.children, targetId, node);
      if (found) return found;
    }
  }
  return null;
}

function isDescendant(nodes: TreeNode[], potentialAncestorId: TreeNodeId, childId: TreeNodeId): boolean {
  const found = findNodeAndParent(nodes, childId);
  if (!found) return false;
  let currentParent = found.parent;
  while (currentParent) {
    if (currentParent.id === potentialAncestorId) return true;
    const wrapper = findNodeAndParent(nodes, currentParent.id);
    currentParent = wrapper?.parent ?? null;
  }
  return false;
}

// Move a node so it becomes a child of the target node.
function moveNode(
  nodes: TreeNode[],
  draggedId: TreeNodeId,
  dropTargetId: TreeNodeId
): TreeNode[] {
  if (draggedId === dropTargetId || isDescendant(nodes, draggedId, dropTargetId)) {
    return nodes;
  }

  const foundSource = findNodeAndParent(nodes, draggedId);
  if (!foundSource) return nodes;

  const sourceNode = foundSource.node;

  const withoutSource = deleteNode(nodes, draggedId);

  const insertAsChild = (targetNode: TreeNode): TreeNode => {
    const children = targetNode.children ?? [];
    return {
      ...targetNode,
      isExpanded: true,
      children: [...children, sourceNode]
    };
  };

  return updateNode(withoutSource, dropTargetId, insertAsChild);
}

export const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialTreeData);
  const [draggingNodeId, setDraggingNodeId] = useState<TreeNodeId | null>(null);

  const handleToggleExpand = (nodeId: TreeNodeId) => {
    let shouldLoadChildren = false;

    setTreeData((previousTree) =>
      updateNode(previousTree, nodeId, (node) => {
        const isExpanding = !node.isExpanded;

        if (
          isExpanding &&
          node.hasLazyChildren &&
          !node.children &&
          !node.isLoading
        ) {
          shouldLoadChildren = true;
          return {
            ...node,
            isExpanded: true,
            isLoading: true
          };
        }

        return {
          ...node,
          isExpanded: isExpanding
        };
      })
    );

    if (shouldLoadChildren) {
          loadChildrenForNode(nodeId).then((children) => {
        setTreeData((previousTree) =>
          updateNode(previousTree, nodeId, (node) => ({
            ...node,
            isLoading: false,
            hasLazyChildren: false,
            children
          }))
        );
      });
    }
  };

  const handleAddChild = (parentId: TreeNodeId) => {
    const label = window.prompt("Enter name for new node:");
    if (!label) return;
    const newNode: TreeNode = {
      id: `${parentId}-${Date.now()}`,
      label: label.trim()
    };
    setTreeData((previousTree) =>
      updateNode(previousTree, parentId, (node) => {
        const children = node.children ?? [];
        return {
          ...node,
          isExpanded: true,
          children: [...children, newNode]
        };
      })
    );
  };

  const handleDeleteNode = (nodeId: TreeNodeId) => {
    setTreeData((previousTree) => deleteNode(previousTree, nodeId));
  };

  const handleRenameNode = (nodeId: TreeNodeId, label: string) => {
    setTreeData((previousTree) =>
      updateNode(previousTree, nodeId, (node) => ({
        ...node,
        label
      }))
    );
  };

  const handleDragStart = (nodeId: TreeNodeId) => {
    setDraggingNodeId(nodeId);
  };

  const handleDropOnNode = (dropTargetId: TreeNodeId) => {
    if (!draggingNodeId) return;
    setTreeData((previousTree) => moveNode(previousTree, draggingNodeId, dropTargetId));
    setDraggingNodeId(null);
  };

  const renderNodes = (nodes: TreeNode[], depth: number) => {
    if (!nodes.length) {
      return <div className="tree-empty">No nodes</div>;
    }

    return (
      <ul className={depth === 0 ? "tree-list" : "tree-children"}>
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <TreeNodeItem
              node={node}
              depth={depth}
              onToggleExpand={handleToggleExpand}
              onAddChild={handleAddChild}
              onDelete={handleDeleteNode}
              onRename={handleRenameNode}
              onDragStart={handleDragStart}
              onDropOnNode={handleDropOnNode}
              isDragging={draggingNodeId === node.id}
            />
            {node.isExpanded && node.children && node.children.length > 0 && renderNodes(node.children, depth + 1)}
            {node.isExpanded && node.isLoading && (
              <div className="tree-loading">Loading children…</div>
            )}
          </React.Fragment>
        ))}
      </ul>
    );
  };

  return (
    <div className="tree-root">
      <div className="tree-toolbar">
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Double-click a node to rename, drag labels to move.
        </span>
        <button
          type="button"
          onClick={() =>
            setTreeData((previousTree) =>
              previousTree.map((node) => ({ ...node, isExpanded: true }))
            )
          }
        >
          Expand All
        </button>
      </div>
      {renderNodes(treeData, 0)}
    </div>
  );
};

