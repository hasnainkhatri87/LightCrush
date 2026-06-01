export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatDimensions(width?: number, height?: number): string {
  if (!width || !height) return "-";
  return `${width} x ${height}`;
}

export function formatSaved(value?: number): string {
  if (value === undefined || !Number.isFinite(value)) return "-";
  return `${Math.max(0, value).toFixed(1)}%`;
}
