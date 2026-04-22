import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { StopCircle } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow';

interface Props {
  data: EndNodeData;
  selected: boolean;
}

/**
 * End Node: Workflow termination point with completion message
 */
function EndNode({ data, selected }: Props) {
  return (
    <div
      className={`min-w-[168px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all ${
        selected
          ? 'border-rose-300 ring-1 ring-rose-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
          : 'border-rose-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-rose-500"
      />
      <div className="flex items-center gap-2 border-b border-rose-100 bg-rose-50 px-3 py-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-rose-100 bg-white">
          <StopCircle size={11} className="text-rose-700" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">End</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">
          {data.endMessage || 'Workflow Complete'}
        </p>
        {data.summaryFlag && (
          <p className="text-xs text-slate-500">Summary: Yes</p>
        )}
      </div>
    </div>
  );
}

export default memo(EndNode);
