import React, { useState } from 'react';
import { FunctionGrapher } from './FunctionGrapher';
import { ScientificCalculator } from './ScientificCalculator';
import { UnitConverter } from './UnitConverter';
import { DataRegressionTool } from './DataRegressionTool';
import {
  LineChart,
  Calculator as CalcIcon,
  TrendingUp,
  Scale,
  Sparkles,
  BookOpen,
  Atom,
} from 'lucide-react';

type SubTool = 'grapher' | 'calculator' | 'converter' | 'regression';

export const MathGraphingView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<SubTool>('grapher');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <LineChart className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Mathematics, Graphing & Units Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scientific Math, Units & Graphing Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Interactive multi-function graphing, definite calculus integrals & derivatives, SI ↔ Imperial scientific unit conversions, STEM constants, and regression.
          </p>
        </div>

        {/* Sub-tool switcher tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('grapher')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTool === 'grapher'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Function Grapher</span>
          </button>

          <button
            onClick={() => setActiveTool('calculator')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTool === 'calculator'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Lab Calculator</span>
          </button>

          <button
            onClick={() => setActiveTool('converter')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTool === 'converter'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Unit Converter</span>
          </button>

          <button
            onClick={() => setActiveTool('regression')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTool === 'regression'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Data Regression</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      {activeTool === 'grapher' && <FunctionGrapher />}
      {activeTool === 'calculator' && <ScientificCalculator />}
      {activeTool === 'converter' && <UnitConverter />}
      {activeTool === 'regression' && <DataRegressionTool />}
    </div>
  );
};
