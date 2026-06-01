import type { ImageMetadata, QueuedImage } from '../types/image';

export function createQueueItem(metadata: ImageMetadata): QueuedImage {
  return {
    ...metadata,
    id: `${metadata.filename}-${metadata.fileSize}-${metadata.width}x${metadata.height}-${Date.now()}`,
    originalUrl: URL.createObjectURL(metadata.file),
    status: metadata.megapixels > 25 ? 'skipped' : 'waiting',
    progress: 0,
    error: metadata.megapixels > 25 ? 'Image is too large (over 25 MP safety limit).' : undefined
  };
}

export function dedupeByFile(existing: QueuedImage[], incoming: QueuedImage[]): QueuedImage[] {
  const keys = new Set(existing.map((item) => `${item.filename}-${item.fileSize}`));
  return incoming.filter((item) => !keys.has(`${item.filename}-${item.fileSize}`));
}
