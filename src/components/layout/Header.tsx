import { CheckCircle, Play } from 'lucide-react';

interface HeaderProps {
  onValidate: () => void;
  onTest: () => void;
  isTesting: boolean;
}

/**
 * Header component: Top navigation with Validate (green) and Test buttons
 */
export default function Header({ onValidate, onTest, isTesting }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          WorkIt
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onValidate}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 hover:border-green-700 transition-colors"
        >
          <CheckCircle size={15} />
          Validate
        </button>

        <button
          onClick={onTest}
          disabled={isTesting}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          <Play size={14} className={isTesting ? 'animate-pulse' : ''} />
          {isTesting ? 'Running...' : 'Test Workflow'}
        </button>
      </div>
    </header>
  );
}
