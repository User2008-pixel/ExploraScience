import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';

interface WorkEnergySimProps {
  initialHeightM: number; // m (2 - 20)
  massKg: number; // kg (1 - 50)
  frictionWorkPercent: number; // % (0 - 50%)
}

export const WorkEnergySim: React.FC<WorkEnergySimProps> = ({
  initialHeightM,
  massKg,
  frictionWorkPercent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState(0); // 0 to 2*pi periodic motion on parabolic bowl

  const g = 9.8;
  const maxPotentialEnergy = massKg * g * initialHeightM;

  // Mechanical energy remaining after friction dissipation
  const frictionLossFactor = 1 - (frictionWorkPercent / 100) * 0.5;
  const effectiveMaxHeight = initialHeightM * frictionLossFactor;

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      let last = performance.now();
      const loop = (now: number) => {
        const dt = (now - last) / 1000;
        last = now;
        // Angular frequency omega ~ sqrt(g / R)
        setPhase((prev) => (prev + dt * 2.2) % (Math.PI * 2));
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Current instantaneous height and velocity along the track
  const currentHeight = (Math.cos(phase) + 1) * 0.5 * effectiveMaxHeight;
  const currentPotentialEnergy = massKg * g * currentHeight;
  const currentTotalEnergy = maxPotentialEnergy * frictionLossFactor;
  const currentKineticEnergy = Math.max(0, currentTotalEnergy - currentPotentialEnergy);
  const currentVelocity = Math.sqrt((2 * currentKineticEnergy) / massKg);

  // Render curved parabolic ramp canvas
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
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Track coordinates
    const leftX = 40;
    const rightX = w - 160; // leave space on right for energy bars
    const trackBottomY = h - 40;
    const trackTopY = 40;
    const trackSpanX = rightX - leftX;

    // Parabolic U-track path
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let px = leftX; px <= rightX; px++) {
      const normalizedX = (px - (leftX + trackSpanX / 2)) / (trackSpanX / 2); // -1 to 1
      const py = trackBottomY - (1 - normalizedX * normalizedX) * 0 + normalizedX * normalizedX * (trackBottomY - trackTopY);
      if (px === leftX) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mass position on track based on phase: x coordinate = center + amplitude * cos(phase)
    const normX = Math.cos(phase);
    const cartX = leftX + trackSpanX / 2 + normX * (trackSpanX / 2) * Math.sqrt(frictionLossFactor);
    const cartY = trackBottomY - (1 - normX * normX) * (trackBottomY - trackTopY) * frictionLossFactor;

    // Cart / Roller Coaster Sphere
    const sphereRadius = Math.min(18, Math.max(10, 8 + massKg * 0.2));
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cartX, cartY - sphereRadius, sphereRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cart mass text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${massKg}kg`, cartX, cartY - sphereRadius + 4);

    // Height reference line
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(cartX, cartY);
    ctx.lineTo(leftX, cartY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`h = ${currentHeight.toFixed(1)}m`, leftX + 8, cartY - 4);

    // --- Right Side Dynamic Energy Bars ---
    const barX = w - 120;
    const barW = 28;
    const barMaxH = 140;
    const barBaseY = h - 45;

    // 1. Kinetic Energy Bar (Emerald)
    const keFraction = Math.min(1, currentKineticEnergy / maxPotentialEnergy);
    const keH = keFraction * barMaxH;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, barBaseY - keH, barW, keH);
    ctx.strokeStyle = '#059669';
    ctx.strokeRect(barX, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('KE', barX + barW / 2, barBaseY + 16);
    ctx.fillText(`${Math.round(currentKineticEnergy)}J`, barX + barW / 2, barBaseY - keH - 6);

    // 2. Potential Energy Bar (Sky Blue)
    const peFraction = Math.min(1, currentPotentialEnergy / maxPotentialEnergy);
    const peH = peFraction * barMaxH;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(barX + 45, barBaseY - peH, barW, peH);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(barX + 45, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('PE', barX + 45 + barW / 2, barBaseY + 16);
    ctx.fillText(`${Math.round(currentPotentialEnergy)}J`, barX + 45 + barW / 2, barBaseY - peH - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('Energy (J)', barX + 35, barBaseY - barMaxH - 18);
  }, [phase, initialHeightM, massKg, frictionLossFactor, currentHeight, currentKineticEnergy, currentPotentialEnergy, maxPotentialEnergy]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Mechanical Energy Conservation Sandbox</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              onClick={() => setPhase(0)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset to Top"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Speed (v): </span>
              <span className="text-amber-300 font-bold">{currentVelocity.toFixed(1)}</span> m/s
            </div>
            <div>
              <span className="text-slate-500">Height (h): </span>
              <span className="text-cyan-300 font-bold">{currentHeight.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">Total Mechanical (E): </span>
              <span className="text-emerald-400 font-bold">{Math.round(currentTotalEnergy)}</span> J
            </div>
          </div>
        </div>
      </div>

      {/* Energy Transformation Curves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Conservation: Kinetic vs Height"
          xLabel="h"
          yLabel="K(h)"
          xUnit="m"
          yUnit="J"
          xDomain={[0, initialHeightM]}
          yDomain={[0, Math.ceil(maxPotentialEnergy * 1.1)]}
          curveFunction={(hVal) => Math.max(0, currentTotalEnergy - massKg * g * hVal)}
          currentMarker={{ x: currentHeight, y: currentKineticEnergy }}
          curveColor="#10b981"
          height={160}
        />
        <GraphViewer
          title="Velocity vs Height: v(h) = \sqrt{2g(h_0 - h)}"
          xLabel="h"
          yLabel="v(h)"
          xUnit="m"
          yUnit="m/s"
          xDomain={[0, initialHeightM]}
          yDomain={[0, Math.ceil(Math.sqrt(2 * g * initialHeightM) * 1.15)]}
          curveFunction={(hVal) => Math.sqrt(Math.max(0, 2 * g * (effectiveMaxHeight - hVal)))}
          currentMarker={{ x: currentHeight, y: currentVelocity }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* KaTeX Mathematical Derivations */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Conservation Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Total Mechanical Energy</div>
            <Formula tex={`E = K + U = \\frac{1}{2}mv^2 + mgh = ${Math.round(currentTotalEnergy)}\\text{ J}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Maximum Velocity at Lowest Point</div>
            <Formula tex={`v_{\\max} = \\sqrt{2gh_0} = ${(Math.sqrt(2 * g * effectiveMaxHeight)).toFixed(2)}\\text{ m/s}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Work-Energy Theorem</div>
            <Formula tex="W_{\\text{ext}} = \\Delta E_{\\text{mech}} = \\Delta K + \\Delta U" />
          </div>
        </div>
      </div>
    </div>
  );
};
