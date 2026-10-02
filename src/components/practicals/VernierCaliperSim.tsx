import React, { useState } from 'react';
import { Eye, HelpCircle, Check, RotateCcw } from 'lucide-react';

interface VernierCaliperSimProps {
  initialObjectDiameterMm?: number;
}

export const VernierCaliperSim: React.FC<VernierCaliperSimProps> = ({
  initialObjectDiameterMm = 24.6,
}) => {
  // Main slider controls the position of the jaw in millimeters (0 to 100 mm)
  const [jawPositionMm, setJawPositionMm] = useState<number>(initialObjectDiameterMm);
  const [zeroErrorCm, setZeroErrorCm] = useState<number>(0); // in cm
  const [showReadingBreakdown, setShowReadingBreakdown] = useState<boolean>(true);

  // Vernier constants:
  // 1 Main Scale Division (MSD) = 1 mm = 0.1 cm
  // 10 Vernier Scale Divisions (VSD) = 9 MSD = 9 mm
  // Least Count (LC) = 1 MSD - 1 VSD = 0.1 mm = 0.01 cm
  const lcMm = 0.1;
  const lcCm = 0.01;

  // Calculate MSR and VSR based on jawPositionMm
  // Main Scale Reading (MSR) is the integer part in mm
  const msrMm = Math.floor(jawPositionMm);
  const msrCm = msrMm / 10;

  // Fraction in mm (0 to 0.9 mm)
  const fractionMm = jawPositionMm - msrMm;
  // Vernier Scale Reading (VSR) is which division coincides (0 to 9)
  const vsrDivision = Math.round(fractionMm / lcMm) % 10;

  // Total observed reading
  const observedReadingCm = msrCm + vsrDivision * lcCm;
  // Corrected reading = Observed - ZeroError
  const correctedReadingCm = observedReadingCm - zeroErrorCm;

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Class 11 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Vernier Caliper Laboratory Apparatus
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Least Count = 0.01 cm (0.1 mm). Slide the movable jaw to measure object dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zero Error Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400">Zero Error:</span>
            <select
              value={zeroErrorCm}
              onChange={(e) => setZeroErrorCm(parseFloat(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded px-1.5 py-0.5 focus:outline-none"
            >
              <option value={0}>Nil (0.00 cm)</option>
              <option value={0.02}>+0.02 cm (Positive)</option>
              <option value={-0.03}>-0.03 cm (Negative)</option>
            </select>
          </div>

          <button
            onClick={() => setJawPositionMm(24.6)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Reset to 24.6 mm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Apparatus Drawing */}
      <div className="relative w-full h-56 bg-[#080d1a] border border-slate-800/80 rounded-xl overflow-hidden shadow-inner flex flex-col justify-center px-4">
        <svg viewBox="0 0 800 200" className="w-full h-full select-none">
          {/* Main Scale Beam (Fixed) */}
          <rect x="50" y="55" width="700" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="3" />

          {/* Fixed Jaws (Left) */}
          {/* Upper Jaw (Internal) */}
          <path d="M 50,55 L 50,15 L 75,55 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          {/* Lower Jaw (External) */}
          <path d="M 50,95 L 50,185 L 85,95 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />

          {/* Main Scale Graduations (0 to 12 cm, each cm has 10 mm marks) */}
          {Array.from({ length: 121 }).map((_, i) => {
            const x = 90 + i * 4.8;
            const isCm = i % 10 === 0;
            const isHalfCm = i % 5 === 0 && !isCm;
            const y1 = 55;
            const y2 = isCm ? 75 : isHalfCm ? 68 : 63;
            return (
              <g key={i}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="#94a3b8" strokeWidth={isCm ? 1.5 : 1} />
                {isCm && (
                  <text x={x} y="88" fill="#e2e8f0" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {i / 10}
                  </text>
                )}
              </g>
            );
          })}
          <text x="730" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
            cm
          </text>

          {/* Object being measured between jaws */}
          {jawPositionMm > 0 && (
            <rect
              x="50"
              y="110"
              width={Math.min(jawPositionMm * 4.8, 350)}
              height="50"
              fill="url(#brassGrad)"
              stroke="#b45309"
              strokeWidth="1.5"
              rx="2"
            />
          )}

          {/* Movable Vernier Slider (X shifts with jawPositionMm) */}
          {(() => {
            const sliderX = 50 + jawPositionMm * 4.8;
            return (
              <g transform={`translate(${sliderX}, 0)`}>
                {/* Movable Lower Jaw (External) */}
                <path d="M 0,95 L 0,185 L -35,95 Z" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
                {/* Movable Upper Jaw (Internal) */}
                <path d="M 0,55 L 0,15 L -25,55 Z" fill="#475569" stroke="#64748b" strokeWidth="1.5" />

                {/* Movable Vernier Window Body */}
                <rect x="-10" y="45" width="80" height="50" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" rx="3" opacity="0.95" />

                {/* Vernier Scale Markings (10 divisions = 9 MSD) */}
                {Array.from({ length: 11 }).map((_, v) => {
                  const vx = v * (4.8 * 0.9); // 9 mm spanned by 10 divisions
                  return (
                    <g key={v}>
                      <line x1={vx} y1="45" x2={vx} y2={v === 0 || v === 10 ? "62" : "55"} stroke="#38bdf8" strokeWidth={v === vsrDivision ? 2.5 : 1} />
                      {(v === 0 || v === 5 || v === 10) && (
                        <text x={vx} y="70" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {v}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Coinciding indicator arrow */}
                <polygon
                  points={`${vsrDivision * (4.8 * 0.9)},42 ${vsrDivision * (4.8 * 0.9) - 3},36 ${vsrDivision * (4.8 * 0.9) + 3},36`}
                  fill="#f59e0b"
                />
              </g>
            );
          })()}

          {/* Gradients */}
          <defs>
            <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>

        {/* Coinciding Division Callout */}
        <div className="absolute top-2 right-4 bg-slate-950/90 border border-amber-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Coinciding Vernier Mark: <strong>{vsrDivision}th division</strong></span>
        </div>
      </div>

      {/* Jaw Position Fine Slider */}
      <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span>Drag Vernier Jaw:</span>
            <span className="text-cyan-400 font-mono font-bold">{jawPositionMm.toFixed(1)} mm</span>
          </span>
          <span className="text-slate-400 text-[11px]">Range: 0.0 to 60.0 mm</span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          step="0.1"
          value={jawPositionMm}
          onChange={(e) => setJawPositionMm(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Measurement Readout & Step-by-Step Practical Calculation */}
      {showReadingBreakdown && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Main Scale (MSR)</span>
            <span className="text-sm font-bold text-white">
              {msrMm} mm = {msrCm.toFixed(1)} cm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Vernier Scale (VSR)</span>
            <span className="text-sm font-bold text-cyan-300">
              {vsrDivision} × 0.01 = {(vsrDivision * lcCm).toFixed(2)} cm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Observed Total</span>
            <span className="text-sm font-bold text-yellow-300">
              {observedReadingCm.toFixed(2)} cm
            </span>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50">
            <span className="text-[10px] text-cyan-400 uppercase block font-sans">Corrected Reading</span>
            <span className="text-base font-extrabold text-emerald-400">
              {correctedReadingCm.toFixed(2)} cm
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
