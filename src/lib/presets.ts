import type { OptimizeSettings, PresetId } from '../types/image';

export const defaultSettings: OptimizeSettings = {
  outputFormat: 'webp',
  quality: 72,
  preserveTransparency: true,
  removeMetadata: true,
  lowRamMode: true,
  filenameSuffix: '-lightcrush',
  parallelJobs: 1,
  maxMegapixels: 25,
  preset: 'balanced'
};

export const presetLabels: Record<PresetId, string> = {
  smallest: 'Smallest Size',
  balanced: 'Balanced',
  quality: 'High Quality',
  lossless: 'Lossless'
};

export function applyPreset(preset: PresetId, current: OptimizeSettings): OptimizeSettings {
  const base = { ...current, preset, removeMetadata: true };

  if (preset === 'smallest') return { ...base, outputFormat: 'webp', quality: 55 };
  if (preset === 'quality') return { ...base, outputFormat: 'webp', quality: 86 };
  if (preset === 'lossless') return { ...base, outputFormat: 'png', quality: 100 };
  return { ...base, outputFormat: 'webp', quality: 72 };
}
