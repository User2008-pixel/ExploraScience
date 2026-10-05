import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Flame, Sliders, RotateCcw, Sparkles, Play, Pause, Zap } from 'lucide-react';

interface ThermodynamicsSimProps {
  hotReservoirTempK?: number; // T_H in Kelvin (400 to 1000 K)
  coldReservoirTempK?: number; // T_C in Kelvin (200 to 380 K)
  compressionRatio?: number; // V_max / V_min (2 to 8)
}

export const ThermodynamicsSim: React.FC<ThermodynamicsSimProps> = ({
  hotReservoirTempK: propTh = 650,
  coldReservoirTempK: propTc = 300,
  compressionRatio: propCr = 4.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [hotTemp, setHotTemp] = useState<number>(propTh);
  const [coldTemp, setColdTemp] = useState<number>(propTc);
  const [heatInput, setHeatInput] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Carnot Efficiency: eta = 1 - T_C / T_H
  const carnotEfficiency = 1 - coldTemp / hotTemp;
  const carnotEffPercent = Math.max(0, Math.min(100, Math.round(carnotEfficiency * 100)));
  const workOutputW = heatInput * carnotEfficiency;
  const heatRejectedQc = heatInput - workOutputW;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let cycleTime = 0;

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

      // Dark grid background
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, w, h);

      // Left half: Carnot P-V Diagram
      const pvW = w * 0.52;
      const pvMargin = { top: 40, right: 30, bottom: 45, left: 55 };
      const graphW = pvW - pvMargin.left - pvMargin.right;
      const graphH = h - pvMargin.top - pvMargin.bottom;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(pvMargin.left, pvMargin.top);
      ctx.lineTo(pvMargin.left, pvMargin.top + graphH);
      ctx.lineTo(pvMargin.left + graphW, pvMargin.top + graphH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('Pressure (P)', pvMargin.left - 8, pvMargin.top + 10);
      ctx.textAlign = 'center';
      ctx.fillText('Volume (V)', pvMargin.left + graphW / 2, pvMargin.top + graphH + 24);

      // 4 State points for Carnot Cycle
      const v1 = pvMargin.left + graphW * 0.15;
      const p1 = pvMargin.top + graphH * (1 - (hotTemp / 1000) * 0.9);

      const v2 = pvMargin.left + graphW * 0.45;
      const p2 = pvMargin.top + graphH * (1 - (hotTemp / 1000) * 0.55);

      const v3 = pvMargin.left + graphW * 0.85;
      const p3 = pvMargin.top + graphH * (1 - (coldTemp / 1000) * 0.45);

      const v4 = pvMargin.left + graphW * 0.35;
      const p4 = pvMargin.top + graphH * (1 - (coldTemp / 1000) * 0.7);

      // Fill work enclosed area (W_net)
      ctx.beginPath();
      ctx.moveTo(v1, p1);
      ctx.quadraticCurveTo((v1 + v2) / 2, (p1 + p2) / 2 - 10, v2, p2);
      ctx.quadraticCurveTo((v2 + v3) / 2, (p2 + p3) / 2 - 5, v3, p3);
      ctx.quadraticCurveTo((v3 + v4) / 2, (p3 + p4) / 2 + 10, v4, p4);
      ctx.quadraticCurveTo((v4 + v1) / 2, (p4 + p1) / 2 + 5, v1, p1);
      ctx.closePath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.fill();

      // Cycle curves
      ctx.beginPath();
      ctx.moveTo(v1, p1);
      ctx.quadraticCurveTo((v1 + v2) / 2, (p1 + p2) / 2 - 10, v2, p2);
      ctx.strokeStyle = '#ef4444'; // Isothermal expansion at T_H
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(v2, p2);
      ctx.quadraticCurveTo((v2 + v3) / 2, (p2 + p3) / 2 - 5, v3, p3);
      ctx.strokeStyle = '#f59e0b'; // Adiabatic expansion
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(v3, p3);
      ctx.quadraticCurveTo((v3 + v4) / 2, (p3 + p4) / 2 + 10, v4, p4);
      ctx.strokeStyle = '#06b6d4'; // Isothermal compression at T_C
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(v4, p4);
      ctx.quadraticCurveTo((v4 + v1) / 2, (p4 + p1) / 2 + 5, v1, p1);
      ctx.strokeStyle = '#38bdf8'; // Adiabatic compression
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // State dots
      const states = [
        { x: v1, y: p1, label: '1 (T_H)' },
        { x: v2, y: p2, label: '2' },
        { x: v3, y: p3, label: '3 (T_C)' },
        { x: v4, y: p4, label: '4' },
      ];
      states.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(s.label, s.x + 6, s.y - 4);
      });

      // Animated tracer along cycle
      if (isPlaying) {
        cycleTime = (cycleTime + 0.015) % 1;
      }
      let tracerX = v1;
      let tracerY = p1;
      if (cycleTime < 0.25) {
        const tNorm = cycleTime / 0.25;
        tracerX = v1 + (v2 - v1) * tNorm;
        tracerY = p1 + (p2 - p1) * tNorm;
      } else if (cycleTime < 0.5) {
        const tNorm = (cycleTime - 0.25) / 0.25;
        tracerX = v2 + (v3 - v2) * tNorm;
        tracerY = p2 + (p3 - p2) * tNorm;
      } else if (cycleTime < 0.75) {
        const tNorm = (cycleTime - 0.5) / 0.25;
        tracerX = v3 + (v4 - v3) * tNorm;
        tracerY = p3 + (p4 - p3) * tNorm;
      } else {
        const tNorm = (cycleTime - 0.75) / 0.25;
        tracerX = v4 + (v1 - v4) * tNorm;
        tracerY = p4 + (p1 - p4) * tNorm;
      }

      ctx.beginPath();
      ctx.arc(tracerX, tracerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Right half: Heat Engine Sankey Flow Diagram
      const engX = w * 0.75;
      const engY = h * 0.5;

      // Hot reservoir (Red top)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(engX - 60, 25, 120, 32);
      ctx.strokeStyle = '#f87171';
      ctx.strokeRect(engX - 60, 25, 120, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Hot Reservoir: ${hotTemp} K`, engX, 45);

      // Cold reservoir (Blue bottom)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(engX - 60, h - 55, 120, 32);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(engX - 60, h - 55, 120, 32);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Cold Sink: ${coldTemp} K`, engX, h - 35);

      // Engine circle in middle
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(engX, engY, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Carnot', engX, engY - 4);
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`η = ${carnotEffPercent}%`, engX, engY + 12);

      // Energy pipes: Q_H down, W right, Q_C down
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(engX, 57);
      ctx.lineTo(engX, engY - 32);
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`Q_H: ${heatInput} J`, engX + 40, (57 + engY - 32) / 2);

      // Work arrow right
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(engX + 32, engY);
      ctx.lineTo(engX + 75, engY);
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`W = ${workOutputW.toFixed(0)} J`, engX + 80, engY + 4);

      // Q_C out to cold reservoir
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(engX, engY + 32);
      ctx.lineTo(engX, h - 55);
      ctx.stroke();

      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Q_C: ${heatRejectedQc.toFixed(0)} J`, engX + 40, (engY + 32 + h - 55) / 2);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [hotTemp, coldTemp, heatInput, carnotEffPercent, workOutputW, heatRejectedQc, isPlaying]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a101f] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block" />

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
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Carnot Cycle & Thermodynamics Manipulator
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Carnot Efficiency: η = {carnotEffPercent}%
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Hot Reservoir (T_H):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{hotTemp} K ({(hotTemp - 273.15).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="10"
              value={hotTemp}
              onChange={(e) => setHotTemp(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>400 K</span>
              <span>650 K</span>
              <span>1200 K</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Cold Reservoir (T_C):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{coldTemp} K ({(coldTemp - 273.15).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min="150"
              max="380"
              step="5"
              value={coldTemp}
              onChange={(e) => setColdTemp(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>150 K (Cryogenic)</span>
              <span>300 K (Ambient)</span>
              <span>380 K</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Heat Absorbed (Q_H):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{heatInput} J</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={heatInput}
              onChange={(e) => setHeatInput(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>200 J</span>
              <span>1000 J</span>
              <span>2500 J</span>
            </div>
          </div>
        </div>

        {/* Engine Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Thermodynamic Presets:</span>
            <button
              onClick={() => {
                setHotTemp(600);
                setColdTemp(300);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Steam Turbine (600K → 300K, η=50%)
            </button>
            <button
              onClick={() => {
                setHotTemp(900);
                setColdTemp(300);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Gas Turbine (900K → 300K, η=67%)
            </button>
            <button
              onClick={() => {
                setHotTemp(1200);
                setColdTemp(200);
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Ultra Carnot Engine (1200K → 200K, η=83%)
            </button>
          </div>

          <button
            onClick={() => {
              setHotTemp(650);
              setColdTemp(300);
              setHeatInput(1000);
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
          <span className="text-slate-400 block mb-0.5">Carnot Efficiency (η)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">{carnotEffPercent}%</div>
          <span className="text-[10px] text-slate-500">Maximum theoretical limit</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Mechanical Work Done (W)</span>
          <div className="text-lg font-mono font-bold text-sky-400">{workOutputW.toFixed(0)} J</div>
          <span className="text-[10px] text-slate-500">W = Q_H - Q_C</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Heat Expelled to Sink (Q_C)</span>
          <div className="text-lg font-mono font-bold text-amber-300">{heatRejectedQc.toFixed(0)} J</div>
          <span className="text-[10px] text-slate-500">Second Law Entropy Tax</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Carnot Theorem</span>
          <div className="mt-1">
            <Formula tex="\eta = 1 - \frac{T_C}{T_H} = \frac{W}{Q_H}" />
          </div>
        </div>
      </div>
    </div>
  );
};
