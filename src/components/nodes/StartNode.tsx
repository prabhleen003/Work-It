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
      className={`min-w-[168px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all ${
        selected
          ? 'border-emerald-300 ring-1 ring-emerald-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
          : 'border-emerald-200'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-3 py-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-white">
          <Play size={10} className="fill-emerald-700 text-emerald-700" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Start</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium leading-tight text-slate-800">{data.title || 'Start'}</p>
        {data.metadata.length > 0 && (
          <p className="mt-1 text-xs text-slate-400">{data.metadata.length} metadata field(s)</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500"
      />
    </div>
  );
}

export default memo(StartNode);
