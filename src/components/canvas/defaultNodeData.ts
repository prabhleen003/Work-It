import type { WorkflowNodeData, NodeKind } from '../../types/workflow';

/**
 * Factory function: Returns default data structure for each node type.
 * Used when creating new nodes via drag-drop.
 */
export function defaultNodeData(kind: NodeKind): WorkflowNodeData {
  switch (kind) {
    case 'start':
      return { kind: 'start', title: 'Start', metadata: [] };
    case 'task':
      return { kind: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { kind: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'automated':
      return { kind: 'automated', title: 'Automated Action', actionId: '', actionParams: {} };
    case 'end':
      return { kind: 'end', endMessage: 'Workflow Complete', summaryFlag: false };
  }
}
