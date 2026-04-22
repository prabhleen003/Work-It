import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';
import type { AutomatedNodeData } from '../../types/workflow';

interface Props {
  data: AutomatedNodeData;
  selected: boolean;
}

/**
 * Automated Node: System action execution (e.g., send email, generate document)
 */
function AutomatedNode({ data, selected }: Props) {
  // Display count of configured action parameters
  const paramCount = Object.keys(data.actionParams).length;

  return (
    <div
      className={`bg-white rounded-xl border-2 min-w-[180px] shadow-md transition-all ${
        selected ? 'border-teal-500 shadow-teal-200 shadow-lg' : 'border-teal-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-teal-400 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-teal-100">
        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
          <Zap size={11} className="text-white fill-white" />
        </div>
        <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Automated Step</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">{data.title || 'Automated Action'}</p>
        {data.actionId && (
          <p className="text-xs text-gray-500">Action: {data.actionId}</p>
        )}
        {paramCount > 0 && (
          <p className="text-xs text-gray-400">Params: {paramCount}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-teal-400 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(AutomatedNode);
