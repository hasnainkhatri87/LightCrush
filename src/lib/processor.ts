import type { ImageMetadata, OptimizeResult, OptimizeSettings, OutputFormat } from '../types/image';

function getMimeType(format: OutputFormat, inputFormat: string, hasTransparency: boolean, preserveTransparency: boolean): string {
  if (format === 'auto') return 'image/webp';
  if (format === 'jpeg') {
    // JPEG can't handle transparency — fall back to WebP
    if (hasTransparency && preserveTransparency) return 'image/webp';
    return 'image/jpeg';
  }
  return `image/${format}`;
}

export async function readMetadata(files: File[]): Promise<ImageMetadata[]> {
  const results: ImageMetadata[] = [];
  for (const file of files) {
    try {
      const bitmap = await createImageBitmap(file);
      const { width, height } = bitmap;
      bitmap.close();

      const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const inputFormat = ext === 'jpg' ? 'jpeg' : ext;

      results.push({
        file,
        filename: file.name,
        inputFormat,
        width,
        height,
        fileSize: file.size,
        hasTransparency: ['png', 'webp', 'avif'].includes(inputFormat),
        megapixels: (width * height) / 1_000_000
      });
    } catch {
      // Skip files that can't be decoded
    }
  }
  return results;
}

export function optimizeImage(
  metadata: ImageMetadata,
  settings: OptimizeSettings
): Promise<OptimizeResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/image-worker.ts', import.meta.url),
      { type: 'module' }
    );

    const mime = getMimeType(
      settings.outputFormat,
      metadata.inputFormat,
      metadata.hasTransparency,
      settings.preserveTransparency
    );

    worker.postMessage({
      file: metadata.file,
      outputFormat: mime,
      quality: settings.quality / 100,
      maxWidth: settings.maxWidth,
      maxHeight: settings.maxHeight,
      preserveTransparency: settings.preserveTransparency
    });

    worker.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'done' && data.blob) {
        const objectUrl = URL.createObjectURL(data.blob);
        const outputFormat = mime.replace('image/', '');
        const savedPercent = metadata.fileSize > 0
          ? ((metadata.fileSize - data.blob.size) / metadata.fileSize) * 100
          : 0;

        worker.terminate();
        resolve({
          blob: data.blob,
          objectUrl,
          outputFormat,
          outputWidth: data.width,
          outputHeight: data.height,
          optimizedSize: data.blob.size,
          savedPercent: Math.max(0, savedPercent),
          skipped: false
        });
      } else if (data.type === 'error') {
        worker.terminate();
        reject(new Error(data.error || 'Processing failed'));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message || 'Worker error'));
    };
  });
}
