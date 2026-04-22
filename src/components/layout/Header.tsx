import { CheckCircle, Play, Users } from 'lucide-react';

interface HeaderProps {
  onValidate: () => void;
  onTest: () => void;
  isTesting: boolean;
}

/**
 * Header component: Top navigation with validation and simulation actions
 */
export default function Header({ onValidate, onTest, isTesting }: HeaderProps) {
  return (
    <header className="z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-[#fbfbfc] px-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50">
          <Users size={14} className="text-indigo-600" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            WorkIt
          </h1>
          <p className="text-xs text-slate-500">Workflow Designer</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500 bg-emerald-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-emerald-600 hover:bg-emerald-600"
        >
          <CheckCircle size={15} className="text-white" />
          Validate
        </button>

        <button
          onClick={onTest}
          disabled={isTesting}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-500 bg-indigo-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-indigo-600 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Play size={14} className={isTesting ? 'animate-pulse' : ''} />
          {isTesting ? 'Running...' : 'Test Workflow'}
        </button>
      </div>
    </header>
  );
}
