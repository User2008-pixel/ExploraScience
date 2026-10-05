import React, { useEffect, useRef, useState } from 'react';
import { Formula } from '../common/Formula';
import { BatteryCharging, Sliders, RotateCcw, Zap, Sparkles, ArrowRightLeft } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ElectrochemicalCellSimProps {
  zincConc?: number; // M [Zn2+]
  copperConc?: number; // M [Cu2+]
  temperatureK?: number; // K
}

interface CouplePreset {
  name: string;
  anode: string;
  cathode: string;
  eAnode: number; // reduction potential
  eCathode: number; // reduction potential
  eStandard: number;
}

const COUPLE_PRESETS: CouplePreset[] = [
  { name: 'Daniell Cell (Zn-Cu)', anode: 'Zn', cathode: 'Cu', eAnode: -0.76, eCathode: 0.34, eStandard: 1.10 },
  { name: 'Zinc-Silver (Zn-Ag)', anode: 'Zn', cathode: 'Ag', eAnode: -0.76, eCathode: 0.80, eStandard: 1.56 },
  { name: 'Iron-Copper (Fe-Cu)', anode: 'Fe', cathode: 'Cu', eAnode: -0.44, eCathode: 0.34, eStandard: 0.78 },
  { name: 'Aluminum-Copper (Al-Cu)', anode: 'Al', cathode: 'Cu', eAnode: -1.66, eCathode: 0.34, eStandard: 2.00 },
];

