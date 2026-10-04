import React, { useState } from 'react';
import { Flame, TestTube, Sparkles, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface SaltOption {
  id: string;
  name: string;
  formula: string;
  cation: string;
  anion: string;
  flameColor: string;
  flameHex: string;
  flameDescription: string;
  reagentReaction: string;
  reagentPrecipitateColor: string;
  reagentHex: string;
  gasEvolution: string;
  inference: string;
}

const SALTS_DATA: SaltOption[] = [
  {
    id: 'bacl2',
    name: 'Barium Chloride',
    formula: 'BaCl₂',
    cation: 'Ba²⁺ (Group V)',
    anion: 'Cl⁻ (Dilute acid group)',
    flameColor: 'Apple Green',
    flameHex: '#84cc16',
    flameDescription: 'Persistent apple green coloration imparted to non-luminous Bunsen flame.',
    reagentReaction: 'Salt Soln + Dil. H₂SO₄ ➔ Insoluble white precipitate of BaSO₄ (insoluble in conc. HNO₃).',
    reagentPrecipitateColor: 'Dense White Precipitate',
    reagentHex: '#ffffff',
    gasEvolution: 'Treated with Conc. H₂SO₄ ➔ Colourless pungent HCl gas forming dense white fumes of NH₄Cl.',
    inference: 'Confirmed: Barium cation (Ba²⁺) and Chloride anion (Cl⁻).',
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO₄',
    cation: 'Cu²⁺ (Group II)',
    anion: 'SO₄²⁻ (Individual test)',
    flameColor: 'Bluish Green',
    flameHex: '#06b6d4',
    flameDescription: 'Non-luminous flame tinted vivid bluish-green.',
    reagentReaction: 'Salt Soln + NH₄OH (excess) ➔ Pale blue ppt dissolves to form deep azure blue complex [Cu(NH₃)₄]²⁺.',
    reagentPrecipitateColor: 'Deep Azure Royal Blue',
    reagentHex: '#1d4ed8',
    gasEvolution: 'Salt Soln + BaCl₂ ➔ Thick white precipitate of BaSO₄.',
    inference: 'Confirmed: Cupric cation (Cu²⁺) and Sulfate anion (SO₄²⁻).',
  },
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    formula: 'CaCO₃',
    cation: 'Ca²⁺ (Group V)',
    anion: 'CO₃²⁻ (Dilute acid group)',
    flameColor: 'Brick Red',
    flameHex: '#ea580c',
    flameDescription: 'Characteristic brick-red flash visible through cobalt blue glass.',
    reagentReaction: 'Salt Soln + Ammonium Oxalate (NH₄)₂C₂O₄ ➔ White precipitate of Calcium Oxalate (CaC₂O₄).',
    reagentPrecipitateColor: 'White Calcium Oxalate',
    reagentHex: '#f1f5f9',
    gasEvolution: 'Salt + Dilute HCl ➔ Brisk effervescence of CO₂ gas which turns clear lime water Ca(OH)₂ milky.',
    inference: 'Confirmed: Calcium cation (Ca²⁺) and Carbonate anion (CO₃²⁻).',
  },
  {
    id: 'pbno32',
    name: 'Lead(II) Nitrate',
    formula: 'Pb(NO₃)₂',
    cation: 'Pb²⁺ (Group I / II)',
    anion: 'NO₃⁻ (Brown ring test)',
    flameColor: 'Dull Bluish-White',
    flameHex: '#93c5fd',
    flameDescription: 'Faint bluish-white sparks with crackling decrepitation.',
    reagentReaction: 'Salt Soln + Potassium Iodide (KI) ➔ Brilliant golden-yellow precipitate of Lead Iodide (PbI₂).',
    reagentPrecipitateColor: 'Golden Yellow Crystals (Golden Rain)',
    reagentHex: '#eab308',
    gasEvolution: 'Dry salt heating with Cu turnings + Conc. H₂SO₄ ➔ Dense reddish-brown fumes of NO₂ gas.',
    inference: 'Confirmed: Lead cation (Pb²⁺) and Nitrate anion (NO₃⁻).',
  },
  {
    id: 'nh4cl',
    name: 'Ammonium Chloride',
    formula: 'NH₄Cl',
    cation: 'NH₄⁺ (Zero Group)',
    anion: 'Cl⁻',
    flameColor: 'No Flame Color',
    flameHex: '#38bdf8',
    flameDescription: 'No distinct flame tint (sublimes readily onto cooler parts of test tube).',
    reagentReaction: 'Salt Soln + Nessler’s Reagent K₂[HgI₄] + NaOH ➔ Brown precipitate (Iodide of Millon’s base).',
    reagentPrecipitateColor: 'Reddish-Brown Precipitate',
    reagentHex: '#991b1b',
    gasEvolution: 'Salt + NaOH solution heated ➔ Pungent smell of NH₃ gas, turns moist red litmus paper blue.',
    inference: 'Confirmed: Ammonium cation (NH₄⁺) and Chloride anion (Cl⁻).',
  },
];

