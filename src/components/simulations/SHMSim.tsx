import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Activity, Sliders, RotateCcw, Play, Pause, Zap } from 'lucide-react';

interface SHMSimProps {
  amplitude?: number; // in meters (0.1 to 1.5)
  springConstant?: number; // k in N/m (10 to 100)
  mass?: number; // m in kg (0.5 to 10)
  damping?: number; // 0 (ideal) to 0.1 (damped)
}

export const SHMSim: React.FC<SHMSimProps> = ({
  amplitude: propA = 1.0,
  springConstant: propK = 40,
  mass: propM = 2.0,
  damping: propDamp = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [amplitude, setAmplitude] = useState<number>(propA);
  const [springConstant, setSpringConstant] = useState<number>(propK);
  const [mass, setMass] = useState<number>(propM);
  const [damping, setDamping] = useState<number>(propDamp);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Physics:
  // omega_0 = sqrt(k / m)
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

      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) {
        t += 0.025;
      }
      const currentAmp = amplitude * Math.exp(-damping * t * 0.5);
      const xPos = currentAmp * Math.cos(omega * t);
      const velocity = -currentAmp * omega * Math.sin(omega * t);
      const kineticE = 0.5 * mass * velocity * velocity;
      const potentialE = 0.5 * springConstant * xPos * xPos;

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

      // Spring coil from wall to block
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

      // Mass label
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
        ctx.moveTo(startX, centerY);
        ctx.lineTo(endX, centerY);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(endX, centerY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
      }

      // Bottom Area: Live Energy Conservation Bars & Waveform
      const barY = h - 65;
      const totalE = kineticE + potentialE;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(50, barY, w - 100, 22);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, barY, w - 100, 22);

      const kWidth = totalE > 0 ? (kineticE / totalE) * (w - 100) : 0;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(50, barY, kWidth, 22);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(50 + kWidth, barY, (w - 100) - kWidth, 22);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Kinetic (KE): ${kineticE.toFixed(1)} J`, 50, barY - 8);
      ctx.textAlign = 'right';
      ctx.fillText(`Potential (PE): ${potentialE.toFixed(1)} J`, w - 50, barY - 8);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [amplitude, springConstant, mass, damping, omega, isPlaying]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a101f] shadow-2xl">
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
              Simple Harmonic Oscillator Manipulator
            </h4>
          </div>
          <span className="text-xs text-sky-400 font-mono font-bold bg-sky-950/80 border border-sky-800 px-2.5 py-0.5 rounded-full">
            T = {period.toFixed(2)} s • f = {frequency.toFixed(2)} Hz • ω = {omega.toFixed(2)} rad/s
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Amplitude (A):</span>
              <span className="font-mono font-bold text-sky-400">{amplitude.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Spring Constant (k):</span>
              <span className="font-mono font-bold text-amber-400">{springConstant} N/m</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={springConstant}
              onChange={(e) => setSpringConstant(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Block Mass (m):</span>
              <span className="font-mono font-bold text-emerald-400">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Damping (b):</span>
              <span className="font-mono font-bold text-rose-400">{damping.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.08"
              step="0.005"
              value={damping}
              onChange={(e) => setDamping(parseFloat(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Oscillator Presets:</span>
            <button
              onClick={() => {
                setSpringConstant(80);
                setMass(1.0);
                setDamping(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              High Frequency (k=80, m=1)
            </button>
            <button
              onClick={() => {
                setSpringConstant(20);
                setMass(8.0);
                setDamping(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Heavy Sluggish (k=20, m=8)
            </button>
            <button
              onClick={() => {
                setDamping(0.04);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Damped Harmonic Motion
            </button>
          </div>

          <button
            onClick={() => {
              setAmplitude(1.0);
              setSpringConstant(40);
              setMass(2.0);
              setDamping(0);
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
          <span className="text-slate-400 block mb-0.5">Natural Frequency (f)</span>
          <div className="text-lg font-mono font-bold text-sky-400">{frequency.toFixed(2)} Hz</div>
          <span className="text-[10px] text-slate-500">Period: {period.toFixed(2)} s</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Angular Frequency (ω)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">{omega.toFixed(2)} rad/s</div>
          <span className="text-[10px] text-slate-500">ω = √(k/m)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Total Mechanical Energy (E)</span>
          <div className="text-lg font-mono font-bold text-amber-300">{maxKineticEnergy.toFixed(2)} J</div>
          <span className="text-[10px] text-slate-500">E = ½ k A²</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">SHM Equation of Motion</span>
          <div className="mt-1">
            <Formula tex="m \frac{d^2 x}{dt^2} + k x = 0" />
          </div>
        </div>
      </div>
    </div>
  );
};
