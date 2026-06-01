import { ImagePlus } from 'lucide-react';

export default function EmptyState() {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <ImagePlus size={44} />
      </div>
      <h2>No images in the queue</h2>
      <p>Drop or browse JPG, PNG, WebP, or AVIF files to start compressing.</p>
    </section>
  );
}
