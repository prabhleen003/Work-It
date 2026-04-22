import { describe, expect, it } from 'vitest';

import { sampleEdges, sampleNodes } from '../data/sampleWorkflow';
import type { WorkflowEdge, WorkflowNode } from '../types/workflow';
import { validateWorkflow } from './validation';

function cloneNodes(nodes: WorkflowNode[] = sampleNodes): WorkflowNode[] {
  return JSON.parse(JSON.stringify(nodes)) as WorkflowNode[];
}

function cloneEdges(edges: WorkflowEdge[] = sampleEdges): WorkflowEdge[] {
  return JSON.parse(JSON.stringify(edges)) as WorkflowEdge[];
}

describe('validateWorkflow', () => {
  it('accepts the sample branching workflow', () => {
    const result = validateWorkflow(cloneNodes(), cloneEdges());

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Start node is present', passed: true }),
        expect.objectContaining({ label: 'Branching approval paths are configured', passed: true }),
      ])
    );
  });

  it('rejects a branching approval without a rejected path', () => {
    const edges = cloneEdges().filter((edge) => edge.sourceHandle !== 'rejected');
    const result = validateWorkflow(cloneNodes(), edges);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Approval "Compensation Approval" is missing a rejected branch.'
    );
  });

  it('rejects workflows with missing required task fields', () => {
    const nodes = cloneNodes().map((node) =>
      node.id === 'n2' && node.data.kind === 'task'
        ? { ...node, data: { ...node.data, assignee: '' } }
        : node
    );

    const result = validateWorkflow(nodes, cloneEdges());

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Task "Draft Offer Package" is missing an assignee.');
  });

  it('rejects cycles in the workflow graph', () => {
    const edges = [
      ...cloneEdges(),
      { id: 'e6-2', source: 'n6', target: 'n2', type: 'smoothstep' },
    ];

    const result = validateWorkflow(cloneNodes(), edges);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Workflow contains a cycle. Cycles are not allowed.');
  });
});