export const ElectrochemicalCellSim: React.FC<ElectrochemicalCellSimProps> = ({
  zincConc: propZn = 1.0,
  copperConc: propCu = 1.0,
  temperatureK: propT = 298.15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [zincConc, setZincConc] = useState<number>(propZn);
  const [copperConc, setCopperConc] = useState<number>(propCu);
  const [temperatureK, setTemperatureK] = useState<number>(propT);
  const [hasSaltBridge, setHasSaltBridge] = useState<boolean>(true);
  const [selectedCouple, setSelectedCouple] = useState<CouplePreset>(COUPLE_PRESETS[0]);

  // Standard potentials
  const E_standard = selectedCouple.eStandard;
  const n_electrons = 2;
  const R_gas = 8.314;
  const F_faraday = 96485;

  // Nernst Equation
  // Q = [Anode] / [Cathode]
  const Q = Math.max(1e-5, zincConc / Math.max(1e-5, copperConc));
  const nernstFactor = (R_gas * temperatureK) / (n_electrons * F_faraday);
  const rawE = E_standard - nernstFactor * Math.log(Q);
  const E_cell = hasSaltBridge ? Math.max(0, rawE) : 0; // Without salt bridge, internal resistance -> infinity, Ecell -> 0

  // Animate electron flow in wire and ion diffusion in salt bridge
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const render = () => {
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

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const beakerW = 125;
      const beakerH = 140;
      const beakerY = h - beakerH - 25;
      const leftBeakerX = w * 0.22 - beakerW / 2;
      const rightBeakerX = w * 0.78 - beakerW / 2;

      // --- Left Beaker: Anode ---
      ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.fillRect(leftBeakerX + 4, beakerY + 30, beakerW - 8, beakerH - 34);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(leftBeakerX, beakerY, beakerW, beakerH);

      // Anode Electrode bar
      const znElecW = 18;
      const znElecX = leftBeakerX + beakerW / 2 - znElecW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(znElecX, beakerY - 20, znElecW, beakerH - 20);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(znElecX, beakerY - 20, znElecW, beakerH - 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${selectedCouple.anode} Anode (-)`, znElecX + znElecW / 2, beakerY - 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`[${selectedCouple.anode}²⁺] = ${zincConc.toFixed(2)}M`, leftBeakerX + beakerW / 2, beakerY + beakerH + 18);

      // --- Right Beaker: Cathode ---
      const blueAlpha = Math.min(0.7, 0.15 + copperConc * 0.25);
      ctx.fillStyle = `rgba(59, 130, 246, ${blueAlpha})`;
      ctx.fillRect(rightBeakerX + 4, beakerY + 30, beakerW - 8, beakerH - 34);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(rightBeakerX, beakerY, beakerW, beakerH);

      // Cathode Electrode bar
      const cuElecW = 18;
      const cuElecX = rightBeakerX + beakerW / 2 - cuElecW / 2;
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cuElecX, beakerY - 20, cuElecW, beakerH - 20);
      ctx.strokeStyle = '#b45309';
      ctx.strokeRect(cuElecX, beakerY - 20, cuElecW, beakerH - 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${selectedCouple.cathode} Cathode (+)`, cuElecX + cuElecW / 2, beakerY - 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`[${selectedCouple.cathode}²⁺] = ${copperConc.toFixed(2)}M`, rightBeakerX + beakerW / 2, beakerY + beakerH + 18);

      // --- Inverted U-Tube Salt Bridge ---
      const sbW = 80;
      const sbH = 65;
      const sbY = beakerY + 15;

      if (hasSaltBridge) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(leftBeakerX + beakerW - 20, sbY + sbH);
        ctx.lineTo(leftBeakerX + beakerW - 20, sbY);
        ctx.lineTo(rightBeakerX + 20, sbY);
        ctx.lineTo(rightBeakerX + 20, sbY + sbH);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('Salt Bridge (KNO₃)', w / 2, sbY - 8);

        offset += 0.8;
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('NO₃⁻ ←', w / 2 - 25, sbY + 4);
        ctx.fillStyle = '#10b981';
        ctx.fillText('→ K⁺', w / 2 + 25, sbY + 4);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('❌ Salt Bridge Removed (Circuit Broken, E = 0V)', w / 2, sbY + 20);
      }

      // --- External Circuit Wire & Voltmeter ---
      const wireY = 40;
      ctx.beginPath();
      ctx.moveTo(znElecX + znElecW / 2, beakerY - 20);
      ctx.lineTo(znElecX + znElecW / 2, wireY);
      ctx.lineTo(w / 2 - 25, wireY);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w / 2 + 25, wireY);
      ctx.lineTo(cuElecX + cuElecW / 2, wireY);
      ctx.lineTo(cuElecX + cuElecW / 2, beakerY - 20);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Voltmeter dial in center
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(w / 2, wireY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${E_cell.toFixed(3)}V`, w / 2, wireY + 4);

      // Animated electron flow
      if (hasSaltBridge && E_cell > 0.05) {
        ctx.fillStyle = '#facc15';
        for (let i = 0; i < 4; i++) {
          const ePos = (offset * 1.5 + i * 40) % (w * 0.5);
          if (ePos < w * 0.25) {
            ctx.beginPath();
            ctx.arc(znElecX + znElecW / 2 + ePos, wireY, 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(w / 2 + 25 + (ePos - w * 0.25), wireY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [zincConc, copperConc, temperatureK, E_cell, hasSaltBridge, selectedCouple]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-72 block" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setHasSaltBridge(!hasSaltBridge)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
              hasSaltBridge
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {hasSaltBridge ? 'Remove Salt Bridge' : 'Insert Salt Bridge'}
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Nernst Equation & Electrochemical Potential Manipulator
            </h4>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
            E_cell = {E_cell.toFixed(3)} V (E° = {E_standard.toFixed(2)} V)
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">[{selectedCouple.anode}²⁺] Anode Concentration:</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{zincConc.toFixed(2)} M</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.5"
              step="0.05"
              value={zincConc}
              onChange={(e) => setZincConc(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.01 M</span>
              <span>1.0 M (Standard)</span>
              <span>2.5 M</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">[{selectedCouple.cathode}²⁺] Cathode Concentration:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{copperConc.toFixed(2)} M</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.5"
              step="0.05"
              value={copperConc}
              onChange={(e) => setCopperConc(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.01 M</span>
              <span>1.0 M (Standard)</span>
              <span>2.5 M</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Temperature (K):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{temperatureK.toFixed(1)} K ({(temperatureK - 273.15).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min="273.15"
              max="373.15"
              step="1"
              value={temperatureK}
              onChange={(e) => setTemperatureK(parseFloat(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>273 K (0°C)</span>
              <span>298 K (25°C)</span>
              <span>373 K (100°C)</span>
            </div>
          </div>
        </div>

        {/* Electrode Couple Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Galvanic Couples:</span>
            {COUPLE_PRESETS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCouple(c)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                  selectedCouple.name === c.name
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {c.name} (E°={c.eStandard.toFixed(2)}V)
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setZincConc(1.0);
              setCopperConc(1.0);
              setTemperatureK(298.15);
              setHasSaltBridge(true);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset 1.0M
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Cell EMF (E_cell)</span>
          <div className="text-lg font-mono font-bold text-cyan-400">{E_cell.toFixed(3)} V</div>
          <span className="text-[10px] text-slate-500">E° = {E_standard.toFixed(2)} V</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Reaction Quotient (Q)</span>
          <div className="text-lg font-mono font-bold text-amber-300">{Q.toFixed(3)}</div>
          <span className="text-[10px] text-slate-500">Q = [Anode] / [Cathode]</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Gibbs Free Energy (ΔG)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {(-n_electrons * F_faraday * E_cell / 1000).toFixed(1)} <span className="text-xs font-normal">kJ/mol</span>
          </div>
          <span className="text-[10px] text-slate-500">ΔG = -nFE</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Nernst Equation</span>
          <div className="mt-1">
            <Formula tex="E_{\text{cell}} = E^\circ - \frac{RT}{nF} \ln Q" />
          </div>
        </div>
      </div>
    </div>
  );
};
