import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Zap, Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface ElectrostaticsSimProps {
  charge1?: number; // in microCoulombs (-10 to +10)
  charge2?: number; // in microCoulombs (-10 to +10)
  distanceCm?: number; // separation in cm (5 to 45)
}

export const ElectrostaticsSim: React.FC<ElectrostaticsSimProps> = ({
  charge1: propQ1 = 5,
  charge2: propQ2 = -5,
  distanceCm: propDist = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [charge1, setCharge1] = useState<number>(propQ1);
  const [charge2, setCharge2] = useState<number>(propQ2);
  const [distanceCm, setDistanceCm] = useState<number>(propDist);
  const isDraggingDist = useRef<boolean>(false);

  // Coulomb's Law: F = k * |q1 * q2| / r^2
  const rMeters = distanceCm / 100;
  const isAttractive = charge1 * charge2 < 0;
  const isRepulsive = charge1 * charge2 > 0;
  const forceMag = (8.99 * Math.abs(charge1 * charge2)) / Math.max(0.001, rMeters * rMeters);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#080e1e';
    ctx.fillRect(0, 0, w, h);

    const centerY = h * 0.5;
    const centerX = w * 0.5;
    const scale = (w * 0.6) / 45;
    const pixelDistance = distanceCm * scale;

    const q1X = centerX - pixelDistance / 2;
    const q1Y = centerY;
    const q2X = centerX + pixelDistance / 2;
    const q2Y = centerY;

    // Draw Electric Field Lines
    const numLines = Math.max(8, Math.min(24, Math.round((Math.abs(charge1) + Math.abs(charge2)) * 1.5)));
    ctx.lineWidth = 1;

    for (let i = 0; i < numLines; i++) {
      const angle = (i * 2 * Math.PI) / numLines;
      let currX = q1X + 16 * Math.cos(angle);
      let currY = q1Y + 16 * Math.sin(angle);
      const signQ1 = Math.sign(charge1) || 1;

      ctx.beginPath();
      ctx.moveTo(currX, currY);

      let step = 0;
      while (step < 75) {
        step++;
        const d1x = currX - q1X;
        const d1y = currY - q1Y;
        const r1Sq = d1x * d1x + d1y * d1y;
        const r1 = Math.sqrt(r1Sq);

        const d2x = currX - q2X;
        const d2y = currY - q2Y;
        const r2Sq = d2x * d2x + d2y * d2y;
        const r2 = Math.sqrt(r2Sq);

        if (r1 < 12 || r2 < 12 || currX < 0 || currX > w || currY < 0 || currY > h) break;

        const e1x = (charge1 * d1x) / Math.pow(r1, 3);
        const e1y = (charge1 * d1y) / Math.pow(r1, 3);
        const e2x = (charge2 * d2x) / Math.pow(r2, 3);
        const e2y = (charge2 * d2y) / Math.pow(r2, 3);

        const etotX = e1x + e2x;
        const etotY = e1y + e2y;
        const eMag = Math.hypot(etotX, etotY);

        if (eMag === 0) break;
        const dx = (etotX / eMag) * 5 * signQ1;
        const dy = (etotY / eMag) * 5 * signQ1;

        currX += dx;
        currY += dy;
        ctx.lineTo(currX, currY);
      }

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.stroke();
    }

    // Distance line between charges
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(q1X, centerY + 45);
    ctx.lineTo(q2X, centerY + 45);
    ctx.strokeStyle = '#64748b';
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${distanceCm} cm (${rMeters.toFixed(2)} m)`, centerX, centerY + 62);

    // Force Vectors on Q1 and Q2
    const forceArrowScale = Math.min(65, 12 + Math.log10(Math.max(1, forceMag)) * 12);
    const q1Dir = isAttractive ? 1 : -1;
    const q2Dir = isAttractive ? -1 : 1;

    // Vector Q1
    ctx.beginPath();
    ctx.moveTo(q1X, q1Y);
    ctx.lineTo(q1X + q1Dir * forceArrowScale, q1Y);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q1X + q1Dir * forceArrowScale, q1Y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Vector Q2
    ctx.beginPath();
    ctx.moveTo(q2X, q2Y);
    ctx.lineTo(q2X + q2Dir * forceArrowScale, q2Y);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q2X + q2Dir * forceArrowScale, q2Y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();

    // Draw Charge Q1 Body
    ctx.beginPath();
    ctx.arc(q1X, q1Y, 15, 0, Math.PI * 2);
    ctx.fillStyle = charge1 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(charge1 >= 0 ? `+${charge1}` : `${charge1}`, q1X, q1Y + 4);
    ctx.fillText('q₁', q1X, q1Y - 20);

    // Draw Charge Q2 Body
    ctx.beginPath();
    ctx.arc(q2X, q2Y, 15, 0, Math.PI * 2);
    ctx.fillStyle = charge2 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(charge2 >= 0 ? `+${charge2}` : `${charge2}`, q2X, q2Y + 4);
    ctx.fillText('q₂', q2X, q2Y - 20);

    ctx.restore();
  }, [charge1, charge2, distanceCm, forceMag, isAttractive, rMeters]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080e1e] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Coulomb&apos;s Law & Electrostatic Field Manipulator
            </h4>
          </div>
          <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-950/80 border border-yellow-800 px-2.5 py-0.5 rounded-full">
            Force: {forceMag.toFixed(2)} N ({isAttractive ? 'Attractive' : isRepulsive ? 'Repulsive' : 'Neutral'})
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Charge 1 (q₁):</span>
              <span
                className={`font-mono font-bold text-sm ${
                  charge1 > 0 ? 'text-rose-400' : charge1 < 0 ? 'text-sky-400' : 'text-slate-400'
                }`}
              >
                {charge1 > 0 ? `+${charge1}` : charge1} μC
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={charge1}
              onChange={(e) => setCharge1(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10 μC</span>
              <span>0 (Neutral)</span>
              <span>+10 μC</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Charge 2 (q₂):</span>
              <span
                className={`font-mono font-bold text-sm ${
                  charge2 > 0 ? 'text-rose-400' : charge2 < 0 ? 'text-sky-400' : 'text-slate-400'
                }`}
              >
                {charge2 > 0 ? `+${charge2}` : charge2} μC
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={charge2}
              onChange={(e) => setCharge2(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10 μC</span>
              <span>0 (Neutral)</span>
              <span>+10 μC</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Separation Distance (r):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{distanceCm} cm</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={distanceCm}
              onChange={(e) => setDistanceCm(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 cm (Close)</span>
              <span>25 cm</span>
              <span>45 cm (Far)</span>
            </div>
          </div>
        </div>

        {/* Charge Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => {
                setCharge1(5);
                setCharge2(-5);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
            >
              Dipole (+5 μC, -5 μC)
            </button>
            <button
              onClick={() => {
                setCharge1(6);
                setCharge2(6);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
            >
              Like Repulsion (+6 μC, +6 μC)
            </button>
            <button
              onClick={() => {
                setCharge1(10);
                setCharge2(-10);
                setDistanceCm(10);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Maximum Force (±10 μC @ 10cm)
            </button>
          </div>

          <button
            onClick={() => {
              setCharge1(5);
              setCharge2(-5);
              setDistanceCm(20);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Coulomb Force (F)</span>
          <div className="text-lg font-mono font-bold text-yellow-400">{forceMag.toFixed(2)} N</div>
          <span className="text-[10px] text-slate-500">
            {isAttractive ? 'Mutual Attraction' : isRepulsive ? 'Mutual Repulsion' : 'No Net Force'}
          </span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Electric Potential Energy (U)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {((8.99 * charge1 * charge2) / rMeters).toFixed(2)} J
          </div>
          <span className="text-[10px] text-slate-500">U = k q₁q₂ / r</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Electric Field at Midpoint</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {isAttractive
              ? `${(((8.99 * Math.abs(charge1) + 8.99 * Math.abs(charge2)) / Math.pow(rMeters / 2, 2))).toFixed(1)} N/C`
              : '0.0 N/C (Cancels)'}
          </div>
          <span className="text-[10px] text-slate-500">Superposition vector sum</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Coulomb&apos;s Inverse-Square Law</span>
          <div className="mt-1">
            <Formula tex="F = \frac{1}{4\pi\varepsilon_0} \frac{|q_1 q_2|}{r^2}" />
          </div>
        </div>
      </div>
    </div>
  );
};
