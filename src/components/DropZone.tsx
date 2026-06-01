import { ImagePlus, Upload } from 'lucide-react';
import { getDropFiles, pickFiles } from '../lib/file-utils';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
}

export default function DropZone({ onFiles }: DropZoneProps) {
  const handlePick = async () => {
    const files = await pickFiles();
    if (files.length > 0) onFiles(files);
  };

  return (
    <section
      className="drop-zone"
      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
      onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = getDropFiles(e.dataTransfer);
        if (files.length > 0) onFiles(files);
      }}
    >
      <div className="drop-icon">
        <ImagePlus size={32} />
      </div>
      <h2>Drop images here</h2>
      <p>JPG, PNG, WebP, AVIF supported</p>
      <button className="btn btn-primary" onClick={handlePick}>
        <Upload size={16} />
        Browse Files
      </button>
    </section>
  );
}
