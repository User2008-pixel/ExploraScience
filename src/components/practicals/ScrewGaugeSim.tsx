import React, { useState } from 'react';
import { Eye, HelpCircle, Check, RotateCcw, Volume2, ShieldAlert } from 'lucide-react';

interface ScrewGaugeSimProps {
  initialWireDiameterMm?: number;
}

export const ScrewGaugeSim: React.FC<ScrewGaugeSimProps> = ({
  initialWireDiameterMm = 1.42,
}) => {
  // Main slider controls the position of the spindle in millimeters (0 to 15.00 mm)
  const [spindlePositionMm, setSpindlePositionMm] = useState<number>(initialWireDiameterMm);
  const [zeroErrorMm, setZeroErrorMm] = useState<number>(0); // in mm, e.g. +0.03 or -0.02
  const [hasRatchetClicked, setHasRatchetClicked] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(true);

  // Screw gauge constants:
  // Pitch = 1.0 mm (distance advanced per 1 full rotation)
  // Total Circular Scale Divisions (CSD) = 100
  // Least Count (LC) = Pitch / CSD = 1.0 mm / 100 = 0.01 mm = 0.001 cm
  const pitchMm = 1.0;
  const totalCsd = 100;
  const leastCountMm = pitchMm / totalCsd; // 0.01 mm

  // Pitch Scale Reading (PSR) is full pitch steps in mm
  const psrMm = Math.floor(spindlePositionMm / pitchMm) * pitchMm;

  // Fraction within the current pitch (0 to 0.99 mm)
  const circularFractionMm = spindlePositionMm - psrMm;
  // Circular Scale Reading (CSR) is the division coinciding with the baseline
  const csrDivision = Math.round(circularFractionMm / leastCountMm) % totalCsd;

  // Total observed reading
  const observedReadingMm = psrMm + csrDivision * leastCountMm;
  // Corrected reading = Observed - ZeroError
  const correctedReadingMm = Number((observedReadingMm - zeroErrorMm).toFixed(2));
  // Radius r = D / 2
  const wireRadiusMm = correctedReadingMm / 2;
  // Cross-sectional Area A = pi * r^2 (mm^2)
  const crossSectionalAreaMm2 = Math.PI * wireRadiusMm * wireRadiusMm;

  const handleRatchetClick = () => {
    setHasRatchetClicked(true);
    setTimeout(() => setHasRatchetClicked(false), 1200);
  };

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
              Class 11 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive Micrometer Screw Gauge Laboratory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pitch = 1.0 mm, 100 Circular Divisions. Least Count = 0.01 mm (10 μm).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zero Error Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400">Zero Error:</span>
            <select
              value={zeroErrorMm}
              onChange={(e) => setZeroErrorMm(parseFloat(e.target.value))}
              className="bg-transparent text-amber-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="0" className="bg-slate-900 text-white">0.00 mm (Nil)</option>
              <option value="0.03" className="bg-slate-900 text-white">+0.03 mm (+3 div Positive)</option>
              <option value="0.05" className="bg-slate-900 text-white">+0.05 mm (+5 div Positive)</option>
              <option value="-0.02" className="bg-slate-900 text-white">-0.02 mm (-2 div Negative)</option>
              <option value="-0.04" className="bg-slate-900 text-white">-0.04 mm (-4 div Negative)</option>
            </select>
          </div>

          <button
            onClick={() => setSpindlePositionMm(initialWireDiameterMm)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Reset to default wire diameter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram: SVG Micrometer Screw Gauge */}
      <div className="relative bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800/80 rounded-xl p-4 overflow-hidden">
        <svg
          viewBox="0 0 760 220"
          className="w-full h-auto select-none font-mono"
        >
          <defs>
            <linearGradient id="frameMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="steelStud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="thimbleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Heavy Curved U-Shaped Metallic Frame */}
          <path
            d="M 120 70 C 40 70, 20 180, 140 190 C 260 190, 270 140, 270 110"
            fill="none"
            stroke="url(#frameMetallic)"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 120 70 C 40 70, 20 180, 140 190 C 260 190, 270 140, 270 110"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Frame Label */}
          <text x="130" y="150" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
            0 - 15 mm × 0.01 mm
          </text>
          <text x="130" y="166" fill="#38bdf8" fontSize="9" textAnchor="middle">
            SCREW GAUGE MICROMETER
          </text>

          {/* Fixed Anvil Stud on Left */}
          <rect x="130" y="80" width="16" height="28" fill="url(#steelStud)" rx="2" />
          <line x1="146" y1="80" x2="146" y2="108" stroke="#38bdf8" strokeWidth="2" />

          {/* Wire Object Being Measured */}
          {spindlePositionMm > 0.05 && (
            <g>
              {/* Dynamic width based on spindle position */}
              <rect
                x="146"
                y="83"
                width={Math.min(130, spindlePositionMm * 10)}
                height="22"
                fill="#f59e0b"
                fillOpacity="0.85"
                stroke="#d97706"
                strokeWidth="1.5"
                rx="2"
              />
              <text
                x={146 + (spindlePositionMm * 10) / 2}
                y="98"
                fill="#0f172a"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                Wire: {correctedReadingMm.toFixed(2)} mm
              </text>
            </g>
          )}

          {/* Movable Spindle Stud */}
          <rect
            x={146 + spindlePositionMm * 10}
            y="80"
            width={124 - spindlePositionMm * 10 + 20}
            height="28"
            fill="url(#steelStud)"
            rx="2"
          />

          {/* Main Barrel / Sleeve with Pitch Scale (Fixed) */}
          <rect x="290" y="74" width="180" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="3" />

          {/* Reference Baseline on Barrel */}
          <line x1="290" y1="94" x2="470" y2="94" stroke="#e2e8f0" strokeWidth="2" />

          {/* Pitch Scale Markings (0, 1, 2, 3 ... 15 mm) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const x = 300 + i * 10;
            const isMajor = i % 5 === 0;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1="94"
                  x2={x}
                  y2={isMajor ? 82 : 87}
                  stroke="#cbd5e1"
                  strokeWidth={isMajor ? 1.5 : 1}
                />
                {isMajor && (
                  <text x={x} y="78" fill="#e2e8f0" fontSize="9" textAnchor="middle" fontWeight="bold">
                    {i}
                  </text>
                )}
                {/* 0.5 mm bottom division ticks */}
                {i < 15 && (
                  <line
                    x1={x + 5}
                    y1="94"
                    x2={x + 5}
                    y2="101"
                    stroke="#94a3b8"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* Rotating Thimble with Beveled Circular Scale (Moves with spindle) */}
          {(() => {
            const thimbleX = 300 + spindlePositionMm * 10;
            return (
              <g transform={`translate(${thimbleX}, 0)`}>
                {/* Beveled edge of thimble */}
                <polygon
                  points="0,70 24,64 24,124 0,118"
                  fill="#475569"
                  stroke="#64748b"
                  strokeWidth="1"
                />
                {/* Main knurled thimble body */}
                <rect x="24" y="64" width="90" height="60" fill="url(#thimbleGradient)" rx="2" />

                {/* Knurled grip pattern */}
                {Array.from({ length: 9 }).map((_, idx) => (
                  <line
                    key={idx}
                    x1={34 + idx * 9}
                    y1="67"
                    x2={34 + idx * 9}
                    y2="121"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Circular Scale Divisions on the bevel edge */}
                {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                  const divNum = (csrDivision + offset + 100) % 100;
                  const y = 94 - offset * 7;
                  const isCoinciding = offset === 0;
                  return (
                    <g key={offset}>
                      <line
                        x1="0"
                        y1={y}
                        x2={isCoinciding ? "18" : "10"}
                        stroke={isCoinciding ? "#38bdf8" : "#e2e8f0"}
                        strokeWidth={isCoinciding ? 2.5 : 1}
                      />
                      <text
                        x="19"
                        y={y + 3}
                        fill={isCoinciding ? "#38bdf8" : "#94a3b8"}
                        fontSize={isCoinciding ? "10" : "8"}
                        fontWeight={isCoinciding ? "bold" : "normal"}
                      >
                        {divNum}
                      </text>
                    </g>
                  );
                })}

                {/* Ratchet at the far right end */}
                <g transform="translate(114, 0)">
                  <rect x="0" y="80" width="30" height="28" fill="#1e293b" stroke="#334155" rx="3" />
                  <line x1="10" y1="82" x2="10" y2="106" stroke="#475569" strokeWidth="1" />
                  <line x1="20" y1="82" x2="20" y2="106" stroke="#475569" strokeWidth="1" />
                  <text x="15" y="98" fill="#38bdf8" fontSize="8" textAnchor="middle">
                    RATCHET
                  </text>
                </g>
              </g>
            );
          })()}

          {/* Coincidence Target Callout Pointer */}
          <line x1="290" y1="94" x2={300 + spindlePositionMm * 10} y2="94" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,2" />
        </svg>

        {/* Floating Quick Readout Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleRatchetClick}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              hasRatchetClicked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{hasRatchetClicked ? 'Click! Click! (Uniform Pressure)' : 'Turn Ratchet Head'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Spindle Opening / Wire Diameter:</span>
            <span className="font-mono font-bold text-amber-300">{spindlePositionMm.toFixed(2)} mm</span>
          </div>
          <input
            type="range"
            min="0"
            max="12.0"
            step="0.01"
            value={spindlePositionMm}
            onChange={(e) => setSpindlePositionMm(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.00 mm (Studs touch)</span>
            <span>5.00 mm</span>
            <span>12.00 mm</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-300 font-semibold block">Lab Specimen Wires:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Nichrome Wire (0.84 mm)', val: 0.84 },
              { label: 'Copper Wire (1.42 mm)', val: 1.42 },
              { label: 'Brass Lead (2.35 mm)', val: 2.35 },
              { label: 'Glass Plate (3.68 mm)', val: 3.68 },
            ].map((spec) => (
              <button
                key={spec.label}
                onClick={() => setSpindlePositionMm(spec.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                  Math.abs(spindlePositionMm - spec.val) < 0.02
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Step-by-Step Measurement Breakdown */}
      {showFormulaDetails && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              Micro-Measurement Reading Breakdown:
            </span>
            <span className="text-emerald-400 font-bold">
              Corrected Diameter D = {correctedReadingMm.toFixed(2)} mm
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">1. Pitch Scale (PSR):</span>
              <span className="text-white font-bold text-sm">{psrMm.toFixed(1)} mm</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Uncovered on barrel baseline</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">2. Circular Scale (CSR × LC):</span>
              <span className="text-cyan-300 font-bold text-sm">
                {csrDivision} × 0.01 = {(csrDivision * leastCountMm).toFixed(2)} mm
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Coinciding division = {csrDivision}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">3. Zero Correction:</span>
              <span className="text-amber-300 font-bold text-sm">
                {zeroErrorMm >= 0 ? `-${zeroErrorMm.toFixed(2)}` : `+${Math.abs(zeroErrorMm).toFixed(2)}`} mm
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Error = {zeroErrorMm > 0 ? `+${zeroErrorMm} mm` : zeroErrorMm < 0 ? `${zeroErrorMm} mm` : '0 mm'}
              </span>
            </div>
          </div>

          {/* Governing Formula */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">Calculated Cross-Section Area:</span>
              <span className="text-amber-300 font-bold">
                A = π (D / 2)² = π ({wireRadiusMm.toFixed(3)})² = {crossSectionalAreaMm2.toFixed(3)} mm²
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              <span className="text-cyan-400 font-semibold">Formula:</span> D = PSR + (CSR × LC) - Zero Error
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