export const SaltAnalysisSim: React.FC = () => {
  const [selectedSalt, setSelectedSalt] = useState<SaltOption>(SALTS_DATA[0]);
  const [activeTest, setActiveTest] = useState<'flame' | 'wet' | 'gas'>('flame');
  const [isTestActive, setIsTestActive] = useState<boolean>(true);

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Qualitative Systematic Inorganic Salt Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Dry tests (flame coloration), wet confirmatory tests for cations, and anion identification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-800/60 font-bold">
            Semi-Micro Analysis Bench
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Apparatus: Bunsen Burner or Test Tube */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
            <span>
              {activeTest === 'flame' && 'PLATINUM WIRE LOOP & BUNSEN FLAME COLOR TEST'}
              {activeTest === 'wet' && 'WET CONFIRMATORY REACTION & PRECIPITATION'}
              {activeTest === 'gas' && 'GAS EVOLUTION & ACID TESTING'}
            </span>
          </div>

          {/* Test 1: Flame Test Apparatus */}
          {activeTest === 'flame' && (
            <svg viewBox="0 0 320 250" className="w-full max-w-[280px] h-64 select-none">
              {/* Bunsen Burner Base & Barrel */}
              <rect x="135" y="160" width="50" height="70" fill="#334155" rx="4" />
              <rect x="110" y="225" width="100" height="15" fill="#1e293b" rx="4" />
              <ellipse cx="160" cy="160" rx="15" ry="5" fill="#475569" />

              {/* Bunsen Flame (Tinted by Salt) */}
              <defs>
                <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="40%" stopColor={selectedSalt.flameHex} />
                  <stop offset="100%" stopColor={selectedSalt.flameHex} stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Flame Outer Shape */}
              <path
                d="M 148,160 C 130,120 140,80 160,40 C 180,80 190,120 172,160 Z"
                fill="url(#flameGrad)"
                className="animate-pulse"
              />
              {/* Flame Inner Core */}
              <path
                d="M 154,160 C 145,135 150,110 160,85 C 170,110 175,135 166,160 Z"
                fill="#38bdf8"
                fillOpacity="0.6"
              />

              {/* Platinum Wire Loop entering flame */}
              <line x1="260" y1="90" x2="165" y2="105" stroke="#94a3b8" strokeWidth="2.5" />
              <circle cx="165" cy="105" r="4" fill="none" stroke="#facc15" strokeWidth="2" />
              <text x="270" y="85" fill="#94a3b8" fontSize="8" textAnchor="end">Pt Wire Loop</text>

              <text x="160" y="25" textAnchor="middle" fill={selectedSalt.flameHex} fontSize="12" fontWeight="bold">
                {selectedSalt.flameColor} Flame
              </text>
            </svg>
          )}

          {/* Test 2: Wet Confirmatory Test Tube */}
          {activeTest === 'wet' && (
            <svg viewBox="0 0 320 250" className="w-full max-w-[280px] h-64 select-none">
              {/* Test Tube */}
              <path
                d="M 135,40 L 135,170 Q 135,210 160,210 Q 185,210 185,170 L 185,40 Z"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2.5"
              />
              {/* Solution Layer with Precipitate */}
              <path
                d="M 137,120 L 137,170 Q 137,208 160,208 Q 183,208 183,170 L 183,120 Z"
                fill={selectedSalt.reagentHex}
                fillOpacity="0.8"
              />

              {/* Reagent Dropper adding drops */}
              <path d="M 156,15 L 164,15 L 162,55 L 158,55 Z" fill="#94a3b8" />
              <circle cx="160" cy="75" r="3" fill="#38bdf8" className="animate-pulse" />

              <text x="160" y="235" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                {selectedSalt.reagentPrecipitateColor}
              </text>
            </svg>
          )}

          {/* Test 3: Gas Evolution */}
          {activeTest === 'gas' && (
            <svg viewBox="0 0 320 250" className="w-full max-w-[280px] h-64 select-none">
              {/* Boiling Tube */}
              <path
                d="M 130,50 L 130,170 Q 130,215 160,215 Q 190,215 190,170 L 190,50 Z"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2.5"
              />
              {/* Liquid */}
              <path
                d="M 132,150 L 132,170 Q 132,213 160,213 Q 188,213 188,170 L 188,150 Z"
                fill="#475569"
                fillOpacity="0.5"
              />

              {/* Rising Effervescence / Fumes */}
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx={148 + (i * 7)}
                  cy={140 - (i * 20)}
                  r={3 + (i % 2)}
                  fill={selectedSalt.id === 'pbno32' ? '#b45309' : '#38bdf8'}
                  fillOpacity="0.7"
                />
              ))}

              <text x="160" y="30" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                {selectedSalt.id === 'pbno32' ? 'Brown NO₂ Fumes' : 'Gas Bubbles / Effervescence'}
              </text>
            </svg>
          )}

          <div className="w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-purple-400 font-bold">{selectedSalt.name} ({selectedSalt.formula})</span>
            <span className="text-emerald-400 font-bold">{selectedSalt.cation}</span>
            <span className="text-cyan-400 font-bold">{selectedSalt.anion}</span>
          </div>
        </div>

        {/* Controls & Inference */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">Select Salt Sample</h4>

          <div className="grid grid-cols-1 gap-1.5 text-xs">
            {SALTS_DATA.map((salt) => (
              <button
                key={salt.id}
                onClick={() => setSelectedSalt(salt)}
                className={`p-2 rounded-xl text-left font-semibold transition border flex items-center justify-between ${
                  selectedSalt.id === salt.id
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span>{salt.name}</span>
                <span className="font-mono text-[10px] text-slate-500">{salt.formula}</span>
              </button>
            ))}
          </div>

          <div>
            <span className="text-xs text-slate-400 mb-1.5 block font-mono">Select Systematic Test:</span>
            <div className="flex gap-1.5 text-xs">
              {[
                { id: 'flame', label: '1. Flame Test' },
                { id: 'wet', label: '2. Wet Test' },
                { id: 'gas', label: '3. Gas Evolution' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTest(t.id as any)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition border ${
                    activeTest === t.id
                      ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observations Box */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
            <div className="font-bold text-purple-400 font-mono">Laboratory Observation:</div>
            {activeTest === 'flame' && <p>{selectedSalt.flameDescription}</p>}
            {activeTest === 'wet' && <p>{selectedSalt.reagentReaction}</p>}
            {activeTest === 'gas' && <p>{selectedSalt.gasEvolution}</p>}

            <div className="pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
              {selectedSalt.inference}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
