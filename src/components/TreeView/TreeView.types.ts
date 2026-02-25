export type TreeNodeId = string;

export interface TreeNode {
  id: TreeNodeId;
  label: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isLoading?: boolean;
  /**
   * When true, children will be loaded lazily the first time
   * the node is expanded.
   */
  hasLazyChildren?: boolean;
}

