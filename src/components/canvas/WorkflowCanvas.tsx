import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
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
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onPaneClick,
  setNodes,
  setEdges,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

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
      className="flex-1 h-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeClick={(_e, node) => onNodeClick(node as WorkflowNode)}
        onPaneClick={onPaneClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Delete', 'Backspace']}
        className="bg-slate-50"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
        <Controls className="!shadow-md" />
        <MiniMap
          nodeColor={(n) => {
            switch (n.type) {
              case 'start': return '#22c55e';
              case 'task': return '#3b82f6';
              case 'approval': return '#f59e0b';
              case 'automated': return '#14b8a6';
              case 'end': return '#ef4444';
              default: return '#94a3b8';
            }
          }}
          className="!shadow-md !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}