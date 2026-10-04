import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Droplets, Sparkles, CheckCircle2, Ruler } from 'lucide-react';

interface PigmentBand {
  name: string;
  colorHex: string;
  colorName: string;
  rfValue: number; // e.g. 0.95
  distanceCm: number;
}

export const PaperChromatographySim: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(75); // 0 to 100%
  const totalSolventDistanceCm = 10.0;
  const currentSolventFrontCm = Number(((progressPercent / 100) * totalSolventDistanceCm).toFixed(1));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && progressPercent < 100) {
      timer = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isRunning, progressPercent]);

  const PIGMENTS: PigmentBand[] = [
    {
      name: 'Carotene',
      colorHex: '#ea580c',
      colorName: 'Yellow-Orange',
      rfValue: 0.95,
      distanceCm: Number((currentSolventFrontCm * 0.95).toFixed(2)),
    },
    {
      name: 'Xanthophyll',
      colorHex: '#eab308',
      colorName: 'Yellow',
      rfValue: 0.71,
      distanceCm: Number((currentSolventFrontCm * 0.71).toFixed(2)),
    },
    {
      name: 'Chlorophyll a',
      colorHex: '#15803d',
      colorName: 'Blue-Green',
      rfValue: 0.59,
      distanceCm: Number((currentSolventFrontCm * 0.59).toFixed(2)),
    },
    {
      name: 'Chlorophyll b',
      colorHex: '#65a30d',
      colorName: 'Olive-Green',
      rfValue: 0.42,
      distanceCm: Number((currentSolventFrontCm * 0.42).toFixed(2)),
    },
  ];

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Paper Chromatography of Plant Pigments
            </h3>
            <p className="text-xs text-slate-400">
              Separation of Spinach leaf chloroplast pigments (Petroleum ether : Acetone 9:1)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60 font-bold">
            Capillary Adsorption Separation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Apparatus: Chromatography Chamber */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>WHATMAN CHROMATOGRAM STRIP &amp; SOLVENT FRONT MIGRATION</span>
          </div>

          <svg viewBox="0 0 320 280" className="w-full max-w-[280px] h-72 select-none">
            {/* Glass Developing Jar */}
            <rect x="70" y="20" width="180" height="240" rx="12" fill="#1e293b" fillOpacity="0.4" stroke="#475569" strokeWidth="2.5" />
            <rect x="65" y="15" width="190" height="12" rx="4" fill="#334155" />
            <text x="160" y="24" fill="#94a3b8" fontSize="7" fontWeight="bold" textAnchor="middle">Sealed Jar Lid</text>

            {/* Solvent Reservoir at Bottom */}
            <rect x="72" y="235" width="176" height="23" rx="4" fill="#0284c7" fillOpacity="0.3" />

            {/* Whatman No. 1 Filter Paper Strip */}
            <rect x="130" y="35" width="60" height="210" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

            {/* Loading Origin Line (baseline) */}
            <line x1="130" y1="220" x2="190" y2="220" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            <text x="125" y="222" fill="#94a3b8" fontSize="6" textAnchor="end">Origin</text>

            {/* Solvent Front Rising Line */}
            {(() => {
              const sfY = 220 - (progressPercent / 100) * 165;
              return (
                <g>
                  {/* Wet paper zone */}
                  <rect x="130" y={sfY} width="60" height={220 - sfY} fill="#e2e8f0" fillOpacity="0.5" />
                  <line x1="130" y1={sfY} x2="190" y2={sfY} stroke="#0284c7" strokeWidth="2" />
                  <text x="195" y={sfY + 3} fill="#38bdf8" fontSize="7" fontWeight="bold">Solvent Front</text>

                  {/* 4 Separated Pigment Bands */}
                  {PIGMENTS.map((p) => {
                    const bandY = 220 - (220 - sfY) * p.rfValue;
                    return (
                      <g key={p.name}>
                        <ellipse cx="160" cy={bandY} rx="22" ry="4" fill={p.colorHex} fillOpacity="0.85" />
                        <line x1="182" y1={bandY} x2="215" y2={bandY} stroke="#475569" strokeWidth="0.8" />
                        <text x="218" y={bandY + 2.5} fill={p.colorHex} fontSize="7" fontWeight="bold">
                          {p.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}

            {/* Original Spinach Extract Spot at Origin */}
            <circle cx="160" cy="220" r="3" fill="#14532d" />
          </svg>

          {/* Metric Bar */}
          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold">Solvent Front: {currentSolventFrontCm} cm</span>
            <span className="text-cyan-400 font-bold">Progress: {progressPercent}%</span>
            <span className="text-amber-400 font-bold">Rf = d_pigment / d_solvent</span>
          </div>
        </div>

        {/* Controls & Rf Values Table */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Chromatogram Controls</h4>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Development Progress:</span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={progressPercent}
              onChange={(e) => setProgressPercent(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Run' : 'Resume Run'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setProgressPercent(10);
              }}
              className="p-2 rounded-xl text-slate-400 bg-slate-950 border border-slate-800 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Retention Factor Table */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 font-mono">Rf Calculations (Spinach Extract):</span>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                    <th className="p-1">Pigment</th>
                    <th className="p-1">Color</th>
                    <th className="p-1">Dist (cm)</th>
                    <th className="p-1 text-right">Rf Value</th>
                  </tr>
                </thead>
                <tbody>
                  {PIGMENTS.map((p) => (
                    <tr key={p.name} className="text-slate-300 border-b border-slate-900">
                      <td className="p-1 font-bold" style={{ color: p.colorHex }}>{p.name}</td>
                      <td className="p-1 text-slate-400 text-[10px]">{p.colorName}</td>
                      <td className="p-1">{p.distanceCm}</td>
                      <td className="p-1 text-right font-bold text-cyan-300">{p.rfValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-emerald-400 font-mono">Principle:</div>
            <p>
              Non-polar carotene dissolves readily in the non-polar mobile phase (petroleum ether) and ascends fastest. Polar chlorophylls interact more strongly with cellulose water molecules on paper (stationary phase).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
