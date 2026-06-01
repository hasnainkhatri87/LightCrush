export type ImageStatus = 'waiting' | 'optimizing' | 'done' | 'failed' | 'skipped';

export type OutputFormat = 'auto' | 'webp' | 'jpeg' | 'png';

export type PresetId = 'smallest' | 'balanced' | 'quality' | 'lossless';

export interface ImageMetadata {
  file: File;
  filename: string;
  inputFormat: string;
  width: number;
  height: number;
  fileSize: number;
  hasTransparency: boolean;
  megapixels: number;
}

export interface OptimizeSettings {
  outputFormat: OutputFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  preserveTransparency: boolean;
  removeMetadata: boolean;
  lowRamMode: boolean;
  filenameSuffix: string;
  parallelJobs: number;
  maxMegapixels: number;
  preset: PresetId;
}

export interface OptimizeResult {
  blob: Blob;
  objectUrl: string;
  outputFormat: string;
  outputWidth: number;
  outputHeight: number;
  optimizedSize: number;
  savedPercent: number;
  skipped: boolean;
}

export interface QueuedImage extends ImageMetadata {
  id: string;
  originalUrl: string;
  status: ImageStatus;
  progress: number;
  outputFormat?: string;
  outputWidth?: number;
  outputHeight?: number;
  optimizedSize?: number;
  savedPercent?: number;
  result?: OptimizeResult;
  error?: string;
}
