import ImageCard from './ImageCard';
import type { QueuedImage } from '../types/image';

interface ImageQueueProps {
  items: QueuedImage[];
  selectedId?: string;
  busy: boolean;
  onSelect: (id: string) => void;
  onOptimize: (item: QueuedImage) => void;
  onExport: (item: QueuedImage) => void;
}

export default function ImageQueue({ items, selectedId, busy, onSelect, onOptimize, onExport }: ImageQueueProps) {
  return (
    <section className="image-queue">
      {items.map((item) => (
        <ImageCard
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          busy={busy}
          onSelect={() => onSelect(item.id)}
          onOptimize={() => onOptimize(item)}
          onExport={() => onExport(item)}
        />
      ))}
    </section>
  );
}
