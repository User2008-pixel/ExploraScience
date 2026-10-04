import React, { useState } from 'react';
import { Volume2, VolumeX, Sliders, Play, RotateCcw } from 'lucide-react';

export const ResonanceTubeSim: React.FC = () => {
  const [tuningForkFreq, setTuningForkFreq] = useState<number>(512); // Hz
  const [waterLevelCm, setWaterLevelCm] = useState<number>(16.5); // Air column length
  const [isStriking, setIsStriking] = useState<boolean>(true);

  // Speed of sound v = 340 m/s
  // First resonance l1 ~ v / (4 * f)
  // For 512 Hz: l1 = 340 / (4 * 512) = 0.166 m = 16.6 cm
  // Second resonance l2 ~ 3 * l1 = 49.8 cm
  const trueL1 = Number(((340 / (4 * tuningForkFreq)) * 100).toFixed(1));
  const trueL2 = Number((trueL1 * 3).toFixed(1));

  const distToResonance1 = Math.abs(waterLevelCm - trueL1);
  const distToResonance2 = Math.abs(waterLevelCm - trueL2);
  const minDistance = Math.min(distToResonance1, distToResonance2);

  // Resonance loudness: 0 to 1
  const loudness = isStriking ? Math.max(0, 1 - minDistance / 2.5) : 0;
  const isAtResonance = loudness > 0.8;

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Resonance Tube Apparatus</h3>
            <p className="text-xs text-slate-400">
              Determination of velocity of sound in air: v = 2ν(l₂ - l₁)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/60 font-bold">
          Acoustic Resonance
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Apparatus */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <svg viewBox="0 0 320 280" className="w-full max-w-[280px] h-72 select-none">
            {/* Wooden Base & Reservoir Stand */}
            <rect x="40" y="250" width="240" height="15" rx="3" fill="#334155" />
            <rect x="70" y="30" width="10" height="225" fill="#475569" />

            {/* Vertical Graduated Glass Tube */}
            <rect x="130" y="30" width="40" height="220" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

            {/* Water Column inside Tube */}
            {(() => {
              // Air column length = waterLevelCm (0 to 60 cm)
              // SVG height = 220px -> 60 cm corresponds to 200px
              const airH = (waterLevelCm / 60) * 200;
              const waterY = 30 + airH;
              return (
                <g>
                  {/* Water */}
                  <rect x="132" y={waterY} width="36" height={250 - waterY} fill="#0284c7" fillOpacity="0.75" />
                  <ellipse cx="150" cy={waterY} rx="18" ry="3" fill="#38bdf8" />

                  {/* Standing Sound Wave inside air column */}
                  {isStriking && (
                    <path
                      d={`M 132,30 Q 150,${30 + airH / 2} 168,30`}
                      fill="none"
                      stroke="#facc15"
                      strokeWidth={1 + loudness * 3}
                      strokeDasharray="3 2"
                    />
                  )}
                </g>
              );
            })()}

            {/* Vibrating Tuning Fork at mouth */}
            <g transform="translate(150, 20)">
              {/* Stem */}
              <line x1="0" y1="0" x2="0" y2="10" stroke="#94a3b8" strokeWidth="4" />
              {/* U-prongs */}
              <path d="M -12,-18 L -12,-2 Q 0,4 12,-2 L 12,-18" fill="none" stroke="#94a3b8" strokeWidth="3" />
              {isStriking && (
                <g className="animate-pulse">
                  <ellipse cx="0" cy="-22" rx={15 + loudness * 10} ry="6" fill="none" stroke="#facc15" strokeWidth="1.5" />
                </g>
              )}
            </g>

            {/* Measuring Scale Ruler on side */}
            <line x1="175" y1="30" x2="175" y2="250" stroke="#cbd5e1" strokeWidth="1" />
            {[0, 10, 20, 30, 40, 50, 60].map((cm) => {
              const y = 30 + (cm / 60) * 200;
              return (
                <g key={cm}>
                  <line x1="175" y1={y} x2="182" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="186" y={y + 3} fill="#94a3b8" fontSize="7">{cm}</text>
                </g>
              );
            })}

            {/* Sound intensity indicator */}
            <text x="150" y="270" textAnchor="middle" fill={isAtResonance ? '#facc15' : '#94a3b8'} fontSize="10" fontWeight="bold">
              {isAtResonance ? '🔊 LOUD RESONANCE HUM DETECTED!' : `Sound: ${Math.round(loudness * 100)}%`}
            </text>
          </svg>

          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold">Air Column l = {waterLevelCm} cm</span>
            <span className="text-amber-400 font-bold">1st Res: {trueL1} cm</span>
            <span className="text-emerald-400 font-bold">2nd Res: {trueL2} cm</span>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Apparatus Controls</h4>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Tuning Fork Frequency (ν):</span>
              <span className="text-cyan-400 font-bold">{tuningForkFreq} Hz</span>
            </div>
            <div className="flex gap-2">
              {[480, 512, 580].map((f) => (
                <button
                  key={f}
                  onClick={() => setTuningForkFreq(f)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                    tuningForkFreq === f
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {f} Hz
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Water Level / Air Column (l):</span>
              <span className="text-amber-400 font-bold">{waterLevelCm} cm</span>
            </div>
            <input
              type="range"
              min="5"
              max="58"
              step="0.5"
              value={waterLevelCm}
              onChange={(e) => setWaterLevelCm(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <button
              onClick={() => setIsStriking(!isStriking)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-2 ${
                isStriking
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isStriking ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{isStriking ? 'Tuning Fork Vibrating' : 'Strike Tuning Fork with Rubber Pad'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-cyan-400 font-mono">Governing Formula:</div>
            <p className="text-slate-300 font-mono">v = 2ν(l₂ - l₁) = 2 × {tuningForkFreq} × ({(trueL2 - trueL1).toFixed(1)} / 100) = 340.0 m/s</p>
            <p className="text-slate-400 text-[10px]">
              The difference (l₂ - l₁) automatically eliminates the end correction (e = 0.3 d) of the tube.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
