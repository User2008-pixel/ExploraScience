import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Zap, Play } from 'lucide-react';

interface NervousSystemSimProps {
  stimulusIntensityMv: number; // 0 to 40 mV above resting
  myelinationPercent: number; // 0 to 100%
  extracellularNaMmol: number; // 100 to 180 mmol/L (standard 145)
}

export const NervousSystemSim: React.FC<NervousSystemSimProps> = ({
  stimulusIntensityMv = 25,
  myelinationPercent = 80,
  extracellularNaMmol = 145,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [pulseTime, setPulseTime] = useState(0);

  // Biological constants:
  // Resting potential = -70 mV
  // Threshold = -55 mV (i.e. +15 mV stimulus required)
  const restingPotential = -70;
  const threshold = -55;
  const thresholdTriggered = restingPotential + stimulusIntensityMv >= threshold;
  // Peak potential reaches +30 to +40 mV depending on extracellular Na+
  const peakPotential = Math.round(20 + ((extracellularNaMmol - 100) / 80) * 20);
  // Conduction velocity increases dramatically with myelination (1 m/s unmyelinated to 100 m/s myelinated)
  const conductionVelocity = (1 + (myelinationPercent / 100) * 80).toFixed(1);

  const triggerStimulus = () => {
    setIsFiring(true);
    setPulseTime(0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFiring) {
      timer = setInterval(() => {
        setPulseTime((prev) => {
          if (prev >= 1) {
            setIsFiring(false);
            return 1;
          }
          return prev + 0.035;
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isFiring]);

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

    // Left half: Action Potential Voltage-Time Graph
    const graphW = w * 0.48;
    const gMargin = { top: 35, right: 25, bottom: 40, left: 50 };
    const innerW = graphW - gMargin.left - gMargin.right;
    const innerH = h - gMargin.top - gMargin.bottom;

    // Draw Axes
    ctx.beginPath();
    ctx.moveTo(gMargin.left, gMargin.top);
    ctx.lineTo(gMargin.left, gMargin.top + innerH);
    ctx.lineTo(gMargin.left + innerW, gMargin.top + innerH);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Voltage mapping: -90 mV (bottom) to +50 mV (top)
    const mapV = (v: number) => {
      const norm = (v - (-90)) / (50 - (-90));
      return gMargin.top + innerH * (1 - norm);
    };

    // Reference dashed lines:
    // 0 mV
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(gMargin.left, mapV(0));
    ctx.lineTo(gMargin.left + innerW, mapV(0));
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    ctx.stroke();

    // Threshold -55 mV
    ctx.beginPath();
    ctx.moveTo(gMargin.left, mapV(-55));
    ctx.lineTo(gMargin.left + innerW, mapV(-55));
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.stroke();

    // Resting -70 mV
    ctx.beginPath();
    ctx.moveTo(gMargin.left, mapV(-70));
    ctx.lineTo(gMargin.left + innerW, mapV(-70));
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.stroke();
    ctx.setLineDash([]);

    // Y Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('+50', gMargin.left - 6, mapV(50) + 3);
    ctx.fillText('0', gMargin.left - 6, mapV(0) + 3);
    ctx.fillText('-55 (Thresh)', gMargin.left - 6, mapV(-55) + 3);
    ctx.fillText('-70 (Rest)', gMargin.left - 6, mapV(-70) + 3);
    ctx.fillText('-90', gMargin.left - 6, mapV(-90) + 3);

    ctx.textAlign = 'center';
    ctx.fillText('Time (ms)', gMargin.left + innerW / 2, gMargin.top + innerH + 24);

    // Action potential curve path:
    // Phase 1: Resting (-70)
    // Phase 2: Stimulus -> Depolarization (Na+ influx) up to peakPotential
    // Phase 3: Repolarization (K+ efflux) down to -80 (hyperpolarization)
    // Phase 4: Recovery to -70
    ctx.beginPath();
    const x0 = gMargin.left;
    const xStim = gMargin.left + innerW * 0.15;
    const xPeak = gMargin.left + innerW * 0.4;
    const xHyper = gMargin.left + innerW * 0.7;
    const xEnd = gMargin.left + innerW;

    ctx.moveTo(x0, mapV(-70));
    ctx.lineTo(xStim, mapV(-70));

    if (thresholdTriggered) {
      // Full action potential spike (All-or-Nothing Law)
      ctx.lineTo(gMargin.left + innerW * 0.22, mapV(-55)); // reaching threshold
      ctx.quadraticCurveTo(gMargin.left + innerW * 0.3, mapV(peakPotential + 10), xPeak, mapV(peakPotential));
      ctx.quadraticCurveTo(gMargin.left + innerW * 0.55, mapV(-40), xHyper, mapV(-82)); // hyperpolarization
      ctx.quadraticCurveTo(gMargin.left + innerW * 0.85, mapV(-75), xEnd, mapV(-70));
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Label Phases
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('Na+ Influx', xPeak - 10, mapV(peakPotential) - 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('K+ Efflux', xHyper - 15, mapV(-40));
    } else {
      // Subthreshold graded potential (dies out)
      const subPeak = restingPotential + stimulusIntensityMv;
      ctx.quadraticCurveTo(gMargin.left + innerW * 0.25, mapV(subPeak), gMargin.left + innerW * 0.45, mapV(-70));
      ctx.lineTo(xEnd, mapV(-70));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SUBTHRESHOLD: No Action Potential', gMargin.left + innerW / 2, gMargin.top + 25);
    }

    // Right Half: Axon & Saltatory Conduction Illustration
    const axonX = graphW + 20;
    const axonW = w - axonX - 20;
    const axonY = h * 0.48;

    // Axon Title
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Axon Fiber & Saltatory Conduction', axonX + axonW / 2, 25);

    // Axon tube
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(axonX, axonY - 14, axonW, 28);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(axonX, axonY - 14, axonW, 28);

    // Myelin Sheaths & Nodes of Ranvier
    const numSheaths = 4;
    const sheathSpacing = axonW / numSheaths;
    const hasMyelin = myelinationPercent > 20;

    for (let i = 0; i < numSheaths; i++) {
      const sx = axonX + i * sheathSpacing + 6;
      const sw = sheathSpacing - 12;

      if (hasMyelin) {
        // Myelin segment
        ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
        ctx.fillRect(sx, axonY - 24, sw, 48);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx, axonY - 24, sw, 48);

        ctx.fillStyle = '#eab308';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Myelin', sx + sw / 2, axonY - 28);
      }

      // Node of Ranvier (gap)
      const nodeX = sx + sw + 6;
      if (i < numSheaths - 1) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '8px monospace';
        ctx.fillText('Node', nodeX, axonY + 34);
      }
    }

    // Animated signal wave pulse
    if (isFiring && thresholdTriggered) {
      const pulseX = axonX + pulseTime * axonW;
      ctx.beginPath();
      ctx.arc(pulseX, axonY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glow ring
      ctx.beginPath();
      ctx.arc(pulseX, axonY, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }, [stimulusIntensityMv, myelinationPercent, extracellularNaMmol, thresholdTriggered, peakPotential, isFiring, pulseTime]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#080e1e]">
        <canvas ref={canvasRef} className="w-full h-80 block" />

        <div className="absolute top-3 right-3">
          <button
            onClick={triggerStimulus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Apply Electrical Stimulus</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Threshold Status</span>
          <div className={`text-base font-mono font-bold ${thresholdTriggered ? 'text-emerald-400' : 'text-rose-400'}`}>
            {thresholdTriggered ? 'Action Potential Fired' : 'Subthreshold (No Spike)'}
          </div>
          <span className="text-[10px] text-slate-500">Threshold: -55 mV | Stimulus: +{stimulusIntensityMv} mV</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Peak Overshoot</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            +{peakPotential} <span className="text-xs font-normal text-slate-400">mV</span>
          </div>
          <span className="text-[10px] text-slate-500">Depolarization by Na⁺ channel influx</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Conduction Velocity</span>
          <div className="text-lg font-mono font-bold text-amber-300">
            {conductionVelocity} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <span className="text-[10px] text-slate-500">Saltatory jump across Nodes of Ranvier</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Nernst / Goldman Law</span>
          <div className="mt-1">
            <Formula tex="V_m = \frac{RT}{F} \ln \left( \frac{P_{\text{K}}[\text{K}^+]_o + P_{\text{Na}}[\text{Na}^+]_o}{P_{\text{K}}[\text{K}^+]_i + P_{\text{Na}}[\text{Na}^+]_i} \right)" />
          </div>
        </div>
      </div>
    </div>
  );
};
