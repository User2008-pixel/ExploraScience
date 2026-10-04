import React, { useState } from 'react';
import { TestTube, Flame, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface FoodTest {
  id: string;
  name: string;
  targetNutrient: string;
  sampleName: string;
  reagentAdded: string;
  heatRequired: boolean;
  initialColor: string;
  finalColor: string;
  finalColorHex: string;
  chemicalPrinciple: string;
}

const TESTS: FoodTest[] = [
  {
    id: 'iodine',
    name: 'Iodine Test',
    targetNutrient: 'Starch (Complex Carbohydrate)',
    sampleName: 'Potato Extract / Starch Soln',
    reagentAdded: 'Potassium Triiodide (I₂/KI)',
    heatRequired: false,
    initialColor: 'Pale Amber',
    finalColor: 'Intense Blue-Black Complex',
    finalColorHex: '#1e1b4b',
    chemicalPrinciple: 'Iodine molecules slip into the helical coils of amylose polymer, forming an intense charge-transfer blue-black complex.',
  },
  {
    id: 'benedict',
    name: "Benedict's Test",
    targetNutrient: 'Reducing Sugars (Glucose / Maltose)',
    sampleName: 'Glucose Solution',
    reagentAdded: "Benedict's Quantitative Reagent (CuSO₄ + Na₂CO₃ + Sodium Citrate)",
    heatRequired: true,
    initialColor: 'Clear Aqua Blue',
    finalColor: 'Brick-Red Precipitate of Cu₂O',
    finalColorHex: '#b91c1c',
    chemicalPrinciple: 'Free aldehyde/ketone group of glucose reduces soluble blue cupric Cu²⁺ ions to insoluble brick-red cuprous oxide (Cu₂O) upon boiling.',
  },
  {
    id: 'biuret',
    name: 'Biuret Test',
    targetNutrient: 'Proteins (Polypeptides)',
    sampleName: 'Egg Albumin Soln',
    reagentAdded: '10% NaOH + 1% CuSO₄',
    heatRequired: false,
    initialColor: 'Colorless to Light Blue',
    finalColor: 'Deep Violet / Purple Complex',
    finalColorHex: '#7c3aed',
    chemicalPrinciple: 'Cu²⁺ ions coordinate with four unshared electron pairs on peptide nitrogen atoms (-CONH-) in alkaline medium, producing a violet coordination complex.',
  },
  {
    id: 'emulsion',
    name: 'Ethanol Emulsion Test',
    targetNutrient: 'Lipids (Fats & Oils)',
    sampleName: 'Vegetable Cooking Oil',
    reagentAdded: 'Absolute Ethanol + Cold Distilled Water',
    heatRequired: false,
    initialColor: 'Clear Golden Oil',
    finalColor: 'Milky White Opaque Emulsion',
    finalColorHex: '#e2e8f0',
    chemicalPrinciple: 'Lipids dissolve readily in non-polar ethanol. When water is added, lipids precipitate as microscopic dispersed droplets scattering light (emulsion).',
  },
];

export const BiochemicalFoodTestsSim: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<FoodTest>(TESTS[0]);
  const [isReagentAdded, setIsReagentAdded] = useState<boolean>(false);
  const [isHeated, setIsHeated] = useState<boolean>(false);

  const isCompleted = selectedTest.heatRequired ? isReagentAdded && isHeated : isReagentAdded;

  const handleSelectTest = (test: FoodTest) => {
    setSelectedTest(test);
    setIsReagentAdded(false);
    setIsHeated(false);
  };

  const handleReset = () => {
    setIsReagentAdded(false);
    setIsHeated(false);
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <TestTube className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Biochemical Qualitative Testing of Food Nutrients
            </h3>
            <p className="text-xs text-slate-400">
              Identification of Starch, Reducing Sugars, Proteins, and Lipids in biological specimens
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-teal-300 bg-teal-950/60 px-3 py-1 rounded-xl border border-teal-800/60 font-bold">
            Analytical Biochemistry Rack
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Apparatus: Wooden Test Tube Rack & Tube */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-teal-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            <span>TEST TUBE RACK &amp; CHEMICAL COLOR REACTION</span>
          </div>

          <svg viewBox="0 0 320 250" className="w-full max-w-[280px] h-64 select-none">
            {/* Wooden Test Tube Stand Base */}
            <rect x="40" y="215" width="240" height="20" rx="4" fill="#78350f" stroke="#92400e" strokeWidth="2" />
            <rect x="60" y="80" width="200" height="15" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="2" />
            <rect x="50" y="80" width="10" height="135" fill="#5c2605" />
            <rect x="260" y="80" width="10" height="135" fill="#5c2605" />

            {/* Test Tube in Center */}
            <path
              d="M 142,30 L 142,185 Q 142,215 160,215 Q 178,215 178,185 L 178,30 Z"
              fill="#1e293b"
              stroke="#cbd5e1"
              strokeWidth="2.5"
            />
            {/* Test Tube Rim */}
            <ellipse cx="160" cy="30" rx="18" ry="4" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />

            {/* Liquid in Test Tube */}
            <path
              d="M 144,115 L 144,185 Q 144,213 160,213 Q 176,213 176,185 L 176,115 Z"
              fill={isCompleted ? selectedTest.finalColorHex : '#38bdf8'}
              fillOpacity={isCompleted ? 0.9 : 0.4}
              className="transition-all duration-700"
            />

            {/* Water Bath Flame if Heated */}
            {isHeated && (
              <g transform="translate(160, 235)">
                <path d="M -8,0 C -12,-15 -5,-25 0,-30 C 5,-25 12,-15 8,0 Z" fill="#f59e0b" className="animate-pulse" />
                <path d="M -4,0 C -6,-10 -2,-18 0,-22 C 2,-18 6,-10 4,0 Z" fill="#38bdf8" />
              </g>
            )}

            {/* Color Status text */}
            <text x="160" y="105" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              {isCompleted ? selectedTest.finalColor : 'Sample: ' + selectedTest.sampleName}
            </text>
          </svg>

          <div className="w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-teal-400 font-bold">{selectedTest.name}</span>
            <span className="text-amber-400 font-bold">{selectedTest.targetNutrient}</span>
            <span className="text-emerald-400 font-bold">{isCompleted ? 'POSITIVE TEST' : 'Pending Reagent'}</span>
          </div>
        </div>

        {/* Controls & Inference */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-teal-400 font-mono text-sm uppercase">Select Food Test</h4>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {TESTS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTest(t)}
                className={`p-2 rounded-xl text-left font-bold transition border ${
                  selectedTest.id === t.id
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div>{t.name}</div>
                <div className="text-[10px] text-slate-500 font-normal">{t.targetNutrient.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsReagentAdded(true)}
              disabled={isReagentAdded}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-teal-500 text-slate-950 hover:bg-teal-400 transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <TestTube className="w-4 h-4" />
              <span>{isReagentAdded ? '✓ Reagent Added' : 'Add ' + selectedTest.reagentAdded.split('(')[0]}</span>
            </button>

            {selectedTest.heatRequired && (
              <button
                onClick={() => setIsHeated(true)}
                disabled={!isReagentAdded || isHeated}
                className="w-full py-2 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Flame className="w-4 h-4" />
                <span>{isHeated ? '✓ Boiled in Water Bath' : 'Heat in Boiling Water Bath (3 mins)'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="w-full py-1.5 rounded-xl text-xs text-slate-400 bg-slate-950 border border-slate-800 hover:text-white transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Test Tube</span>
            </button>
          </div>

          {/* Principle & Inference */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
            <div className="font-bold text-teal-400 font-mono">Biochemical Mechanism:</div>
            <p className="text-slate-400">{selectedTest.chemicalPrinciple}</p>
            {isCompleted && (
              <div className="pt-2 border-t border-slate-800 text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Positive Confirmation: {selectedTest.targetNutrient} confirmed.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
