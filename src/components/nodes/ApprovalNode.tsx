import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { UserCheck } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  data: ApprovalNodeData;
  selected: boolean;
}

/**
 * Approval Node: Decision point that can branch to approved/rejected paths
 */
function ApprovalNode({ data, selected }: Props) {
  const decisionMode = (data as ApprovalNodeData & {
    decisionMode?: 'single' | 'approved_rejected';
  }).decisionMode;

  // Branching mode adds dual output handles for different decisions
  const isBranching = decisionMode === 'approved_rejected';

  return (
    <div
      className={`relative min-w-[204px] overflow-hidden rounded-lg border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition-all dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(2,6,23,0.32)] ${
        selected
          ? 'border-amber-300 ring-1 ring-amber-200 shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-amber-500 dark:ring-amber-900/80'
          : 'border-amber-200 dark:border-amber-900/70'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-amber-500 dark:!border-slate-900"
      />

      <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-3 py-2 dark:border-amber-900/70 dark:bg-amber-950/45">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-amber-100 bg-white dark:border-amber-900/70 dark:bg-slate-900">
          <UserCheck size={11} className="text-amber-700 dark:text-amber-300" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
          Approval
        </span>
      </div>

      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium leading-tight text-slate-800 dark:text-slate-100">
          {data.title || 'Approval Step'}
        </p>

        {data.approverRole && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Approver Role: {data.approverRole}</p>
        )}

        {data.autoApproveThreshold > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Auto-approve after {data.autoApproveThreshold}h
          </p>
        )}

        {isBranching && (
          <div className="pt-2 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <span>Approved</span>
              <span>Rejected</span>
            </div>
          </div>
        )}
      </div>

      {isBranching ? (
        <>
          <Handle
            id="approved"
            type="source"
            position={Position.Right}
            style={{ top: '38%' }}
            className="!h-3 !w-3 !border-2 !border-white !bg-emerald-500 dark:!border-slate-900"
          />
          <Handle
            id="rejected"
            type="source"
            position={Position.Right}
            style={{ top: '72%' }}
            className="!h-3 !w-3 !border-2 !border-white !bg-rose-500 dark:!border-slate-900"
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-white !bg-amber-500 dark:!border-slate-900"
        />
      )}
    </div>
  );
}

export default memo(ApprovalNode);
