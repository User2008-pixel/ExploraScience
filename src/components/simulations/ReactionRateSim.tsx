import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Flame, Sparkles, Sliders, RotateCcw, Zap } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ReactionRateSimProps {
  temperature?: number; // in Kelvin (273 - 500)
  concentration?: number; // M (0.1 - 3.0)
  activationEnergy?: number; // kJ/mol (20 - 100)
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'reactant' | 'product';
  radius: number;
}

export const ReactionRateSim: React.FC<ReactionRateSimProps> = ({
  temperature: propT = 320,
  concentration: propConc = 1.2,
  activationEnergy: propEa = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [temperature, setTemperature] = useState<number>(propT);
  const [concentration, setConcentration] = useState<number>(propConc);
  const [activationEnergy, setActivationEnergy] = useState<number>(propEa);
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);
  const [successfulCollisions, setSuccessfulCollisions] = useState<number>(0);

  // Effective activation energy (catalyst lowers it by 25 kJ/mol)
  const effectiveEa = hasCatalyst ? Math.max(10, activationEnergy - 25) : activationEnergy;
  const R_gas = 8.314; // J/(mol*K)
  const k_arrhenius = Math.exp(-(effectiveEa * 1000) / (R_gas * temperature));
  const normalizedRate = (k_arrhenius * 1e7 * Math.pow(concentration, 1.5)).toFixed(3);

  // Particles simulation state
  const particlesRef = useRef<Particle[]>([]);

  // Initialize or rebalance particles when concentration changes
  useEffect(() => {
    const targetCount = Math.min(80, Math.max(15, Math.round(concentration * 22)));
    const pts: Particle[] = [];
    for (let i = 0; i < targetCount; i++) {
      const speed = Math.sqrt(temperature / 300) * (2 + Math.random() * 2);
      const angle = Math.random() * Math.PI * 2;
      pts.push({
        x: 30 + Math.random() * 320,
        y: 30 + Math.random() * 180,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: Math.random() > 0.85 ? 'product' : 'reactant',
        radius: 4.5,
      });
    }
    particlesRef.current = pts;
  }, [concentration, temperature]);

  // Simulation physics frame loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let flashTimer = 0;
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

      // Reactor Vessel Background
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(0, 0, w, h);

      // Wall boundaries
      ctx.strokeStyle = hasCatalyst ? '#10b981' : '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // Catalyst bed visual along bottom wall if enabled
      if (hasCatalyst) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
        ctx.fillRect(12, h - 30, w - 24, 18);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CATALYTIC PLATINUM SURFACE BED (E_a Reduced by 25 kJ/mol)', w / 2, h - 18);
      }

      // Update and draw particles
      const pts = particlesRef.current;
      const speedScale = Math.sqrt(temperature / 298);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx * speedScale;
        p.y += p.vy * speedScale;

        // Bounce walls
        if (p.x - p.radius < 12) {
          p.x = 12 + p.radius;
          p.vx = -p.vx;
        } else if (p.x + p.radius > w - 12) {
          p.x = w - 12 - p.radius;
          p.vx = -p.vx;
        }

        const bottomLimit = hasCatalyst ? h - 32 : h - 12;
        if (p.y - p.radius < 12) {
          p.y = 12 + p.radius;
          p.vy = -p.vy;
        } else if (p.y + p.radius > bottomLimit) {
          p.y = bottomLimit - p.radius;
          p.vy = -p.vy;
        }

        // Particle collisions
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < p.radius + p2.radius) {
            // Elastic collision bounce
            const nx = dx / dist;
            const ny = dy / dist;
            const kx = p.vx - p2.vx;
            const ky = p.vy - p2.vy;
            const pTransfer = 2 * (nx * kx + ny * ky) / 2;
            p.vx -= pTransfer * nx;
            p.vy -= pTransfer * ny;
            p2.vx += pTransfer * nx;
            p2.vy += pTransfer * ny;

            // Collision energy check: KE ~ (v1^2 + v2^2)
            const collisionEnergy = (p.vx * p.vx + p.vy * p.vy + p2.vx * p2.vx + p2.vy * p2.vy) * 4;
            const thresholdEnergy = effectiveEa * 0.4;

            if (collisionEnergy > thresholdEnergy && (p.type === 'reactant' || p2.type === 'reactant')) {
              p.type = 'product';
              p2.type = 'product';
              flashTimer = 5;
              setSuccessfulCollisions((prev) => prev + 1);
            }
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.type === 'reactant') {
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#0284c7';
        } else {
          ctx.fillStyle = '#f59e0b';
          ctx.strokeStyle = '#d97706';
        }
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Flash glow on effective reaction collision
      if (flashTimer > 0) {
        flashTimer--;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [temperature, effectiveEa, hasCatalyst]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">Kinetic Molecular Collisions</span>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="flex items-center gap-1.5 text-sky-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            Reactant A
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Product B
          </span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Control toolbar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHasCatalyst(!hasCatalyst)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                hasCatalyst
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {hasCatalyst ? 'Catalyst Active (-25 kJ/mol)' : 'Add Heterogeneous Catalyst'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Effective E_a: </span>
              <span className="text-amber-400 font-bold">{effectiveEa}</span> kJ/mol
            </div>
            <div>
              <span className="text-slate-500">Reaction Rate: </span>
              <span className="text-emerald-400 font-bold">{normalizedRate}</span> mol/L·s
            </div>
            <div>
              <span className="text-slate-500">Effective Hits: </span>
              <span className="text-cyan-300 font-bold">{successfulCollisions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Collision Theory & Arrhenius Rate Manipulator
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
            k = {k_arrhenius.toExponential(2)} • Ea = {effectiveEa} kJ/mol
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Temperature (T):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{temperature} K ({(temperature - 273.15).toFixed(0)}°C)</span>
            </div>
            <input
              type="range"
              min="273"
              max="500"
              step="5"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>273 K (0°C)</span>
              <span>350 K</span>
              <span>500 K (227°C)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Reactant Concentration [A]:</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{concentration.toFixed(1)} M</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={concentration}
              onChange={(e) => setConcentration(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1 M</span>
              <span>1.5 M</span>
              <span>3.0 M (High Density)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Base Activation Energy (Ea):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{activationEnergy} kJ/mol</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={activationEnergy}
              onChange={(e) => setActivationEnergy(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20 kJ (Low Barrier)</span>
              <span>50 kJ</span>
              <span>100 kJ (High Barrier)</span>
            </div>
          </div>
        </div>

        {/* Quick Temperature & Reactant Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Quick Temp Presets:</span>
            <button
              onClick={() => setTemperature(273)}
              className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 transition"
            >
              Ice Bath (273 K)
            </button>
            <button
              onClick={() => setTemperature(298)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
            >
              Room Temp (298 K)
            </button>
            <button
              onClick={() => setTemperature(373)}
              className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Boiling Water (373 K)
            </button>
            <button
              onClick={() => setTemperature(480)}
              className="px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Furnace (480 K)
            </button>
          </div>

          <button
            onClick={() => {
              setTemperature(320);
              setConcentration(1.2);
              setActivationEnergy(50);
              setHasCatalyst(false);
              setSuccessfulCollisions(0);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Arrhenius Maxwell-Boltzmann & Rate Plots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Arrhenius Rate vs Temperature: k(T)"
          xLabel="T"
          yLabel="k(T)"
          xUnit="K"
          yUnit="s⁻¹"
          xDomain={[273, 500]}
          yDomain={[0, 10]}
          curveFunction={(T) => {
            const val = Math.exp(-(effectiveEa * 1000) / (R_gas * T)) * 1e7;
            return Math.min(10, val);
          }}
          currentMarker={{
            x: temperature,
            y: Math.min(10, Math.exp(-(effectiveEa * 1000) / (R_gas * temperature)) * 1e7),
          }}
          curveColor="#f59e0b"
          height={160}
        />
        <GraphViewer
          title="Rate Law Order: Rate vs Reactant [A]"
          xLabel="[A]"
          yLabel="\text{Rate}"
          xUnit="M"
          yUnit="mol/L·s"
          xDomain={[0.1, 3.0]}
          yDomain={[0, 15]}
          curveFunction={(conc) => {
            const k = Math.exp(-(effectiveEa * 1000) / (R_gas * temperature)) * 1e7;
            return Math.min(15, k * Math.pow(conc, 1.5));
          }}
          currentMarker={{
            x: concentration,
            y: Math.min(15, parseFloat(normalizedRate)),
          }}
          curveColor="#10b981"
          height={160}
        />
      </div>

      {/* Chemical Kinetics Equations */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Live Chemical Kinetics Formalism
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Arrhenius Equation</div>
            <Formula tex="k = A \cdot e^{-\frac{E_a}{R T}}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Empirical Rate Law</div>
            <Formula tex="\text{Rate} = k [A]^m [B]^n" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Effective Energy Barrier</div>
            <Formula tex={`E_{a,\\text{eff}} = ${effectiveEa}\\text{ kJ/mol}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
