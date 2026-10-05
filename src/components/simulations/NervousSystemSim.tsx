import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Zap, Play, Sliders, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface NervousSystemSimProps {
  stimulusIntensityMv?: number; // 0 to 45 mV above resting
  myelinationPercent?: number; // 0 to 100%
  extracellularNaMmol?: number; // 100 to 180 mmol/L (standard 145)
}

export const NervousSystemSim: React.FC<NervousSystemSimProps> = ({
  stimulusIntensityMv: propStim = 25,
  myelinationPercent: propMyelin = 80,
  extracellularNaMmol: propNa = 145,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [stimulusMv, setStimulusMv] = useState<number>(propStim);
  const [myelination, setMyelination] = useState<number>(propMyelin);
  const [extracellularNa, setExtracellularNa] = useState<number>(propNa);
  const [ttxBlocked, setTtxBlocked] = useState<boolean>(false);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [pulseTime, setPulseTime] = useState<number>(0);

  // Biological constants:
  // Resting potential = -70 mV
  // Threshold = -55 mV (i.e. +15 mV stimulus required)
  const restingPotential = -70;
  const threshold = -55;
  const thresholdTriggered = !ttxBlocked && restingPotential + stimulusMv >= threshold;

  // Peak potential reaches +20 to +45 mV depending on extracellular Na+
  const peakPotential = Math.round(20 + ((extracellularNa - 100) / 80) * 20);

  // Conduction velocity increases dramatically with myelination (1 m/s unmyelinated to 100 m/s myelinated)
  const conductionVelocity = (1 + (myelination / 100) * 80).toFixed(1);

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
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
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
      const norm = (v - -90) / (50 - -90);
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
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
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

    // Action potential curve path
    ctx.beginPath();
    const x0 = gMargin.left;
    const xStim = gMargin.left + innerW * 0.15;
    const xPeak = gMargin.left + innerW * 0.38;
    const xHyper = gMargin.left + innerW * 0.68;
    const xEnd = gMargin.left + innerW;

    ctx.moveTo(x0, mapV(restingPotential));
    ctx.lineTo(xStim, mapV(restingPotential));

    if (ttxBlocked) {
      // TTX blocks Na+ channels completely -> graded local bump only
      ctx.quadraticCurveTo(
        (xStim + xPeak) / 2,
        mapV(restingPotential + Math.min(10, stimulusMv * 0.3)),
        xPeak + 20,
        mapV(restingPotential)
      );
      ctx.lineTo(xEnd, mapV(restingPotential));
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else if (thresholdTriggered) {
      // Full Action Potential Spike
      ctx.lineTo(xStim + 15, mapV(threshold));
      ctx.lineTo(xPeak, mapV(peakPotential)); // Depolarization
      ctx.lineTo(xHyper, mapV(-82)); // Repolarization & Hyperpolarization
      ctx.quadraticCurveTo((xHyper + xEnd) / 2, mapV(-75), xEnd, mapV(restingPotential));

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Highlight peak
      ctx.beginPath();
      ctx.arc(xPeak, mapV(peakPotential), 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
    } else {
      // Subthreshold graded local bump (decays without spike)
      const localV = restingPotential + stimulusMv;
      ctx.quadraticCurveTo((xStim + xPeak) / 2, mapV(localV), xPeak + 30, mapV(restingPotential));
      ctx.lineTo(xEnd, mapV(restingPotential));

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Right half: Axon & Myelin Sheath Schematic
    const axonX = w * 0.54;
    const axonY = h * 0.52;
    const axonW = w * 0.42;

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Saltatory Axon Conduction', axonX, 28);

    // Axon cylinder
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(axonX, axonY - 14, axonW, 28);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(axonX, axonY - 14, axonW, 28);

    // Myelin sheaths
    const numSheaths = 5;
    const sheathSpacing = axonW / numSheaths;
    const sheathsToDraw = Math.round((myelination / 100) * numSheaths);

    for (let i = 0; i < numSheaths; i++) {
      const hasMyelin = i < sheathsToDraw;
      const sx = axonX + i * sheathSpacing + 6;
      const sw = sheathSpacing - 12;

      if (hasMyelin) {
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

      const nodeX = sx + sw + 6;
      if (i < numSheaths - 1) {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
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

      ctx.beginPath();
      ctx.arc(pulseX, axonY, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }, [
    stimulusMv,
    myelination,
    extracellularNa,
    thresholdTriggered,
    peakPotential,
    isFiring,
    pulseTime,
    ttxBlocked,
  ]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080e1e] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={triggerStimulus}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Apply Electrical Stimulus</span>
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Action Potential Electrophysiology Manipulator
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
            Resting: -70 mV • Threshold: -55 mV
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-300 font-medium">Stimulus Voltage (ΔV):</span>
              <span className="font-mono font-bold text-yellow-400 text-sm">+{stimulusMv} mV</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={stimulusMv}
              onChange={(e) => setStimulusMv(parseInt(e.target.value))}
              className="w-full accent-yellow-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mV</span>
              <span>15 mV (Threshold)</span>
              <span>45 mV</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Myelination Degree:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{myelination}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={myelination}
              onChange={(e) => setMyelination(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Unmyelinated)</span>
              <span>50%</span>
              <span>100% (Saltatory)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Extracellular [Na⁺]:</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{extracellularNa} mmol/L</span>
            </div>
            <input
              type="range"
              min="100"
              max="180"
              step="2"
              value={extracellularNa}
              onChange={(e) => setExtracellularNa(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100 mmol</span>
              <span>145 (Physiological)</span>
              <span>180 mmol</span>
            </div>
          </div>
        </div>

        {/* Quick Presets & TTX Blocker Toggle */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => {
                setStimulusMv(10);
                setTtxBlocked(false);
                triggerStimulus();
              }}
              className="px-2.5 py-1 rounded-lg bg-yellow-950/80 hover:bg-yellow-900 text-yellow-300 border border-yellow-800 transition"
            >
              Subthreshold (+10 mV)
            </button>
            <button
              onClick={() => {
                setStimulusMv(16);
                setTtxBlocked(false);
                triggerStimulus();
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold transition"
            >
              Threshold (+16 mV Spike)
            </button>
            <button
              onClick={() => {
                setStimulusMv(35);
                setTtxBlocked(false);
                triggerStimulus();
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
            >
              Suprathreshold (+35 mV)
            </button>
            <button
              onClick={() => setTtxBlocked(!ttxBlocked)}
              className={`px-2.5 py-1 rounded-lg border font-bold transition flex items-center gap-1 ${
                ttxBlocked
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {ttxBlocked ? 'TTX Toxin (Na⁺ Blocked)' : 'Apply Tetrodotoxin (TTX)'}
            </button>
          </div>

          <button
            onClick={() => {
              setStimulusMv(25);
              setMyelination(80);
              setExtracellularNa(145);
              setTtxBlocked(false);
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
          <span className="text-slate-400 block mb-0.5">Threshold Status</span>
          <div
            className={`text-base font-mono font-bold ${
              ttxBlocked
                ? 'text-rose-400'
                : thresholdTriggered
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {ttxBlocked
              ? 'Blocked by TTX'
              : thresholdTriggered
              ? 'Action Potential Fired'
              : 'Subthreshold (No Spike)'}
          </div>
          <span className="text-[10px] text-slate-500">
            Threshold: -55 mV | Stimulus: +{stimulusMv} mV
          </span>
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
