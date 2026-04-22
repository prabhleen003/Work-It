import type {
  AutomationAction,
  SimulationResult,
  WorkflowJSON,
  SimulationStep,
  NodeKind,
} from '../types/workflow';

type MockApiRequest =
  | { method: 'GET'; path: '/automations' }
  | { method: 'POST'; path: '/simulate'; body: WorkflowJSON };

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
];

export function handleMockRequest(request: { method: 'GET'; path: '/automations' }): Promise<AutomationAction[]>;
export function handleMockRequest(request: { method: 'POST'; path: '/simulate'; body: WorkflowJSON }): Promise<SimulationResult>;
export async function handleMockRequest(request: MockApiRequest): Promise<AutomationAction[] | SimulationResult> {
  const endpoint = `${request.method} ${request.path}`;

  switch (request.method) {
    case 'GET':
      if (request.path === '/automations') {
        await delay(100);
        return AUTOMATIONS;
      }
      break;

    case 'POST':
      if (request.path === '/simulate') {
        await delay(600);
        return runSimulation(request.body);
      }
      break;
  }

  throw new Error(`Unhandled mock API request: ${endpoint}`);
}

export function getAutomations(): Promise<AutomationAction[]> {
  return handleMockRequest({ method: 'GET', path: '/automations' });
}

export function simulate(workflow: WorkflowJSON): Promise<SimulationResult> {
  return handleMockRequest({ method: 'POST', path: '/simulate', body: workflow });
}

/**
 * Simulates workflow execution using breadth-first traversal.
 * Processes nodes sequentially, generating timestamped execution steps for audit trail.
 * Handles branching logic for approval nodes (approved/rejected paths).
 */
function runSimulation(workflow: WorkflowJSON): SimulationResult {
  const steps: SimulationStep[] = [];
  const now = new Date();

  // Build index for O(1) node lookups
  const nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));

  // Build adjacency map for outgoing edges from each node
  const outgoingMap = new Map<string, typeof workflow.edges>();
  for (const edge of workflow.edges) {
    const arr = outgoingMap.get(edge.source) ?? [];
    arr.push(edge);
    outgoingMap.set(edge.source, arr);
  }

  const startNode = workflow.nodes.find((n) => n.data.kind === 'start');
  if (!startNode) {
    return { success: false, steps: [], error: 'No start node found.' };
  }

  // BFS traversal to execute workflow nodes in order
  const visited = new Set<string>();
  const queue = [startNode.id];
  let offsetSec = 0;

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodeMap.get(id);
    if (!node) continue;

    const { data } = node;
    const kind = data.kind as NodeKind;

    const ts = new Date(now.getTime() + offsetSec * 1000);
    const timestamp = ts.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    offsetSec += 20;

    switch (kind) {
      case 'start': {
        const sd = data as import('../types/workflow').StartNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Start: ${sd.title || 'Workflow Start'}`,
          status: 'completed',
          timestamp,
        });
        break;
      }

      case 'task': {
        const td = data as import('../types/workflow').TaskNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Task: ${td.title || 'Task Step'}`,
          status: 'completed',
          timestamp,
          detail: td.assignee ? `Assigned to ${td.assignee}` : undefined,
        });
        break;
      }

      case 'approval': {
        const ad = data as import('../types/workflow').ApprovalNodeData;

        // Auto-approval takes the approved path before falling back to a manual decision.
        const isBranching = ad.decisionMode === 'approved_rejected';
        const outgoing = outgoingMap.get(id) ?? [];
        const autoApproveHours = Number.isFinite(ad.autoApproveThreshold)
          ? Math.max(0, ad.autoApproveThreshold)
          : 0;
        const isAutoApproved = autoApproveHours > 0;

        if (isBranching) {
          const decision = isAutoApproved
            ? 'approved'
            : Math.random() > 0.5 ? 'approved' : 'rejected';

          steps.push({
            nodeId: id,
            nodeKind: kind,
            label: `Approval: ${ad.title || 'Approval Step'}`,
            status: decision === 'approved' ? 'approved' : 'error',
            timestamp,
            detail:
              isAutoApproved
                ? `Auto-approved after ${formatHours(autoApproveHours)}`
                : decision === 'approved'
                ? `Approved by ${ad.approverRole || 'Approver'}`
                : `Rejected by ${ad.approverRole || 'Approver'}`,
          });

          const chosenEdges = outgoing.filter((e) => e.sourceHandle === decision);
          for (const edge of chosenEdges) {
            if (!visited.has(edge.target)) queue.push(edge.target);
          }

          continue;
        }

        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Approval: ${ad.title || 'Approval Step'}`,
          status: 'approved',
          timestamp,
          detail: isAutoApproved
            ? `Auto-approved after ${formatHours(autoApproveHours)}`
            : ad.approverRole ? `Approved by ${ad.approverRole}` : undefined,
        });

        break;
      }

      case 'automated': {
        const aud = data as import('../types/workflow').AutomatedNodeData;
        const action = AUTOMATIONS.find((a) => a.id === aud.actionId);

        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Automated: ${aud.title || action?.label || 'Automated Step'}`,
          status: 'success',
          timestamp,
          detail: action ? `Executed action: ${action.label}` : undefined,
        });
        break;
      }

      case 'end': {
        const ed = data as import('../types/workflow').EndNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `End: ${ed.endMessage || 'Workflow Complete'}`,
          status: 'completed',
          timestamp,
        });
        continue;
      }
    }

    const nexts = outgoingMap.get(id) ?? [];
    for (const edge of nexts) {
      if (!visited.has(edge.target)) queue.push(edge.target);
    }
  }

  return { success: true, steps };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatHours(hours: number) {
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}
