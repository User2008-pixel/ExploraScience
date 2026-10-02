import React from 'react';
import { Formula } from '../common/Formula';
import { Beaker } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface EnzymeActivitySimProps {
  substrateConc: number; // mM (0 - 50)
  tempC: number; // °C (10 - 75)
  phLevel: number; // (1 - 12)
}

export const EnzymeActivitySim: React.FC<EnzymeActivitySimProps> = ({
  substrateConc,
  tempC,
  phLevel,
}) => {
  // Michaelis-Menten Parameters
  const V_max_base = 100; // μmol/min
  const K_m = 8; // mM

  // Temperature effect: Arrhenius rise then thermal denaturation crash above 45°C
  const tempFactor =
    tempC > 65
      ? 0
      : tempC < 15
      ? 0.15
      : Math.max(0, 1 - Math.pow((tempC - 37) / 18, 2));

  // pH effect: Bell curve centered at pH 7.0
  const phFactor = Math.max(0, 1 - Math.pow((phLevel - 7.0) / 3.0, 2));

  // Live catalytic velocity v
  const v_active = (V_max_base * substrateConc) / (K_m + substrateConc) * tempFactor * phFactor;
  const isDenatured = tempC > 58 || phLevel < 3 || phLevel > 11;

  return (
    <div className="space-y-4">
      {/* Visual Simulation Card */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Enzyme Active Site & Induced Fit</h3>
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
            {Array.from({ length: Math.min(18, Math.max(3, Math.round(substrateConc / 2.5))) }).map((_, i) => (
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
              {!isDenatured && substrateConc > 3 && (
                <polygon
                  points="-15,-5 0,15 15,-5 0,-15"
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              )}

              <text x="0" y="45" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                {isDenatured ? 'Denatured Polypeptide' : 'Enzyme Active Site'}
              </text>
            </g>
          </svg>
        </div>

        {/* Real-time Telemetry Bar */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Substrate [S]: </span>
              <span className="text-cyan-300 font-bold">{substrateConc}</span> mM
            </div>
            <div>
              <span className="text-slate-500">Michaelis K_m: </span>
              <span className="text-amber-400 font-bold">{K_m}</span> mM
            </div>
            <div>
              <span className="text-slate-500">Catalytic Rate (v): </span>
              <span className="text-emerald-400 font-bold">{v_active.toFixed(1)}</span> μmol/min
            </div>
          </div>
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
          curveFunction={(s) => ((V_max_base * s) / (K_m + s)) * tempFactor * phFactor}
          currentMarker={{ x: substrateConc, y: v_active }}
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
            return ((V_max_base * substrateConc) / (K_m + substrateConc)) * tf * phFactor;
          }}
          currentMarker={{ x: tempC, y: v_active }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* Michaelis-Menten Formula Cards */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Enzyme Kinetics Formalism</h4>
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
