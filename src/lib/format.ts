import type { OutputFormat } from '../types/image';

export const outputFormats: Array<{ value: OutputFormat; label: string }> = [
  { value: 'auto', label: 'Auto (Same as Original)' },
  { value: 'webp', label: 'WebP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' }
];

export function outputFilename(originalName: string, suffix: string, format: string): string {
  const stem = originalName.replace(/\.[^.]+$/, '');
  const ext = format === 'jpeg' ? 'jpg' : format;
  return `${stem}${suffix}.${ext}`;
}
