import React, { useState } from 'react';
import { RotateCcw, Zap, Compass, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';

interface PotentiometerSimProps {
  testCellEmf?: number; // E = 1.45 V
  trueInternalResistance?: number; // r = 2.4 ohms
}

export const PotentiometerSim: React.FC<PotentiometerSimProps> = ({
  testCellEmf = 1.45,
  trueInternalResistance = 2.4,
}) => {
  // Potentiometer wire total length = 400 cm (4-wire board)
  // Driver battery EMF = 2.0 V
  const driverBatteryEmf = 2.0;
  const wireResistanceOhms = 8.0; // 8 ohms for 400 cm
  const [driverCurrentA] = useState<number>(0.20); // steady DC
  const potentialGradientK = 0.003625; // V/cm (2.0V / 400cm adjusted with rheostat)

  // Circuit switches:
  // Key K1 (Driver circuit key) is always ON
  // Key K2 (Shunt resistance box key): false = Open circuit (EMF E), true = Closed circuit (Terminal V)
  const [isKeyK2Closed, setIsKeyK2Closed] = useState<boolean>(false);
  // Shunt resistance box R (1 to 20 ohms)
  const [shuntResistanceR, setShuntResistanceR] = useState<number>(5.0);
  // Jockey position along 400 cm wire
  const [jockeyPositionCm, setJockeyPositionCm] = useState<number>(315.0);

  // Physics calculation:
  // 1. Open Circuit (K2 OPEN):
  // Terminal potential V_open = E = 1.45 V
  // Ideal balance length l1 = E / k = 1.45 / 0.003625 = 400.0 cm * (1.45 / 2.0) ≈ 362.5 cm
  const idealOpenLengthL1 = 362.5;

  // 2. Closed Circuit (K2 CLOSED):
  // Load current through cell: I = E / (R + r)
  // Terminal voltage V = I * R = E * R / (R + r)
  // Ideal balance length l2 = V / k = l1 * R / (R + r)
  const terminalVoltageV = (testCellEmf * shuntResistanceR) / (shuntResistanceR + trueInternalResistance);
  const idealClosedLengthL2 = (idealOpenLengthL1 * shuntResistanceR) / (shuntResistanceR + trueInternalResistance);

  // Active ideal balance length depending on K2:
  const activeIdealLength = isKeyK2Closed ? idealClosedLengthL2 : idealOpenLengthL1;

  // Galvanometer deflection:
  const diff = jockeyPositionCm - activeIdealLength;
  const galvanometerDeflection = Math.max(-30, Math.min(30, diff * 1.8));
  const isBalanced = Math.abs(diff) < 0.6;

  // Calculated internal resistance from observed lengths:
  // Assume student records l1 = idealOpenLengthL1 (or current position when K2 open)
  // r = R * (l1 - l2) / l2
  const observedL = Math.max(10, Math.min(395, jockeyPositionCm));
  const calculatedR = isKeyK2Closed
    ? shuntResistanceR * ((idealOpenLengthL1 - observedL) / observedL)
    : 0;

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Class 12 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Potentiometer Apparatus: Internal Resistance of a Primary Cell
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Find null point l₁ (Key K₂ Open for EMF E) and null point l₂ (Key K₂ Closed with R for Terminal Voltage V).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Key K2 Toggle Button */}
          <button
            onClick={() => setIsKeyK2Closed(!isKeyK2Closed)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isKeyK2Closed
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            <span>Key K₂ (Shunt Box):</span>
            <span className="font-extrabold">{isKeyK2Closed ? 'CLOSED (With R)' : 'OPEN (Cell EMF)'}</span>
          </button>

          <button
            onClick={() => {
              setIsKeyK2Closed(false);
              setJockeyPositionCm(315.0);
              setShuntResistanceR(5.0);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Reset Potentiometer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Potentiometer SVG Graphic View */}
      <div className="relative bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 760 210" className="w-full h-auto select-none font-mono">
          {/* Wooden Potentiometer Board */}
          <rect x="30" y="20" width="700" height="170" fill="#1c1917" stroke="#44403c" strokeWidth="2" rx="4" />

          {/* Copper End Strips */}
          <rect x="45" y="35" width="16" height="140" fill="#d97706" rx="2" />
          <rect x="695" y="35" width="16" height="140" fill="#d97706" rx="2" />

          {/* 4 Manganin Wire Tracks (100 cm each = 400 cm total) */}
          {[0, 1, 2, 3].map((trackIdx) => {
            const y = 50 + trackIdx * 32;
            const isReversed = trackIdx % 2 === 1;
            const wireStartCm = trackIdx * 100;
            return (
              <g key={trackIdx}>
                {/* Millimeter scale track background */}
                <rect x="65" y={y - 8} width="625" height="16" fill="#0f172a" rx="2" />
                {/* Constantan wire line */}
                <line x1="65" y1={y} x2="690" y2={y} stroke="#fde047" strokeWidth="2.5" />

                {/* Sub-track Labels */}
                <text x="75" y={y - 10} fill="#94a3b8" fontSize="8">
                  {isReversed ? `${wireStartCm + 100} cm` : `${wireStartCm} cm`}
                </text>
                <text x="680" y={y - 10} fill="#94a3b8" fontSize="8" textAnchor="end">
                  {isReversed ? `${wireStartCm} cm` : `${wireStartCm + 100} cm`}
                </text>
              </g>
            );
          })}

          {/* Jockey Position Cursor on the active segment */}
          {(() => {
            const wireIdx = Math.min(3, Math.floor(jockeyPositionCm / 100));
            const remainderCm = jockeyPositionCm % 100;
            const isReversed = wireIdx % 2 === 1;
            const wireY = 50 + wireIdx * 32;
            const fraction = isReversed ? (100 - remainderCm) / 100 : remainderCm / 100;
            const jockeyX = 65 + fraction * 625;

            return (
              <g transform={`translate(${jockeyX}, ${wireY})`}>
                {/* Jockey Knife Edge Touch Point */}
                <polygon points="0,0 -6,-14 6,-14" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="1" />
                <rect x="-4" y="-30" width="8" height="16" fill="#38bdf8" rx="2" />
                <circle cx="0" cy="0" r="4" fill="#f43f5e" />
                {/* Jockey Coordinate Tag */}
                <text x="0" y="-34" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Jockey: {jockeyPositionCm.toFixed(1)} cm
                </text>
              </g>
            );
          })()}

          {/* Center-Zero Galvanometer HUD in corner */}
          <g transform="translate(560, 105)">
            <rect x="0" y="0" width="130" height="75" fill="#090d16" stroke="#334155" strokeWidth="1.5" rx="3" />
            <text x="65" y="15" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
              GALVANOMETER (G)
            </text>
            {/* Center zero scale arc */}
            <path d="M 25 50 Q 65 30 105 50" fill="none" stroke="#475569" strokeWidth="1.5" />
            {/* Center zero mark */}
            <line x1="65" y1="36" x2="65" y2="43" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="65" y="32" fill="#f43f5e" fontSize="7" textAnchor="middle">0</text>
            <text x="30" y="58" fill="#94a3b8" fontSize="7">-30</text>
            <text x="100" y="58" fill="#94a3b8" fontSize="7">+30</text>

            {/* Needle Pivot & Deflecting Pointer */}
            <circle cx="65" cy="62" r="3" fill="#cbd5e1" />
            {(() => {
              const needleAngleRad = ((galvanometerDeflection * 1.5) * Math.PI) / 180;
              const needleLen = 24;
              const tipX = 65 + needleLen * Math.sin(needleAngleRad);
              const tipY = 62 - needleLen * Math.cos(needleAngleRad);
              return (
                <line
                  x1="65"
                  y1="62"
                  x2={tipX}
                  y2={tipY}
                  stroke={isBalanced ? "#10b981" : "#f43f5e"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })()}
          </g>
        </svg>

        {/* Null Point Balance Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
              isBalanced
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/90 text-amber-300 border-amber-500/30'
            }`}
          >
            {isBalanced ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>NULL BALANCE POINT FOUND (Deflection = 0)</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Galv Deflection: {galvanometerDeflection > 0 ? `+${galvanometerDeflection.toFixed(0)}` : galvanometerDeflection.toFixed(0)} div</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls: Jockey Slider & Resistance Box R */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        {/* Jockey Slider (0 to 400 cm) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Jockey Contact Length:</span>
            <span className="font-mono font-bold text-cyan-300">{jockeyPositionCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min="0"
            max="400"
            step="0.5"
            value={jockeyPositionCm}
            onChange={(e) => setJockeyPositionCm(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 cm</span>
            <span>200 cm</span>
            <span>400 cm</span>
          </div>
        </div>

        {/* Shunt Resistance Box (when K2 is closed) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Shunt Resistance Box (R):</span>
            <span className="font-mono font-bold text-amber-300">{shuntResistanceR} Ω</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[2, 4, 5, 8, 10, 15].map((val) => (
              <button
                key={val}
                onClick={() => setShuntResistanceR(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                  shuntResistanceR === val
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {val} Ω
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experimental Internal Resistance Calculation */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            Primary Cell Internal Resistance Formula:
          </span>
          <span className="text-emerald-400 font-bold">
            r = R × (l₁ - l₂) / l₂ = {calculatedR > 0 ? `${calculatedR.toFixed(2)} Ω` : 'Pending l₂ balance'} (True r = {trueInternalResistance} Ω)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">1. Open Circuit Length (l₁):</span>
            <span className="text-cyan-300 font-bold text-sm">{idealOpenLengthL1.toFixed(1)} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Balancing Cell EMF (E = {testCellEmf}V)</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">2. Closed Circuit Length (l₂):</span>
            <span className="text-amber-300 font-bold text-sm">
              {isKeyK2Closed ? `${idealClosedLengthL2.toFixed(1)} cm` : 'Open Circuit'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Balancing Terminal Voltage V = {terminalVoltageV.toFixed(3)}V</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">3. Shunt Resistance (R):</span>
            <span className="text-purple-300 font-bold text-sm">{shuntResistanceR.toFixed(1)} Ω</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">r = {shuntResistanceR} × ({(idealOpenLengthL1 - idealClosedLengthL2).toFixed(1)} / {idealClosedLengthL2.toFixed(1)}) = {trueInternalResistance.toFixed(2)} Ω</span>
          </div>
        </div>
      </div>
    </div>
  );
};
