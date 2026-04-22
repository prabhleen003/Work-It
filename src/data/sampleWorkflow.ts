import type { WorkflowNode, WorkflowEdge } from '../types/workflow';

/**
 * Sample workflow: Candidate Offer Approval
 * Demonstrates complete workflow structure with multiple node types and branching logic.
 */
export const sampleNodes: WorkflowNode[] = [
  {
    id: 'n1',
    type: 'start',
    position: { x: 60, y: 200 },
    data: {
      kind: 'start',
      title: 'Candidate Offer Approval',
      metadata: [
        { id: 'kv_start_1', key: 'department', value: 'Talent Acquisition' },
        { id: 'kv_start_2', key: 'requestType', value: 'New Hire Offer' },
      ],
    },
  },
  {
    id: 'n2',
    type: 'task',
    position: { x: 260, y: 200 },
    data: {
      kind: 'task',
      title: 'Draft Offer Package',
      description: 'Prepare compensation, joining date, and approval notes for the candidate.',
      assignee: 'Recruiter',
      dueDate: '',
      customFields: [
        { id: 'kv_task_1', key: 'candidateLevel', value: 'SDE-1' },
        { id: 'kv_task_2', key: 'location', value: 'Bangalore' },
      ],
    },
  },
  {
    id: 'n3',
    type: 'approval',
    position: { x: 480, y: 200 },
    data: {
      kind: 'approval',
      title: 'Compensation Approval',
      approverRole: 'HRBP',
      autoApproveThreshold: 12,
      decisionMode: 'approved_rejected',
    },
  },
  {
    id: 'n4',
    type: 'automated',
    position: { x: 760, y: 120 },
    data: {
      kind: 'automated',
      title: 'Generate Offer Letter',
      actionId: 'generate_doc',
      actionParams: {
        template: 'offer_letter_v2',
        recipient: 'candidate@company.com',
      },
    },
  },
  {
    id: 'n5',
    type: 'task',
    position: { x: 760, y: 300 },
    data: {
      kind: 'task',
      title: 'Revise Compensation Package',
      description: 'Update compensation details, capture feedback, and resubmit for approval.',
      assignee: 'Recruiter',
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
      endMessage: 'Offer Workflow Closed',
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
