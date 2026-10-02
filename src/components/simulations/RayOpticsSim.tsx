import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface RayOpticsSimProps {
  angle1: number; // Incident angle in degrees (0 to 85)
  n1: number; // Refractive index of medium 1 (e.g. 1.0 Air)
  n2: number; // Refractive index of medium 2 (e.g. 1.33 Water, 1.5 Glass, 2.42 Diamond)
}

export const RayOpticsSim: React.FC<RayOpticsSimProps> = ({
  angle1 = 45,
  n1 = 1.0,
  n2 = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  // sin(theta2) = (n1 / n2) * sin(theta1)
  const rad1 = (angle1 * Math.PI) / 180;
  const sin2 = (n1 / n2) * Math.sin(rad1);
  const isTotalInternalReflection = sin2 > 1.0;
  const rad2 = isTotalInternalReflection ? 0 : Math.asin(sin2);
  const angle2 = (rad2 * 180) / Math.PI;

  // Critical angle if n1 > n2: theta_c = asin(n2 / n1)
  const hasCriticalAngle = n1 > n2;
  const criticalAngleDeg = hasCriticalAngle ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

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

    // Medium 1 (Top)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h * 0.5);

    // Medium 2 (Bottom)
    const med2Grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    med2Grad.addColorStop(0, '#0c2340');
    med2Grad.addColorStop(1, '#071626');
    ctx.fillStyle = med2Grad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Interface boundary
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Normal line (dashed vertical)
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, h - 20);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Medium labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Medium 1 (n₁ = ${n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`Medium 2 (n₂ = ${n2.toFixed(2)})`, 20, h * 0.5 + 30);

    // Incident Ray (comes from top-left towards center)
    const rayLength = Math.min(w, h) * 0.45;
    const incStartX = centerX - rayLength * Math.sin(rad1);
    const incStartY = centerY - rayLength * Math.cos(rad1);

    ctx.beginPath();
    ctx.moveTo(incStartX, incStartY);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#facc15'; // yellow incident ray
    ctx.lineWidth = 3;
    ctx.stroke();

    // Incident ray arrow pointer
    const midIncX = (incStartX + centerX) / 2;
    const midIncY = (incStartY + centerY) / 2;
    ctx.beginPath();
    ctx.arc(midIncX, midIncY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // Partial Reflected Ray (Fresnel reflection)
    const reflEndX = centerX + rayLength * Math.sin(rad1);
    const reflEndY = centerY - rayLength * Math.cos(rad1);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(reflEndX, reflEndY);
    ctx.strokeStyle = isTotalInternalReflection ? '#facc15' : 'rgba(250, 204, 21, 0.4)';
    ctx.lineWidth = isTotalInternalReflection ? 3 : 1.5;
    ctx.stroke();

    // Refracted Ray or Total Internal Reflection
    if (isTotalInternalReflection) {
      // Announce TIR
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ TOTAL INTERNAL REFLECTION (TIR) OCCURRED', centerX, centerY + 50);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Incident angle θ₁ (${angle1}°) exceeds Critical Angle θ_c (${criticalAngleDeg?.toFixed(1)}°)`, centerX, centerY + 70);
    } else {
      // Refracted ray into medium 2
      const refrEndX = centerX + rayLength * Math.sin(rad2);
      const refrEndY = centerY + rayLength * Math.cos(rad2);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refrEndX, refrEndY);
      ctx.strokeStyle = '#38bdf8'; // blue refracted ray
      ctx.lineWidth = 3;
      ctx.stroke();

      // Refracted Ray arrow
      const midRefrX = (centerX + refrEndX) / 2;
      const midRefrY = (centerY + refrEndY) / 2;
      ctx.beginPath();
      ctx.arc(midRefrX, midRefrY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Angle arc for theta 2
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, Math.PI * 0.5 - rad2, Math.PI * 0.5);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Angle arc for theta 1
    ctx.beginPath();
    ctx.arc(centerX, centerY, 45, -Math.PI * 0.5, -Math.PI * 0.5 + rad1);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Angle texts
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'right';
    ctx.fillText(`θ₁ = ${angle1}°`, centerX - 10, centerY - 50);

    if (!isTotalInternalReflection) {
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(`θ₂ = ${angle2.toFixed(1)}°`, centerX + 10, centerY + 50);
    }
  }, [angle1, n1, n2, rad1, rad2, angle2, isTotalInternalReflection, criticalAngleDeg]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Incident Angle (θ₁)</span>
          <div className="text-lg font-mono font-bold text-amber-300">
            {angle1}°
          </div>
          <span className="text-[10px] text-slate-500">Angle relative to normal</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Refraction Angle (θ₂)</span>
          <div className={`text-lg font-mono font-bold ${isTotalInternalReflection ? 'text-rose-400' : 'text-sky-400'}`}>
            {isTotalInternalReflection ? 'TIR (None)' : `${angle2.toFixed(2)}°`}
          </div>
          <span className="text-[10px] text-slate-500">
            {isTotalInternalReflection ? 'Total internal reflection' : n1 < n2 ? 'Bends TOWARDS normal' : 'Bends AWAY from normal'}
          </span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Critical Angle (θ_c)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : 'N/A (n₁ ≤ n₂)'}
          </div>
          <span className="text-[10px] text-slate-500">θ_c = arcsin(n₂/n₁)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Snell's Formulation</span>
          <div className="mt-1">
            <Formula tex="n_1 \sin\theta_1 = n_2 \sin\theta_2" />
          </div>
        </div>
      </div>
    </div>
  );
};
