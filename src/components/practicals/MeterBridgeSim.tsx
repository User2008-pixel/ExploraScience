import React, { useState } from 'react';
import { RotateCcw, Zap, Compass, CheckCircle } from 'lucide-react';

interface MeterBridgeSimProps {
  trueUnknownResistance?: number; // Ohms, e.g. 4.5 ohms
}

export const MeterBridgeSim: React.FC<MeterBridgeSimProps> = ({
  trueUnknownResistance = 4.5,
}) => {
  // Known resistance from resistance box R (1 to 20 ohms)
  const [resistanceBoxR, setResistanceBoxR] = useState<number>(5.0);
  // Jockey position along 100 cm wire (0 to 100 cm)
  const [jockeyPositionCm, setJockeyPositionCm] = useState<number>(52.6);
  // Wire specifications for resistivity computation
  const [wireLengthM] = useState<number>(1.0); // 1 meter
  const [wireRadiusMm] = useState<number>(0.25); // 0.25 mm radius

  // Ideal balancing length where X = R * (100 - l) / l
  // R / X = l / (100 - l) => l = (100 * R) / (R + trueUnknownResistance)
  const idealBalanceLengthCm = (100 * resistanceBoxR) / (resistanceBoxR + trueUnknownResistance);

  // Deflection in galvanometer:
  // Difference between jockey position and ideal balance point
  // Scaled to +/- 30 galvanometer divisions
  const diff = jockeyPositionCm - idealBalanceLengthCm;
  const galvanometerDeflection = Math.max(-30, Math.min(30, diff * 3.5));
  const isBalanced = Math.abs(diff) < 0.3;

  // Calculated experimental unknown resistance X = R * (100 - l) / l
  const l = Math.max(1, Math.min(99, jockeyPositionCm));
  const calculatedX = resistanceBoxR * ((100 - l) / l);

  // Cross sectional area A = pi * r^2
  const rMeters = wireRadiusMm * 1e-3;
  const areaM2 = Math.PI * rMeters * rMeters;
  // Specific resistance (resistivity) rho = X * A / L (ohm-meter)
  const calculatedResistivity = (calculatedX * areaM2) / wireLengthM;

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Class 12 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Meter Bridge (Wheatstone Bridge) Apparatus
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Slide the jockey to find the null balance point (zero deflection in galvanometer).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Resistance Box Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400">Resistance Box R:</span>
            <select
              value={resistanceBoxR}
              onChange={(e) => setResistanceBoxR(parseFloat(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-cyan-300 text-xs rounded px-2 py-0.5 font-mono focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  {val.toFixed(1)} Ω
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setJockeyPositionCm(Number(idealBalanceLengthCm.toFixed(1)))}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-500/30 transition flex items-center gap-1"
            title="Auto-slide jockey to exact null deflection"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Seek Null</span>
          </button>
        </div>
      </div>

      {/* Meter Bridge Apparatus Graphic & Galvanometer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main 100cm Bridge Board */}
        <div className="lg:col-span-8 bg-[#080d1a] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-inner">
          <svg viewBox="0 0 700 180" className="w-full h-auto select-none">
            {/* Wooden Base */}
            <rect x="20" y="20" width="660" height="140" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="4" />

            {/* Thick Copper Strips */}
            {/* Left L-strip */}
            <path d="M 40,40 L 150,40 L 150,60 L 60,60 L 60,140 L 40,140 Z" fill="#b45309" stroke="#d97706" strokeWidth="1" />
            {/* Center Strip */}
            <rect x="210" y="40" width="280" height="20" fill="#b45309" stroke="#d97706" strokeWidth="1" />
            {/* Right L-strip */}
            <path d="M 660,40 L 550,40 L 550,60 L 640,60 L 640,140 L 660,140 Z" fill="#b45309" stroke="#d97706" strokeWidth="1" />

            {/* Left Gap: Resistance Box R */}
            <rect x="155" y="32" width="50" height="35" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
            <text x="180" y="54" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              R={resistanceBoxR}Ω
            </text>

            {/* Right Gap: Unknown Resistance Wire X */}
            <rect x="495" y="32" width="50" height="35" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
            <text x="520" y="54" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              X (Wire)
            </text>

            {/* 100cm Manganin/Constantan Wire */}
            <line x1="60" y1="130" x2="640" y2="130" stroke="#f8fafc" strokeWidth="2.5" />

            {/* Meter Scale Graduations */}
            <rect x="60" y="135" width="580" height="15" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            {Array.from({ length: 11 }).map((_, i) => {
              const x = 60 + i * 58;
              return (
                <g key={i}>
                  <line x1={x} y1="135" x2={x} y2="145" stroke="#94a3b8" strokeWidth="1" />
                  <text x={x} y="148" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {i * 10}
                  </text>
                </g>
              );
            })}

            {/* Sliding Jockey */}
            {(() => {
              const jockeyX = 60 + (jockeyPositionCm / 100) * 580;
              return (
                <g transform={`translate(${jockeyX}, 0)`}>
                  {/* Lead wire from galvanometer down to jockey */}
                  <line x1="0" y1="95" x2="0" y2="130" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3,3" />
                  {/* Knife edge jockey handle */}
                  <polygon points="0,130 -6,115 -3,95 3,95 6,115" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                  <circle cx="0" cy="95" r="4" fill="#22d3ee" />
                  <text x="0" y="90" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {jockeyPositionCm.toFixed(1)}cm
                  </text>
                </g>
              );
            })()}
          </svg>

          {/* Wire Length Breakdown */}
          <div className="flex justify-between items-center text-xs font-mono px-2 pt-2 text-slate-300">
            <span className="text-cyan-400">
              Left Balancing Length (l): <strong>{jockeyPositionCm.toFixed(1)} cm</strong>
            </span>
            <span className="text-amber-400">
              Right Length (100 - l): <strong>{(100 - jockeyPositionCm).toFixed(1)} cm</strong>
            </span>
          </div>
        </div>

        {/* Sensitive Center-Zero Galvanometer Gauge */}
        <div className="lg:col-span-4 bg-[#080d1a] border border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-between text-center shadow-inner">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> Center-Zero Galvanometer
            </span>
            {isBalanced ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> NULL BALANCE
              </span>
            ) : (
              <span className="text-[9px] font-mono text-amber-400">UNBALANCED</span>
            )}
          </div>

          {/* Galvanometer Dial SVG */}
          <div className="relative w-44 h-28 my-2">
            <svg viewBox="0 0 200 120" className="w-full h-full select-none">
              {/* Dial Arc */}
              <path d="M 20,100 A 90,90 0 0,1 180,100" fill="none" stroke="#334155" strokeWidth="2" />

              {/* Tick Marks: -30 to +30 divisions */}
              {[-30, -20, -10, 0, 10, 20, 30].map((div) => {
                const angleRad = ((div / 30) * 50 - 90) * (Math.PI / 180);
                const x1 = 100 + 80 * Math.cos(angleRad);
                const y1 = 105 + 80 * Math.sin(angleRad);
                const x2 = 100 + 90 * Math.cos(angleRad);
                const y2 = 105 + 90 * Math.sin(angleRad);
                return (
                  <g key={div}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={div === 0 ? 2 : 1} />
                    <text
                      x={100 + 68 * Math.cos(angleRad)}
                      y={108 + 68 * Math.sin(angleRad)}
                      fill={div === 0 ? '#34d399' : '#94a3b8'}
                      fontSize="8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {Math.abs(div)}
                    </text>
                  </g>
                );
              })}

              {/* Center Zero Marker */}
              <text x="100" y="32" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                0
              </text>
              <text x="100" y="115" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                GALVANOMETER (G)
              </text>

              {/* Needle Pointer */}
              {(() => {
                const needleAngleRad = ((galvanometerDeflection / 30) * 50 - 90) * (Math.PI / 180);
                const nx = 100 + 75 * Math.cos(needleAngleRad);
                const ny = 105 + 75 * Math.sin(needleAngleRad);
                return (
                  <g>
                    <line
                      x1="100"
                      y1="105"
                      x2={nx}
                      y2={ny}
                      stroke={isBalanced ? '#10b981' : '#f43f5e'}
                      strokeWidth="2.5"
                    />
                    <circle cx="100" cy="105" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="text-xs font-mono">
            <span className="text-slate-400">Needle Deflection: </span>
            <span
              className={`font-bold ${
                isBalanced ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {galvanometerDeflection > 0 ? `+${galvanometerDeflection.toFixed(1)} div (Right)` : galvanometerDeflection < 0 ? `${galvanometerDeflection.toFixed(1)} div (Left)` : '0.0 div (Center Null)'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Jockey Slider */}
      <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span>Slide Jockey Along Wire (l):</span>
            <span className="text-cyan-400 font-bold">{jockeyPositionCm.toFixed(1)} cm</span>
          </span>
          <span className="text-slate-400">Total Scale: 100.0 cm</span>
        </div>
        <input
          type="range"
          min="1"
          max="99"
          step="0.1"
          value={jockeyPositionCm}
          onChange={(e) => setJockeyPositionCm(parseFloat(e.target.value))}
          className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Quantitative Calculations & Resistivity Output */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Formula: Wheatstone Ratio</span>
          <span className="text-xs text-cyan-300 block mt-0.5">X = R × (100 - l) / l</span>
          <span className="text-xs text-slate-400 block mt-1">
            = {resistanceBoxR} × ({ (100 - l).toFixed(1) } / { l.toFixed(1) })
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-sans">Calculated Unknown Resistance (X)</span>
          <span className="text-base font-extrabold text-white block mt-0.5">
            {calculatedX.toFixed(3)} Ω
          </span>
          <span className="text-[10px] text-slate-400">
            True Wire Value: {trueUnknownResistance.toFixed(1)} Ω
          </span>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50">
          <span className="text-[10px] text-cyan-400 uppercase block font-sans">Specific Resistance (Resistivity ρ)</span>
          <span className="text-base font-extrabold text-emerald-400 block mt-0.5">
            {(calculatedResistivity * 1e6).toFixed(3)} × 10⁻⁶ Ω·m
          </span>
          <span className="text-[10px] text-slate-400">
            Material: Constantan alloy
          </span>
        </div>
      </div>
    </div>
  );
};
