import { CheckCircle2, XCircle, Play, StopCircle, ClipboardList, UserCheck, Zap, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ValidationResult, SimulationResult, SimulationStep, NodeKind } from '../../types/workflow';

interface SandboxPanelProps {
  workflowJSON: string;
  validationResult: ValidationResult | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  activeTab: 'log' | 'validation';
  onTabChange: (tab: 'log' | 'validation') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

// Icon map for visual representation of node types in simulation logs
const KIND_ICON: Record<NodeKind, React.ReactNode> = {
  start:     <Play size={13} className="fill-emerald-700 text-emerald-700" />,
  task:      <ClipboardList size={13} className="text-indigo-700" />,
  approval:  <UserCheck size={13} className="text-amber-700" />,
  automated: <Zap size={13} className="fill-teal-700 text-teal-700" />,
  end:       <StopCircle size={13} className="text-rose-700" />,
};

const STATUS_COLOR: Record<SimulationStep['status'], string> = {
  completed: 'text-emerald-700',
  approved:  'text-amber-700',
  success:   'text-teal-700',
  error:     'text-rose-700',
};

/**
 * Debug/Output Panel: Displays validation results and workflow simulation execution logs.
 * Tabs switch between validation errors and simulation step traces.
 */
export default function SandboxPanel({
  workflowJSON,
  validationResult,
  simulationResult,
  isSimulating,
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: SandboxPanelProps) {
  return (
    <div
      className={`flex flex-shrink-0 flex-col border-t border-slate-200 bg-white transition-all duration-200 ${
        collapsed ? 'h-11' : 'h-72'
      }`}
    >
      {/* Panel header */}
      <div
        className="flex h-11 flex-shrink-0 cursor-pointer select-none items-center justify-between border-b border-slate-100 bg-[#fbfbfc] px-4 transition-colors hover:bg-slate-50"
        onClick={onToggleCollapse}
      >
        <span className="text-sm font-semibold text-slate-700">Workflow Test / Sandbox</span>
        <div className="flex items-center gap-2">
          {validationResult && (
            <span className={`flex items-center gap-1 text-xs font-medium ${validationResult.valid ? 'text-emerald-700' : 'text-rose-700'}`}>
              {validationResult.valid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {validationResult.valid ? 'Valid' : `${validationResult.errors.length} error(s)`}
            </span>
          )}
          {collapsed ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: JSON */}
          <div className="flex w-64 flex-shrink-0 flex-col border-r border-slate-100">
            <div className="border-b border-slate-100 bg-[#fbfbfc] px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Workflow JSON</span>
            </div>
            <pre className="flex-1 overflow-auto whitespace-pre-wrap break-all px-3 py-2 font-mono text-xs leading-relaxed text-slate-600">
              {workflowJSON || '{}'}
            </pre>
          </div>

          {/* Middle: Tabs */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex flex-shrink-0 border-b border-slate-100">
              {(['log', 'validation'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'log' ? 'Execution Log' : 'Validation'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              {activeTab === 'log' && (
                <LogTab result={simulationResult} isSimulating={isSimulating} />
              )}
              {activeTab === 'validation' && (
                <ValidationTab result={validationResult} />
              )}
            </div>
          </div>

          {/* Right: Validation Results summary */}
          <div className="flex w-64 flex-shrink-0 flex-col border-l border-slate-100">
            <div className="border-b border-slate-100 bg-[#fbfbfc] px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Validation Results</span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-auto px-3 py-2">
              {validationResult ? (
                <>
                  {validationResult.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {c.passed
                        ? <CheckCircle2 size={13} className="flex-shrink-0 text-emerald-500" />
                        : <XCircle size={13} className="flex-shrink-0 text-rose-500" />}
                      <span className={`text-xs ${c.passed ? 'text-slate-600' : 'text-rose-700'}`}>{c.label}</span>
                    </div>
                  ))}
                  {validationResult.valid && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5">
                      <CheckCircle2 size={12} className="flex-shrink-0 text-emerald-700" />
                      <span className="text-xs font-medium text-emerald-700">Workflow is ready for execution!</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="pt-1 text-xs italic text-slate-400">Run validation to see results</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogTab({ result, isSimulating }: { result: SimulationResult | null; isSimulating: boolean }) {
  if (isSimulating) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-indigo-600">
        <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: '0.1s' }} />
        <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: '0.2s' }} />
        <span className="ml-1 text-xs font-medium">Simulating workflow...</span>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
        <Play size={18} className="text-slate-300" />
        <p className="text-xs">Click "Test Workflow" to run simulation</p>
      </div>
    );
  }
  if (!result.success) {
    return (
      <div className="flex items-start gap-2 px-4 py-3">
        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-rose-500" />
        <p className="text-xs text-rose-700">{result.error}</p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-slate-100">
      {result.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50">
          <div className="flex w-4 flex-shrink-0 justify-center">
            {KIND_ICON[step.nodeKind]}
          </div>
          <span className="flex-1 text-xs text-slate-700">{step.label}</span>
          {step.detail && <span className="text-xs text-slate-400">{step.detail}</span>}
          <span className={`text-xs font-medium flex-shrink-0 ${STATUS_COLOR[step.status]}`}>
            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
          </span>
          <span className="flex-shrink-0 font-mono text-xs text-slate-400">{step.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

function ValidationTab({ result }: { result: ValidationResult | null }) {
  if (!result) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
        <CheckCircle2 size={18} className="text-slate-300" />
        <p className="text-xs">Click "Validate" to check your workflow</p>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 space-y-3">
      {result.errors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-rose-700">Errors ({result.errors.length})</p>
          {result.errors.map((err, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-rose-700">
              <XCircle size={12} className="mt-0.5 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}
      {result.valid && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={12} />
          All checks passed. Workflow is valid.
        </div>
      )}
    </div>
  );
}
