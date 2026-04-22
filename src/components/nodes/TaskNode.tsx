import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow';

interface Props {
  data: TaskNodeData;
  selected: boolean;
}

/**
 * Task Node: User-assigned workflow step with assignee and due date info
 */
function TaskNode({ data, selected }: Props) {
  return (
    <div
      className={`bg-white rounded-xl border-2 min-w-[180px] shadow-md transition-all ${
        selected ? 'border-blue-500 shadow-blue-200 shadow-lg' : 'border-blue-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-blue-100">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={11} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Task</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">{data.title || 'Untitled Task'}</p>
        {data.assignee && (
          <p className="text-xs text-gray-500">Assignee: {data.assignee}</p>
        )}
        {data.dueDate && (
          <p className="text-xs text-gray-400">Due: {data.dueDate}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(TaskNode);
