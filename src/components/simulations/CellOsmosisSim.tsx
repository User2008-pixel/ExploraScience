import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface CellOsmosisSimProps {
  externalSoluteConc: number; // in osm/L or % (0.1 to 3.0, isotonic is 0.9% saline)
  cellType: 'plant' | 'animal'; // plant with cell wall vs animal RBC
  temperatureC: number; // 10 to 45 C
}

export const CellOsmosisSim: React.FC<CellOsmosisSimProps> = ({
  externalSoluteConc = 0.9,
  cellType = 'animal',
  temperatureC = 25,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cytoplasm osmolarity ~ 0.9% NaCl equivalent (300 mOsm/L)
  const internalConc = 0.9;
  const isHypotonic = externalSoluteConc < internalConc - 0.15;
  const isHypertonic = externalSoluteConc > internalConc + 0.15;
  const isIsotonic = !isHypotonic && !isHypertonic;

  // Osmotic pressure difference: Pi = i * CRT
  // Temperature in Kelvin:
  const tempK = 273.15 + temperatureC;
  const deltaC = externalSoluteConc - internalConc;
  const osmoticPressureAtm = Math.abs(deltaC * 0.0821 * tempK * 10).toFixed(1);

  // Cell volume ratio:
  // Hypotonic: swells (if animal, may lyse/burst; if plant, becomes turgid)
  // Hypertonic: shrinks (crenation / plasmolysis)
  const volumeMultiplier = Math.max(0.65, Math.min(1.4, 1 - (deltaC / 2.0)));

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
      const soluteTint = Math.min(1, externalSoluteConc / 3.0);
      ctx.fillStyle = `rgba(14, 165, 233, ${0.1 + soluteTint * 0.25})`;
      ctx.fillRect(0, 0, w, h);

      // Beaker walls
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, w - 40, h - 35);

      const centerX = w * 0.5;
      const centerY = h * 0.52;

      // Draw Plant Cell Wall if plant
      if (cellType === 'plant') {
        const wallW = 190;
        const wallH = 130;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.strokeRect(centerX - wallW / 2, centerY - wallH / 2, wallW, wallH);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cellulose Cell Wall (Rigid Matrix)', centerX, centerY - wallH / 2 - 10);
      }

      // Draw Protoplast / Animal Cell Membrane
      const baseRadiusX = cellType === 'plant' ? 80 * volumeMultiplier : 70 * volumeMultiplier;
      const baseRadiusY = cellType === 'plant' ? 55 * volumeMultiplier : 55 * volumeMultiplier;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);

      // Cell cytoplasm gradient
      const cytoGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, baseRadiusX);
      if (cellType === 'animal') {
        cytoGrad.addColorStop(0, '#fca5a5');
        cytoGrad.addColorStop(1, '#ef4444');
      } else {
        cytoGrad.addColorStop(0, '#86efac');
        cytoGrad.addColorStop(1, '#22c55e');
      }
      ctx.fillStyle = cytoGrad;
      ctx.fill();

      // Plasma Membrane line
      ctx.strokeStyle = cellType === 'animal' ? '#dc2626' : '#15803d';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Nucleus in cell
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Plant Vacuole
      if (cellType === 'plant') {
        const vacR = 30 * volumeMultiplier;
        ctx.beginPath();
        ctx.ellipse(centerX + 20, centerY, vacR, vacR * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();
        ctx.fillStyle = '#bae6fd';
        ctx.font = '9px monospace';
        ctx.fillText('Central Vacuole', centerX + 20, centerY);
      }

      // Net Water Flux Arrows (animated)
      waterParticleTick += 0.04;
      const arrowLen = 32;

      ctx.font = 'bold 11px sans-serif';
      if (isHypotonic) {
        // Water rushes INWARD
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('Net Osmotic Water Inflow (Endosmosis) ➔', centerX, 45);

        // 4 arrows pointing inward
        const offsets = [[-baseRadiusX - 30, 0, 1, 0], [baseRadiusX + 30, 0, -1, 0], [0, -baseRadiusY - 25, 0, 1], [0, baseRadiusY + 25, 0, -1]];
        offsets.forEach(([ox, oy, dx, dy]) => {
          const sx = centerX + ox;
          const sy = centerY + oy;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + dx * arrowLen, sy + dy * arrowLen);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          // Arrow point
          ctx.beginPath();
          ctx.arc(sx + dx * arrowLen, sy + dy * arrowLen, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
        });
      } else if (isHypertonic) {
        // Water rushes OUTWARD
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText('Net Osmotic Water Outflow (Exosmosis) ➔ Plasmolysis / Crenation', centerX, 45);

        // 4 arrows pointing outward
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
      } else {
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
  }, [externalSoluteConc, cellType, temperatureC, volumeMultiplier, isHypotonic, isHypertonic, isIsotonic]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#080e1e]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Solution Tonicity</span>
          <div className={`text-base font-mono font-bold ${isHypotonic ? 'text-sky-400' : isHypertonic ? 'text-amber-300' : 'text-emerald-400'}`}>
            {isHypotonic ? 'Hypotonic (<0.9%)' : isHypertonic ? 'Hypertonic (>0.9%)' : 'Isotonic (0.9%)'}
          </div>
          <span className="text-[10px] text-slate-500">Ext: {externalSoluteConc.toFixed(2)}% | Cytoplasm: 0.90%</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Cellular Morphology</span>
          <div className="text-base font-mono font-bold text-white">
            {cellType === 'plant'
              ? isHypotonic
                ? 'Turgid (High Wall Pressure)'
                : isHypertonic
                ? 'Plasmolysed (Shrunk)'
                : 'Flaccid'
              : isHypotonic
              ? 'Swollen / Hemolysis Risk'
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
