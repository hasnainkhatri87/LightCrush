// Web Worker for off-main-thread image processing
// Uses OffscreenCanvas for decode → resize → encode

interface WorkerInput {
  file: File;
  outputFormat: string; // 'image/webp' | 'image/jpeg' | 'image/png'
  quality: number; // 0-1
  maxWidth?: number;
  maxHeight?: number;
  preserveTransparency: boolean;
}

interface WorkerOutput {
  type: 'progress' | 'done' | 'error';
  progress?: number;
  blob?: Blob;
  width?: number;
  height?: number;
  error?: string;
}

self.onmessage = async (event: MessageEvent<WorkerInput>) => {
  const { file, outputFormat, quality, maxWidth, maxHeight, preserveTransparency } = event.data;

  try {
    // Step 1: Decode
    postProgress(10);
    const bitmap = await createImageBitmap(file);
    
    // Step 2: Calculate resize dimensions (no enlargement)
    postProgress(30);
    let targetWidth = bitmap.width;
    let targetHeight = bitmap.height;
    
    if (maxWidth && targetWidth > maxWidth) {
      const ratio = maxWidth / targetWidth;
      targetWidth = maxWidth;
      targetHeight = Math.round(targetHeight * ratio);
    }
    if (maxHeight && targetHeight > maxHeight) {
      const ratio = maxHeight / targetHeight;
      targetHeight = maxHeight;
      targetWidth = Math.round(targetWidth * ratio);
    }

    // Step 3: Draw to OffscreenCanvas (resize + encode)
    postProgress(50);
    const canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext('2d')!;
    
    // High-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Clear for transparency support
    if (preserveTransparency && (outputFormat === 'image/png' || outputFormat === 'image/webp')) {
      ctx.clearRect(0, 0, targetWidth, targetHeight);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
    
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    // Step 4: Encode
    postProgress(75);
    const blob = await canvas.convertToBlob({
      type: outputFormat,
      quality: quality
    });

    postProgress(100);
    const response: WorkerOutput = {
      type: 'done',
      progress: 100,
      blob,
      width: targetWidth,
      height: targetHeight
    };
    self.postMessage(response);
  } catch (err) {
    const response: WorkerOutput = {
      type: 'error',
      error: err instanceof Error ? err.message : 'Image processing failed'
    };
    self.postMessage(response);
  }
};

function postProgress(value: number) {
  const response: WorkerOutput = { type: 'progress', progress: value };
  self.postMessage(response);
}
