import { Download, Eye, RefreshCcw } from 'lucide-react';
import { formatBytes, formatDimensions, formatSaved } from '../lib/size';
import type { QueuedImage } from '../types/image';

interface ImageCardProps {
  item: QueuedImage;
  selected: boolean;
  busy: boolean;
  onSelect: () => void;
  onOptimize: () => void;
  onExport: () => void;
}

export default function ImageCard({ item, selected, busy, onSelect, onOptimize, onExport }: ImageCardProps) {
  const canOptimize = !busy && item.status !== 'optimizing' && item.status !== 'skipped';
  const canExport = item.status === 'done' && Boolean(item.result);

  return (
    <article className={selected ? 'image-card selected' : 'image-card'} onClick={onSelect}>
      <div className="card-topline">
        <div className="filename-block">
          <h3 title={item.filename}>{item.filename}</h3>
          <span>{item.inputFormat.toUpperCase()} → {(item.outputFormat ?? 'WebP').toUpperCase()}</span>
        </div>
        <span className={`status status-${item.status}`}>{item.status}</span>
      </div>

      <div className="metric-grid">
        <Metric label="Original" value={formatBytes(item.fileSize)} />
        <Metric label="Optimized" value={item.optimizedSize ? formatBytes(item.optimizedSize) : '—'} />
        <Metric label="Saved" value={formatSaved(item.savedPercent)} />
        <Metric label="Input" value={formatDimensions(item.width, item.height)} />
        <Metric label="Output" value={formatDimensions(item.outputWidth, item.outputHeight)} />
        <Metric label="Pixels" value={`${item.megapixels.toFixed(1)} MP`} />
      </div>

      <div className="progress-track">
        <span style={{ width: `${item.progress}%` }} />
      </div>

      {item.error && <p className="error-text">{item.error}</p>}

      <div className="card-actions">
        <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          <Eye size={15} /> Preview
        </button>
        <button className="btn btn-ghost" disabled={!canOptimize} onClick={(e) => { e.stopPropagation(); onOptimize(); }}>
          <RefreshCcw size={15} /> Optimize
        </button>
        <button className="btn btn-primary" disabled={!canExport} onClick={(e) => { e.stopPropagation(); onExport(); }}>
          <Download size={15} /> Save
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
