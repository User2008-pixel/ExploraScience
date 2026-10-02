import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface SHMSimProps {
  amplitude: number; // in meters (0.1 to 1.5)
  springConstant: number; // k in N/m (10 to 100)
  mass: number; // m in kg (0.5 to 10)
  damping: number; // 0 (ideal) to 0.1 (damped)
}

export const SHMSim: React.FC<SHMSimProps> = ({
  amplitude = 1.0,
  springConstant = 40,
  mass = 2.0,
  damping = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics:
  // omega_0 = sqrt(k / m)
  // Period T = 2 * pi / omega_0
  const omega = Math.sqrt(springConstant / Math.max(0.1, mass));
  const period = (2 * Math.PI) / omega;
  const frequency = 1 / period;
  const maxKineticEnergy = 0.5 * springConstant * amplitude * amplitude;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const trail: { t: number; x: number }[] = [];

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, w, h);

      t += 0.025;
      const currentAmp = amplitude * Math.exp(-damping * t * 0.5);
      const xPos = currentAmp * Math.cos(omega * t); // displacement
      const velocity = -currentAmp * omega * Math.sin(omega * t);
      const kineticE = 0.5 * mass * velocity * velocity;
      const potentialE = 0.5 * springConstant * xPos * xPos;

      // Keep trail for waveform display
      trail.push({ t, x: xPos });
      if (trail.length > 140) trail.shift();

      // Top area: Spring & Mass
      const wallX = 50;
      const centerY = 75;
      const eqX = w * 0.45;
      const pixelsPerMeter = (w * 0.25) / Math.max(0.5, amplitude);
      const blockX = eqX + xPos * pixelsPerMeter;
      const blockSize = 40;

      // Wall
      ctx.fillStyle = '#334155';
      ctx.fillRect(wallX - 10, centerY - 45, 10, 90);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(wallX - 10, centerY - 45, 10, 90);

      // Floor track
      ctx.beginPath();
      ctx.moveTo(wallX - 10, centerY + blockSize / 2);
      ctx.lineTo(w - 20, centerY + blockSize / 2);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Equilibrium dashed line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(eqX, centerY - 40);
      ctx.lineTo(eqX, centerY + 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'center';
      ctx.fillText('x = 0 (Equilibrium)', eqX, centerY - 45);

      // Draw spring coil from wall to block
      const springLength = blockX - wallX;
      const coils = 14;
      const coilStep = springLength / coils;

      ctx.beginPath();
      ctx.moveTo(wallX, centerY);
      for (let i = 0; i <= coils; i++) {
        const cx = wallX + i * coilStep;
        const cy = i === 0 || i === coils ? centerY : centerY + (i % 2 === 0 ? -14 : 14);
        ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Draw block
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(blockX, centerY - blockSize / 2, blockSize, blockSize);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, centerY - blockSize / 2, blockSize, blockSize);

      // Mass label on block
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass.toFixed(1)}kg`, blockX + blockSize / 2, centerY + 4);

      // Restoring force vector
      const forceMag = -springConstant * xPos;
      const fNorm = Math.sign(forceMag);
      const fArrowLen = Math.min(50, Math.abs(forceMag) * 0.8);
      if (fArrowLen > 2) {
        const startX = blockX + blockSize / 2;
        const endX = startX + fNorm * fArrowLen;
        ctx.beginPath();
        ctx.moveTo(startX, centerY - blockSize / 2 - 8);
        ctx.lineTo(endX, centerY - blockSize / 2 - 8);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.arc(endX, centerY - blockSize / 2 - 8, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`F_rest = ${forceMag.toFixed(1)}N`, startX, centerY - blockSize / 2 - 14);
      }

      // Bottom Area: Waveform & Live Energy Bars
      const waveY = h * 0.72;
      const graphW = w * 0.58;

      // Axis for displacement vs time
      ctx.beginPath();
      ctx.moveTo(30, waveY);
      ctx.lineTo(graphW, waveY);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Waveform trace
      if (trail.length > 1) {
        ctx.beginPath();
        const startX = graphW;
        for (let i = 0; i < trail.length; i++) {
          const pt = trail[trail.length - 1 - i];
          const gx = startX - i * (graphW / 140);
          const gy = waveY - pt.x * (h * 0.18);
          if (i === 0) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Displacement Waveform x(t)', 30, waveY - 45);

      // Energy Bar Graphs (Right side)
      const barX = graphW + 40;
      const barW = (w - barX - 30) / 2;
      const maxBarH = 65;
      const totalE = kineticE + potentialE;

      // Kinetic Energy Bar
      const keH = maxKineticEnergy > 0 ? (kineticE / maxKineticEnergy) * maxBarH : 0;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(barX, waveY + 20 - keH, barW - 6, keH);
      ctx.strokeStyle = '#34d399';
      ctx.strokeRect(barX, waveY + 20 - maxBarH, barW - 6, maxBarH);

      // Potential Energy Bar
      const peH = maxKineticEnergy > 0 ? (potentialE / maxKineticEnergy) * maxBarH : 0;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(barX + barW, waveY + 20 - peH, barW - 6, peH);
      ctx.strokeStyle = '#fbbf24';
      ctx.strokeRect(barX + barW, waveY + 20 - maxBarH, barW - 6, maxBarH);

      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981';
      ctx.fillText('KE', barX + (barW - 6) / 2, waveY + 34);
      ctx.fillText(`${kineticE.toFixed(1)}J`, barX + (barW - 6) / 2, waveY + 46);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText('PE', barX + barW + (barW - 6) / 2, waveY + 34);
      ctx.fillText(`${potentialE.toFixed(1)}J`, barX + barW + (barW - 6) / 2, waveY + 46);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [amplitude, springConstant, mass, damping, omega, maxKineticEnergy]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0a101f]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Time Period (T)</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {period.toFixed(2)} <span className="text-xs font-normal text-slate-400">s</span>
          </div>
          <span className="text-[10px] text-slate-500">Frequency f = {frequency.toFixed(2)} Hz</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Angular Frequency (ω)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {omega.toFixed(2)} <span className="text-xs font-normal text-slate-400">rad/s</span>
          </div>
          <span className="text-[10px] text-slate-500">ω = √(k/m)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Mechanical Energy</span>
          <div className="text-lg font-mono font-bold text-amber-300">
            {maxKineticEnergy.toFixed(1)} <span className="text-xs font-normal text-slate-400">J</span>
          </div>
          <span className="text-[10px] text-slate-500">E = ½kA² (Conserved)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Hooke's Restoring Law</span>
          <div className="mt-1">
            <Formula tex="F = -kx, \quad T = 2\pi\sqrt{\frac{m}{k}}" />
          </div>
        </div>
      </div>
    </div>
  );
};
