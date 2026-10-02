import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Flame, Sparkles } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ReactionRateSimProps {
  temperature: number; // in Kelvin (273 - 500)
  concentration: number; // M (0.1 - 3.0)
  activationEnergy: number; // kJ/mol (20 - 100)
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
  temperature,
  concentration,
  activationEnergy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [successfulCollisions, setSuccessfulCollisions] = useState(0);

  // Effective activation energy (catalyst lowers it by 25 kJ/mol)
  const effectiveEa = hasCatalyst ? Math.max(10, activationEnergy - 25) : activationEnergy;
  const R_gas = 8.314; // J/(mol*K)
  // Arrhenius rate constant (scaled for visualization)
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
        x: 30 + Math.random() * 300,
        y: 30 + Math.random() * 180,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: Math.random() > 0.85 ? 'product' : 'reactant',
        radius: 4.5,
      });
    }
    particlesRef.current = pts;
  }, [concentration]);

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
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
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
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CATALYTIC PLATINUM SURFACE BED (LOWER Ea)', w / 2, h - 18);
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

            // Check if collision energy exceeds Ea
            const relativeKineticEnergy = 0.5 * (kx * kx + ky * ky) * (temperature / 100);
            if (relativeKineticEnergy > effectiveEa * 0.15) {
              setSuccessfulCollisions((c) => c + 1);
              p.type = 'product';
              p2.type = 'product';
              flashTimer = 4;
            }
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.type === 'reactant') {
          ctx.fillStyle = '#38bdf8'; // Blue reactant A
        } else {
          ctx.fillStyle = '#f59e0b'; // Amber product B
        }
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Reaction Flash effect when reaction happens
      if (flashTimer > 0) {
        ctx.fillStyle = `rgba(245, 158, 11, ${flashTimer * 0.05})`;
        ctx.fillRect(10, 10, w - 20, h - 20);
        flashTimer--;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [temperature, effectiveEa, hasCatalyst]);

  return (
    <div className="space-y-4">
      {/* Reactor Vessel Canvas */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Flame className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Molecular Collision Chamber</span>
        </div>

        {/* Legend */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
            Reactant A
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
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

          <div className="flex items-center gap-4 text-slate-300">
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
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Chemical Kinetics Formalism</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Arrhenius Equation</div>
            <Formula tex={`k = A \\cdot e^{-\\frac{E_a}{R T}}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Empirical Rate Law</div>
            <Formula tex={`\\text{Rate} = k [A]^m [B]^n`} />
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
