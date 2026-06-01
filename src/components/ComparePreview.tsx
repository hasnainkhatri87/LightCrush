import { ScanSearch } from 'lucide-react';
import { formatBytes, formatDimensions, formatSaved } from '../lib/size';
import type { QueuedImage } from '../types/image';

interface ComparePreviewProps {
  item?: QueuedImage;
}

export default function ComparePreview({ item }: ComparePreviewProps) {
  if (!item) {
    return (
      <section className="compare-preview blank glass-card">
        <ScanSearch size={34} />
        <h2>Preview</h2>
        <p>Select an image to see the before & after comparison.</p>
      </section>
    );
  }

  const optimizedUrl = item.result?.objectUrl;

  return (
    <section className="compare-preview glass-card">
      <div className="section-title">
        <ScanSearch size={18} />
        <h2>Compare</h2>
      </div>
      <div className="preview-grid">
        <PreviewImage label="Original" src={item.originalUrl} />
        <PreviewImage label="Optimized" src={optimizedUrl} />
      </div>
      <div className="summary-strip">
        <span>{formatDimensions(item.outputWidth ?? item.width, item.outputHeight ?? item.height)}</span>
        <span>{item.optimizedSize ? formatBytes(item.optimizedSize) : formatBytes(item.fileSize)}</span>
        <span>{formatSaved(item.savedPercent)}</span>
      </div>
    </section>
  );
}

function PreviewImage({ label, src }: { label: string; src?: string }) {
  return (
    <figure>
      <figcaption>{label}</figcaption>
      {src ? <img src={src} alt={`${label} preview`} /> : <div className="preview-placeholder">Waiting</div>}
    </figure>
  );
}
