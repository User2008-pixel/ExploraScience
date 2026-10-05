import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { RotateCcw, Droplets, Plus, Minus, Sparkles, Play, Pause, Flame } from 'lucide-react';

interface CellOsmosisSimProps {
  externalSoluteConc?: number; // in % (0.0 to 3.0, isotonic is 0.9% saline)
  cellType?: 'plant' | 'animal'; // plant with cell wall vs animal RBC
  temperatureC?: number; // 0 to 50 C
}

export const CellOsmosisSim: React.FC<CellOsmosisSimProps> = ({
  externalSoluteConc: initialConc = 0.9,
  cellType: initialCellType = 'animal',
  temperatureC: initialTemp = 25,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [soluteConc, setSoluteConc] = useState<number>(initialConc);
  const [activeCellType, setActiveCellType] = useState<'plant' | 'animal'>(initialCellType);
  const [temperature, setTemperature] = useState<number>(initialTemp);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [hasBurst, setHasBurst] = useState<boolean>(false);
  const [soluteAddedPulse, setSoluteAddedPulse] = useState<number>(0);

  // Cytoplasm osmolarity ~ 0.9% NaCl equivalent (300 mOsm/L)
  const internalConc = 0.9;
  const isHypotonic = soluteConc < internalConc - 0.15;
  const isHypertonic = soluteConc > internalConc + 0.15;
  const isIsotonic = !isHypotonic && !isHypertonic;

  // Temperature in Kelvin:
  const tempK = 273.15 + temperature;
  const deltaC = soluteConc - internalConc;
  const osmoticPressureAtm = Math.abs(deltaC * 0.0821 * tempK * 10).toFixed(1);

  // Cell volume ratio:
  // Hypotonic: swells (if animal and conc < 0.35%, hemolysis occurs!)
  const rawVolume = 1 - (deltaC / 2.0);
  const volumeMultiplier = hasBurst ? 0.3 : Math.max(0.6, Math.min(1.45, rawVolume));

  // Auto-detect hemolysis for animal cells in severe hypotonic conditions
  useEffect(() => {
    if (activeCellType === 'animal' && soluteConc <= 0.25) {
      setHasBurst(true);
    } else if (soluteConc > 0.35 && hasBurst) {
      setHasBurst(false);
    }
  }, [activeCellType, soluteConc, hasBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let waterParticleTick = 0;

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

      // Beaker solution background (shifts from clear to deep solute hue)
      const soluteTint = Math.min(1, soluteConc / 3.0);
      ctx.fillStyle = `rgba(14, 165, 233, ${0.08 + soluteTint * 0.22})`;
      ctx.fillRect(0, 0, w, h);

      // Beaker walls
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 20, w - 40, h - 35);

      const centerX = w * 0.5;
      const centerY = h * 0.52;

      // Draw Plant Cell Wall if plant
      if (activeCellType === 'plant') {
        const wallW = 200;
        const wallH = 135;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.strokeRect(centerX - wallW / 2, centerY - wallH / 2, wallW, wallH);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cellulose Cell Wall (Rigid Matrix • Exerts Turgor Pressure)', centerX, centerY - wallH / 2 - 10);
      }

      // If animal cell lysed / burst:
      if (activeCellType === 'animal' && hasBurst) {
        // Draw lysed cell fragments
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 85, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ HEMOLYSIS OCCURRED (Cell Lysed / Burst!)', centerX, centerY - 10);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Excess osmotic water inflow exceeded membrane tensile limit (no cell wall)', centerX, centerY + 14);
      } else {
        // Draw Protoplast / Animal Cell Membrane
        const baseRadiusX = activeCellType === 'plant' ? 82 * volumeMultiplier : 72 * volumeMultiplier;
        const baseRadiusY = activeCellType === 'plant' ? 56 * volumeMultiplier : 56 * volumeMultiplier;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);

        // Cell cytoplasm gradient
        const cytoGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, baseRadiusX);
        if (activeCellType === 'animal') {
          cytoGrad.addColorStop(0, '#fca5a5');
          cytoGrad.addColorStop(1, '#ef4444');
        } else {
          cytoGrad.addColorStop(0, '#86efac');
          cytoGrad.addColorStop(1, '#22c55e');
        }
        ctx.fillStyle = cytoGrad;
        ctx.fill();

        // Plasma Membrane line
        ctx.strokeStyle = activeCellType === 'animal' ? '#dc2626' : '#15803d';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Nucleus in cell
        ctx.beginPath();
        ctx.arc(centerX - 16, centerY, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Plant Vacuole
        if (activeCellType === 'plant') {
          const vacR = 32 * volumeMultiplier;
          ctx.beginPath();
          ctx.ellipse(centerX + 22, centerY, vacR, vacR * 0.7, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();
          ctx.fillStyle = '#bae6fd';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('Central Vacuole', centerX + 22, centerY + 3);
        }
      }

      // Net Water Flux Arrows (animated)
      if (isPlaying) {
        waterParticleTick += 0.04 * (1 + temperature / 30);
      }
      const arrowLen = 32;

      ctx.font = 'bold 11px sans-serif';
      if (isHypotonic && !hasBurst) {
        // Water rushes INWARD
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('Net Osmotic Water Inflow (Endosmosis) ➔ Cell Swelling', centerX, 45);

        const baseRadiusX = activeCellType === 'plant' ? 82 * volumeMultiplier : 72 * volumeMultiplier;
        const baseRadiusY = activeCellType === 'plant' ? 56 * volumeMultiplier : 56 * volumeMultiplier;
        const offsets = [[-baseRadiusX - 32, 0, 1, 0], [baseRadiusX + 32, 0, -1, 0], [0, -baseRadiusY - 26, 0, 1], [0, baseRadiusY + 26, 0, -1]];
        offsets.forEach(([ox, oy, dx, dy]) => {
          const sx = centerX + ox;
          const sy = centerY + oy;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + dx * arrowLen, sy + dy * arrowLen);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(sx + dx * arrowLen, sy + dy * arrowLen, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
        });
      } else if (isHypertonic) {
        // Water rushes OUTWARD
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText(
          activeCellType === 'plant'
            ? 'Net Water Outflow (Exosmosis) ➔ Plasmolysis (Protoplast Detachment)'
            : 'Net Water Outflow (Exosmosis) ➔ Crenation (Cell Shrinking)',
          centerX,
          45
        );

        const baseRadiusX = activeCellType === 'plant' ? 82 * volumeMultiplier : 72 * volumeMultiplier;
        const baseRadiusY = activeCellType === 'plant' ? 56 * volumeMultiplier : 56 * volumeMultiplier;
        const offsets = [[-baseRadiusX + 5, 0, -1, 0], [baseRadiusX - 5, 0, 1, 0], [0, -baseRadiusY + 5, 0, -1], [0, baseRadiusY - 5, 0, 1]];
        offsets.forEach(([ox, oy, dx, dy]) => {
          const sx = centerX + ox;
          const sy = centerY + oy;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + dx * arrowLen, sy + dy * arrowLen);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(sx + dx * arrowLen, sy + dy * arrowLen, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
        });
      } else if (!hasBurst) {
        // Dynamic Equilibrium
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('Dynamic Osmotic Equilibrium (Isotonic: Inflow = Outflow)', centerX, 45);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [soluteConc, activeCellType, temperature, volumeMultiplier, isHypotonic, isHypertonic, isIsotonic, isPlaying, hasBurst]);

  return (
    <div className="space-y-4">
      {/* Simulation Display */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080e1e] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block" />

        {/* Top Control Overlay */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Cell Model:</span>
            <button
              onClick={() => {
                setActiveCellType('animal');
                setHasBurst(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeCellType === 'animal'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Animal (RBC)
            </button>
            <button
              onClick={() => {
                setActiveCellType('plant');
                setHasBurst(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                activeCellType === 'plant'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Plant (Cell Wall)
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setSoluteConc(0.9);
                setTemperature(25);
                setHasBurst(false);
              }}
              className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Reset to Isotonic 0.9%"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Control Panel */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live Osmotic Solution Manipulator
            </h4>
          </div>
          <span className="text-xs text-sky-400 font-mono font-bold bg-sky-950/80 border border-sky-800 px-2.5 py-0.5 rounded-full">
            Intracellular: 0.90% Saline (300 mOsm/L)
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">External Solute Concentration:</span>
              <span className="font-mono font-bold text-sky-300">{soluteConc.toFixed(2)}% NaCl</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={soluteConc}
              onChange={(e) => setSoluteConc(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Distilled Water)</span>
              <span>0.9% (Isotonic Saline)</span>
              <span>3.0% (Hypertonic)</span>
            </div>

            {/* Quick Solution Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setSoluteConc(0.0)}
                className="text-[11px] px-2 py-1 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 transition"
              >
                0.0% Pure Water
              </button>
              <button
                onClick={() => setSoluteConc(0.45)}
                className="text-[11px] px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
              >
                0.45% Half Normal
              </button>
              <button
                onClick={() => {
                  setSoluteConc(0.9);
                  setHasBurst(false);
                }}
                className="text-[11px] px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
              >
                0.90% Isotonic
              </button>
              <button
                onClick={() => setSoluteConc(1.8)}
                className="text-[11px] px-2 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
              >
                1.8% Hypertonic
              </button>
              <button
                onClick={() => setSoluteConc(3.0)}
                className="text-[11px] px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
              >
                3.0% Brine
              </button>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">System Temperature (°C):</span>
              <span className="font-mono font-bold text-amber-400">{temperature}°C ({tempK.toFixed(1)} K)</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0°C (Ice Cold)</span>
              <span>25°C (Room Temp)</span>
              <span>37°C (Body Temp)</span>
              <span>50°C</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSoluteConc((prev) => Math.max(0, +(prev - 0.2).toFixed(2)))}
                className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-3 h-3 text-sky-400" />
                Add DI Water (-0.2% Solute)
              </button>
              <button
                onClick={() => setSoluteConc((prev) => Math.min(3.0, +(prev + 0.2).toFixed(2)))}
                className="flex-1 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-medium flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-3 h-3 text-amber-400" />
                Add Salt (+0.2% Solute)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Solution Tonicity</span>
          <div
            className={`text-base font-mono font-bold ${
              isHypotonic ? 'text-sky-400' : isHypertonic ? 'text-amber-300' : 'text-emerald-400'
            }`}
          >
            {isHypotonic ? 'Hypotonic (<0.9%)' : isHypertonic ? 'Hypertonic (>0.9%)' : 'Isotonic (0.9%)'}
          </div>
          <span className="text-[10px] text-slate-500">
            Ext: {soluteConc.toFixed(2)}% | Cytoplasm: 0.90%
          </span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Cellular Morphology</span>
          <div className="text-base font-mono font-bold text-white">
            {activeCellType === 'plant'
              ? isHypotonic
                ? 'Turgid (High Wall Pressure)'
                : isHypertonic
                ? 'Plasmolysed (Shrunk)'
                : 'Flaccid'
              : hasBurst
              ? 'Lysed / Burst'
              : isHypotonic
              ? 'Swollen / Fragile'
              : isHypertonic
              ? 'Crenated (Shriveled)'
              : 'Normal Biconcave'}
          </div>
          <span className="text-[10px] text-slate-500">Volume ratio: {(volumeMultiplier * 100).toFixed(0)}%</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Osmotic Pressure (Π)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {osmoticPressureAtm} <span className="text-xs font-normal text-slate-400">atm</span>
          </div>
          <span className="text-[10px] text-slate-500">Π = iCRT across semipermeable lipid bilayer</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Water Potential Equation</span>
          <div className="mt-1">
            <Formula tex="\Psi_w = \Psi_s + \Psi_p" />
          </div>
        </div>
      </div>
    </div>
  );
};
