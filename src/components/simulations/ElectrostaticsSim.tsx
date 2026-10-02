import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface ElectrostaticsSimProps {
  charge1: number; // in microCoulombs (-10 to +10)
  charge2: number; // in microCoulombs (-10 to +10)
  distanceCm: number; // separation in cm (5 to 40)
}

export const ElectrostaticsSim: React.FC<ElectrostaticsSimProps> = ({
  charge1 = 5,
  charge2 = -5,
  distanceCm = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Coulomb's Law: F = k * |q1 * q2| / r^2
  // k ~ 8.99 * 10^9 N m^2 / C^2
  const rMeters = distanceCm / 100;
  const kCoulomb = 8.98755; // in GN·(μC)^-2 approx scale
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
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#080e1e';
    ctx.fillRect(0, 0, w, h);

    const centerY = h * 0.5;
    const centerX = w * 0.5;
    const scale = (w * 0.6) / 40; // pixels per cm
    const pixelDistance = distanceCm * scale;

    const q1X = centerX - pixelDistance / 2;
    const q1Y = centerY;
    const q2X = centerX + pixelDistance / 2;
    const q2Y = centerY;

    // Draw Electric Field Lines (Dipole / Like charges)
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

        // E field vector = k * q1 / r1^2 * r1_hat + k * q2 / r2^2 * r2_hat
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

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${distanceCm} cm (${rMeters.toFixed(2)} m)`, centerX, centerY + 60);

    // Force Vectors on Q1 and Q2
    const forceArrowScale = Math.min(65, 12 + Math.log10(Math.max(1, forceMag)) * 12);
    // If attractive: Q1 pulled right (+1), Q2 pulled left (-1)
    // If repulsive: Q1 pushed left (-1), Q2 pushed right (+1)
    const q1Dir = isAttractive ? 1 : -1;
    const q2Dir = isAttractive ? -1 : 1;

    // Vector Q1
    ctx.beginPath();
    ctx.moveTo(q1X, q1Y);
    ctx.lineTo(q1X + q1Dir * forceArrowScale, q1Y);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q1X + q1Dir * forceArrowScale, q1Y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Vector Q2
    ctx.beginPath();
    ctx.moveTo(q2X, q2Y);
    ctx.lineTo(q2X + q2Dir * forceArrowScale, q2Y);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(q2X + q2Dir * forceArrowScale, q2Y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Draw Charge 1 Sphere
    const q1Color = charge1 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(q1X, q1Y, 18, 0, Math.PI * 2);
    ctx.fillStyle = q1Color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(charge1 >= 0 ? `+${charge1}` : `${charge1}`, q1X, q1Y + 4);
    ctx.fillText('q₁', q1X, q1Y - 26);

    // Draw Charge 2 Sphere
    const q2Color = charge2 >= 0 ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(q2X, q2Y, 18, 0, Math.PI * 2);
    ctx.fillStyle = q2Color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(charge2 >= 0 ? `+${charge2}` : `${charge2}`, q2X, q2Y + 4);
    ctx.fillText('q₂', q2X, q2Y - 26);

    // Vector labels
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('F₁₂ (on q₁)', q1X + q1Dir * (forceArrowScale + 14), q1Y - 8);
    ctx.fillText('F₂₁ (on q₂)', q2X + q2Dir * (forceArrowScale + 14), q2Y - 8);
  }, [charge1, charge2, distanceCm, rMeters, forceMag, isAttractive, isRepulsive]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#080e1e]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Coulombic Force (F)</span>
          <div className="text-lg font-mono font-bold text-rose-400">
            {forceMag.toFixed(2)} <span className="text-xs font-normal text-slate-400">N</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {isAttractive ? 'Mutual Attraction' : isRepulsive ? 'Mutual Repulsion' : 'Neutral'}
          </span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Interaction Type</span>
          <div className="text-lg font-mono font-bold text-amber-300">
            {charge1 * charge2 < 0 ? 'Attractive (+ / −)' : 'Repulsive (Like)'}
          </div>
          <span className="text-[10px] text-slate-500">Newton\'s 3rd Law: F₁₂ = −F₂₁</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Inverse Square Law</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            F ∝ 1/r²
          </div>
          <span className="text-[10px] text-slate-500">Halving distance quadruples force</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Coulomb Equation</span>
          <div className="mt-1">
            <Formula tex="F = \frac{1}{4\pi\varepsilon_0}\frac{|q_1 q_2|}{r^2}" />
          </div>
        </div>
      </div>
    </div>
  );
};
