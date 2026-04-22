import type { WorkflowNode, WorkflowEdge } from '../types/workflow';

/**
 * Sample workflow: Employee Onboarding Process
 * Demonstrates complete workflow structure with multiple node types and branching logic.
 */
export const sampleNodes: WorkflowNode[] = [
  {
    id: 'n1',
    type: 'start',
    position: { x: 60, y: 200 },
    data: {
      kind: 'start',
      title: 'Employee Onboarding',
      metadata: [],
    },
  },
  {
    id: 'n2',
    type: 'task',
    position: { x: 260, y: 200 },
    data: {
      kind: 'task',
      title: 'Collect Documents',
      description: 'Collect employee identity and onboarding documents',
      assignee: 'HR Executive',
      dueDate: '',
      customFields: [],
    },
  },
  {
    id: 'n3',
    type: 'approval',
    position: { x: 480, y: 200 },
    data: {
      kind: 'approval',
      title: 'Manager Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 24,
      decisionMode: 'approved_rejected',
    },
  },
  {
    id: 'n4',
    type: 'automated',
    position: { x: 760, y: 120 },
    data: {
      kind: 'automated',
      title: 'Send Welcome Email',
      actionId: 'send_email',
      actionParams: {
        to: 'new.employee@company.com',
        subject: 'Welcome to the team!',
      },
    },
  },
  {
    id: 'n5',
    type: 'task',
    position: { x: 760, y: 300 },
    data: {
      kind: 'task',
      title: 'Rework Documents',
      description: 'Fix missing or incorrect documents and resubmit',
      assignee: 'HR Executive',
      dueDate: '',
      customFields: [],
    },
  },
  {
    id: 'n6',
    type: 'end',
    position: { x: 1040, y: 200 },
    data: {
      kind: 'end',
      endMessage: 'Process Complete',
      summaryFlag: true,
    },
  },
];

export const sampleEdges: WorkflowEdge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2', type: 'smoothstep' },
  { id: 'e2-3', source: 'n2', target: 'n3', type: 'smoothstep' },

  {
    id: 'e3-4',
    source: 'n3',
    sourceHandle: 'approved',
    target: 'n4',
    type: 'smoothstep',
    label: 'Approved',
  },
  {
    id: 'e3-5',
    source: 'n3',
    sourceHandle: 'rejected',
    target: 'n5',
    type: 'smoothstep',
    label: 'Rejected',
  },

  { id: 'e4-6', source: 'n4', target: 'n6', type: 'smoothstep' },
  { id: 'e5-6', source: 'n5', target: 'n6', type: 'smoothstep' },
];