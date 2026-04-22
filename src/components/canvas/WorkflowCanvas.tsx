import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  addEdge,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import type {
  Connection,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';

import type { WorkflowNode, WorkflowEdge, NodeKind } from '../../types/workflow';
import { defaultNodeData } from './defaultNodeData';

const nodeTypes: NodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

// Auto-increment counter for generating unique node IDs
let idCounter = 100;
function nextId() {
  return `n${++idCounter}`;
}

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  theme: 'light' | 'dark';
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick: (node: WorkflowNode) => void;
  onPaneClick: () => void;
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<WorkflowEdge[]>>;
}

export default function WorkflowCanvas({
  nodes,
  edges,
  theme,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onPaneClick,
  setNodes,
  setEdges,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const edgeColor = theme === 'dark' ? '#8190ff' : '#5b6ee1';
  const gridColor = theme === 'dark' ? '#1f2a3d' : '#e8ecf3';

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        className: edge.className ? `${edge.className} workflow-edge` : 'workflow-edge',
        style: {
          stroke: edgeColor,
          strokeWidth: 1.7,
          ...(edge.style ?? {}),
        },
        markerEnd: edge.markerEnd ?? {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: edgeColor,
        },
      })),
    [edgeColor, edges]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drag-drop from sidebar to create new nodes
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('application/reactflow-node-type') as NodeKind;
      if (!kind) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      // Create new node with default data
      const newNode: WorkflowNode = {
        id: nextId(),
        type: kind,
        position,
        data: defaultNodeData(kind),
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const handleConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, type: 'smoothstep', animated: false }, eds)
      );
    },
    [setEdges]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full flex-1 bg-slate-100 transition-colors dark:bg-slate-950"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={(_e, node) => onNodeClick(node as WorkflowNode)}
        onPaneClick={onPaneClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          className: 'workflow-edge',
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: edgeColor,
            strokeWidth: 1.7,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
            color: edgeColor,
          },
        }}
        connectionLineStyle={{
          stroke: edgeColor,
          strokeWidth: 1.7,
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Delete', 'Backspace']}
        className={theme === 'dark' ? 'bg-slate-950' : 'bg-[#f6f7fb]'}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={28}
          size={0.8}
          color={gridColor}
        />
        <Controls className="!shadow-none" />
        <MiniMap
          nodeColor={(n) => {
            switch (n.type) {
              case 'start': return '#5f8a68';
              case 'task': return '#4f46e5';
              case 'approval': return '#b7791f';
              case 'automated': return '#0f766e';
              case 'end': return '#b45363';
              default: return '#94a3b8';
            }
          }}
          className="!rounded-lg !shadow-none"
        />
      </ReactFlow>
    </div>
  );
}
