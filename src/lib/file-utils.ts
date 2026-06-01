declare const Neutralino: any;

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif';

export function isDesktop(): boolean {
  return typeof Neutralino !== 'undefined';
}

export function pickFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = IMAGE_ACCEPT;
    input.onchange = () => {
      const files = input.files ? Array.from(input.files) : [];
      resolve(files);
    };
    input.click();
  });
}

export function getDropFiles(dataTransfer: DataTransfer | null): File[] {
  if (!dataTransfer) return [];
  return Array.from(dataTransfer.files).filter((f) =>
    f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif)$/i.test(f.name)
  );
}

export async function saveBlob(blob: Blob, filename: string): Promise<void> {
  if (isDesktop()) {
    try {
      const result = await Neutralino.os.showSaveDialog('Save optimized image', {
        defaultPath: filename,
        filters: [
          { name: 'Images', extensions: ['webp', 'jpg', 'jpeg', 'png'] }
        ]
      });
      if (result) {
        const buffer = await blob.arrayBuffer();
        await Neutralino.filesystem.writeBinaryFile(result, buffer);
      }
      return;
    } catch {
      // Fall through to browser download
    }
  }

  // Browser download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function saveBlobBatch(items: Array<{ blob: Blob; filename: string }>): Promise<number> {
  if (isDesktop()) {
    try {
      const result = await Neutralino.os.showFolderDialog('Choose output folder');
      if (result) {
        for (const item of items) {
          const buffer = await item.blob.arrayBuffer();
          await Neutralino.filesystem.writeBinaryFile(`${result}/${item.filename}`, buffer);
        }
        return items.length;
      }
      return 0;
    } catch {
      // Fall through
    }
  }

  // Browser: download each file
  for (const item of items) {
    await saveBlob(item.blob, item.filename);
    await new Promise((r) => setTimeout(r, 200)); // Avoid browser blocking
  }
  return items.length;
}
