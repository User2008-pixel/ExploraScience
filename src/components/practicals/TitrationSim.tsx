import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

interface TitrationSimProps {
  analyteVolumeMl?: number; // Volume of oxalic acid pipetted (e.g. 20.0 mL)
  analyteMolarity?: number; // 0.1 M Oxalic Acid
}

export const TitrationSim: React.FC<TitrationSimProps> = ({
  analyteVolumeMl = 20.0,
  analyteMolarity = 0.1,
}) => {
  // Burette volume added (0 to 50 mL)
  const [buretteVolumeAddedMl, setBuretteVolumeAddedMl] = useState<number>(0);
  const [flowRate, setFlowRate] = useState<'closed' | 'drop' | 'stream'>('closed');
  const [concordantLogs, setConcordantLogs] = useState<number[]>([]);

  // Stoichiometry:
  // 2 KMnO4 + 5 H2C2O4 + 3 H2SO4 -> K2SO4 + 2 MnSO4 + 10 CO2 + 8 H2O
  // (M1 * V1) / 2 = (M2 * V2) / 5
  // For unknown KMnO4 with M1 ~ 0.02 M, equivalence volume V1 = (2 * M2 * V2) / (5 * M1)
  // Let true KMnO4 molarity = 0.02 M
  // V1 = (2 * 0.1 * 20.0) / (5 * 0.02) = 4.0 / 0.1 = 40.0 mL / 2 = 20.0 mL
  const equivalenceVolumeMl = 20.0;

  // Animation interval for burette dripping
  useEffect(() => {
    if (flowRate === 'closed') return;
    const intervalMs = flowRate === 'drop' ? 300 : 80;
    const increment = flowRate === 'drop' ? 0.05 : 0.2;

    const timer = setInterval(() => {
      setBuretteVolumeAddedMl((prev) => {
        if (prev >= 45) {
          setFlowRate('closed');
          return 45;
        }
        return Number((prev + increment).toFixed(2));
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [flowRate]);

  // Color determination:
  // Before 20.0 mL: completely colorless or very transient pink flashes
  // Exactly at 20.0 mL: permanent faint pink
  // Beyond 20.5 mL: over-titrated deep magenta / purple
  const isPastEquivalence = buretteVolumeAddedMl >= equivalenceVolumeMl;
  const isExactEndPoint =
    buretteVolumeAddedMl >= equivalenceVolumeMl &&
    buretteVolumeAddedMl <= equivalenceVolumeMl + 0.3;
  const isOverTitrated = buretteVolumeAddedMl > equivalenceVolumeMl + 0.8;

  const getFlaskColor = () => {
    if (buretteVolumeAddedMl < equivalenceVolumeMl - 0.2) {
      return 'rgba(241, 245, 249, 0.2)'; // Clear transparent
    }
    if (isExactEndPoint) {
      return 'rgba(244, 114, 182, 0.45)'; // Faint permanent pink (Correct end-point)
    }
    if (isOverTitrated) {
      return 'rgba(192, 38, 211, 0.85)'; // Dark purple (Over-titrated error)
    }
    // Very near transition
    return 'rgba(251, 207, 232, 0.35)';
  };

  const handleAddConcordant = () => {
    if (concordantLogs.length < 3) {
      setConcordantLogs([...concordantLogs, Number(buretteVolumeAddedMl.toFixed(2))]);
    }
  };

  const handleReset = () => {
    setFlowRate('closed');
    setBuretteVolumeAddedMl(0);
  };

  // Calculate experimental molarity of KMnO4 based on current burette reading
  // M1 = (2 * M2 * V2) / (5 * V1)
  const calculatedMolarity =
    buretteVolumeAddedMl > 0
      ? (2 * analyteMolarity * analyteVolumeMl) / (5 * buretteVolumeAddedMl)
      : 0;

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase">
              Class 11 & 12 Chemistry Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Volumetric Redox Titration: KMnO₄ vs Oxalic Acid
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn the stopcock to titrate hot oxalic acid until a permanent faint pink color persists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBuretteVolumeAddedMl(19.8)}
            className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-mono font-bold hover:bg-pink-500/30 transition flex items-center gap-1"
            title="Fast forward near end-point (19.8 mL)"
          >
            <Sparkles className="w-3 h-3 text-pink-400" />
            <span>Near End-Point (19.8 mL)</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Refill Burette"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Titration Apparatus Canvas */}
        <div className="lg:col-span-7 bg-[#080d1a] border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center relative shadow-inner">
          <svg viewBox="0 0 450 320" className="w-full h-auto max-h-[300px] select-none">
            {/* White Tile Background on table */}
            <rect x="120" y="270" width="180" height="20" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" rx="3" />

            {/* Retort Stand Base & Rod */}
            <rect x="60" y="275" width="80" height="15" fill="#334155" rx="2" />
            <rect x="95" y="10" width="10" height="270" fill="#475569" rx="1" />
            {/* Burette Clamp */}
            <rect x="95" y="90" width="110" height="10" fill="#64748b" rx="2" />
            <circle cx="205" cy="95" r="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />

            {/* 50 mL Glass Burette Column */}
            <rect x="195" y="15" width="20" height="180" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" rx="1" />

            {/* KMnO4 Purple Liquid Level inside Burette */}
            {(() => {
              const liquidHeight = Math.max(0, 160 - (buretteVolumeAddedMl / 50) * 160);
              const liquidY = 35 + (buretteVolumeAddedMl / 50) * 160;
              return (
                <g>
                  <rect
                    x="196"
                    y={liquidY}
                    width="18"
                    height={liquidHeight}
                    fill="url(#kmno4Grad)"
                    opacity="0.9"
                  />
                  {/* Meniscus curvature */}
                  <ellipse cx="205" cy={liquidY} rx="9" ry="3" fill="#a21caf" />
                </g>
              );
            })()}

            {/* Burette Graduations */}
            {Array.from({ length: 11 }).map((_, i) => {
              const y = 35 + i * 16;
              return (
                <g key={i}>
                  <line x1="210" y1={y} x2="215" y2={y} stroke="#f8fafc" strokeWidth="1" />
                  <text x="222" y={y + 3} fill="#94a3b8" fontSize="7" fontFamily="monospace">
                    {i * 5}
                  </text>
                </g>
              );
            })}

            {/* Burette Stopcock Valve */}
            <rect x="198" y="195" width="14" height="20" fill="#334155" stroke="#94a3b8" strokeWidth="1" rx="2" />
            <circle cx="205" cy="205" r="6" fill={flowRate === 'closed' ? '#ef4444' : '#10b981'} />
            {/* Burette Tip */}
            <polygon points="201,215 209,215 206,230 204,230" fill="#cbd5e1" />

            {/* Falling Drops when open */}
            {flowRate !== 'closed' && (
              <circle cx="205" cy="242" r="2.5" fill="#c026d3" className="animate-bounce" />
            )}

            {/* Conical Flask */}
            <path
              d="M 190,240 L 220,240 L 220,250 L 255,280 L 155,280 L 190,250 Z"
              fill={getFlaskColor()}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Flask Neck Rim */}
            <ellipse cx="205" cy="240" rx="15" ry="3" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

            <defs>
              <linearGradient id="kmno4Grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#701a75" />
                <stop offset="50%" stopColor="#a21caf" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
            </defs>
          </svg>

          {/* Real-Time End Point Status Badge */}
          <div className="absolute top-3 left-4">
            {isExactEndPoint ? (
              <div className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Permanent Faint Pink: End-Point Achieved!</span>
              </div>
            ) : isOverTitrated ? (
              <div className="px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                <span>⚠️ Over-Titrated (Too Dark / Past End-Point)</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
                <span>Solution: Colorless (Oxalate in excess)</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Flow Controls, Reading & Concordant Table */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Stopcock Controls */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Burette Stopcock Controls
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <button
                onClick={() => setFlowRate('closed')}
                className={`py-2 rounded-lg transition border ${
                  flowRate === 'closed'
                    ? 'bg-rose-500 text-slate-950 font-bold border-rose-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Close Valve
              </button>
              <button
                onClick={() => setFlowRate('drop')}
                className={`py-2 rounded-lg transition border flex items-center justify-center gap-1 ${
                  flowRate === 'drop'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Dropwise</span>
              </button>
              <button
                onClick={() => setFlowRate('stream')}
                className={`py-2 rounded-lg transition border ${
                  flowRate === 'stream'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Stream (Fast)
              </button>
            </div>
          </div>

          {/* Burette Reading Box */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Current Burette Reading:</span>
              <span className="text-base font-extrabold text-white">
                {buretteVolumeAddedMl.toFixed(2)} mL
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800 text-slate-300">
              <span>Standard Oxalic Acid (V₂): 20.0 mL</span>
              <span>Molarity (M₂): 0.10 M</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-pink-300">
              <span>Calculated Molarity of KMnO₄:</span>
              <span className="font-bold">{calculatedMolarity.toFixed(4)} M</span>
            </div>
          </div>

          {/* Concordant Observations Logger */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white uppercase text-[11px]">
                Concordant Observations Log ({concordantLogs.length}/3)
              </span>
              <button
                onClick={handleAddConcordant}
                disabled={concordantLogs.length >= 3 || buretteVolumeAddedMl === 0}
                className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-40 text-[10px] font-mono font-bold"
              >
                + Log Reading
              </button>
            </div>

            {concordantLogs.length > 0 ? (
              <div className="space-y-1 font-mono text-[11px]">
                {concordantLogs.map((vol, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between p-1.5 rounded bg-slate-950/70 border border-slate-800 text-slate-300"
                  >
                    <span>Trial #{idx + 1}:</span>
                    <span className="font-bold text-cyan-300">{vol.toFixed(2)} mL</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                No concordant readings logged yet. Record end-point values when faint pink appears.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
