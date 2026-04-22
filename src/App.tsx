import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeDetailsPanel from './components/panels/NodeDetailsPanel';
import SandboxPanel from './components/panels/SandboxPanel';

import { sampleNodes, sampleEdges } from './data/sampleWorkflow';
import { apiClient } from './lib/apiClient';
import { validateWorkflow } from './lib/validation';
import { serializeWorkflow, workflowToDisplayJSON } from './lib/serialization';

import type {
  WorkflowNode,
  WorkflowNodeData,
  AutomationAction,
  ValidationResult,
  SimulationResult,
} from './types/workflow';

const INITIAL_VALIDATION = validateWorkflow(sampleNodes as WorkflowNode[], sampleEdges);

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Main workflow orchestration component.
 * Manages workflow graph state (nodes/edges), user interactions, validation, and simulation execution.
 */
function WorkflowApp() {
  // ReactFlow managed state for graph nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(sampleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sampleEdges);

  // UI state
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(INITIAL_VALIDATION);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'log' | 'validation'>('log');
  const [sandboxCollapsed, setSandboxCollapsed] = useState(false);
  // Ref to maintain latest graph state for validation debouncing
  const latestGraphRef = useRef({
    nodes: sampleNodes as WorkflowNode[],
    edges: sampleEdges,
  });

  const validationSignature = JSON.stringify({
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  });

  useEffect(() => {
    let cancelled = false;

    async function loadAutomations() {
      try {
        const result = await apiClient.get('/automations');
        if (!cancelled) setAutomations(result);
      } catch (error) {
        if (!cancelled) {
          setAutomations([]);
          console.error('Failed to load automations:', error);
        }
      }
    }

    loadAutomations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    latestGraphRef.current = {
      nodes: nodes as WorkflowNode[],
      edges,
    };
  }, [nodes, edges]);

  // Auto-validate workflow on graph changes with 200ms debounce to prevent excessive recalculations
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const { nodes: currentNodes, edges: currentEdges } = latestGraphRef.current;
      setValidationResult(validateWorkflow(currentNodes, currentEdges));
      setSimulationResult((prev) => (prev ? null : prev));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [validationSignature]);

  // Keep selected node in sync when nodes state changes
  useEffect(() => {
    if (!selectedNode) return;
    const updated = nodes.find((n) => n.id === selectedNode.id);
    if (updated) setSelectedNode(updated as WorkflowNode);
    else setSelectedNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleUpdateNode = useCallback(
    (id: string, data: WorkflowNodeData) => {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data } : n)));
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const handleValidate = useCallback(() => {
    const result = validateWorkflow(nodes as WorkflowNode[], edges);
    setValidationResult(result);
    setSandboxTab('validation');
    setSandboxCollapsed(false);
  }, [nodes, edges]);

  const handleTest = useCallback(async () => {
    const valResult = validateWorkflow(nodes as WorkflowNode[], edges);
    setValidationResult(valResult);

    if (!valResult.valid) {
      setSandboxTab('validation');
      setSandboxCollapsed(false);
      return;
    }

    setIsSimulating(true);
    setSandboxTab('log');
    setSandboxCollapsed(false);

    try {
      const workflow = serializeWorkflow(nodes as WorkflowNode[], edges);
      const result = await apiClient.post('/simulate', workflow);
      setSimulationResult(result);
    } catch (error) {
      setSimulationResult({
        success: false,
        steps: [],
        error: getErrorMessage(error, 'Simulation failed. Please try again.'),
      });
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges]);

  const workflowDisplayJSON = workflowToDisplayJSON(
    serializeWorkflow(nodes as WorkflowNode[], edges)
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <Header
        onValidate={handleValidate}
        onTest={handleTest}
        isTesting={isSimulating}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <WorkflowCanvas
              nodes={nodes as WorkflowNode[]}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              setNodes={setNodes as React.Dispatch<React.SetStateAction<WorkflowNode[]>>}
              setEdges={setEdges}
            />
            <NodeDetailsPanel
              node={selectedNode}
              automations={automations}
              onUpdate={handleUpdateNode}
              onDelete={handleDeleteNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>

          <SandboxPanel
            workflowJSON={workflowDisplayJSON}
            validationResult={validationResult}
            simulationResult={simulationResult}
            isSimulating={isSimulating}
            activeTab={sandboxTab}
            onTabChange={setSandboxTab}
            collapsed={sandboxCollapsed}
            onToggleCollapse={() => setSandboxCollapsed((c) => !c)}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowApp />
    </ReactFlowProvider>
  );
}
