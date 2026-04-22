import { CheckCircle, Moon, Play, Sun, Users } from 'lucide-react';

interface HeaderProps {
  onValidate: () => void;
  onTest: () => void;
  isTesting: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

/**
 * Header component: Top navigation with validation and simulation actions
 */
export default function Header({
  onValidate,
  onTest,
  isTesting,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const isDark = theme === 'dark';
  const toggleLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header className="z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-[#fbfbfc] px-6 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_1px_2px_rgba(2,6,23,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 transition-colors dark:border-slate-700 dark:bg-slate-800">
          <Users size={14} className="text-indigo-600 dark:text-indigo-300" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            WorkIt
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Workflow Designer</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          title={toggleLabel}
          aria-label={toggleLabel}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500 bg-emerald-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-emerald-600 hover:bg-emerald-600 dark:border-emerald-600 dark:bg-emerald-600 dark:hover:border-emerald-500 dark:hover:bg-emerald-500"
        >
          <CheckCircle size={15} className="text-white" />
          Validate
        </button>

        <button
          onClick={onTest}
          disabled={isTesting}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-500 bg-indigo-500 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:border-indigo-600 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:border-indigo-500 dark:hover:bg-indigo-500"
        >
          <Play size={14} className={isTesting ? 'animate-pulse' : ''} />
          {isTesting ? 'Running...' : 'Test Workflow'}
        </button>
      </div>
    </header>
  );
}
