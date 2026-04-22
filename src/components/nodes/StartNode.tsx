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
      className={`bg-white rounded-xl border-2 min-w-[160px] shadow-md transition-all ${
        selected ? 'border-green-500 shadow-green-200 shadow-lg' : 'border-green-400'
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-green-100">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Play size={10} className="text-white fill-white" />
        </div>
        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Start</span>
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium text-gray-800 leading-tight">{data.title || 'Start'}</p>
        {data.metadata.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{data.metadata.length} metadata field(s)</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-400 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(StartNode);
