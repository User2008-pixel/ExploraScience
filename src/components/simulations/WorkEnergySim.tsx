import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Activity, Sliders, Sparkles } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface WorkEnergySimProps {
  initialHeightM?: number; // m (2 - 20)
  massKg?: number; // kg (1 - 50)
  frictionWorkPercent?: number; // % (0 - 50%)
}

export const WorkEnergySim: React.FC<WorkEnergySimProps> = ({
  initialHeightM: propH = 10,
  massKg: propM = 15,
  frictionWorkPercent: propFric = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [initialHeightM, setInitialHeightM] = useState<number>(propH);
  const [massKg, setMassKg] = useState<number>(propM);
  const [frictionWorkPercent, setFrictionWorkPercent] = useState<number>(propFric);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [phase, setPhase] = useState<number>(0);

  const g = 9.8;
  const maxPotentialEnergy = massKg * g * initialHeightM;
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
        setPhase((prev) => (prev + dt * 2.2) % (Math.PI * 2));
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

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
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const leftX = 40;
    const rightX = w - 160;
    const trackBottomY = h - 40;
    const trackTopY = 40;
    const trackSpanX = rightX - leftX;

    // Parabolic U-track path
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let px = leftX; px <= rightX; px++) {
      const normalizedX = (px - (leftX + trackSpanX / 2)) / (trackSpanX / 2);
      const py = trackBottomY - 0 + normalizedX * normalizedX * (trackBottomY - trackTopY);
      if (px === leftX) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Mass position on track
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

    // Right Side Dynamic Energy Bars
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
    ctx.fillText('KE', barX + barW / 2, barBaseY + 14);

    // 2. Potential Energy Bar (Sky Blue)
    const peBarX = barX + 38;
    const peFraction = Math.min(1, currentPotentialEnergy / maxPotentialEnergy);
    const peH = peFraction * barMaxH;
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(peBarX, barBaseY - peH, barW, peH);
    ctx.strokeStyle = '#0284c7';
    ctx.strokeRect(peBarX, barBaseY - barMaxH, barW, barMaxH);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('PE', peBarX + barW / 2, barBaseY + 14);

    // Telemetry inside canvas
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Speed: ${currentVelocity.toFixed(1)} m/s`, leftX, 25);
    ctx.fillText(`KE: ${currentKineticEnergy.toFixed(0)} J`, leftX + 130, 25);
    ctx.fillText(`PE: ${currentPotentialEnergy.toFixed(0)} J`, leftX + 240, 25);

    ctx.restore();
  }, [phase, massKg, frictionLossFactor, currentHeight, currentKineticEnergy, currentPotentialEnergy, maxPotentialEnergy, currentVelocity]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-72 block" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Work-Energy Theorem & Conservation of Energy Manipulator
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            E_total = {currentTotalEnergy.toFixed(0)} J • v_max = {Math.sqrt(2 * g * effectiveMaxHeight).toFixed(1)} m/s
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Initial Drop Height (h₀):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{initialHeightM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={initialHeightM}
              onChange={(e) => setInitialHeightM(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2 m</span>
              <span>10 m</span>
              <span>20 m</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Cart Mass (m):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{massKg} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={massKg}
              onChange={(e) => setMassKg(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 kg</span>
              <span>25 kg</span>
              <span>50 kg</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Track Friction Dissipation:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{frictionWorkPercent}% Loss</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={frictionWorkPercent}
              onChange={(e) => setFrictionWorkPercent(parseInt(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Conservative)</span>
              <span>25%</span>
              <span>50% (High Friction)</span>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => {
                setInitialHeightM(10);
                setMassKg(15);
                setFrictionWorkPercent(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Frictionless Conservation (10m, 0% Loss)
            </button>
            <button
              onClick={() => {
                setInitialHeightM(18);
                setMassKg(35);
                setFrictionWorkPercent(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
            >
              High Energy Coaster (18m, 35kg)
            </button>
            <button
              onClick={() => {
                setFrictionWorkPercent(40);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
            >
              High Friction Drag (40% Loss)
            </button>
          </div>

          <button
            onClick={() => {
              setInitialHeightM(10);
              setMassKg(15);
              setFrictionWorkPercent(0);
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
          <span className="text-slate-400 block mb-0.5">Maximum Potential Energy</span>
          <div className="text-lg font-mono font-bold text-sky-400">{maxPotentialEnergy.toFixed(0)} J</div>
          <span className="text-[10px] text-slate-500">PE_max = m g h₀</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Peak Bottom Velocity</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {Math.sqrt(2 * g * effectiveMaxHeight).toFixed(2)} m/s
          </div>
          <span className="text-[10px] text-slate-500">v = √(2 g h_eff)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Work Done by Friction</span>
          <div className="text-lg font-mono font-bold text-rose-400">
            {(maxPotentialEnergy * (1 - frictionLossFactor)).toFixed(0)} J
          </div>
          <span className="text-[10px] text-slate-500">W_fric = ΔE_mech</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Work-Energy Theorem</span>
          <div className="mt-1">
            <Formula tex="W_{\text{net}} = \Delta K = K_f - K_i" />
          </div>
        </div>
      </div>
    </div>
  );
};
