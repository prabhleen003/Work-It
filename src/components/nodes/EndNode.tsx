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
      className={`bg-white rounded-xl border-2 min-w-[160px] shadow-md transition-all ${
        selected ? 'border-red-500 shadow-red-200 shadow-lg' : 'border-red-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-red-400 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-red-100">
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <StopCircle size={11} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">End</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">
          {data.endMessage || 'Workflow Complete'}
        </p>
        {data.summaryFlag && (
          <p className="text-xs text-gray-500">Summary: Yes</p>
        )}
      </div>
    </div>
  );
}

export default memo(EndNode);
