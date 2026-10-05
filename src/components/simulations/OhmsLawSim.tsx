import React, { useEffect, useRef, useState } from 'react';
import { Formula } from '../common/Formula';
import { Zap, Sliders, RotateCcw, Power } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface OhmsLawSimProps {
  voltage?: number;
  resistance?: number;
}

const VOLTAGE_PRESETS = [
  { name: '1.5V AA Battery', v: 1.5 },
  { name: '5.0V USB', v: 5.0 },
  { name: '9.0V Battery', v: 9.0 },
  { name: '12.0V DC Lead-Acid', v: 12.0 },
  { name: '24.0V Industrial', v: 24.0 },
];

export const OhmsLawSim: React.FC<OhmsLawSimProps> = ({
  voltage: propV = 12.0,
  resistance: propR = 24.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [voltage, setVoltage] = useState<number>(propV);
  const [resistance, setResistance] = useState<number>(propR);
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);

  const current = switchClosed ? voltage / resistance : 0;
  const power = switchClosed ? voltage * current : 0;

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

      const padX = 65;
      const padY = 50;
      const cW = w - padX * 2;
      const cH = h - padY * 2;

      // Circuit wire path
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeRect(padX, padY, cW, cH);

      // Animate drifting electrons along the rectangular circuit wire if switch closed
      if (switchClosed && current > 0.01) {
        offset += Math.min(6, Math.max(0.5, current * 1.5));
        const perimeter = 2 * (cW + cH);
        const numElectrons = 30;

        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < numElectrons; i++) {
          const dist = (i * (perimeter / numElectrons) + offset) % perimeter;
          let ex = padX;
          let ey = padY;

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
      }

      // --- Component 1: DC Battery (Left wire) ---
      const batY = padY + cH / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(padX - 20, batY - 24, 40, 48);

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(padX - 16, batY - 14);
      ctx.lineTo(padX + 16, batY - 14);
      ctx.stroke();

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
      ctx.fillRect(resX - 28, padY - 14, 56, 28);

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
      ctx.fillText(`R = ${resistance.toFixed(1)}Ω`, resX, padY - 16);

      // --- Component 3: Knife Switch (Bottom wire) ---
      const swX = padX + cW * 0.5;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(swX - 25, padY + cH - 14, 50, 28);

      ctx.beginPath();
      ctx.arc(swX - 18, padY + cH, 4, 0, Math.PI * 2);
      ctx.arc(swX + 18, padY + cH, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Knife blade
      ctx.beginPath();
      ctx.moveTo(swX - 18, padY + cH);
      if (switchClosed) {
        ctx.lineTo(swX + 18, padY + cH);
        ctx.strokeStyle = '#10b981';
      } else {
        ctx.lineTo(swX + 12, padY + cH - 20);
        ctx.strokeStyle = '#ef4444';
      }
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = switchClosed ? '#10b981' : '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(switchClosed ? 'Switch: CLOSED' : 'Switch: OPEN', swX, padY + cH + 20);

      // --- Component 4: Ammeter (Top right wire) ---
      const ammeterX = padX + cW * 0.75;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ammeterX - 20, padY - 20, 40, 40);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ammeterX, padY, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('A', ammeterX, padY + 4);
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`I = ${current.toFixed(2)} A`, ammeterX, padY - 24);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [voltage, resistance, switchClosed, current]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-72 block" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setSwitchClosed(!switchClosed)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition ${
              switchClosed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {switchClosed ? 'Open Circuit Switch' : 'Close Circuit Switch'}
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Ohm&apos;s Law DC Circuit Manipulator
            </h4>
          </div>
          <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-950/80 border border-yellow-800 px-2.5 py-0.5 rounded-full">
            Current: {current.toFixed(2)} A • Power: {power.toFixed(2)} W
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Potential Difference (V):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{voltage.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="24.0"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 V</span>
              <span>12.0 V</span>
              <span>24.0 V</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Electrical Resistance (R):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{resistance.toFixed(1)} Ω</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="100.0"
              step="1.0"
              value={resistance}
              onChange={(e) => setResistance(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.0 Ω (Low Resistance)</span>
              <span>50.0 Ω</span>
              <span>100.0 Ω (High)</span>
            </div>
          </div>
        </div>

        {/* Voltage Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">DC Sources:</span>
            {VOLTAGE_PRESETS.map((vp) => (
              <button
                key={vp.name}
                onClick={() => setVoltage(vp.v)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                  voltage === vp.v
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {vp.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setVoltage(12.0);
              setResistance(24.0);
              setSwitchClosed(true);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset 12V / 24Ω
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Electric Current (I)</span>
          <div className="text-lg font-mono font-bold text-sky-400">{current.toFixed(2)} A</div>
          <span className="text-[10px] text-slate-500">I = V / R</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Joule Heating Dissipation</span>
          <div className="text-lg font-mono font-bold text-amber-300">{power.toFixed(2)} W</div>
          <span className="text-[10px] text-slate-500">P = I²R = VI</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Conductance (G)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">{(1 / resistance).toFixed(3)} S</div>
          <span className="text-[10px] text-slate-500">G = 1 / R (Siemens)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Ohm&apos;s Law</span>
          <div className="mt-1">
            <Formula tex="V = I \cdot R \quad P = V \cdot I" />
          </div>
        </div>
      </div>
    </div>
  );
};
