import { afterEach, describe, expect, it, vi } from 'vitest';

import { sampleEdges, sampleNodes } from '../data/sampleWorkflow';
import type { WorkflowEdge, WorkflowNode, WorkflowJSON } from '../types/workflow';
import { serializeWorkflow } from './serialization';
import { simulate } from './mockApi';

function cloneNodes(nodes: WorkflowNode[] = sampleNodes): WorkflowNode[] {
  return JSON.parse(JSON.stringify(nodes)) as WorkflowNode[];
}

function cloneEdges(edges: WorkflowEdge[] = sampleEdges): WorkflowEdge[] {
  return JSON.parse(JSON.stringify(edges)) as WorkflowEdge[];
}

async function runSimulation(workflow: WorkflowJSON) {
  vi.useFakeTimers();

  const resultPromise = simulate(workflow);
  await vi.advanceTimersByTimeAsync(600);

  return resultPromise;
}

describe('simulate', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('auto-approves threshold-based branching approvals and follows the approved path', async () => {
    const workflow = serializeWorkflow(cloneNodes(), cloneEdges());

    const result = await runSimulation(workflow);
    const labels = result.steps.map((step) => step.label);

    expect(result.success).toBe(true);
    expect(result.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nodeId: 'n3',
          status: 'approved',
          detail: 'Auto-approved after 24 hours',
        }),
      ])
    );
    expect(labels).toContain('Automated: Send Welcome Email');
    expect(labels).not.toContain('Task: Rework Documents');
  });

  it('returns a failed result when no start node exists', async () => {
    const workflow = serializeWorkflow(
      cloneNodes().filter((node) => node.data.kind !== 'start'),
      cloneEdges()
    );

    const result = await runSimulation(workflow);

    expect(result).toEqual({
      success: false,
      steps: [],
      error: 'No start node found.',
    });
  });
});
