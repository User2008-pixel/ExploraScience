import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Heart, Activity } from 'lucide-react';

interface HumanCirculationSimProps {
  heartRateBpm: number; // BPM (50 - 160)
  endDiastolicVolumeMl: number; // EDV in mL (90 - 180)
  peripheralResistanceUnit: number; // PRU (0.6 - 1.8)
}

export const HumanCirculationSim: React.FC<HumanCirculationSimProps> = ({
  heartRateBpm,
  endDiastolicVolumeMl,
  peripheralResistanceUnit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hemodynamic calculations
  // Normal ESV ~ 50 mL
  const endSystolicVolumeMl = 50 * peripheralResistanceUnit;
  const strokeVolumeMl = Math.max(20, endDiastolicVolumeMl - endSystolicVolumeMl);
  const cardiacOutputLMin = (heartRateBpm * strokeVolumeMl) / 1000;
  const ejectionFractionPercent = Math.round((strokeVolumeMl / endDiastolicVolumeMl) * 100);

  // Blood Pressure: Systolic / Diastolic
  // MAP = CO * TPR
  const meanArterialPressure = Math.round(cardiacOutputLMin * 18 * peripheralResistanceUnit);
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
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Phase frequency tied to heart rate (BPM)
      phase += (heartRateBpm / 60) * 0.08;
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
      ctx.fillRect(rightX - 20, 30, w - rightX + 10, h - 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rightX - 20, 30, w - rightX + 10, h - 60);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cardiac Output Telemetry', rightX, 55);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`HR: ${heartRateBpm} BPM`, rightX, 85);
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Stroke Vol: ${strokeVolumeMl.toFixed(0)} mL`, rightX, 110);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Blood Pressure: ${systolicPressure}/${diastolicPressure} mmHg`, rightX, 135);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`Ejection Fraction: ${ejectionFractionPercent}%`, rightX, 160);
      ctx.fillStyle = '#ec4899';
      ctx.fillText(`Cardiac Output: ${cardiacOutputLMin.toFixed(2)} L/min`, rightX, 185);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [heartRateBpm, strokeVolumeMl, systolicPressure, diastolicPressure, ejectionFractionPercent, cardiacOutputLMin]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-slate-300 font-medium">Cardiovascular Hemodynamics & Cardiac Cycle</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Cardiac Output (CO): </span>
              <span className="text-emerald-400 font-bold">{cardiacOutputLMin.toFixed(2)}</span> L/min
            </div>
            <div>
              <span className="text-slate-500">Stroke Volume (SV): </span>
              <span className="text-cyan-400 font-bold">{strokeVolumeMl.toFixed(0)}</span> mL
            </div>
            <div>
              <span className="text-slate-500">Arterial Pressure: </span>
              <span className="text-amber-400 font-bold">{systolicPressure} / {diastolicPressure}</span> mmHg
            </div>
          </div>
        </div>
      </div>

      {/* PV Loop and Frank-Starling Curves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Frank-Starling Law: Stroke Volume vs EDV"
          xLabel="\text{EDV}"
          yLabel="\text{SV}"
          xUnit="mL"
          yUnit="mL"
          xDomain={[90, 180]}
          yDomain={[0, 130]}
          curveFunction={(edv) => edv - endSystolicVolumeMl}
          currentMarker={{ x: endDiastolicVolumeMl, y: strokeVolumeMl }}
          curveColor="#10b981"
          height={160}
        />
        <GraphViewer
          title="Cardiac Output vs Heart Rate: CO(HR)"
          xLabel="\text{HR}"
          yLabel="\text{CO}"
          xUnit="BPM"
          yUnit="L/min"
          xDomain={[50, 160]}
          yDomain={[0, 15]}
          curveFunction={(hr) => (hr * strokeVolumeMl) / 1000}
          currentMarker={{ x: heartRateBpm, y: cardiacOutputLMin }}
          curveColor="#f43f5e"
          height={160}
        />
      </div>

      {/* KaTeX Cardiovascular Formalism */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Hemodynamic Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Cardiac Output Equation</div>
            <Formula tex={`CO = HR \\times SV = ${heartRateBpm} \\times ${strokeVolumeMl.toFixed(0)}\\text{ mL} = ${cardiacOutputLMin.toFixed(2)}\\text{ L/min}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Ejection Fraction</div>
            <Formula tex={`EF = \\frac{SV}{EDV} = \\frac{${strokeVolumeMl.toFixed(0)}}{${endDiastolicVolumeMl}} = ${ejectionFractionPercent}\\%`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Mean Arterial Pressure (MAP)</div>
            <Formula tex={`MAP \\approx DP + \\frac{1}{3}(SP - DP) = ${meanArterialPressure}\\text{ mmHg}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
