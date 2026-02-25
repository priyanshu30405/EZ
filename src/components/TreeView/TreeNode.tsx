import React, { useState } from "react";
import type { TreeNode, TreeNodeId } from "./TreeView.types";

export interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  onToggleExpand: (id: TreeNodeId) => void;
  onAddChild: (parentId: TreeNodeId) => void;
  onDelete: (id: TreeNodeId) => void;
  onRename: (id: TreeNodeId, label: string) => void;
  onDragStart: (id: TreeNodeId) => void;
  onDropOnNode: (targetId: TreeNodeId) => void;
  isDragging: boolean;
}

export const TreeNodeItem: React.FC<TreeNodeProps> = ({
  node,
  depth,
  onToggleExpand,
  onAddChild,
  onDelete,
  onRename,
  onDragStart,
  onDropOnNode,
  isDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftLabel, setDraftLabel] = useState(node.label);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmitRename = () => {
    const trimmedLabel = draftLabel.trim();
    if (trimmedLabel && trimmedLabel !== node.label) {
      onRename(node.id, trimmedLabel);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    const shouldDelete = window.confirm("Delete this node and all of its children?");
    if (shouldDelete) {
      onDelete(node.id);
    }
  };

  const handleDragStart = () => {
    onDragStart(node.id);
  };

  const handleDragOver: React.DragEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLLIElement> = () => {
    setIsDragOver(false);
  };

  const handleDrop: React.DragEventHandler<HTMLLIElement> = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    onDropOnNode(node.id);
  };

  const hasChildren = !!node.children?.length || node.hasLazyChildren;

  return (
    <li
      className={`tree-node-row ${isDragOver ? "drag-over" : ""}`}
      style={{ paddingLeft: depth === 0 ? 0 : 4 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        type="button"
        className={`tree-expander ${hasChildren ? "has-children" : ""}`}
        onClick={() => hasChildren && onToggleExpand(node.id)}
        aria-label={node.isExpanded ? "Collapse node" : "Expand node"}
      >
        {hasChildren ? (node.isExpanded ? "−" : "+") : ""}
      </button>

      <div className="tree-label">
        {isEditing ? (
          <input
            autoFocus
            value={draftLabel}
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={handleSubmitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmitRename();
              } else if (event.key === "Escape") {
                setDraftLabel(node.label);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span
            className={`tree-label-text ${isDragging ? "dragging" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onDoubleClick={() => setIsEditing(true)}
          >
            {node.label}
          </span>
        )}
      </div>

      <div className="tree-actions">
        <button type="button" onClick={() => onAddChild(node.id)}>
          +
        </button>
        <button type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

