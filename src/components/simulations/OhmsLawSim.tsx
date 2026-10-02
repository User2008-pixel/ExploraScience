import React, { useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Zap } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface OhmsLawSimProps {
  voltage: number;
  resistance: number;
}

export const OhmsLawSim: React.FC<OhmsLawSimProps> = ({ voltage, resistance }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const current = voltage / resistance;
  const power = voltage * current;

  // Electron drift animation
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

      // Circuit wire dimensions
      const padX = 60;
      const padY = 50;
      const cW = w - padX * 2;
      const cH = h - padY * 2;

      // Circuit wire path
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeRect(padX, padY, cW, cH);

      // Animate drifting electrons along the rectangular circuit wire
      // Speed scales with current
      offset += Math.min(6, Math.max(0.5, current * 1.2));
      const perimeter = 2 * (cW + cH);
      const numElectrons = 28;

      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < numElectrons; i++) {
        const dist = (i * (perimeter / numElectrons) + offset) % perimeter;
        let ex = padX;
        let ey = padY;

        // Traverse rectangle clockwise: top -> right -> bottom -> left
        if (dist < cW) {
          ex = padX + dist;
          ey = padY;
        } else if (dist < cW + cH) {
          ex = padX + cW;
          ey = padY + (dist - cW);
        } else if (dist < 2 * cW + cH) {
          ex = padX + cW - (dist - (cW + cH));
          ey = padY + cH;
        } else {
          ex = padX;
          ey = padY + cH - (dist - (2 * cW + cH));
        }

        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Component 1: DC Battery (Left wire) ---
      const batY = padY + cH / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(padX - 20, batY - 24, 40, 48); // clear wire gap

      // Battery plates
      // Long positive plate
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(padX - 16, batY - 14);
      ctx.lineTo(padX + 16, batY - 14);
      ctx.stroke();

      // Short negative plate
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(padX - 8, batY + 12);
      ctx.lineTo(padX + 8, batY + 12);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`+`, padX - 22, batY - 10);
      ctx.fillText(`-`, padX - 22, batY + 16);
      ctx.fillText(`${voltage.toFixed(1)}V`, padX - 26, batY + 4);

      // --- Component 2: Resistor (Top wire) ---
      const resX = padX + cW * 0.35;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(resX - 28, padY - 14, 56, 28); // clear gap

      // Zig-zag resistor symbol
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(resX - 28, padY);
      ctx.lineTo(resX - 20, padY - 8);
      ctx.lineTo(resX - 10, padY + 8);
      ctx.lineTo(resX, padY - 8);
      ctx.lineTo(resX + 10, padY + 8);
      ctx.lineTo(resX + 20, padY - 8);
      ctx.lineTo(resX + 28, padY);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`R = ${resistance.toFixed(0)}Ω`, resX, padY - 16);

      // --- Component 3: Ammeter (Top right wire) ---
      const ammeterX = padX + cW * 0.75;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ammeterX - 16, padY - 16, 32, 32);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ammeterX, padY, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A', ammeterX, padY + 4);
      ctx.font = '10px monospace';
      ctx.fillText(`${current.toFixed(2)}A`, ammeterX, padY - 18);

      // --- Component 4: Filament Light Bulb (Bottom wire) ---
      const bulbX = padX + cW * 0.5;
      const bulbY = padY + cH;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bulbX - 22, bulbY - 22, 44, 44);

      // Dynamic Bulb Glow based on dissipated power (P)
      const maxPower = (24 * 24) / 1;
      const glowFraction = Math.min(1, power / 40);

      if (power > 0.1) {
        const glowRadius = 12 + glowFraction * 36;
        const bulbGrad = ctx.createRadialGradient(bulbX, bulbY, 4, bulbX, bulbY, glowRadius);
        bulbGrad.addColorStop(0, `rgba(254, 240, 138, ${Math.min(1, 0.4 + glowFraction * 0.6)})`);
        bulbGrad.addColorStop(0.5, `rgba(251, 191, 36, ${0.3 * glowFraction})`);
        bulbGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = bulbGrad;
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glass bulb outline
      ctx.strokeStyle = power > 10 ? '#fef08a' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Filament
      ctx.strokeStyle = power > 15 ? '#ffffff' : power > 2 ? '#fbbf24' : '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bulbX - 7, bulbY + 10);
      ctx.lineTo(bulbX - 3, bulbY - 5);
      ctx.lineTo(bulbX + 3, bulbY - 5);
      ctx.lineTo(bulbX + 7, bulbY + 10);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${power.toFixed(1)}W`, bulbX, bulbY + 28);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [voltage, resistance, current, power]);

  return (
    <div className="space-y-4">
      {/* Circuit Schematic */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Virtual Circuit Lab & Electron Drift</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Live Gauges */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">EMF (V): </span>
              <span className="text-rose-400 font-bold">{voltage.toFixed(1)}</span> V
            </div>
            <div>
              <span className="text-slate-500">Resistance (R): </span>
              <span className="text-amber-400 font-bold">{resistance.toFixed(0)}</span> Ω
            </div>
            <div>
              <span className="text-slate-500">Current (I): </span>
              <span className="text-emerald-400 font-bold">{current.toFixed(2)}</span> A
            </div>
            <div>
              <span className="text-slate-500">Power (P): </span>
              <span className="text-yellow-300 font-bold">{power.toFixed(1)}</span> W
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic I-V Characteristic Curve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Ohmic Linear Characteristic: I vs V"
          xLabel="V"
          yLabel="I"
          xUnit="V"
          yUnit="A"
          xDomain={[0, 24]}
          yDomain={[0, Math.ceil(24 / resistance * 1.2)]}
          curveFunction={(v) => v / resistance}
          currentMarker={{ x: voltage, y: current }}
          curveColor="#10b981"
          height={160}
        />
        <GraphViewer
          title="Joule Heating Dissipation: Power vs Voltage"
          xLabel="V"
          yLabel="P(V)"
          xUnit="V"
          yUnit="W"
          xDomain={[0, 24]}
          yDomain={[0, Math.ceil((24 * 24) / resistance * 1.15)]}
          curveFunction={(v) => (v * v) / resistance}
          currentMarker={{ x: voltage, y: power }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* Ohm's Law Formula Cards */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Circuit Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Ohm's Relationship</div>
            <Formula tex={`I = \\frac{V}{R} = \\frac{${voltage}}{${resistance}} = ${current.toFixed(2)}\\text{ A}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Joule Heat Power</div>
            <Formula tex={`P = I^2 R = (${current.toFixed(2)})^2 \\cdot ${resistance} = ${power.toFixed(1)}\\text{ W}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Conductance (G)</div>
            <Formula tex={`G = \\frac{1}{R} = ${(1 / resistance).toFixed(3)}\\text{ S}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
