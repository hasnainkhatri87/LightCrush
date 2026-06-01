import { Archive, Eraser, Play } from 'lucide-react';

interface ExportBarProps {
  disabled: boolean;
  isProcessing: boolean;
  doneCount: number;
  totalCount: number;
  onOptimizeAll: () => void;
  onExportAll: () => void;
  onClear: () => void;
}

export default function ExportBar({ disabled, isProcessing, doneCount, totalCount, onOptimizeAll, onExportAll, onClear }: ExportBarProps) {
  return (
    <div className="export-bar glass-card">
      <button className="btn btn-primary" disabled={disabled || isProcessing} onClick={onOptimizeAll}>
        <Play size={16} />
        {isProcessing ? 'Optimizing...' : 'Optimize All'}
      </button>
      <button className="btn btn-secondary" disabled={doneCount === 0} onClick={onExportAll}>
        <Archive size={16} />
        Save All ({doneCount})
      </button>
      <div className="export-bar-spacer" />
      {totalCount > 0 && (
        <span className="queue-count">{totalCount} image{totalCount !== 1 ? 's' : ''}</span>
      )}
      <button className="btn btn-ghost" disabled={disabled || isProcessing} onClick={onClear} title="Clear queue">
        <Eraser size={16} />
      </button>
    </div>
  );
}
