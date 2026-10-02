import React, { useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { BatteryCharging } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ElectrochemicalCellSimProps {
  zincConc: number; // M [Zn2+]
  copperConc: number; // M [Cu2+]
  temperatureK: number; // K
}

export const ElectrochemicalCellSim: React.FC<ElectrochemicalCellSimProps> = ({
  zincConc,
  copperConc,
  temperatureK,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Standard potentials
  // E°(Zn2+/Zn) = -0.76 V
  // E°(Cu2+/Cu) = +0.34 V
  // E°cell = 0.34 - (-0.76) = 1.10 V
  const E_standard = 1.10;
  const n_electrons = 2;
  const R_gas = 8.314;
  const F_faraday = 96485;

  // Nernst Equation
  // Q = [Zn2+] / [Cu2+]
  const Q = Math.max(1e-5, zincConc / Math.max(1e-5, copperConc));
  const nernstFactor = (R_gas * temperatureK) / (n_electrons * F_faraday);
  const E_cell = E_standard - nernstFactor * Math.log(Q);

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
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const beakerW = 120;
      const beakerH = 140;
      const beakerY = h - beakerH - 25;
      const leftBeakerX = w * 0.22 - beakerW / 2;
      const rightBeakerX = w * 0.78 - beakerW / 2;

      // --- Left Beaker: Zinc Anode (ZnSO4 solution) ---
      // Solution liquid (clear grayish)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.fillRect(leftBeakerX + 4, beakerY + 30, beakerW - 8, beakerH - 34);
      // Beaker glass
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(leftBeakerX, beakerY, beakerW, beakerH);

      // Zn Electrode bar (slivery gray)
      const znElecW = 18;
      const znElecX = leftBeakerX + beakerW / 2 - znElecW / 2;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(znElecX, beakerY - 20, znElecW, beakerH - 20);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(znElecX, beakerY - 20, znElecW, beakerH - 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Zn Anode (-)', znElecX + znElecW / 2, beakerY - 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`[Zn²⁺] = ${zincConc.toFixed(2)}M`, leftBeakerX + beakerW / 2, beakerY + beakerH + 18);

      // --- Right Beaker: Copper Cathode (CuSO4 solution) ---
      // Solution liquid (blue, intensity scales with [Cu2+])
      const blueAlpha = Math.min(0.7, 0.15 + copperConc * 0.25);
      ctx.fillStyle = `rgba(59, 130, 246, ${blueAlpha})`;
      ctx.fillRect(rightBeakerX + 4, beakerY + 30, beakerW - 8, beakerH - 34);
      // Beaker glass
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(rightBeakerX, beakerY, beakerW, beakerH);

      // Cu Electrode bar (copper reddish-brown)
      const cuElecW = 18;
      const cuElecX = rightBeakerX + beakerW / 2 - cuElecW / 2;
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cuElecX, beakerY - 20, cuElecW, beakerH - 20);
      ctx.strokeStyle = '#b45309';
      ctx.strokeRect(cuElecX, beakerY - 20, cuElecW, beakerH - 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Cu Cathode (+)', cuElecX + cuElecW / 2, beakerY - 28);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`[Cu²⁺] = ${copperConc.toFixed(2)}M`, rightBeakerX + beakerW / 2, beakerY + beakerH + 18);

      // --- Inverted U-Tube Salt Bridge (KNO3 / Agar) ---
      const sbW = 80;
      const sbH = 65;
      const sbX = w / 2 - sbW / 2;
      const sbY = beakerY + 15;

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

      // Migrating ions in salt bridge
      offset += 0.8;
      ctx.fillStyle = '#ef4444';
      ctx.font = '9px monospace';
      ctx.fillText('NO₃⁻ ←', w / 2 - 25, sbY + 4);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('→ K⁺', w / 2 + 25, sbY + 4);

      // --- External Wire with Voltmeter ---
      const wireY = beakerY - 50;
      const znTopX = znElecX + znElecW / 2;
      const cuTopX = cuElecX + cuElecW / 2;

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(znTopX, beakerY - 20);
      ctx.lineTo(znTopX, wireY);
      ctx.lineTo(cuTopX, wireY);
      ctx.lineTo(cuTopX, beakerY - 20);
      ctx.stroke();

      // Voltmeter instrument circle in center of wire
      const meterX = w / 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(meterX, wireY, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('V', meterX, wireY - 4);
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`${E_cell.toFixed(3)} V`, meterX, wireY + 12);

      // Animate electron dots moving along wire from Zn to Cu
      const wireLength = (znTopX - wireY) + (cuTopX - znTopX) + (wireY - (beakerY - 20));
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 6; i++) {
        const d = (i * 45 + offset * 2) % (cuTopX - znTopX);
        const ex = znTopX + d;
        if (Math.abs(ex - meterX) > 28) {
          ctx.beginPath();
          ctx.arc(ex, wireY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText('e⁻ flow →', meterX - 60, wireY - 8);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [zincConc, copperConc, E_cell]);

  return (
    <div className="space-y-4">
      {/* Visual Galvanic Cell */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Daniell Galvanic Cell & Ion Transfer</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-72 sm:h-80 block" />

        {/* Telemetry bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Standard EMF (E°): </span>
              <span className="text-cyan-300 font-bold">+1.100</span> V
            </div>
            <div>
              <span className="text-slate-500">Quotient Q: </span>
              <span className="text-amber-300 font-bold">{Q.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-slate-500">Observed Potential: </span>
              <span className={`font-bold ${E_cell >= 1.1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {E_cell.toFixed(3)} V
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Graph: Nernst Potential vs Ion Ratio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Nernst Potential vs Reaction Quotient: E vs log(Q)"
          xLabel="\log_{10} Q"
          yLabel="E_{\text{cell}}"
          xUnit=""
          yUnit="V"
          xDomain={[-2, 2]}
          yDomain={[1.0, 1.2]}
          curveFunction={(logQ) => 1.10 - (0.0591 / 2) * logQ}
          currentMarker={{ x: Math.log10(Q), y: E_cell }}
          curveColor="#38bdf8"
          height={160}
        />
        <GraphViewer
          title="Thermal Sensitivity: E_cell vs Temperature (K)"
          xLabel="T"
          yLabel="E_{\text{cell}}(T)"
          xUnit="K"
          yUnit="V"
          xDomain={[273, 350]}
          yDomain={[0.95, 1.25]}
          curveFunction={(t) => 1.10 - ((R_gas * t) / (n_electrons * F_faraday)) * Math.log(Q)}
          currentMarker={{ x: temperatureK, y: E_cell }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* Nernst Formula Explanations in LaTeX */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Electrochemical Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Standard Cell Potential</div>
            <Formula tex={`E^\\circ = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}} = +1.100\\text{ V}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Reaction Quotient (Q)</div>
            <Formula tex={`Q = \\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]} = \\frac{${zincConc.toFixed(2)}}{${copperConc.toFixed(2)}} = ${Q.toFixed(3)}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Nernst Potential</div>
            <Formula tex={`E_{\\text{cell}} = 1.10 - \\frac{0.0591}{2}\\log_{10} Q = ${E_cell.toFixed(3)}\\text{ V}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
