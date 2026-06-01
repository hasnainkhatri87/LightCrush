import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <h1>LightCrush</h1>
          <p>Ultra-lightweight image compression</p>
        </div>
      </div>
      <div className="header-badges">
        <span className="badge badge-green"><ShieldCheck size={14} /> 100% Offline</span>
        <span className="badge badge-blue"><Zap size={14} /> Low RAM Mode</span>
      </div>
    </header>
  );
}
