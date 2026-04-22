import type { WorkflowNode, WorkflowEdge, WorkflowJSON } from '../types/workflow';

/**
 * Serializes ReactFlow graph (nodes + edges) into JSON format for storage/transmission.
 */
export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name = 'Offer Approval Workflow'
): WorkflowJSON {
  return {
    id: `wf_${Date.now()}`,
    name,
    nodes: nodes.map((n) => ({
      ...n,
      data: n.data,
      position: n.position,
      type: n.type,
    })),
    edges: edges.map((e) => ({
      ...e,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      type: e.type,
      label: e.label,
    })),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Converts serialized workflow to formatted JSON string for display/export.
 */
export function workflowToDisplayJSON(workflow: WorkflowJSON): string {
  const compact = {
    id: workflow.id,
    name: workflow.name,
    nodes: workflow.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      data: n.data,
      position: n.position,
    })),
    edges: workflow.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      type: e.type,
      label: e.label,
    })),
  };

  return JSON.stringify(compact, null, 2);
}
