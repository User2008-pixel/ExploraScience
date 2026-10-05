import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Heart, Activity, Sliders, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface HumanCirculationSimProps {
  heartRateBpm?: number; // BPM (40 - 180)
  endDiastolicVolumeMl?: number; // EDV in mL (80 - 200)
  peripheralResistanceUnit?: number; // PRU (0.5 - 2.0)
}

export const HumanCirculationSim: React.FC<HumanCirculationSimProps> = ({
  heartRateBpm: propHR = 72,
  endDiastolicVolumeMl: propEDV = 120,
  peripheralResistanceUnit: propPRU = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [heartRate, setHeartRate] = useState<number>(propHR);
  const [edv, setEdv] = useState<number>(propEDV);
  const [tpr, setTpr] = useState<number>(propPRU);

  // Hemodynamic calculations
  // ESV normally ~ 50 mL, rises with high afterload/TPR
  const endSystolicVolumeMl = 50 * tpr;
  const strokeVolumeMl = Math.max(20, edv - endSystolicVolumeMl);
  const cardiacOutputLMin = (heartRate * strokeVolumeMl) / 1000;
  const ejectionFractionPercent = Math.round((strokeVolumeMl / edv) * 100);

  // Blood Pressure: Systolic / Diastolic
  // MAP = CO * TPR
  const meanArterialPressure = Math.round(cardiacOutputLMin * 18 * tpr);
  const systolicPressure = Math.round(meanArterialPressure * 1.3);
  const diastolicPressure = Math.round(meanArterialPressure * 0.85);

  // Animation cycle
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
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
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Phase frequency tied to heart rate (BPM)
      phase += (heartRate / 60) * 0.08;
      const heartBeatScale = 1 + Math.sin(phase) * 0.08;

      const cx = w * 0.35;
      const cy = h / 2;

      // Draw stylized cardiac chamber cross section
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(heartBeatScale, heartBeatScale);

      // Left Ventricle (Oxygenated Red)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(30, 20, 42, 55, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Right Ventricle (Deoxygenated Blue)
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.ellipse(-30, 20, 38, 52, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Left Atrium (Upper right)
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(25, -45, 28, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right Atrium (Upper left)
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.ellipse(-25, -45, 28, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Labels inside chambers
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RA', -25, -42);
      ctx.fillText('LA', 25, -42);
      ctx.fillText('RV', -30, 25);
      ctx.fillText('LV', 30, 25);

      ctx.restore();

      // Hemodynamic Gauges Panel on Right
      const rightX = w * 0.65;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(rightX - 20, 25, w - rightX + 10, h - 50);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rightX - 20, 25, w - rightX + 10, h - 50);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cardiac Output Telemetry', rightX, 50);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`HR: ${heartRate} BPM`, rightX, 78);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Stroke Vol: ${strokeVolumeMl.toFixed(0)} mL`, rightX, 102);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`BP: ${systolicPressure}/${diastolicPressure} mmHg`, rightX, 126);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Ejection Frac: ${ejectionFractionPercent}%`, rightX, 150);
      ctx.fillStyle = '#ec4899';
      ctx.fillText(`Cardiac Out: ${cardiacOutputLMin.toFixed(2)} L/min`, rightX, 174);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [heartRate, strokeVolumeMl, systolicPressure, diastolicPressure, ejectionFractionPercent, cardiacOutputLMin]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />
      </div>

      {/* Direct Manipulation Sliders & Presets */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Hemodynamic Cardiac Cycle Manipulator
            </h4>
          </div>
          <span className="text-xs text-rose-400 font-mono font-bold bg-rose-950/80 border border-rose-800 px-2.5 py-0.5 rounded-full">
            CO = {cardiacOutputLMin.toFixed(2)} L/min • EF = {ejectionFractionPercent}%
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Heart Rate (HR):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{heartRate} BPM</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              step="1"
              value={heartRate}
              onChange={(e) => setHeartRate(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>40 (Bradycardia)</span>
              <span>72 (Normal)</span>
              <span>180 (Tachycardia)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">End-Diastolic Volume (Preload):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{edv} mL</span>
            </div>
            <input
              type="range"
              min="80"
              max="200"
              step="2"
              value={edv}
              onChange={(e) => setEdv(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>80 mL (Low Preload)</span>
              <span>120 mL (Rest)</span>
              <span>200 mL (Athlete)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Total Peripheral Resistance (Afterload):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{tpr.toFixed(2)} PRU</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={tpr}
              onChange={(e) => setTpr(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 (Vasodilation)</span>
              <span>1.0 (Normal)</span>
              <span>2.0 (Vasoconstriction)</span>
            </div>
          </div>
        </div>

        {/* Physiological Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Physiological States:</span>
            <button
              onClick={() => {
                setHeartRate(72);
                setEdv(120);
                setTpr(1.0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Basal Rest (72 BPM)
            </button>
            <button
              onClick={() => {
                setHeartRate(150);
                setEdv(170);
                setTpr(0.7);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Heavy Exercise (150 BPM)
            </button>
            <button
              onClick={() => {
                setHeartRate(50);
                setEdv(160);
                setTpr(0.9);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
            >
              Endurance Athlete (50 BPM)
            </button>
            <button
              onClick={() => {
                setHeartRate(95);
                setEdv(110);
                setTpr(1.8);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Hypertensive Crisis
            </button>
          </div>

          <button
            onClick={() => {
              setHeartRate(72);
              setEdv(120);
              setTpr(1.0);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Hemodynamic Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Cardiac Output (CO)</span>
          <div className="text-lg font-mono font-bold text-rose-400">{cardiacOutputLMin.toFixed(2)} L/min</div>
          <span className="text-[10px] text-slate-500">CO = HR × Stroke Volume</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Stroke Volume (SV)</span>
          <div className="text-lg font-mono font-bold text-sky-400">{strokeVolumeMl.toFixed(0)} mL/beat</div>
          <span className="text-[10px] text-slate-500">SV = EDV - ESV</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Blood Pressure</span>
          <div className="text-lg font-mono font-bold text-amber-400">
            {systolicPressure}/{diastolicPressure} <span className="text-xs font-normal">mmHg</span>
          </div>
          <span className="text-[10px] text-slate-500">MAP ≈ {meanArterialPressure} mmHg</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Frank-Starling Law</span>
          <div className="mt-1">
            <Formula tex="\text{SV} \propto \text{End-Diastolic Preload}" />
          </div>
        </div>
      </div>
    </div>
  );
};
