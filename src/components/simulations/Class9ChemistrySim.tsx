import React, { useState, useEffect, useRef } from 'react';
import {
  FlaskConical,
  Flame,
  Atom,
  Droplets,
  Sparkles,
  RefreshCw,
  Scale,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Zap,
} from 'lucide-react';

interface Class9ChemistrySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type ChemMode =
  | 'reactions'
  | 'matter'
  | 'solutions'
  | 'bohr'
  | 'rutherford'
  | 'formula';

export const Class9ChemistrySim: React.FC<Class9ChemistrySimProps> = ({
  simulationType = 'chem-reactions-conservation',
  conceptId = '',
  variables = {},
}) => {
  // Determine starting mode from simulationType or conceptId
  const getInitialMode = (): ChemMode => {
    if (conceptId.includes('sublimation') || conceptId.includes('matter') || conceptId.includes('state') || conceptId.includes('evaporat') || conceptId.includes('dry-ice') || simulationType.includes('matter')) return 'matter';
    if (conceptId.includes('pure') || conceptId.includes('solution') || conceptId.includes('colloid') || conceptId.includes('suspension') || conceptId.includes('tyndall') || conceptId.includes('mixture') || simulationType.includes('tyndall') || simulationType.includes('solution')) return 'solutions';
    if (conceptId.includes('bohr') || conceptId.includes('electron') || conceptId.includes('valency') || conceptId.includes('isotope') || conceptId.includes('isobar') || conceptId.includes('atomic-number') || simulationType.includes('bohr')) return 'bohr';
    if (conceptId.includes('rutherford') || conceptId.includes('thomson') || conceptId.includes('gold-foil') || conceptId.includes('alpha') || simulationType.includes('rutherford')) return 'rutherford';
    if (conceptId.includes('formula') || conceptId.includes('criss-cross') || conceptId.includes('molecular-mass') || conceptId.includes('mole') || conceptId.includes('polyatomic') || conceptId.includes('ions') || simulationType.includes('formula')) return 'formula';
    return 'reactions';
  };

  const isExploringTopic = Boolean(conceptId);
  const [activeMode, setActiveMode] = useState<ChemMode>(getInitialMode());

  // Update mode when simulationType changes
  useEffect(() => {
    setActiveMode(getInitialMode());
  }, [simulationType, conceptId]);

  // ----------------------------------------------------------------------
  // MODE 1: CHEMICAL REACTIONS & CONSERVATION OF MASS
  // ----------------------------------------------------------------------
  const REACTIONS = [
    {
      id: 'bacl2-na2so4',
      name: 'Precipitation: Barium Chloride + Sodium Sulfate',
      equation: '\\text{BaCl}_2(aq) + \\text{Na}_2\\text{SO}_4(aq) \\to \\text{BaSO}_4\\downarrow(s) + 2\\text{NaCl}(aq)',
      reactants: [
        { formula: 'BaCl_2', name: 'Barium Chloride (solution)', state: 'Clear liquid', mass: 20.82 },
        { formula: 'Na_2SO_4', name: 'Sodium Sulfate (solution)', state: 'Clear liquid', mass: 14.20 },
      ],
      products: [
        { formula: 'BaSO_4', name: 'Barium Sulfate (precipitate)', state: 'White insoluble solid', mass: 23.34 },
        { formula: 'NaCl', name: 'Sodium Chloride (in solution)', state: 'Dissolved brine', mass: 11.68 },
      ],
      tareMass: 150.00, // Conical flask + cork
      reactionType: 'Double Displacement & Precipitation',
      visualObservation: 'White curdy precipitate of Barium Sulfate immediately forms upon mixing.',
      constantProportionLaw: 'Barium Sulfate always contains Ba and SO₄ in strict 137.33 : 96.06 mass ratio (1.43:1).',
      atomBalance: { Ba: '1 = 1', Cl: '2 = 2', Na: '2 = 2', S: '1 = 1', O: '4 = 4' },
      precipitateColor: '#ffffff',
    },
    {
      id: 'fe-s',
      name: 'Synthesis: Iron + Sulfur Reaction',
      equation: '\\text{Fe}(s) + \\text{S}(s) \\xrightarrow{\\Delta} \\text{FeS}(s)',
      reactants: [
        { formula: 'Fe', name: 'Iron filings (grey powder)', state: 'Magnetic solid', mass: 5.58 },
        { formula: 'S', name: 'Sulfur powder (yellow)', state: 'Non-magnetic solid', mass: 3.21 },
      ],
      products: [
        { formula: 'FeS', name: 'Iron(II) Sulfide', state: 'Black non-magnetic compound', mass: 8.79 },
      ],
      tareMass: 45.00, // Boiling tube mass
      reactionType: 'Direct Combination (Exothermic)',
      visualObservation: 'Glows red-hot upon heating; transformed into a black mass unresponsive to magnets.',
      constantProportionLaw: 'Iron and Sulfur combine strictly in a 7:4 mass ratio (56g Fe : 32g S) according to Proust’s Law.',
      atomBalance: { Fe: '1 = 1', S: '1 = 1' },
      precipitateColor: '#1e293b',
    },
    {
      id: 'mg-o2',
      name: 'Combustion: Magnesium Ribbon in Air',
      equation: '2\\text{Mg}(s) + \\text{O}_2(g) \\to 2\\text{MgO}(s)',
      reactants: [
        { formula: 'Mg', name: 'Magnesium Ribbon', state: 'Silvery metal strip', mass: 4.86 },
        { formula: 'O_2', name: 'Oxygen (from sealed flask)', state: 'Gas in chamber', mass: 3.20 },
      ],
      products: [
        { formula: 'MgO', name: 'Magnesium Oxide', state: 'Dazzling white ash', mass: 8.06 },
      ],
      tareMass: 180.00,
      reactionType: 'Oxidation / Synthesis',
      visualObservation: 'Burns with a blinding, dazzling white flame leaving a white powdery residue of Magnesium Oxide.',
      constantProportionLaw: 'Magnesium and Oxygen combine in a constant 3:2 mass ratio (24g Mg : 16g O).',
      atomBalance: { Mg: '2 = 2', O: '2 = 2' },
      precipitateColor: '#f8fafc',
    },
    {
      id: 'cuso4-fe',
      name: 'Displacement: Iron Nail in Copper Sulfate',
      equation: '\\text{Fe}(s) + \\text{CuSO}_4(aq) \\to \\text{FeSO}_4(aq) + \\text{Cu}(s)',
      reactants: [
        { formula: 'Fe', name: 'Clean Iron Nail', state: 'Grey solid', mass: 5.58 },
        { formula: 'CuSO_4', name: 'Copper(II) Sulfate', state: 'Deep blue solution', mass: 15.96 },
      ],
      products: [
        { formula: 'FeSO_4', name: 'Iron(II) Sulfate', state: 'Light green solution', mass: 15.19 },
        { formula: 'Cu', name: 'Displaced Copper', state: 'Reddish-brown deposit', mass: 6.35 },
      ],
      tareMass: 120.00,
      reactionType: 'Single Displacement (Redox)',
      visualObservation: 'Blue solution fades to pale green; a shiny reddish-brown coating of elemental copper coats the iron nail.',
      constantProportionLaw: 'Copper sulfate crystal contains Cu:S:O in exact 63.5 : 32 : 64 mass proportion.',
      atomBalance: { Fe: '1 = 1', Cu: '1 = 1', S: '1 = 1', O: '4 = 4' },
      precipitateColor: '#b45309',
    },
  ];

  const [selectedReactionIdx, setSelectedReactionIdx] = useState(0);
  const currentReaction = REACTIONS[selectedReactionIdx];
  const [reactionProgress, setReactionProgress] = useState(0); // 0 = unreacted, 100 = reacted
  const [isReacting, setIsReacting] = useState(false);

  const initialReactantsMass = currentReaction.reactants.reduce((acc, r) => acc + r.mass, 0);
  const finalProductsMass = currentReaction.products.reduce((acc, p) => acc + p.mass, 0);
  const totalBalanceReading = (currentReaction.tareMass + initialReactantsMass).toFixed(2);

  const handleTriggerReaction = () => {
    if (reactionProgress === 100) return;
    setIsReacting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setIsReacting(false);
      }
      setReactionProgress(p);
    }, 40);
  };

  const handleResetReaction = () => {
    setReactionProgress(0);
    setIsReacting(false);
  };

  // ----------------------------------------------------------------------
  // MODE 2: PARTICULATE STATES OF MATTER
  // ----------------------------------------------------------------------
  const [matterTempC, setMatterTempC] = useState<number>(variables.temperatureC ?? 25);
  const [matterPressureAtm, setMatterPressureAtm] = useState<number>(1.0);
  const [selectedSubstance, setSelectedSubstance] = useState<'water' | 'nh4cl' | 'co2'>('water');

  // Determine state of matter
  const getStateName = () => {
    if (selectedSubstance === 'water') {
      if (matterTempC < 0) return { name: 'Solid (Ice)', color: '#38bdf8', phase: 'solid' };
      if (matterTempC >= 100) return { name: 'Gas (Water Vapor / Steam)', color: '#f43f5e', phase: 'gas' };
      return { name: 'Liquid (Water)', color: '#06b6d4', phase: 'liquid' };
    }
    if (selectedSubstance === 'nh4cl') {
      if (matterTempC < 340) return { name: 'Solid Ammonium Chloride', color: '#a855f7', phase: 'solid' };
      return { name: 'Sublimed Gas (NH₃ + HCl vapor)', color: '#ec4899', phase: 'gas' };
    }
    // CO2 (Dry ice)
    if (matterTempC < -78.5) return { name: 'Solid Dry Ice (CO₂)', color: '#38bdf8', phase: 'solid' };
    return { name: 'Carbon Dioxide Gas (Sublimed)', color: '#f97316', phase: 'gas' };
  };

  const currentState = getStateName();

  // ----------------------------------------------------------------------
  // MODE 3: SOLUTIONS, SUSPENSIONS & TYNDALL EFFECT
  // ----------------------------------------------------------------------
  const [isLaserOn, setIsLaserOn] = useState(true);
  const [stirringActive, setStirringActive] = useState(false);

  // ----------------------------------------------------------------------
  // MODE 4: BOHR ATOMIC MODEL & SHELL CONFIGURATION (Elements 1-20)
  // ----------------------------------------------------------------------
  const ELEMENTS = [
    { z: 1, symbol: 'H', name: 'Hydrogen', a: 1, p: 1, n: 0, k: 1, l: 0, m: 0, nShell: 0, valency: 1 },
    { z: 2, symbol: 'He', name: 'Helium', a: 4, p: 2, n: 2, k: 2, l: 0, m: 0, nShell: 0, valency: 0 },
    { z: 3, symbol: 'Li', name: 'Lithium', a: 7, p: 3, n: 4, k: 2, l: 1, m: 0, nShell: 0, valency: 1 },
    { z: 4, symbol: 'Be', name: 'Beryllium', a: 9, p: 4, n: 5, k: 2, l: 2, m: 0, nShell: 0, valency: 2 },
    { z: 5, symbol: 'B', name: 'Boron', a: 11, p: 5, n: 6, k: 2, l: 3, m: 0, nShell: 0, valency: 3 },
    { z: 6, symbol: 'C', name: 'Carbon', a: 12, p: 6, n: 6, k: 2, l: 4, m: 0, nShell: 0, valency: 4 },
    { z: 7, symbol: 'N', name: 'Nitrogen', a: 14, p: 7, n: 7, k: 2, l: 5, m: 0, nShell: 0, valency: 3 },
    { z: 8, symbol: 'O', name: 'Oxygen', a: 16, p: 8, n: 8, k: 2, l: 6, m: 0, nShell: 0, valency: 2 },
    { z: 9, symbol: 'F', name: 'Fluorine', a: 19, p: 9, n: 10, k: 2, l: 7, m: 0, nShell: 0, valency: 1 },
    { z: 10, symbol: 'Ne', name: 'Neon', a: 20, p: 10, n: 10, k: 2, l: 8, m: 0, nShell: 0, valency: 0 },
    { z: 11, symbol: 'Na', name: 'Sodium', a: 23, p: 11, n: 12, k: 2, l: 8, m: 1, nShell: 0, valency: 1 },
    { z: 12, symbol: 'Mg', name: 'Magnesium', a: 24, p: 12, n: 12, k: 2, l: 8, m: 2, nShell: 0, valency: 2 },
    { z: 13, symbol: 'Al', name: 'Aluminium', a: 27, p: 13, n: 14, k: 2, l: 8, m: 3, nShell: 0, valency: 3 },
    { z: 14, symbol: 'Si', name: 'Silicon', a: 28, p: 14, n: 14, k: 2, l: 8, m: 4, nShell: 0, valency: 4 },
    { z: 15, symbol: 'P', name: 'Phosphorus', a: 31, p: 15, n: 16, k: 2, l: 8, m: 5, nShell: 0, valency: 3 },
    { z: 16, symbol: 'S', name: 'Sulfur', a: 32, p: 16, n: 16, k: 2, l: 8, m: 6, nShell: 0, valency: 2 },
    { z: 17, symbol: 'Cl', name: 'Chlorine', a: 35.5, p: 17, n: 18, k: 2, l: 8, m: 7, nShell: 0, valency: 1 },
    { z: 18, symbol: 'Ar', name: 'Argon', a: 40, p: 18, n: 22, k: 2, l: 8, m: 8, nShell: 0, valency: 0 },
    { z: 19, symbol: 'K', name: 'Potassium', a: 39, p: 19, n: 20, k: 2, l: 8, m: 8, nShell: 1, valency: 1 },
    { z: 20, symbol: 'Ca', name: 'Calcium', a: 40, p: 20, n: 20, k: 2, l: 8, m: 8, nShell: 2, valency: 2 },
  ];

  const [selectedZ, setSelectedZ] = useState<number>(11); // Default Sodium (Na)
  const currentElement = ELEMENTS.find((e) => e.z === selectedZ) || ELEMENTS[10];

  // ----------------------------------------------------------------------
  // MODE 5: RUTHERFORD SCATTERING EXPERIMENT
  // ----------------------------------------------------------------------
  const [alphaSpeed, setAlphaSpeed] = useState<number>(1);
  const [showRutherfordFoilZoom, setShowRutherfordFoilZoom] = useState(false);

  // ----------------------------------------------------------------------
  // MODE 6: CHEMICAL FORMULA CRISS-CROSS BUILDER
  // ----------------------------------------------------------------------
  const CATIONS = [
    { name: 'Sodium', symbol: 'Na', charge: 1, formula: 'Na^+' },
    { name: 'Potassium', symbol: 'K', charge: 1, formula: 'K^+' },
    { name: 'Ammonium', symbol: 'NH_4', charge: 1, formula: 'NH_4^+' },
    { name: 'Magnesium', symbol: 'Mg', charge: 2, formula: 'Mg^{2+}' },
    { name: 'Calcium', symbol: 'Ca', charge: 2, formula: 'Ca^{2+}' },
    { name: 'Copper(II)', symbol: 'Cu', charge: 2, formula: 'Cu^{2+}' },
    { name: 'Iron(II)', symbol: 'Fe', charge: 2, formula: 'Fe^{2+}' },
    { name: 'Aluminium', symbol: 'Al', charge: 3, formula: 'Al^{3+}' },
    { name: 'Iron(III)', symbol: 'Fe', charge: 3, formula: 'Fe^{3+}' },
  ];

  const ANIONS = [
    { name: 'Chloride', symbol: 'Cl', charge: 1, formula: 'Cl^-' },
    { name: 'Hydroxide', symbol: 'OH', charge: 1, formula: 'OH^-' },
    { name: 'Nitrate', symbol: 'NO_3', charge: 1, formula: 'NO_3^-' },
    { name: 'Oxide', symbol: 'O', charge: 2, formula: 'O^{2-}' },
    { name: 'Sulfide', symbol: 'S', charge: 2, formula: 'S^{2-}' },
    { name: 'Sulfate', symbol: 'SO_4', charge: 2, formula: 'SO_4^{2-}' },
    { name: 'Carbonate', symbol: 'CO_3', charge: 2, formula: 'CO_3^{2-}' },
    { name: 'Phosphate', symbol: 'PO_4', charge: 3, formula: 'PO_4^{3-}' },
  ];

  const [selectedCationIdx, setSelectedCationIdx] = useState(7); // Al3+
  const [selectedAnionIdx, setSelectedAnionIdx] = useState(5); // SO4 2-

  const cation = CATIONS[selectedCationIdx];
  const anion = ANIONS[selectedAnionIdx];

  // Simplify criss-cross ratio (e.g., 2 and 2 becomes 1 and 1)
  const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
  const divisor = gcd(cation.charge, anion.charge);
  const cationSubscript = anion.charge / divisor;
  const anionSubscript = cation.charge / divisor;

  const buildFormulaString = () => {
    let catPart = cation.symbol;
    if (cationSubscript > 1) {
      if (cation.symbol.includes('_')) catPart = `(${catPart})_${cationSubscript}`;
      else catPart = `${catPart}_${cationSubscript}`;
    }
    let anPart = anion.symbol;
    if (anionSubscript > 1) {
      if (anion.symbol.includes('_') || anPart.length > 2) anPart = `(${anPart})_${anionSubscript}`;
      else anPart = `${anPart}_${anionSubscript}`;
    }
    return `${catPart}${anPart}`;
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Sub-navigation tabs for Chemistry Visual Modules */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            NCERT Class 9 Chemistry Visual Studio
          </h3>
        </div>

        {!isExploringTopic && (
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('reactions')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'reactions'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chemical Reactions & Mass
            </button>
            <button
              onClick={() => setActiveMode('matter')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'matter'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Particulate Matter & States
            </button>
            <button
              onClick={() => setActiveMode('solutions')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'solutions'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tyndall Light Scattering
            </button>
            <button
              onClick={() => setActiveMode('bohr')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'bohr'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bohr Atomic Shells
            </button>
            <button
              onClick={() => setActiveMode('rutherford')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'rutherford'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rutherford Scattering
            </button>
            <button
              onClick={() => setActiveMode('formula')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeMode === 'formula'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Criss-Cross Formula Builder
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODE 1: CHEMICAL REACTIONS & LAW OF CONSERVATION OF MASS */}
      {/* ============================================================== */}
      {activeMode === 'reactions' && (
        <div className="space-y-5">
          {/* Reaction Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-semibold uppercase font-mono">
              Select NCERT Chemical Reaction:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REACTIONS.map((rx, idx) => (
                <button
                  key={rx.id}
                  onClick={() => {
                    setSelectedReactionIdx(idx);
                    setReactionProgress(0);
                    setIsReacting(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedReactionIdx === idx
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {rx.name.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Balanced Chemical Equation Banner */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-amber-500/30 text-center space-y-1 shadow-inner">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
              {currentReaction.name} ({currentReaction.reactionType})
            </span>
            <div className="text-lg font-mono text-cyan-300 font-bold py-1">
              {currentReaction.equation.replace(/\\text\{([^}]+)\}/g, '$1').replace(/\\to/g, '➔').replace(/\\downarrow/g, '↓').replace(/\\xrightarrow\{[^}]*\}/g, '➔')}
            </div>
            <p className="text-xs text-slate-300 max-w-xl mx-auto italic">
              "{currentReaction.visualObservation}"
            </p>
          </div>

          {/* Simulation Stage: The Analytical Balance Apparatus */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Glassware & Flask Canvas */}
            <div className="lg:col-span-7 bg-gradient-to-b from-[#0e172e] to-[#070b16] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[320px] overflow-hidden">
              {/* Scale Platform Base */}
              <div className="relative w-64 h-56 flex flex-col items-center justify-end">
                {/* Conical Flask SVG Graphic with animated liquids & precipitation */}
                <svg viewBox="0 0 200 240" className="w-52 h-52 relative z-10">
                  {/* Flask Cork */}
                  <rect x="85" y="10" width="30" height="20" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />

                  {/* Glass Outline */}
                  <path
                    d="M 85,28 L 85,80 L 25,200 A 15,15 0 0,0 38,220 L 162,220 A 15,15 0 0,0 175,200 L 115,80 L 115,28 Z"
                    fill="rgba(30, 41, 59, 0.4)"
                    stroke="#94a3b8"
                    strokeWidth="3"
                  />

                  {/* Liquid inside flask */}
                  <path
                    d="M 45,185 L 155,185 L 162,215 A 8,8 0 0,1 155,218 L 45,218 A 8,8 0 0,1 38,215 Z"
                    fill={
                      reactionProgress === 0
                        ? '#38bdf844'
                        : reactionProgress < 100
                        ? '#fbbf2455'
                        : currentReaction.precipitateColor + 'aa'
                    }
                    className="transition-colors duration-500"
                  />

                  {/* Precipitate settling at bottom */}
                  {reactionProgress > 20 && (
                    <ellipse
                      cx="100"
                      cy="212"
                      rx={20 + (reactionProgress / 100) * 45}
                      ry={4 + (reactionProgress / 100) * 6}
                      fill={currentReaction.precipitateColor}
                      opacity={reactionProgress / 100}
                    />
                  )}

                  {/* Small suspended test tube inside (Lavoisier's sealed ignition tube) */}
                  <g transform="translate(90, 95) rotate(-25)">
                    <rect x="0" y="0" width="16" height="55" rx="8" fill="#1e293b88" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect
                      x="2"
                      y={reactionProgress === 0 ? 25 : 50}
                      width="12"
                      height={reactionProgress === 0 ? 25 : 0}
                      rx="4"
                      fill="#f59e0b"
                      className="transition-all duration-700"
                    />
                  </g>

                  {/* Rising gas bubbles / reaction effervescence particles */}
                  {isReacting && (
                    <g>
                      <circle cx="95" cy="180" r="3" fill="#ffffff" opacity="0.8" className="animate-ping" />
                      <circle cx="115" cy="170" r="2.5" fill="#ffffff" opacity="0.8" className="animate-pulse" />
                      <circle cx="85" cy="165" r="2" fill="#ffffff" opacity="0.7" className="animate-ping" />
                      <circle cx="125" cy="155" r="3" fill="#ffffff" opacity="0.6" className="animate-pulse" />
                    </g>
                  )}
                </svg>

                {/* Digital Scale Base Plate */}
                <div className="w-64 h-12 bg-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-between px-4 shadow-xl z-20">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mettler Analytical Scale</span>
                  </div>
                  {/* Digital LCD Weight readout */}
                  <div className="bg-emerald-950/90 border border-emerald-500/50 px-3 py-1 rounded text-emerald-400 font-mono font-extrabold text-sm tracking-widest shadow-inner">
                    {totalBalanceReading} g
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                    reactionProgress === 100
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isReacting
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {reactionProgress === 100
                      ? 'Reaction Complete: Mass Conserved Exactly'
                      : isReacting
                      ? `Reacting... ${reactionProgress}%`
                      : 'Reactants Ready on Balance'}
                  </span>
                </span>
              </div>
            </div>

            {/* Right Side: Law of Conservation of Mass & Proust Proportions Audit */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Law of Conservation of Mass (Lavoisier, 1789)
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Total Mass Before Reaction:</span>
                    <span className="text-cyan-400 font-mono font-bold">{totalBalanceReading} g</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Total Mass After Reaction:</span>
                    <span className="text-emerald-400 font-mono font-bold">{totalBalanceReading} g</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-emerald-300 font-bold">Δm (Mass Difference):</span>
                    <span className="text-emerald-400 font-mono font-extrabold">0.00 g (Strictly Conserved)</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Atomic Conservation Audit:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {Object.entries(currentReaction.atomBalance).map(([atom, balance]) => (
                      <div key={atom} className="flex justify-between px-1">
                        <span className="text-amber-400">{atom}:</span>
                        <span>{balance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Law of Constant Proportions Callout */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Law of Constant Proportions (Proust, 1799)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentReaction.constantProportionLaw}
                </p>
              </div>

              {/* Control Trigger Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerReaction}
                  disabled={isReacting || reactionProgress === 100}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{reactionProgress === 100 ? 'Reaction Completed' : 'Trigger Chemical Reaction'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetReaction}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Apparatus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: PARTICULATE NATURE OF MATTER & PHASE TRANSITIONS */}
      {/* ============================================================== */}
      {activeMode === 'matter' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Interactive Particle Canvas */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 uppercase">Microscopic Particle Lattice:</span>
                <span className="font-mono font-bold px-2.5 py-0.5 rounded-full border" style={{ color: currentState.color, borderColor: currentState.color }}>
                  {currentState.name}
                </span>
              </div>

              {/* Particle Canvas Display */}
              <div className="w-full h-64 bg-[#070b14] rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                {/* Visual state simulation */}
                {currentState.phase === 'solid' && (
                  <div className="grid grid-cols-6 gap-3 p-4">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full shadow-lg transition-transform animate-pulse"
                        style={{
                          backgroundColor: currentState.color,
                          animationDuration: '1.2s',
                          transform: `scale(${0.9 + Math.sin(i) * 0.1})`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {currentState.phase === 'liquid' && (
                  <div className="w-full h-full p-4 relative">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full absolute shadow-md transition-all duration-300"
                        style={{
                          backgroundColor: currentState.color,
                          left: `${15 + (i * 11) % 70}%`,
                          bottom: `${10 + ((i * 13) % 45)}%`,
                          animation: 'bounce 3s infinite',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {currentState.phase === 'gas' && (
                  <div className="w-full h-full p-4 relative">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full absolute shadow-xl animate-ping"
                        style={{
                          backgroundColor: currentState.color,
                          left: `${5 + (i * 23) % 85}%`,
                          top: `${10 + (i * 19) % 75}%`,
                          animationDuration: '1.5s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Characteristics Summary */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Interparticle Space</div>
                  <div className="font-bold text-white mt-0.5">
                    {currentState.phase === 'solid' ? 'Negligible' : currentState.phase === 'liquid' ? 'Moderate' : 'Maximum'}
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Kinetic Energy</div>
                  <div className="font-bold text-white mt-0.5">
                    {currentState.phase === 'solid' ? 'Vibrational' : currentState.phase === 'liquid' ? 'Translational' : 'High Velocity'}
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Compressibility</div>
                  <div className="font-bold text-white mt-0.5">
                    {currentState.phase === 'solid' ? 'Zero (Rigid)' : currentState.phase === 'liquid' ? 'Almost Nil' : 'Highly Compressible'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Thermodynamic Controllers & Latent Heat Curves */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Thermal & Pressure Regulators
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Incubation Temperature:</span>
                    <span className="font-mono text-cyan-400 font-bold">{matterTempC} °C ({matterTempC + 273} K)</span>
                  </div>
                  <input
                    type="range"
                    min="-85"
                    max="140"
                    step="1"
                    value={matterTempC}
                    onChange={(e) => setMatterTempC(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>-85°C (Dry Ice)</span>
                    <span>0°C (Melting)</span>
                    <span>100°C (Boiling)</span>
                    <span>140°C</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Atmospheric Pressure:</span>
                    <span className="font-mono text-amber-400 font-bold">{matterPressureAtm.toFixed(1)} atm</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="5.0"
                    step="0.1"
                    value={matterPressureAtm}
                    onChange={(e) => setMatterPressureAtm(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>

              {/* Sublimation Note */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 text-xs text-slate-300 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase font-mono block">
                  NCERT Phenomenon: Sublimation & Latent Heat
                </span>
                <p className="leading-relaxed">
                  <strong>Latent Heat of Fusion:</strong> The thermal energy required to convert 1 kg of a solid into liquid at atmospheric pressure at its melting point without any rise in temperature.
                </p>
                <p className="leading-relaxed text-slate-400 pt-1">
                  <strong>Sublimation:</strong> Change of state directly from solid to gas without passing through the liquid state (e.g., Ammonium Chloride NH₄Cl, Camphor, and Dry Ice solid CO₂).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: TYNDALL LIGHT SCATTERING & COLLOIDAL PHENOMENA */}
      {/* ============================================================== */}
      {activeMode === 'solutions' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-semibold">
              Optical Chamber Laser Simulation:
            </span>
            <button
              onClick={() => setIsLaserOn(!isLaserOn)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isLaserOn ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isLaserOn ? 'Laser Emitter: ON' : 'Laser Emitter: OFF'}</span>
            </button>
          </div>

          {/* Three Beakers Comparison Canvas */}
          <div className="bg-[#080d1a] rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-around gap-6 relative min-h-[280px]">
            {/* Laser Line across all beakers */}
            {isLaserOn && (
              <div className="absolute top-[135px] left-4 right-4 h-0.5 bg-gradient-to-r from-red-500 via-red-500 to-red-400 z-30 opacity-90 shadow-[0_0_8px_#ef4444]" />
            )}

            {/* Beaker 1: True Solution */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-44 rounded-b-2xl border-2 border-slate-600 bg-slate-900/40 relative overflow-hidden flex items-end">
                <div className="w-full h-32 bg-cyan-950/30 flex items-center justify-center">
                  {/* Invisible beam in true solution */}
                  <span className="text-[10px] text-slate-500 italic">No beam visible</span>
                </div>
              </div>
              <div className="text-center font-mono">
                <div className="text-xs font-bold text-white">1. True Solution</div>
                <div className="text-[10px] text-slate-400">Salt / Sugar in H₂O</div>
                <div className="text-[10px] text-rose-400 font-bold mt-0.5">Particle &lt; 1 nm (No Tyndall)</div>
              </div>
            </div>

            {/* Beaker 2: Colloid (Tyndall Cone) */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-44 rounded-b-2xl border-2 border-slate-600 bg-slate-900/40 relative overflow-hidden flex items-end">
                <div className="w-full h-32 bg-amber-950/40 relative flex items-center justify-center">
                  {/* Illuminated Tyndall path */}
                  {isLaserOn && (
                    <div className="w-full h-3 bg-red-500/60 blur-[1px] shadow-[0_0_12px_#ef4444] animate-pulse" />
                  )}
                  <span className="absolute bottom-2 text-[10px] text-amber-300 font-mono font-bold">
                    Tyndall Cone
                  </span>
                </div>
              </div>
              <div className="text-center font-mono">
                <div className="text-xs font-bold text-amber-300">2. Colloidal Solution</div>
                <div className="text-[10px] text-slate-400">Milk / Starch in H₂O</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">1–100 nm (Tyndall Scattering)</div>
              </div>
            </div>

            {/* Beaker 3: Suspension */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-32 h-44 rounded-b-2xl border-2 border-slate-600 bg-slate-900/40 relative overflow-hidden flex items-end">
                <div className="w-full h-32 bg-slate-800/60 relative flex flex-col justify-end p-1">
                  {/* Settled particles at bottom */}
                  <div className="w-full h-4 bg-amber-700/80 rounded-b-xl" />
                  <span className="absolute top-2 left-2 text-[9px] text-slate-400">Particles settle</span>
                </div>
              </div>
              <div className="text-center font-mono">
                <div className="text-xs font-bold text-slate-300">3. Suspension</div>
                <div className="text-[10px] text-slate-400">Chalk / Sand in H₂O</div>
                <div className="text-[10px] text-amber-400 font-bold mt-0.5">&gt; 100 nm (Unstable)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: BOHR ATOMIC STRUCTURE & SHELL FILLING (Elements 1-20) */}
      {/* ============================================================== */}
      {activeMode === 'bohr' && (
        <div className="space-y-5">
          {/* Element Selector Bar */}
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              Select Element (Z = 1 to 20):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {ELEMENTS.map((el) => (
                <button
                  key={el.z}
                  onClick={() => setSelectedZ(el.z)}
                  className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition flex flex-col items-center shrink-0 ${
                    selectedZ === el.z
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">{el.z}</span>
                  <span>{el.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Bohr Orbitals Graphic */}
            <div className="lg:col-span-7 bg-[#060a17] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <svg viewBox="0 0 300 300" className="w-72 h-72">
                {/* Concentric Energy Shells */}
                {/* K Shell (n=1) */}
                <circle cx="150" cy="150" r="45" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                {/* L Shell (n=2) */}
                {currentElement.l > 0 && (
                  <circle cx="150" cy="150" r="75" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                )}
                {/* M Shell (n=3) */}
                {currentElement.m > 0 && (
                  <circle cx="150" cy="150" r="105" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                )}
                {/* N Shell (n=4) */}
                {currentElement.nShell > 0 && (
                  <circle cx="150" cy="150" r="135" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                )}

                {/* Central Nucleus */}
                <circle cx="150" cy="150" r="22" fill="#ef4444" stroke="#f87171" strokeWidth="2" className="animate-pulse" />
                <text x="150" y="146" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  {currentElement.p}p⁺
                </text>
                <text x="150" y="158" textAnchor="middle" fill="#cbd5e1" fontSize="9">
                  {currentElement.n}n⁰
                </text>

                {/* Electrons in K Shell */}
                {Array.from({ length: currentElement.k }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / currentElement.k;
                  return (
                    <circle
                      key={`k-${i}`}
                      cx={150 + 45 * Math.cos(angle)}
                      cy={150 + 45 * Math.sin(angle)}
                      r="4"
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Electrons in L Shell */}
                {Array.from({ length: currentElement.l }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / currentElement.l;
                  return (
                    <circle
                      key={`l-${i}`}
                      cx={150 + 75 * Math.cos(angle)}
                      cy={150 + 75 * Math.sin(angle)}
                      r="4"
                      fill="#a855f7"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Electrons in M Shell */}
                {Array.from({ length: currentElement.m }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / currentElement.m;
                  return (
                    <circle
                      key={`m-${i}`}
                      cx={150 + 105 * Math.cos(angle)}
                      cy={150 + 105 * Math.sin(angle)}
                      r="4"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Electrons in N Shell */}
                {Array.from({ length: currentElement.nShell }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / currentElement.nShell;
                  return (
                    <circle
                      key={`n-${i}`}
                      cx={150 + 135 * Math.cos(angle)}
                      cy={150 + 135 * Math.sin(angle)}
                      r="4"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              <div className="flex gap-4 text-[11px] font-mono mt-2 text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> K: {currentElement.k}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400"></span> L: {currentElement.l}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> M: {currentElement.m}</span>
                {currentElement.nShell > 0 && (
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> N: {currentElement.nShell}</span>
                )}
              </div>
            </div>

            {/* Right: Electronic Data Card */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-lg font-bold text-white">{currentElement.name}</h4>
                  <div className="text-xs text-cyan-400 font-semibold">{currentElement.symbol} (Z = {currentElement.z})</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Mass Number A</div>
                  <div className="text-base font-extrabold text-amber-400">{currentElement.a} u</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Electronic Configuration:</span>
                  <span className="text-emerald-400 font-bold">
                    {[currentElement.k, currentElement.l, currentElement.m, currentElement.nShell]
                      .filter((s) => s > 0)
                      .join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Valence Electrons:</span>
                  <span className="text-cyan-400 font-bold">
                    {currentElement.nShell || currentElement.m || currentElement.l || currentElement.k}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Chemical Valency:</span>
                  <span className="text-amber-400 font-bold">{currentElement.valency}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Bohr-Bury Rule:</span>
                  <span className="text-slate-300">Max electrons in shell = 2n²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 5: RUTHERFORD ALPHA SCATTERING EXPERIMENT */}
      {/* ============================================================== */}
      {activeMode === 'rutherford' && (
        <div className="space-y-4">
          <div className="bg-[#070b16] rounded-2xl border border-slate-800 p-6 flex flex-col items-center relative overflow-hidden min-h-[300px]">
            <svg viewBox="0 0 500 240" className="w-full h-56">
              {/* Alpha Particle Emitter */}
              <rect x="20" y="100" width="50" height="40" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <text x="45" y="125" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">α Gun</text>

              {/* Gold Foil Layer */}
              <line x1="250" y1="20" x2="250" y2="220" stroke="#f59e0b" strokeWidth="4" opacity="0.8" />
              <text x="250" y="15" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">Gold Foil (100 nm)</text>

              {/* Undeflected Alpha Tracks (99% pass straight) */}
              <line x1="70" y1="60" x2="440" y2="60" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
              <line x1="70" y1="80" x2="440" y2="80" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
              <line x1="70" y1="160" x2="440" y2="160" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
              <line x1="70" y1="180" x2="440" y2="180" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />

              {/* Deflected Alpha Particle */}
              <path d="M 70,110 L 248,110 Q 252,110 270,80 L 400,20" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />

              {/* Rebounded Alpha Particle (1 in 12,000) */}
              <path d="M 70,120 L 246,120 Q 250,120 220,150 L 120,200" fill="none" stroke="#a855f7" strokeWidth="2.5" />

              {/* Circular Zinc Sulfide Screen */}
              <path d="M 400,20 A 200,200 0 0,1 400,220" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.6" />
              <text x="440" y="130" textAnchor="middle" fill="#10b981" fontSize="9" transform="rotate(90 440,130)">ZnS Detector Screen</text>
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full text-xs font-mono text-slate-300 pt-2">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">1. Most Passed Straight:</span>
                Atom consists predominantly of empty space.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-rose-400 font-bold block mb-1">2. Small Deflections:</span>
                Positive charge is concentrated, not spread uniformly like Thomson pudding.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">3. Rare Rebound (1/12000):</span>
                Entire mass and positive charge is crammed into tiny nucleus (r ≈ 10⁻¹⁵ m).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 6: CHEMICAL FORMULA CRISS-CROSS BUILDER */}
      {/* ============================================================== */}
      {activeMode === 'formula' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cation Picker */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Select Positive Ion (Cation):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {CATIONS.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedCationIdx(idx)}
                    className={`p-2 rounded-xl text-xs font-mono transition text-left border ${
                      selectedCationIdx === idx
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-sm">{c.symbol}⁺{c.charge > 1 ? c.charge : ''}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Anion Picker */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                Select Negative Ion (Anion):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ANIONS.map((a, idx) => (
                  <button
                    key={a.name}
                    onClick={() => setSelectedAnionIdx(idx)}
                    className={`p-2 rounded-xl text-xs font-mono transition text-left border ${
                      selectedAnionIdx === idx
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-sm">{a.symbol}⁻{a.charge > 1 ? a.charge : ''}</div>
                    <div className="text-[10px] text-slate-500 truncate">{a.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Criss-Cross Display */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold">
              Criss-Cross Valency Rule:
            </span>

            <div className="flex items-center justify-center gap-8 text-xl font-mono">
              <div className="text-cyan-400">
                <div className="text-sm text-slate-500 mb-1">Cation Valency</div>
                <div className="font-bold text-2xl">{cation.symbol}</div>
                <div className="text-base text-cyan-300">+{cation.charge}</div>
              </div>

              <div className="text-slate-500 text-3xl font-light">⤧</div>

              <div className="text-amber-400">
                <div className="text-sm text-slate-500 mb-1">Anion Valency</div>
                <div className="font-bold text-2xl">{anion.symbol}</div>
                <div className="text-base text-amber-300">-{anion.charge}</div>
              </div>
            </div>

            {/* Resulting Empirical Chemical Formula */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 inline-block px-8">
              <div className="text-xs text-slate-400 font-mono mb-1">Formulated Compound:</div>
              <div className="text-3xl font-mono font-extrabold text-emerald-400 tracking-wider">
                {buildFormulaString().replace(/_([0-9]+)/g, '₍$1₎')}
              </div>
              <div className="text-xs text-slate-300 font-sans mt-1">
                {cation.name} {anion.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
