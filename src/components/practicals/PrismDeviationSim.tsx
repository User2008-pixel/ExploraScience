import React, { useState } from 'react';
import { Eye, RotateCcw, Compass, Sparkles, LineChart } from 'lucide-react';

interface PrismDeviationSimProps {
  prismAngleA?: number; // 60 degrees for equilateral prism
  trueRefractiveIndex?: number; // 1.52 for Crown Glass
}

export const PrismDeviationSim: React.FC<PrismDeviationSimProps> = ({
  prismAngleA = 60.0,
  trueRefractiveIndex = 1.52,
}) => {
  // Angle of incidence i (30 to 70 degrees)
  const [incidentAngleDeg, setIncidentAngleDeg] = useState<number>(48.0);
  const [recordedPoints, setRecordedPoints] = useState<{ i: number; delta: number }[]>([
    { i: 35, delta: 44.8 },
    { i: 40, delta: 40.2 },
    { i: 45, delta: 38.0 },
    { i: 48, delta: 37.8 }, // near minimum
    { i: 55, delta: 39.5 },
    { i: 60, delta: 42.1 },
  ]);

  // Optical calculations:
  // Snell's Law at first face: sin(i) = mu * sin(r1) => r1 = arcsin(sin(i) / mu)
  const iRad = (incidentAngleDeg * Math.PI) / 180;
  const sinR1 = Math.sin(iRad) / trueRefractiveIndex;
  const r1Rad = Math.asin(Math.min(0.999, sinR1));
  const r1Deg = (r1Rad * 180) / Math.PI;

  // Prism geometry: r1 + r2 = A => r2 = A - r1
  const r2Deg = prismAngleA - r1Deg;
  const r2Rad = (r2Deg * Math.PI) / 180;

  // Snell's Law at second face: mu * sin(r2) = sin(e) => e = arcsin(mu * sin(r2))
  const sinE = trueRefractiveIndex * Math.sin(r2Rad);
  const isTir = sinE > 1.0; // Total internal reflection if sinE > 1
  const eRad = isTir ? 0 : Math.asin(Math.min(1.0, sinE));
  const eDeg = (eRad * 180) / Math.PI;

  // Angle of deviation delta = i + e - A
  const deltaDeg = isTir ? 0 : incidentAngleDeg + eDeg - prismAngleA;

  // Theoretical angle of minimum deviation Dm:
  // At min deviation: i = e, r1 = r2 = A/2 = 30°
  // mu = sin((A + Dm)/2) / sin(A/2) => (A + Dm)/2 = arcsin(mu * sin(A/2))
  const halfA = (prismAngleA / 2) * (Math.PI / 180);
  const minDevAngleDeg = 2 * (Math.asin(trueRefractiveIndex * Math.sin(halfA)) * (180 / Math.PI)) - prismAngleA;

  // Refractive index calculation from minimum deviation:
  const calculatedMu =
    Math.sin(((prismAngleA + minDevAngleDeg) / 2) * (Math.PI / 180)) /
    Math.sin((prismAngleA / 2) * (Math.PI / 180));

  const handleLogDataPoint = () => {
    if (isTir) return;
    setRecordedPoints((prev) => {
      const filtered = prev.filter((p) => p.i !== incidentAngleDeg);
      return [...filtered, { i: incidentAngleDeg, delta: Number(deltaDeg.toFixed(1)) }].sort((a, b) => a.i - b.i);
    });
  };

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
              Glass Prism: Angle of Minimum Deviation & Refractive Index (μ)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Trace incident ray, measure emergent ray, and plot i vs δ curve to find minimum deviation D_m.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400">Prism Angle (A):</span>
            <span className="text-purple-300 font-bold">{prismAngleA}°</span>
          </div>

          <button
            onClick={() => setIncidentAngleDeg(48.0)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Reset to Minimum Deviation angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Ray Tracing Diagram */}
      <div className="relative bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 760 250" className="w-full h-auto select-none font-mono">
          <defs>
            <linearGradient id="glassPrismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Equilateral Triangle Glass Prism ABC */}
          {/* A = (380, 40), B = (260, 210), C = (500, 210) */}
          <polygon
            points="380,40 260,210 500,210"
            fill="url(#glassPrismGrad)"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Vertex Labels */}
          <text x="380" y="30" fill="#e0f2fe" fontSize="12" fontWeight="bold" textAnchor="middle">
            A (60°)
          </text>
          <text x="248" y="215" fill="#94a3b8" fontSize="11" textAnchor="end">B</text>
          <text x="512" y="215" fill="#94a3b8" fontSize="11">C</text>

          {/* Refraction calculations & points on SVG: */}
          {(() => {
            // Face AB line: from (380, 40) to (260, 210)
            // Midpoint of Face AB:
            const pIncX = 320;
            const pIncY = 125;
            // Face AB angle: dx = -120, dy = 170 => normal is perpendicular pointing up-left
            // Normal to Face AB at (320, 125):
            const normalAngleRad = Math.atan2(120, 170); // ~35 deg from horizontal
            const normLen = 45;
            const normX1 = pIncX - normLen * Math.cos(normalAngleRad);
            const normY1 = pIncY - normLen * Math.sin(normalAngleRad);
            const normX2 = pIncX + normLen * Math.cos(normalAngleRad);
            const normY2 = pIncY + normLen * Math.sin(normalAngleRad);

            // Incident ray starting point:
            const rayLen = 140;
            const incRayAngle = normalAngleRad + iRad;
            const rayStartX = pIncX - rayLen * Math.cos(incRayAngle);
            const rayStartY = pIncY - rayLen * Math.sin(incRayAngle);

            // Face AC line: from (380, 40) to (500, 210)
            // Point of Emergence on Face AC:
            const pEmX = 440;
            const pEmY = 125;

            // Emergent ray direction:
            const emNormalAngle = Math.atan2(-120, 170);
            const emRayAngle = emNormalAngle - eRad;
            const rayEndX = pEmX + rayLen * Math.cos(emRayAngle);
            const rayEndY = pEmY - rayLen * Math.sin(emRayAngle);

            return (
              <g>
                {/* Normal line at face AB */}
                <line x1={normX1} y1={normY1} x2={normX2} y2={normY2} stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
                <text x={normX1 - 10} y={normY1} fill="#64748b" fontSize="8">N</text>

                {/* Incident Ray */}
                <line x1={rayStartX} y1={rayStartY} x2={pIncX} y2={pIncY} stroke="#f59e0b" strokeWidth="2.5" />
                {/* Incident Pins P & Q */}
                <circle cx={rayStartX + 40} cy={rayStartY + (pIncY - rayStartY) * 0.3} r="3" fill="#f59e0b" />
                <circle cx={rayStartX + 85} cy={rayStartY + (pIncY - rayStartY) * 0.65} r="3" fill="#f59e0b" />
                <text x={rayStartX + 20} y={rayStartY - 5} fill="#f59e0b" fontSize="9">
                  Incident Ray (i = {incidentAngleDeg}°)
                </text>

                {/* Refracted Ray inside prism */}
                <line x1={pIncX} y1={pIncY} x2={pEmX} y2={pEmY} stroke="#38bdf8" strokeWidth="2.5" />

                {/* Emergent Ray */}
                {!isTir ? (
                  <>
                    <line x1={pEmX} y1={pEmY} x2={rayEndX} y2={rayEndY} stroke="#10b981" strokeWidth="2.5" />
                    {/* Emergent Pins R & S */}
                    <circle cx={pEmX + 40} cy={pEmY + (rayEndY - pEmY) * 0.3} r="3" fill="#10b981" />
                    <circle cx={pEmX + 85} cy={pEmY + (rayEndY - pEmY) * 0.65} r="3" fill="#10b981" />
                    <text x={pEmX + 30} y={rayEndY + 15} fill="#10b981" fontSize="9">
                      Emergent Ray (e = {eDeg.toFixed(1)}°)
                    </text>

                    {/* Extended rays showing angle of deviation delta */}
                    <line x1={pIncX} y1={pIncY} x2={pIncX + 110} y2={pIncY + (pIncY - rayStartY) * (110 / (pIncX - rayStartX))} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.6" />
                    <line x1={pEmX} y1={pEmY} x2={pEmX - 100} y2={pEmY - (rayEndY - pEmY) * (100 / (rayEndX - pEmX))} stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.6" />
                  </>
                ) : (
                  <text x="440" y="160" fill="#f43f5e" fontSize="10" fontWeight="bold">
                    Total Internal Reflection!
                  </text>
                )}
              </g>
            );
          })()}
        </svg>

        {/* Real-time Deviation Readout Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono font-bold flex items-center gap-2">
            <span className="text-slate-400">Angle of Deviation:</span>
            <span className="text-amber-300 text-sm">δ = {isTir ? 'TIR' : `${deltaDeg.toFixed(1)}°`}</span>
          </div>
        </div>
      </div>

      {/* Angle of Incidence Slider & Graph Logger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Angle of Incidence (i):</span>
            <span className="font-mono font-bold text-amber-300">{incidentAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="30"
            max="65"
            step="1"
            value={incidentAngleDeg}
            onChange={(e) => setIncidentAngleDeg(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30°</span>
            <span>48° (Min Dev)</span>
            <span>65°</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-mono space-y-0.5">
            <div className="text-slate-400">Internal Refraction:</div>
            <div className="text-cyan-300 font-bold">r₁ = {r1Deg.toFixed(1)}°, r₂ = {r2Deg.toFixed(1)}°</div>
          </div>
          <button
            onClick={handleLogDataPoint}
            className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 transition shadow-sm"
          >
            Log i vs δ Trial
          </button>
        </div>
      </div>

      {/* i vs Delta Curve & Refractive Index Calculation */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <LineChart className="w-3.5 h-3.5 text-purple-400" />
            <span>Prism Refractive Index Formula:</span>
          </span>
          <span className="text-emerald-400 font-bold">
            μ = sin((A + D_m)/2) / sin(A/2) = {calculatedMu.toFixed(3)} (Crown Glass = {trueRefractiveIndex})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {recordedPoints.map((pt) => (
            <div
              key={pt.i}
              className={`p-2 rounded-lg border text-center transition ${
                Math.abs(pt.delta - minDevAngleDeg) < 0.5
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-500">i = {pt.i}°</div>
              <div className="text-xs font-bold mt-0.5">δ = {pt.delta}°</div>
              {Math.abs(pt.delta - minDevAngleDeg) < 0.5 && (
                <span className="text-[9px] text-emerald-400 block font-normal">Minimum D_m</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
