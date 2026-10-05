import React, { useState } from 'react';
import { Formula } from '../common/Formula';
import { Beaker, Sliders, Flame, Droplets, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface EnzymeActivitySimProps {
  substrateConc?: number; // mM (0 - 50)
  tempC?: number; // °C (10 - 75)
  phLevel?: number; // (1 - 12)
}

export const EnzymeActivitySim: React.FC<EnzymeActivitySimProps> = ({
  substrateConc: propS = 20,
  tempC: propT = 37,
  phLevel: propPH = 7.0,
}) => {
  // Direct interactive state
  const [substrate, setSubstrate] = useState<number>(propS);
  const [temp, setTemp] = useState<number>(propT);
  const [ph, setPh] = useState<number>(propPH);
  const [inhibitor, setInhibitor] = useState<'none' | 'competitive' | 'non-competitive'>('none');

  // Michaelis-Menten Parameters
  const V_max_base = 100; // μmol/min
  const K_m_base = 8; // mM

  // Inhibitor modifications:
  // Competitive: increases apparent Km, Vmax unchanged
  // Non-competitive: decreases apparent Vmax, Km unchanged
  const effectiveKm = inhibitor === 'competitive' ? K_m_base * 2.5 : K_m_base;
  const effectiveVmax = inhibitor === 'non-competitive' ? V_max_base * 0.45 : V_max_base;

  // Temperature effect: Arrhenius rise then thermal denaturation crash above 45°C
  const tempFactor =
    temp > 65
      ? 0
      : temp < 15
      ? 0.15
      : Math.max(0, 1 - Math.pow((temp - 37) / 18, 2));

  // pH effect: Bell curve centered at pH 7.0
  const phFactor = Math.max(0, 1 - Math.pow((ph - 7.0) / 3.0, 2));

  // Live catalytic velocity v
  const v_active = ((effectiveVmax * substrate) / (effectiveKm + substrate)) * tempFactor * phFactor;
  const isDenatured = temp > 58 || ph < 3 || ph > 11;

  return (
    <div className="space-y-4">
      {/* Visual Simulation Card */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-200 text-sm">
              Enzyme Active Site & Induced Fit Dynamics
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Conformation:</span>
            {isDenatured ? (
              <span className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2.5 py-0.5 rounded-full font-bold">
                Denatured / Inactive
              </span>
            ) : (
              <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2.5 py-0.5 rounded-full font-bold">
                Native Folded (Catalytic)
              </span>
            )}
            {inhibitor !== 'none' && (
              <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full font-bold">
                {inhibitor === 'competitive' ? 'Competitive Inhibitor Present' : 'Allosteric Non-Competitive Inhibitor'}
              </span>
            )}
          </div>
        </div>

        {/* SVG Diagram of Enzyme-Substrate Complex */}
        <div className="w-full h-56 sm:h-64 bg-[#090e17] rounded-xl border border-slate-800/80 flex items-center justify-center p-4">
          <svg viewBox="0 0 600 220" className="w-full h-full select-none">
            <defs>
              <linearGradient id="enzymeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDenatured ? '#991b1b' : '#3b82f6'} />
                <stop offset="100%" stopColor={isDenatured ? '#450a0a' : '#1d4ed8'} />
              </linearGradient>
            </defs>

            {/* Free Substrate Molecules floating */}
            {Array.from({ length: Math.min(20, Math.max(3, Math.round(substrate / 2.2))) }).map((_, i) => (
              <polygon
                key={i}
                points={`${70 + (i % 6) * 45},${40 + Math.floor(i / 6) * 40} ${85 + (i % 6) * 45},${48 + Math.floor(i / 6) * 40} ${75 + (i % 6) * 45},${60 + Math.floor(i / 6) * 40} ${60 + (i % 6) * 45},${52 + Math.floor(i / 6) * 40}`}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1.5"
                opacity="0.85"
              />
            ))}

            {/* Central Large Enzyme Molecule */}
            <g transform="translate(360, 110)">
              {isDenatured ? (
                // Unfolded tangled mess
                <path
                  d="M -90,-20 Q -60,-70 -20,-30 T 40,-60 T 90,-10 T 60,60 T -30,50 T -80,20 Z"
                  fill="url(#enzymeGrad)"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="6,3"
                />
              ) : (
                // Folded globular enzyme with active site cleft
                <path
                  d="M -80,-50 C -30,-70 30,-70 80,-40 C 110,0 110,50 80,70 C 30,90 -40,90 -80,60 C -110,20 -110,-20 -80,-50 Z
                     M -20,-10 L 0,15 L 20,-10 Z"
                  fill="url(#enzymeGrad)"
                  stroke="#60a5fa"
                  strokeWidth="2.5"
                />
              )}

              {/* Substrate inside active site */}
              {!isDenatured && substrate > 3 && inhibitor !== 'competitive' && (
                <polygon
                  points="-15,-5 0,15 15,-5 0,-15"
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              )}

              {/* Competitive inhibitor blocking active site */}
              {!isDenatured && inhibitor === 'competitive' && (
                <polygon
                  points="-18,-8 0,16 18,-8 0,-18"
                  fill="#ef4444"
                  stroke="#f87171"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}

              <text x="0" y="45" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                {isDenatured
                  ? 'Denatured Polypeptide'
                  : inhibitor === 'competitive'
                  ? 'Inhibitor Blocked Cleft'
                  : 'Enzyme Active Site'}
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Telemetry Bar */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Substrate [S]: </span>
              <span className="text-cyan-300 font-bold">{substrate}</span> mM
            </div>
            <div>
              <span className="text-slate-500">Michaelis K_m: </span>
              <span className="text-amber-400 font-bold">{effectiveKm.toFixed(1)}</span> mM
            </div>
            <div>
              <span className="text-slate-500">V_max: </span>
              <span className="text-purple-400 font-bold">{effectiveVmax.toFixed(0)}</span> μmol/min
            </div>
            <div>
              <span className="text-slate-500">Catalytic Rate (v): </span>
              <span className="text-emerald-400 font-bold">{v_active.toFixed(1)}</span> μmol/min
            </div>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Inhibitor Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Enzyme Kinetics Direct Manipulator
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Active Conformation: {(tempFactor * phFactor * 100).toFixed(0)}%
          </span>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Substrate [S]:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{substrate} mM</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={substrate}
              onChange={(e) => setSubstrate(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 mM</span>
              <span>25 mM</span>
              <span>50 mM (Saturated)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Temperature (°C):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{temp}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="75"
              step="1"
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10°C (Cold)</span>
              <span>37°C (Optimum)</span>
              <span>75°C (Denatured)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">pH Level:</span>
              <span className="font-mono font-bold text-sky-400 text-sm">pH {ph.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="13"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>pH 1 (Stomach)</span>
              <span>pH 7 (Neutral)</span>
              <span>pH 13 (Alkaline)</span>
            </div>
          </div>
        </div>

        {/* Inhibitor & Quick Presets Bar */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Enzyme Inhibitor:</span>
            <button
              onClick={() => setInhibitor('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                inhibitor === 'none'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              No Inhibitor
            </button>
            <button
              onClick={() => setInhibitor('competitive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                inhibitor === 'competitive'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Competitive (Apparent Km ↑)
            </button>
            <button
              onClick={() => setInhibitor('non-competitive')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                inhibitor === 'non-competitive'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Non-Competitive (Vmax ↓)
            </button>
          </div>

          <button
            onClick={() => {
              setSubstrate(20);
              setTemp(37);
              setPh(7.0);
              setInhibitor('none');
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Optimum
          </button>
        </div>
      </div>

      {/* Dynamic Graphs (Michaelis-Menten v vs [S] & Temperature Denaturation Curve) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Michaelis-Menten Kinetics: v vs [S]"
          xLabel="[S]"
          yLabel="v([S])"
          xUnit="mM"
          yUnit="μmol/min"
          xDomain={[0, 50]}
          yDomain={[0, 110]}
          curveFunction={(s) => ((effectiveVmax * s) / (effectiveKm + s)) * tempFactor * phFactor}
          currentMarker={{ x: substrate, y: v_active }}
          curveColor="#38bdf8"
          height={160}
        />
        <GraphViewer
          title="Thermal Optimum & Denaturation: v vs T (°C)"
          xLabel="T"
          yLabel="v(T)"
          xUnit="°C"
          yUnit="μmol/min"
          xDomain={[10, 75]}
          yDomain={[0, 110]}
          curveFunction={(t) => {
            const tf = t > 65 ? 0 : t < 15 ? 0.15 : Math.max(0, 1 - Math.pow((t - 37) / 18, 2));
            return ((effectiveVmax * substrate) / (effectiveKm + substrate)) * tf * phFactor;
          }}
          currentMarker={{ x: temp, y: v_active }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* Michaelis-Menten Formula Cards */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Live Enzyme Kinetics Formalism
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Michaelis-Menten Equation</div>
            <Formula tex="v = \frac{V_{\max} [S]}{K_m + [S]}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Lineweaver-Burk Double Reciprocal</div>
            <Formula tex="\frac{1}{v} = \frac{K_m}{V_{\max}} \frac{1}{[S]} + \frac{1}{V_{\max}}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Active Conformation Index</div>
            <Formula tex={`f_{\\text{active}} = ${(tempFactor * phFactor * 100).toFixed(0)}\\%`} />
          </div>
        </div>
      </div>
    </div>
  );
};
