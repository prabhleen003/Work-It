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
      className={`min-w-[190px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all ${
        selected
          ? 'border-teal-300 ring-1 ring-teal-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
          : 'border-teal-200'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500"
      />
      <div className="flex items-center gap-2 border-b border-teal-100 bg-teal-50 px-3 py-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-teal-100 bg-white">
          <Zap size={11} className="fill-teal-700 text-teal-700" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Automated Step</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium leading-tight text-slate-800">{data.title || 'Automated Action'}</p>
        {data.actionId && (
          <p className="text-xs text-slate-500">Action: {data.actionId}</p>
        )}
        {paramCount > 0 && (
          <p className="text-xs text-slate-400">Params: {paramCount}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500"
      />
    </div>
  );
}

export default memo(AutomatedNode);
