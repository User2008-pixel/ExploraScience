import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface ThermodynamicsSimProps {
  hotReservoirTempK: number; // T_H in Kelvin (400 to 1000 K)
  coldReservoirTempK: number; // T_C in Kelvin (200 to 380 K)
  compressionRatio: number; // V_max / V_min (2 to 8)
}

export const ThermodynamicsSim: React.FC<ThermodynamicsSimProps> = ({
  hotReservoirTempK = 650,
  coldReservoirTempK = 300,
  compressionRatio = 4.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Carnot Efficiency: eta = 1 - T_C / T_H
  const carnotEfficiency = 1 - coldReservoirTempK / hotReservoirTempK;
  const carnotEffPercent = Math.max(0, Math.min(100, Math.round(carnotEfficiency * 100)));
  const heatInputQh = 1000; // in Joules
  const workOutputW = heatInputQh * carnotEfficiency;
  const heatRejectedQc = heatInputQh - workOutputW;

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
    // 1 -> 2: Isothermal expansion at T_H
    // 2 -> 3: Adiabatic expansion T_H -> T_C
    // 3 -> 4: Isothermal compression at T_C
    // 4 -> 1: Adiabatic compression T_C -> T_H
    const v1 = pvMargin.left + graphW * 0.15;
    const p1 = pvMargin.top + graphH * (1 - (hotReservoirTempK / 1000) * 0.9);

    const v2 = pvMargin.left + graphW * 0.45;
    const p2 = pvMargin.top + graphH * (1 - (hotReservoirTempK / 1000) * 0.55);

    const v3 = pvMargin.left + graphW * 0.85;
    const p3 = pvMargin.top + graphH * (1 - (coldReservoirTempK / 1000) * 0.45);

    const v4 = pvMargin.left + graphW * 0.35;
    const p4 = pvMargin.top + graphH * (1 - (coldReservoirTempK / 1000) * 0.7);

    // Fill work enclosed area (W_net)
    ctx.beginPath();
    ctx.moveTo(v1, p1);
    ctx.quadraticCurveTo((v1 + v2) / 2, (p1 + p2) / 2 - 10, v2, p2);
    ctx.quadraticCurveTo((v2 + v3) / 2, (p2 + p3) / 2 - 5, v3, p3);
    ctx.quadraticCurveTo((v3 + v4) / 2, (p3 + p4) / 2 + 10, v4, p4);
    ctx.quadraticCurveTo((v4 + v1) / 2, (p4 + p1) / 2 + 5, v1, p1);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fill();

    // Trace cycle curves
    // 1 -> 2 Isothermal expansion (Red)
    ctx.beginPath();
    ctx.moveTo(v1, p1);
    ctx.quadraticCurveTo((v1 + v2) / 2, (p1 + p2) / 2 - 10, v2, p2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2 -> 3 Adiabatic expansion (Orange)
    ctx.beginPath();
    ctx.moveTo(v2, p2);
    ctx.quadraticCurveTo((v2 + v3) / 2, (p2 + p3) / 2 - 5, v3, p3);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 3 -> 4 Isothermal compression (Cyan)
    ctx.beginPath();
    ctx.moveTo(v3, p3);
    ctx.quadraticCurveTo((v3 + v4) / 2, (p3 + p4) / 2 + 10, v4, p4);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4 -> 1 Adiabatic compression (Sky)
    ctx.beginPath();
    ctx.moveTo(v4, p4);
    ctx.quadraticCurveTo((v4 + v1) / 2, (p4 + p1) / 2 + 5, v1, p1);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // State dots
    const states = [
      { x: v1, y: p1, label: '1' },
      { x: v2, y: p2, label: '2' },
      { x: v3, y: p3, label: '3' },
      { x: v4, y: p4, label: '4' },
    ];
    states.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(s.label, s.x + 8, s.y - 4);
    });

    // Net Work enclosed label
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Net Work W_net', (v1 + v3) / 2, (p1 + p3) / 2 + 5);

    // Right half: Heat Engine Sankey Flow Diagram
    const flowX = pvW + 20;
    const flowW = w - flowX - 20;
    const engY = h * 0.48;
    const engR = 34;
    const engX = flowX + flowW * 0.5;

    // Hot Reservoir (Top)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fillRect(flowX + 15, 20, flowW - 30, 36);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(flowX + 15, 20, flowW - 30, 36);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Hot Reservoir (T_H = ${hotReservoirTempK} K)`, engX, 42);

    // Cold Reservoir (Bottom)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(flowX + 15, h - 55, flowW - 30, 36);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(flowX + 15, h - 55, flowW - 30, 36);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`Cold Sink (T_C = ${coldReservoirTempK} K)`, engX, h - 33);

    // Heat pipe Q_H from hot reservoir into engine
    ctx.beginPath();
    ctx.moveTo(engX, 56);
    ctx.lineTo(engX, engY - engR);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = '#fca5a5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Q_H = ${heatInputQh} J`, engX + 12, (56 + engY - engR) / 2);

    // Engine Circle
    ctx.beginPath();
    ctx.arc(engX, engY, engR, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Carnot', engX, engY - 4);
    ctx.fillText('Engine', engX, engY + 10);

    // Work branch out to right
    const workW = Math.max(3, (workOutputW / heatInputQh) * 12);
    ctx.beginPath();
    ctx.moveTo(engX + engR, engY);
    ctx.lineTo(flowX + flowW - 10, engY);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = workW;
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`W = ${workOutputW.toFixed(0)} J`, flowX + flowW - 10, engY - 10);

    // Rejected heat Q_C down to cold sink
    const qcW = Math.max(3, (heatRejectedQc / heatInputQh) * 10);
    ctx.beginPath();
    ctx.moveTo(engX, engY + engR);
    ctx.lineTo(engX, h - 55);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = qcW;
    ctx.stroke();
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Q_C = ${heatRejectedQc.toFixed(0)} J`, engX + 12, (engY + engR + h - 55) / 2);
  }, [hotReservoirTempK, coldReservoirTempK, compressionRatio, carnotEfficiency, workOutputW, heatRejectedQc]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#0a101f]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Carnot Efficiency (η)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {carnotEffPercent}%
          </div>
          <span className="text-[10px] text-slate-500">Max theoretical thermodynamic limit</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Work Done (W)</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {workOutputW.toFixed(0)} <span className="text-xs font-normal text-slate-400">J / kJ in</span>
          </div>
          <span className="text-[10px] text-slate-500">W = Q_H − Q_C</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Waste Heat (Q_C)</span>
          <div className="text-lg font-mono font-bold text-cyan-300">
            {heatRejectedQc.toFixed(0)} <span className="text-xs font-normal text-slate-400">J</span>
          </div>
          <span className="text-[10px] text-slate-500">2nd Law: Impossible to have Q_C = 0</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Carnot Theorem</span>
          <div className="mt-1">
            <Formula tex="\eta_{\text{max}} = 1 - \frac{T_C}{T_H}" />
          </div>
        </div>
      </div>
    </div>
  );
};
