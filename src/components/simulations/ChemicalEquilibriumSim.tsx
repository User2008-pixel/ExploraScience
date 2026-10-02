import React from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { RefreshCw, ArrowRightLeft } from 'lucide-react';

interface ChemicalEquilibriumSimProps {
  temperatureK: number; // K (400 - 800)
  totalPressureAtm: number; // atm (10 - 250)
  reactantRatio: number; // stoichiometric ratio H2:N2 (1.0 - 5.0)
}

export const ChemicalEquilibriumSim: React.FC<ChemicalEquilibriumSimProps> = ({
  temperatureK,
  totalPressureAtm,
  reactantRatio,
}) => {
  // Haber-Bosch exothermic reaction: N2 + 3H2 <=> 2NH3 + 92.4 kJ/mol
  // Exothermic -> higher temperature shifts equilibrium left (lower K_p)
  // 4 moles gas -> 2 moles gas -> higher pressure shifts equilibrium right (higher NH3 yield)

  // Van 't Hoff equilibrium constant approximation:
  // ln(Kp2 / Kp1) = -deltaH/R * (1/T2 - 1/T1)
  const deltaH = -92400; // J/mol
  const R_gas = 8.314;
  const T_ref = 573; // 300°C
  const Kp_ref = 0.005;
  const Kp = Kp_ref * Math.exp((-deltaH / R_gas) * (1 / temperatureK - 1 / T_ref));

  // Equilibrium ammonia mole fraction estimate
  // High pressure and low temperature favor conversion
  const pressureFactor = Math.pow(totalPressureAtm / 50, 0.45);
  const tempFactor = Math.exp(-(temperatureK - 450) / 130);
  const nh3YieldPercent = Math.min(
    95,
    Math.max(2, 45 * pressureFactor * tempFactor * (reactantRatio > 2.5 && reactantRatio < 3.5 ? 1.1 : 0.85))
  );

  const n2Percent = (100 - nh3YieldPercent) * 0.25;
  const h2Percent = (100 - nh3YieldPercent) * 0.75;

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

        {/* Telemetry */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Equilibrium Yield (NH₃): </span>
              <span className="text-emerald-400 font-bold">{nh3YieldPercent.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-500">Total Pressure: </span>
              <span className="text-cyan-400 font-bold">{totalPressureAtm}</span> atm
            </div>
            <div>
              <span className="text-slate-500">Reaction Temp: </span>
              <span className="text-amber-400 font-bold">{temperatureK}</span> K
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Equilibrium Curves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Le Chatelier Pressure Effect: Yield vs Pressure (atm)"
          xLabel="P_{\text{total}}"
          yLabel="\text{NH}_3\\text{ Yield (\\%)}"
          xUnit="atm"
          yUnit="%"
          xDomain={[10, 250]}
          yDomain={[0, 100]}
          curveFunction={(pAtm) => {
            const pF = Math.pow(pAtm / 50, 0.45);
            const tF = Math.exp(-(temperatureK - 450) / 130);
            return Math.min(95, Math.max(2, 45 * pF * tF));
          }}
          currentMarker={{ x: totalPressureAtm, y: nh3YieldPercent }}
          curveColor="#10b981"
          height={160}
        />
        <GraphViewer
          title="Exothermic Temperature Shift: Yield vs Temperature (K)"
          xLabel="T"
          yLabel="\text{NH}_3\\text{ Yield (\\%)}"
          xUnit="K"
          yUnit="%"
          xDomain={[400, 800]}
          yDomain={[0, 100]}
          curveFunction={(tK) => {
            const pF = Math.pow(totalPressureAtm / 50, 0.45);
            const tF = Math.exp(-(tK - 450) / 130);
            return Math.min(95, Math.max(2, 45 * pF * tF));
          }}
          currentMarker={{ x: temperatureK, y: nh3YieldPercent }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* KaTeX Thermodynamic Formalism */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Equilibrium Laws</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Equilibrium Constant Expression</div>
            <Formula tex="K_p = \frac{P_{\text{NH}_3}^2}{P_{\text{N}_2} \cdot P_{\text{H}_2}^3}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Van 't Hoff Exothermic Shift</div>
            <Formula tex="\frac{d \ln K_p}{d T} = \frac{\Delta H^\circ}{R T^2} < 0 \implies T \uparrow \implies K_p \downarrow" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Le Chatelier Pressure Rule</div>
            <Formula tex="P \uparrow \implies \text{Shifts to side with fewer gas moles (4 } \to \text{ 2)}" />
          </div>
        </div>
      </div>
    </div>
  );
};
