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
      className={`min-w-[190px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all ${
        selected
          ? 'border-indigo-300 ring-1 ring-indigo-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
          : 'border-indigo-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500"
      />
      <div className="flex items-center gap-2 border-b border-indigo-100 bg-indigo-50 px-3 py-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-indigo-100 bg-white">
          <ClipboardList size={11} className="text-indigo-700" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Task</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium leading-tight text-slate-800">{data.title || 'Untitled Task'}</p>
        {data.assignee && (
          <p className="text-xs text-slate-500">Assignee: {data.assignee}</p>
        )}
        {data.dueDate && (
          <p className="text-xs text-slate-400">Due: {data.dueDate}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500"
      />
    </div>
  );
}

export default memo(TaskNode);
