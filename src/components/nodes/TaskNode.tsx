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
      className={`min-w-[190px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(2,6,23,0.32)] ${
        selected
          ? 'border-indigo-300 ring-1 ring-indigo-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-indigo-500 dark:ring-indigo-900/80'
          : 'border-indigo-200 dark:border-indigo-900/70'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500 dark:!border-slate-900"
      />
      <div className="flex items-center gap-2 border-b border-indigo-100 bg-indigo-50 px-3 py-2 dark:border-indigo-900/70 dark:bg-indigo-950/45">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-indigo-100 bg-white dark:border-indigo-900/70 dark:bg-slate-900">
          <ClipboardList size={11} className="text-indigo-700 dark:text-indigo-300" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">Task</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">{data.title || 'Untitled Task'}</p>
        {data.assignee && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Assignee: {data.assignee}</p>
        )}
        {data.dueDate && (
          <p className="text-xs text-slate-400 dark:text-slate-500">Due: {data.dueDate}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-indigo-500 dark:!border-slate-900"
      />
    </div>
  );
}

export default memo(TaskNode);
