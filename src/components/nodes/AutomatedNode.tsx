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
      className={`min-w-[190px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(2,6,23,0.32)] ${
        selected
          ? 'border-teal-300 ring-1 ring-teal-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-teal-500 dark:ring-teal-900/80'
          : 'border-teal-200 dark:border-teal-900/70'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500 dark:!border-slate-900"
      />
      <div className="flex items-center gap-2 border-b border-teal-100 bg-teal-50 px-3 py-2 dark:border-teal-900/70 dark:bg-teal-950/45">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-teal-100 bg-white dark:border-teal-900/70 dark:bg-slate-900">
          <Zap size={11} className="fill-teal-700 text-teal-700 dark:fill-teal-300 dark:text-teal-300" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Automated Step</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">{data.title || 'Automated Action'}</p>
        {data.actionId && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Action: {data.actionId}</p>
        )}
        {paramCount > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">Params: {paramCount}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-teal-500 dark:!border-slate-900"
      />
    </div>
  );
}

export default memo(AutomatedNode);
