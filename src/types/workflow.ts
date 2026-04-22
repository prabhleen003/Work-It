import type { Node, Edge } from 'reactflow';

/**
 * Core workflow node types:
 * - start: Workflow entry point
 * - task: Manual user task
 * - approval: Decision point with optional branching
 * - automated: Automated system action
 * - end: Workflow termination
 */
export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KVPair {
  id: string;
  key: string;
  value: string;
}

export interface StartNodeData {
  kind: 'start';
  title: string;
  metadata: KVPair[];
}

export interface TaskNodeData {
  kind: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KVPair[];
}

/**
 * 🔥 UPDATED: Approval now supports branching
 */
export interface ApprovalNodeData {
  kind: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;

  /**
   * 'single' → normal linear flow
   * 'approved_rejected' → branching flow
   */
  decisionMode?: 'single' | 'approved_rejected';
}

export interface AutomatedNodeData {
  kind: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  kind: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

/**
 * Automation actions
 */
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

/**
 * Simulation
 */
export interface SimulationStep {
  nodeId: string;
  nodeKind: NodeKind;
  label: string;
  status: 'completed' | 'approved' | 'success' | 'error';
  timestamp: string;
  detail?: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  error?: string;
}

/**
 * Validation
 */
export interface ValidationCheck {
  label: string;
  passed: boolean;
  detail?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  checks: ValidationCheck[];
}

/**
 * Serialized Workflow
 */
export interface WorkflowJSON {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
}