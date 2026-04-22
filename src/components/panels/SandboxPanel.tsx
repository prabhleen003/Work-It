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
  start:     <Play size={13} className="fill-green-600 text-green-600" />,
  task:      <ClipboardList size={13} className="text-blue-600" />,
  approval:  <UserCheck size={13} className="text-amber-600" />,
  automated: <Zap size={13} className="fill-teal-600 text-teal-600" />,
  end:       <StopCircle size={13} className="text-red-600" />,
};

const STATUS_COLOR: Record<SimulationStep['status'], string> = {
  completed: 'text-green-600',
  approved:  'text-amber-600',
  success:   'text-teal-600',
  error:     'text-red-600',
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
      className={`bg-white border-t border-gray-200 flex flex-col flex-shrink-0 transition-all duration-200 ${
        collapsed ? 'h-10' : 'h-72'
      }`}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-4 h-10 border-b border-gray-100 cursor-pointer select-none hover:bg-gray-50 transition-colors flex-shrink-0"
        onClick={onToggleCollapse}
      >
        <span className="text-sm font-semibold text-gray-700">Workflow Test / Sandbox</span>
        <div className="flex items-center gap-2">
          {validationResult && (
            <span className={`text-xs font-medium flex items-center gap-1 ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult.valid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {validationResult.valid ? 'Valid' : `${validationResult.errors.length} error(s)`}
            </span>
          )}
          {collapsed ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: JSON */}
          <div className="w-64 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Workflow JSON</span>
            </div>
            <pre className="flex-1 overflow-auto text-xs text-gray-600 px-3 py-2 font-mono leading-relaxed whitespace-pre-wrap break-all">
              {workflowJSON || '{}'}
            </pre>
          </div>

          {/* Middle: Tabs */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex border-b border-gray-100 flex-shrink-0">
              {(['log', 'validation'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
          <div className="w-64 border-l border-gray-100 flex flex-col flex-shrink-0">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Validation Results</span>
            </div>
            <div className="flex-1 overflow-auto px-3 py-2 space-y-1.5">
              {validationResult ? (
                <>
                  {validationResult.checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {c.passed
                        ? <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                        : <XCircle size={13} className="text-red-500 flex-shrink-0" />}
                      <span className={`text-xs ${c.passed ? 'text-gray-600' : 'text-red-600'}`}>{c.label}</span>
                    </div>
                  ))}
                  {validationResult.valid && (
                    <div className="mt-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-green-700">Workflow is ready for execution!</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400 italic pt-1">Run validation to see results</p>
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
      <div className="flex items-center justify-center h-full gap-2 text-blue-600">
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <span className="text-xs font-medium ml-1">Simulating workflow...</span>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <Play size={18} className="text-gray-300" />
        <p className="text-xs">Click "Test Workflow" to run simulation</p>
      </div>
    );
  }
  if (!result.success) {
    return (
      <div className="px-4 py-3 flex items-start gap-2">
        <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-600">{result.error}</p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-50">
      {result.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
          <div className="flex-shrink-0 w-4 flex justify-center">
            {KIND_ICON[step.nodeKind]}
          </div>
          <span className="flex-1 text-xs text-gray-700">{step.label}</span>
          {step.detail && <span className="text-xs text-gray-400">{step.detail}</span>}
          <span className={`text-xs font-medium flex-shrink-0 ${STATUS_COLOR[step.status]}`}>
            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0 font-mono">{step.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

function ValidationTab({ result }: { result: ValidationResult | null }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <CheckCircle2 size={18} className="text-gray-300" />
        <p className="text-xs">Click "Validate" to check your workflow</p>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 space-y-3">
      {result.errors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-red-600">Errors ({result.errors.length})</p>
          {result.errors.map((err, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <XCircle size={12} className="flex-shrink-0 mt-0.5" />
              {err}
            </div>
          ))}
        </div>
      )}
      {result.valid && (
        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle2 size={12} />
          All checks passed. Workflow is valid.
        </div>
      )}
    </div>
  );
}
