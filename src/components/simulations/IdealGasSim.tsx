import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Gauge, Sliders, RotateCcw, Flame, Sparkles } from 'lucide-react';

interface IdealGasSimProps {
  temperatureK?: number; // K (100 - 600)
  volumeLiters?: number; // L (5 - 30)
  molesN?: number; // mol (0.5 - 3.0)
}

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const IdealGasSim: React.FC<IdealGasSimProps> = ({
  temperatureK: propT = 300,
  volumeLiters: propV = 15,
  molesN: propN = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [temperatureK, setTemperatureK] = useState<number>(propT);
  const [volumeLiters, setVolumeLiters] = useState<number>(propV);
  const [molesN, setMolesN] = useState<number>(propN);

  const particlesRef = useRef<GasParticle[]>([]);

  // Ideal Gas Law: P = n R T / V
  // R = 0.08206 L·atm/(mol·K)
  const R_atm = 0.08206;
  const pressureAtm = (molesN * R_atm * temperatureK) / volumeLiters;

  // Initialize particles
  useEffect(() => {
    const targetCount = Math.round(molesN * 25);
    const pts: GasParticle[] = [];
    const speed = Math.sqrt(temperatureK / 300) * 3;
    for (let i = 0; i < targetCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      pts.push({
        x: 30 + Math.random() * 140,
        y: 30 + Math.random() * 140,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
    particlesRef.current = pts;
  }, [molesN, temperatureK]);

  // Simulation physics frame loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

      // Piston cylinder chamber geometry
      const chamberLeft = 40;
      const chamberTop = 30;
      const chamberH = h - 60;
      const maxChamberW = w - 180;
      const chamberW = 80 + ((volumeLiters - 5) / 25) * (maxChamberW - 80);

      // Cylinder Walls
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(chamberLeft, chamberTop);
      ctx.lineTo(chamberLeft, chamberTop + chamberH);
      ctx.lineTo(chamberLeft + chamberW, chamberTop + chamberH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chamberLeft, chamberTop);
      ctx.lineTo(chamberLeft + chamberW, chamberTop);
      ctx.stroke();

      // Piston head (movable right barrier)
      const pistonX = chamberLeft + chamberW;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pistonX - 6, chamberTop, 12, chamberH);
      // Piston shaft
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pistonX + 6, chamberTop + chamberH / 2 - 8, 45, 16);

      // Gas particles
      const speedScale = Math.sqrt(temperatureK / 300);
      const pts = particlesRef.current;

      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx * speedScale * 0.7;
        p.y += p.vy * speedScale * 0.7;

        if (p.x < chamberLeft + 8) {
          p.x = chamberLeft + 8;
          p.vx = Math.abs(p.vx);
        }
        if (p.x > pistonX - 10) {
          p.x = pistonX - 10;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < chamberTop + 8) {
          p.y = chamberTop + 8;
          p.vy = Math.abs(p.vy);
        }
        if (p.y > chamberTop + chamberH - 8) {
          p.y = chamberTop + chamberH - 8;
          p.vy = -Math.abs(p.vy);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pressure Dial Gauge on Right Side
      const dialX = w - 75;
      const dialY = h / 2;
      const dialRadius = 45;

      ctx.beginPath();
      ctx.arc(dialX, dialY, dialRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dial needle (0 to 6 atm)
      const maxPressureDial = 6;
      const pressureNorm = Math.min(1, Math.max(0, pressureAtm / maxPressureDial));
      const needleAngle = -Math.PI * 0.75 + pressureNorm * Math.PI * 1.5;

      ctx.beginPath();
      ctx.moveTo(dialX, dialY);
      ctx.lineTo(dialX + Math.cos(needleAngle) * 32, dialY + Math.sin(needleAngle) * 32);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${pressureAtm.toFixed(2)} atm`, dialX, dialY + 24);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [temperatureK, volumeLiters, molesN, pressureAtm]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-72 block" />
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Ideal Gas Law (PV = nRT) Manipulator
            </h4>
          </div>
          <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-950/80 border border-yellow-800 px-2.5 py-0.5 rounded-full">
            Pressure: {pressureAtm.toFixed(2)} atm ({ (pressureAtm * 101.325).toFixed(1) } kPa)
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Temperature (T):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{temperatureK} K ({(temperatureK - 273.15).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="10"
              value={temperatureK}
              onChange={(e) => setTemperatureK(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>100 K (Cryo)</span>
              <span>300 K (Room)</span>
              <span>600 K (Hot)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Chamber Volume (V):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{volumeLiters.toFixed(1)} L</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={volumeLiters}
              onChange={(e) => setVolumeLiters(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5 L (Compressed)</span>
              <span>15 L</span>
              <span>30 L (Expanded)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Amount of Gas (n):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{molesN.toFixed(2)} mol</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={molesN}
              onChange={(e) => setMolesN(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 mol</span>
              <span>1.0 mol</span>
              <span>3.0 mol</span>
            </div>
          </div>
        </div>

        {/* Gas Law Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Gas Law Presets:</span>
            <button
              onClick={() => {
                setTemperatureK(300);
                setVolumeLiters(10);
                setMolesN(1.0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Boyle&apos;s Compression (V=10L, T=300K)
            </button>
            <button
              onClick={() => {
                setTemperatureK(500);
                setVolumeLiters(25);
                setMolesN(1.0);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Charles&apos;s Expansion (T=500K, V=25L)
            </button>
            <button
              onClick={() => {
                setTemperatureK(273);
                setVolumeLiters(22.4);
                setMolesN(1.0);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold transition"
            >
              STP (1 mol = 22.4 L @ 1 atm)
            </button>
          </div>

          <button
            onClick={() => {
              setTemperatureK(300);
              setVolumeLiters(15);
              setMolesN(1.0);
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
          <span className="text-slate-400 block mb-0.5">Absolute Pressure (P)</span>
          <div className="text-lg font-mono font-bold text-yellow-400">{pressureAtm.toFixed(2)} atm</div>
          <span className="text-[10px] text-slate-500">{(pressureAtm * 101325).toFixed(0)} Pa</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Mean Molecular Speed (v_rms)</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {Math.round(Math.sqrt((3 * 8.314 * temperatureK) / 0.028))} m/s
          </div>
          <span className="text-[10px] text-slate-500">For Nitrogen N₂ gas</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Internal Thermal Energy (U)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {((3 / 2) * molesN * 8.314 * temperatureK / 1000).toFixed(2)} kJ
          </div>
          <span className="text-[10px] text-slate-500">U = 3/2 nRT</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Ideal Gas Equation</span>
          <div className="mt-1">
            <Formula tex="P \cdot V = n \cdot R \cdot T" />
          </div>
        </div>
      </div>
    </div>
  );
};
