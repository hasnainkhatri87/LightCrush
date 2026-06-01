import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { outputFormats } from '../lib/format';
import { applyPreset, presetLabels } from '../lib/presets';
import type { OptimizeSettings, PresetId } from '../types/image';

interface SettingsPanelProps {
  settings: OptimizeSettings;
  onChange: (settings: OptimizeSettings) => void;
}

const presets = Object.entries(presetLabels) as Array<[PresetId, string]>;

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <section className="settings-panel glass-card">
      <div className="section-title">
        <SlidersHorizontal size={18} />
        <h2>Settings</h2>
      </div>

      <div className="preset-grid" role="group" aria-label="Compression preset">
        {presets.map(([id, label]) => (
          <button
            key={id}
            className={settings.preset === id ? 'btn-preset active' : 'btn-preset'}
            onClick={() => onChange(applyPreset(id, settings))}
          >
            {label}
          </button>
        ))}
      </div>

      <label>
        Output format
        <select
          value={settings.outputFormat}
          onChange={(e) => onChange({ ...settings, outputFormat: e.target.value as OptimizeSettings['outputFormat'] })}
        >
          {outputFormats.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </label>

      <label>
        Quality <strong>{settings.quality}</strong>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.quality}
          onChange={(e) => onChange({ ...settings, quality: Number(e.target.value) })}
        />
      </label>

      <label className="toggle-row">
        <input
          type="checkbox"
          checked={settings.lowRamMode}
          onChange={(e) => onChange({ ...settings, lowRamMode: e.target.checked, parallelJobs: e.target.checked ? 1 : settings.parallelJobs })}
        />
        Low RAM mode
      </label>

      <button className="btn-link" onClick={() => setAdvancedOpen((v) => !v)}>
        {advancedOpen ? '▾ Hide advanced' : '▸ Show advanced'}
      </button>

      {advancedOpen && (
        <div className="advanced-settings">
          <label>
            Max width
            <input
              type="number"
              min="1"
              placeholder="No limit"
              value={settings.maxWidth ?? ''}
              onChange={(e) => onChange({ ...settings, maxWidth: optionalNum(e.target.value) })}
            />
          </label>
          <label>
            Max height
            <input
              type="number"
              min="1"
              placeholder="No limit"
              value={settings.maxHeight ?? ''}
              onChange={(e) => onChange({ ...settings, maxHeight: optionalNum(e.target.value) })}
            />
          </label>
          <label>
            Filename suffix
            <input
              type="text"
              value={settings.filenameSuffix}
              onChange={(e) => onChange({ ...settings, filenameSuffix: e.target.value || '-lightcrush' })}
            />
          </label>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={settings.preserveTransparency}
              onChange={(e) => onChange({ ...settings, preserveTransparency: e.target.checked })}
            />
            Preserve transparency
          </label>
        </div>
      )}
    </section>
  );
}

function optionalNum(value: string): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
