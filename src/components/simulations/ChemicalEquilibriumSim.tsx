import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { RefreshCw, ArrowRightLeft, Flame, Gauge, Zap, Plus, Minus } from 'lucide-react';

interface ChemicalEquilibriumSimProps {
  temperatureK: number; // K (400 - 800)
  totalPressureAtm: number; // atm (10 - 250)
  reactantRatio: number; // stoichiometric ratio H2:N2 (1.0 - 5.0)
}

export const ChemicalEquilibriumSim: React.FC<ChemicalEquilibriumSimProps> = ({
  temperatureK: initialTemp,
  totalPressureAtm: initialPressure,
  reactantRatio: initialRatio,
}) => {
  // Local state initialized from props but allowing direct interactive manipulation
  const [tempK, setTempK] = useState<number>(initialTemp || 500);
  const [pressureAtm, setPressureAtm] = useState<number>(initialPressure || 100);
  const [ratio, setRatio] = useState<number>(initialRatio || 3.0);
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(true);
  const [animTime, setAnimTime] = useState<number>(0);

  useEffect(() => {
    if (initialTemp) setTempK(initialTemp);
  }, [initialTemp]);

  useEffect(() => {
    if (initialPressure) setPressureAtm(initialPressure);
  }, [initialPressure]);

  useEffect(() => {
    if (initialRatio) setRatio(initialRatio);
  }, [initialRatio]);

  // Live animation clock for bouncing molecules
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;
      setAnimTime((prev) => prev + dt);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Haber-Bosch exothermic reaction: N2 + 3H2 <=> 2NH3 + 92.4 kJ/mol
  const deltaH = -92400; // J/mol
  const R_gas = 8.314;
  const T_ref = 573; // 300°C
  const Kp_ref = 0.005;
  const Kp = Kp_ref * Math.exp((-deltaH / R_gas) * (1 / tempK - 1 / T_ref));

  // Equilibrium ammonia mole fraction estimate
  const pressureFactor = Math.pow(pressureAtm / 50, 0.45);
  const tempFactor = Math.exp(-(tempK - 450) / 130);
  const nh3YieldPercent = Math.min(
    95,
    Math.max(2, 45 * pressureFactor * tempFactor * (ratio > 2.5 && ratio < 3.5 ? 1.1 : 0.85))
  );

  const n2Percent = (100 - nh3YieldPercent) * 0.25;
  const h2Percent = (100 - nh3YieldPercent) * 0.75;

  // Graph data points for temperature response curve
  const graphPoints = [];
  for (let t = 400; t <= 800; t += 20) {
    const tFact = Math.exp(-(t - 450) / 130);
    const yieldEst = Math.min(
      95,
      Math.max(2, 45 * pressureFactor * tFact * (ratio > 2.5 && ratio < 3.5 ? 1.1 : 0.85))
    );
    graphPoints.push({ x: t, y: yieldEst });
  }

  // Piston vertical position: higher pressure pushes piston down
  const pistonY = Math.min(80, Math.max(20, 20 + ((pressureAtm - 10) / 240) * 50));

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-200 text-sm">
              Le Chatelier Equilibrium Chamber: Haber Ammonia Synthesis
            </h3>
          </div>
          <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-3 py-1 rounded-full font-mono font-bold">
            Dynamic Equilibrium Established
          </span>
        </div>

        {/* Reaction Scheme Banner with KaTeX */}
        <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-center mb-5">
          <Formula tex="\text{N}_2(g) + 3\text{H}_2(g) \rightleftharpoons 2\text{NH}_3(g), \quad \Delta H^\circ = -92.4\text{ kJ/mol}" />
        </div>

        {/* Interactive Chamber Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-center">
          <div className="md:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-3 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
            <svg viewBox="0 0 360 210" className="w-full h-56 select-none">
              {/* Heating glow beneath vessel */}
              <rect
                x="60"
                y="180"
                width="240"
                height="15"
                rx="6"
                fill="#ea580c"
                fillOpacity={(tempK - 400) / 450}
              />
              <text x="180" y="192" fill="#fdba74" fontSize="8" fontWeight="bold" textAnchor="middle">
                Heating Mantle ({tempK} K)
              </text>

              {/* Vessel Walls */}
              <rect x="70" y="20" width="220" height="155" rx="8" fill="#1e293b30" stroke="#475569" strokeWidth="3" />

              {/* Compression Piston Head */}
              <rect x="72" y={pistonY} width="216" height="16" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="180" y1="5" x2="180" y2={pistonY} stroke="#94a3b8" strokeWidth="6" />
              <text x="180" y={pistonY + 11} fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                Piston (P = {pressureAtm} atm)
              </text>

              {/* Catalyst Grid inside chamber */}
              {hasCatalyst && (
                <rect x="160" y={pistonY + 20} width="40" height={155 - pistonY - 25} fill="#f59e0b12" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
              )}

              {/* Bouncing Molecules */}
              {Array.from({ length: 18 }).map((_, i) => {
                const isNH3 = i < Math.round((nh3YieldPercent / 100) * 18);
                const isN2 = !isNH3 && i % 2 === 0;
                const molSpeed = (tempK / 500) * 35;
                const chamberHeight = 150 - pistonY;
                const bx = 85 + ((i * 32 + animTime * molSpeed) % 190);
                const by = pistonY + 22 + ((i * 19 + Math.sin(animTime * 3 + i) * 20) % Math.max(20, chamberHeight - 15));

                return (
                  <g key={i}>
                    <circle
                      cx={bx}
                      cy={by}
                      r={isNH3 ? 6.5 : isN2 ? 5.5 : 4}
                      fill={isNH3 ? '#10b981' : isN2 ? '#38bdf8' : '#e2e8f0'}
                    />
                    <text x={bx} y={by + 2.5} fill="#0f172a" fontSize="5" fontWeight="bold" textAnchor="middle">
                      {isNH3 ? 'NH₃' : isN2 ? 'N₂' : 'H₂'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Direct Manipulation Toggles */}
          <div className="md:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
            <h4 className="font-bold text-cyan-400 font-mono text-xs uppercase">Instant Chamber Adjusters</h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPressureAtm((p) => Math.min(250, p + 25))}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +25 atm (Compress)
              </button>
              <button
                onClick={() => setPressureAtm((p) => Math.max(10, p - 25))}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> -25 atm (Expand)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTempK((t) => Math.max(400, t - 50))}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> -50 K (Favor NH₃)
              </button>
              <button
                onClick={() => setTempK((t) => Math.min(800, t + 50))}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-bold hover:bg-slate-800 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> +50 K (Shift Left)
              </button>
            </div>

            <button
              onClick={() => setHasCatalyst(!hasCatalyst)}
              className={`w-full py-2 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
                hasCatalyst
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasCatalyst ? '✓ Iron Catalyst Present' : '+ Add Iron Catalyst'}</span>
            </button>
          </div>
        </div>

        {/* Equilibrium Mixture Composition Bar Chart */}
        <div className="space-y-3 bg-[#0a101f] p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Equilibrium Gas Mixture Composition (Mole Fraction)
          </h4>

          {/* Stacked Composition Bar */}
          <div className="w-full h-8 bg-slate-900 rounded-xl overflow-hidden flex border border-slate-700/80">
            <div
              className="bg-emerald-500 h-full flex items-center justify-center text-slate-950 font-bold text-xs transition-all duration-300"
              style={{ width: `${nh3YieldPercent}%` }}
              title={`Ammonia NH3: ${nh3YieldPercent.toFixed(1)}%`}
            >
              {nh3YieldPercent > 12 && `NH₃ ${nh3YieldPercent.toFixed(1)}%`}
            </div>
            <div
              className="bg-sky-500 h-full flex items-center justify-center text-slate-950 font-bold text-xs transition-all duration-300"
              style={{ width: `${n2Percent}%` }}
              title={`Nitrogen N2: ${n2Percent.toFixed(1)}%`}
            >
              {n2Percent > 12 && `N₂ ${n2Percent.toFixed(1)}%`}
            </div>
            <div
              className="bg-amber-500 h-full flex items-center justify-center text-slate-950 font-bold text-xs transition-all duration-300"
              style={{ width: `${h2Percent}%` }}
              title={`Hydrogen H2: ${h2Percent.toFixed(1)}%`}
            >
              {h2Percent > 12 && `H₂ ${h2Percent.toFixed(1)}%`}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-1 text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Ammonia Product [NH₃]: {nh3YieldPercent.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
              Nitrogen [N₂]: {n2Percent.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              Hydrogen [H₂]: {h2Percent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Dynamic Temperature vs Yield Graph */}
        <div className="mt-4">
          <GraphViewer
            title={`Equilibrium Yield vs Temperature (P = ${pressureAtm} atm)`}
            xLabel="T"
            yLabel="\text{Yield}"
            xUnit="K"
            yUnit="%"
            xDomain={[350, 750]}
            yDomain={[0, 100]}
            dataPoints={graphPoints}
            currentMarker={{ x: tempK, y: nh3YieldPercent }}
            height={160}
          />
        </div>
      </div>
    </div>
  );
};
