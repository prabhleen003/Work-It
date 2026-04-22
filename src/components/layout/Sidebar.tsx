import { Play, ClipboardList, UserCheck, Zap, StopCircle } from 'lucide-react';
import type { NodeKind } from '../../types/workflow';

interface NodeTypeItem {
  kind: NodeKind;
  label: string;
  icon: React.ReactNode;
  badge: string;
  card: string;
}

// Configuration for draggable node types with visual styling
const NODE_TYPES: NodeTypeItem[] = [
  {
    kind: 'start',
    label: 'Start Node',
    icon: <Play size={13} className="fill-emerald-700 text-emerald-700 dark:fill-emerald-300 dark:text-emerald-300" />,
    badge: 'border border-emerald-100 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/45',
    card: 'border-emerald-100 bg-emerald-50/60 hover:border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/35',
  },
  {
    kind: 'task',
    label: 'Task Node',
    icon: <ClipboardList size={13} className="text-indigo-700 dark:text-indigo-300" />,
    badge: 'border border-indigo-100 bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/45',
    card: 'border-indigo-100 bg-indigo-50/60 hover:border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-indigo-950/20 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/35',
  },
  {
    kind: 'approval',
    label: 'Approval Node',
    icon: <UserCheck size={13} className="text-amber-700 dark:text-amber-300" />,
    badge: 'border border-amber-100 bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/45',
    card: 'border-amber-100 bg-amber-50/60 hover:border-amber-200 hover:bg-amber-50 dark:border-amber-900/60 dark:bg-amber-950/20 dark:hover:border-amber-800 dark:hover:bg-amber-950/35',
  },
  {
    kind: 'automated',
    label: 'Automated Step',
    icon: <Zap size={13} className="fill-teal-700 text-teal-700 dark:fill-teal-300 dark:text-teal-300" />,
    badge: 'border border-teal-100 bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/45',
    card: 'border-teal-100 bg-teal-50/60 hover:border-teal-200 hover:bg-teal-50 dark:border-teal-900/60 dark:bg-teal-950/20 dark:hover:border-teal-800 dark:hover:bg-teal-950/35',
  },
  {
    kind: 'end',
    label: 'End Node',
    icon: <StopCircle size={13} className="text-rose-700 dark:text-rose-300" />,
    badge: 'border border-rose-100 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/45',
    card: 'border-rose-100 bg-rose-50/60 hover:border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20 dark:hover:border-rose-800 dark:hover:bg-rose-950/35',
  },
];

export default function Sidebar() {
  function onDragStart(e: React.DragEvent, kind: NodeKind) {
    e.dataTransfer.setData('application/reactflow-node-type', kind);
    e.dataTransfer.effectAllowed = 'move';
  }

  return (
    <aside className="flex h-full w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto px-3 pt-5">
        <p className="mb-1 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Add Steps
        </p>
        <p className="mb-4 px-1 text-xs text-slate-400 dark:text-slate-500">Drag nodes to the canvas</p>

        <div className="space-y-1.5">
          {NODE_TYPES.map((nt) => (
            <div
              key={nt.kind}
              draggable
              onDragStart={(e) => onDragStart(e, nt.kind)}
              className={`flex cursor-grab items-center gap-2.5 rounded-lg border px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all active:cursor-grabbing dark:shadow-[0_1px_2px_rgba(2,6,23,0.24)] ${nt.card}`}
              title={`Drag to add ${nt.label}`}
            >
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${nt.badge}`}>
                {nt.icon}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {nt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
