import type { TreeNode } from "./TreeView.types";

export const initialTreeData: TreeNode[] = [
  {
    id: "node-a",
    label: "Level A",
    isExpanded: true,
    children: [
      {
        id: "node-b-1",
        label: "Level B",
        hasLazyChildren: true
      },
      {
        id: "node-b-2",
        label: "Level B",
        isExpanded: false,
        children: [
          {
            id: "node-c-1",
            label: "Level C",
            hasLazyChildren: true
          }
        ]
      }
    ]
  },
  {
    id: "node-root-b",
    label: "Level A (Secondary)",
    hasLazyChildren: true
  }
];

/**
 * Simulate an async API call that loads children for a given node id.
 * In a real app this would fetch from an API.
 */
export function loadChildrenForNode(nodeId: string): Promise<TreeNode[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const suffix = nodeId.split("-").slice(-1)[0].toUpperCase();
      const levelLabel = "Level " + String.fromCharCode(suffix.charCodeAt(0) + 1);

      const children: TreeNode[] = [
        {
          id: `${nodeId}-child-1`,
          label: levelLabel,
          hasLazyChildren: Math.random() < 0.5
        },
        {
          id: `${nodeId}-child-2`,
          label: levelLabel,
          hasLazyChildren: Math.random() < 0.5
        }
      ];

      resolve(children);
    }, 700);
  });
}

