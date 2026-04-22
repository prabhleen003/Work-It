import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow';

interface Props {
  data: StartNodeData;
  selected: boolean;
}

/**
 * Start Node: Workflow entry point (memoized to prevent unnecessary re-renders)
 */
function StartNode({ data, selected }: Props) {
  return (
    <div
      className={`min-w-[168px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(2,6,23,0.32)] ${
        selected
          ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-emerald-500 dark:ring-emerald-900/80'
          : 'border-emerald-200 dark:border-emerald-900/70'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-3 py-2 dark:border-emerald-900/70 dark:bg-emerald-950/45">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-white dark:border-emerald-900/70 dark:bg-slate-900">
          <Play size={10} className="fill-emerald-700 text-emerald-700 dark:fill-emerald-300 dark:text-emerald-300" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Start</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">{data.title || 'Start'}</p>
        {data.metadata.length > 0 && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{data.metadata.length} metadata field(s)</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500 dark:!border-slate-900"
      />
    </div>
  );
}

export default memo(StartNode);
