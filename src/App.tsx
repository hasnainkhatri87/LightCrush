import { useMemo, useState } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import SettingsPanel from './components/SettingsPanel';
import ImageQueue from './components/ImageQueue';
import ComparePreview from './components/ComparePreview';
import ExportBar from './components/ExportBar';
import EmptyState from './components/EmptyState';
import { readMetadata, optimizeImage } from './lib/processor';
import { createQueueItem, dedupeByFile } from './lib/queue';
import { defaultSettings } from './lib/presets';
import { outputFilename } from './lib/format';
import { saveBlob, saveBlobBatch } from './lib/file-utils';
import type { OptimizeSettings, QueuedImage } from './types/image';

export default function App() {
  const [items, setItems] = useState<QueuedImage[]>([]);
  const [settings, setSettings] = useState<OptimizeSettings>(defaultSettings);
  const [selectedId, setSelectedId] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string>();

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? items.find((i) => i.status === 'done') ?? items[0],
    [items, selectedId]
  );

  async function addFiles(files: File[]) {
    if (files.length === 0) return;
    setNotice(undefined);
    try {
      const metadata = await readMetadata(files);
      const nextItems = metadata.map(createQueueItem);
      setItems((current) => {
        const unique = dedupeByFile(current, nextItems);
        if (!selectedId && unique.length > 0) setSelectedId(unique[0].id);
        return [...current, ...unique];
      });
    } catch (err) {
      setNotice(String(err));
    }
  }

  async function optimizeOne(item: QueuedImage) {
    setItems((cur) =>
      cur.map((c) => (c.id === item.id ? { ...c, status: 'optimizing' as const, progress: 10, error: undefined } : c))
    );
    try {
      const result = await optimizeImage(item, settings);
      setItems((cur) =>
        cur.map((c) =>
          c.id === item.id
            ? {
                ...c,
                status: 'done' as const,
                progress: 100,
                result,
                outputFormat: result.outputFormat,
                outputWidth: result.outputWidth,
                outputHeight: result.outputHeight,
                optimizedSize: result.optimizedSize,
                savedPercent: result.savedPercent
              }
            : c
        )
      );
    } catch (err) {
      setItems((cur) =>
        cur.map((c) =>
          c.id === item.id
            ? { ...c, status: 'failed' as const, progress: 0, error: friendlyError(err) }
            : c
        )
      );
    }
  }

  async function optimizeQueue() {
    const pending = items.filter((i) => i.status === 'waiting' || i.status === 'failed');
    if (pending.length === 0 || isProcessing) return;
    setIsProcessing(true);
    for (const item of pending) {
      await optimizeOne(item);
    }
    setIsProcessing(false);
  }

  async function exportItem(item: QueuedImage) {
    if (!item.result) return;
    const filename = outputFilename(item.filename, settings.filenameSuffix, item.result.outputFormat);
    await saveBlob(item.result.blob, filename);
    setNotice(`Saved ${filename}`);
  }

  async function exportAll() {
    const done = items.filter((i) => i.status === 'done' && i.result);
    if (done.length === 0) return;
    const batch = done.map((i) => ({
      blob: i.result!.blob,
      filename: outputFilename(i.filename, settings.filenameSuffix, i.result!.outputFormat)
    }));
    const count = await saveBlobBatch(batch);
    setNotice(`Saved ${count} optimized image${count === 1 ? '' : 's'}.`);
  }

  function clearQueue() {
    // Revoke object URLs to free memory
    for (const item of items) {
      URL.revokeObjectURL(item.originalUrl);
      if (item.result) URL.revokeObjectURL(item.result.objectUrl);
    }
    setItems([]);
    setSelectedId(undefined);
    setNotice(undefined);
  }

  return (
    <main className="app-shell">
      <Header />
      <section className="workspace">
        <aside className="left-pane">
          <DropZone onFiles={addFiles} />
          <SettingsPanel settings={settings} onChange={setSettings} />
        </aside>

        <section className="center-pane">
          <ExportBar
            disabled={items.length === 0}
            isProcessing={isProcessing}
            doneCount={items.filter((i) => i.status === 'done').length}
            totalCount={items.length}
            onOptimizeAll={optimizeQueue}
            onExportAll={exportAll}
            onClear={clearQueue}
          />
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <ImageQueue
              items={items}
              selectedId={selected?.id}
              onSelect={setSelectedId}
              onOptimize={optimizeOne}
              onExport={exportItem}
              busy={isProcessing}
            />
          )}
        </section>

        <aside className="preview-pane">
          <ComparePreview item={selected} />
          {notice && <p className="notice">{notice}</p>}
        </aside>
      </section>
    </main>
  );
}

function friendlyError(error: unknown): string {
  const msg = String(error);
  if (msg.includes('unsupported') || msg.includes('decode')) return 'Unsupported image format.';
  if (msg.includes('large')) return 'Image is too large to process.';
  if (msg.includes('memory')) return 'Not enough memory.';
  return msg.replace(/^Error:\s*/, '') || 'Optimization failed.';
}
