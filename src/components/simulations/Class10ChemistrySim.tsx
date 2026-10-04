import React, { useState, useEffect, useRef } from 'react';
import {
  FlaskConical,
  Flame,
  Droplets,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Atom,
  TestTube2,
  Zap,
} from 'lucide-react';

interface Class10ChemistrySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Chem10Mode =
  | 'reactions-redox'
  | 'acids-bases-ph'
  | 'metals-ionic'
  | 'carbon-micelles';

export const Class10ChemistrySim: React.FC<Class10ChemistrySimProps> = ({
  simulationType = 'class10-chemistry',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Chem10Mode => {
    if (conceptId.includes('reaction') || conceptId.includes('redox') || conceptId.includes('balancing')) return 'reactions-redox';
    if (conceptId.includes('acid') || conceptId.includes('base') || conceptId.includes('ph') || conceptId.includes('salt')) return 'acids-bases-ph';
    if (conceptId.includes('metal') || conceptId.includes('reactivity') || conceptId.includes('ionic')) return 'metals-ionic';
    if (conceptId.includes('carbon') || conceptId.includes('covalent') || conceptId.includes('micelle') || conceptId.includes('soap')) return 'carbon-micelles';
    return 'reactions-redox';
  };

  const [activeMode, setActiveMode] = useState<Chem10Mode>(getInitialMode());
  const isExploringTopic = Boolean(conceptId);

  // Global live animation clock
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [animTime, setAnimTime] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveMode(getInitialMode());
  }, [simulationType, conceptId]);

  useEffect(() => {
    if (!isPlaying) return;
    let lastStamp = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;
      setAnimTime((prev) => prev + dt * simSpeed);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, simSpeed]);

  // ----------------------------------------------------------------------
  // MODE 1: CHEMICAL REACTIONS & REDOX
  // ----------------------------------------------------------------------
  const [rxnType, setRxnType] = useState<'redox' | 'combination' | 'displacement' | 'double-disp'>('redox');
  const [reactProgress, setReactProgress] = useState<number>(0.6);

  // ----------------------------------------------------------------------
  // MODE 2: ACIDS, BASES & pH SCALE
  // ----------------------------------------------------------------------
  const [phValue, setPhValue] = useState<number>(variables.ph ?? 7.0);
  const [indicatorType, setIndicatorType] = useState<'universal' | 'litmus' | 'phenolphthalein'>('universal');

  const getPhColor = (ph: number) => {
    if (indicatorType === 'phenolphthalein') {
      return ph >= 8.3 ? '#f43f5e' : '#e2e8f0'; // pink in base, colorless in acid
    }
    if (indicatorType === 'litmus') {
      return ph < 7 ? '#ef4444' : '#3b82f6'; // red in acid, blue in base
    }
    // Universal indicator color gradient
    if (ph <= 2) return '#ef4444'; // strong red
    if (ph <= 4) return '#f97316'; // orange
    if (ph <= 6) return '#eab308'; // yellow
    if (ph <= 7.5) return '#22c55e'; // green (neutral)
    if (ph <= 9) return '#06b6d4'; // cyan
    if (ph <= 11) return '#3b82f6'; // blue
    return '#8b5cf6'; // deep violet
  };

  const hPlusConc = Math.pow(10, -phValue);
  const ohMinusConc = Math.pow(10, -(14 - phValue));

  // ----------------------------------------------------------------------
  // MODE 3: METALS REACTIVITY & IONIC BONDING
  // ----------------------------------------------------------------------
  const [selectedMetal, setSelectedMetal] = useState<'Zn' | 'Fe' | 'Cu' | 'Mg'>('Zn');
  const [ionicCompound, setIonicCompound] = useState<'NaCl' | 'MgO'>('NaCl');

  // ----------------------------------------------------------------------
  // MODE 4: CARBON COVALENT BONDING & SOAP MICELLES
  // ----------------------------------------------------------------------
  const [carbonCompound, setCarbonCompound] = useState<'methane' | 'ethene' | 'ethyne'>('methane');
  const [showAgitation, setShowAgitation] = useState<boolean>(true);

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 10 NCERT Chemistry Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live molecular kinetics, ionic electron transfers, dynamic acid-base indicators & soap micelle emulsification
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition border border-emerald-500/30"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => setAnimTime(0)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Reset Time"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 ml-2">
            <span>Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  simSpeed === s ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'reactions-redox', label: '1. Reactions & Redox' },
          { id: 'acids-bases-ph', label: '2. Acids, Bases & pH' },
          { id: 'metals-ionic', label: '3. Metals & Ionic Bonding' },
          { id: 'carbon-micelles', label: '4. Carbon & Soap Micelles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Chem10Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. REACTIONS & REDOX PROCESSES */}
      {/* ============================================================== */}
      {activeMode === 'reactions-redox' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE REACTION KINETICS & ELECTRON TRANSFER</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                <defs>
                  <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                  </linearGradient>
                  <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Laboratory Bench */}
                <line x1="30" y1="190" x2="370" y2="190" stroke="#334155" strokeWidth="3" />

                {/* Conical Flask */}
                <path
                  d="M 175,60 L 225,60 L 225,80 L 270,180 L 130,180 L 175,80 Z"
                  fill="url(#flaskGrad)"
                  stroke="#64748b"
                  strokeWidth="2.5"
                />
                {/* Liquid Level */}
                {rxnType === 'redox' && (
                  <path
                    d={`M 140,180 L 260,180 L 245,${140 - Math.sin(animTime * 2) * 2} L 155,${140 + Math.sin(animTime * 2) * 2} Z`}
                    fill="#b45309"
                    fillOpacity="0.5"
                  />
                )}
                {rxnType === 'displacement' && (
                  <path
                    d={`M 140,180 L 260,180 L 245,135 L 155,135 Z`}
                    fill="#0284c7"
                    fillOpacity={0.7 - reactProgress * 0.4}
                  />
                )}
                {rxnType === 'double-disp' && (
                  <g>
                    <path d="M 140,180 L 260,180 L 245,135 L 155,135 Z" fill="#e2e8f0" fillOpacity="0.3" />
                    {/* Precipitate settling */}
                    <ellipse cx="200" cy="178" rx="45" ry="4" fill="#ffffff" fillOpacity="0.9" />
                  </g>
                )}

                {/* Dynamic Bubbles / Gas Ejection */}
                {[0, 1, 2, 3, 4].map((i) => {
                  const bY = 175 - ((animTime * 40 + i * 25) % 110);
                  const bX = 180 + ((i * 11 + Math.sin(animTime * 3 + i) * 15) % 40);
                  return (
                    <circle
                      key={i}
                      cx={bX}
                      cy={bY}
                      r={2 + (i % 2)}
                      fill="#38bdf8"
                      fillOpacity="0.6"
                    />
                  );
                })}

                {/* Animated Electron Transfer Particles in Redox */}
                {rxnType === 'redox' && (
                  <g>
                    {/* Reducing Agent (H2) on left -> Oxidizing Agent (CuO) on right */}
                    <circle cx="80" cy="110" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="80" y="114" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">H₂</text>
                    <text x="80" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Oxidized (0 → +1)</text>

                    <circle cx="320" cy="110" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="320" y="114" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">CuO</text>
                    <text x="320" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Reduced (+2 → 0)</text>

                    {/* Flowing electrons */}
                    {(() => {
                      const eProgress = (animTime * 0.8) % 1;
                      const ex = 108 + eProgress * (320 - 108 - 28);
                      const ey = 110 - Math.sin(eProgress * Math.PI) * 35;
                      return (
                        <g>
                          <path d="M 108,110 Q 200,60 292,110" fill="none" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.5" />
                          <circle cx={ex} cy={ey} r="5" fill="#38bdf8" className="animate-pulse" />
                          <text x={ex} y={ey - 8} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">2e⁻</text>
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* Chemical Equation Text */}
                <text x="200" y="30" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  {rxnType === 'redox' && 'CuO (black) + H₂ (g) ➔ Cu (brown) + H₂O (l)'}
                  {rxnType === 'combination' && 'CaO (quicklime) + H₂O ➔ Ca(OH)₂ (slaked lime) + ΔH'}
                  {rxnType === 'displacement' && 'Fe (s) + CuSO₄ (blue) ➔ FeSO₄ (green) + Cu (s)'}
                  {rxnType === 'double-disp' && 'Na₂SO₄ (aq) + BaCl₂ (aq) ➔ BaSO₄ ↓ (white ppt) + 2NaCl'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Reaction: {rxnType.toUpperCase()}</span>
                <span className="text-cyan-400 font-bold">Exothermic heat: {rxnType === 'combination' ? '+63.7 kJ/mol' : 'Moderate'}</span>
                <span className="text-amber-400 font-bold">Electron Flow: Active</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Reaction Selector</h4>

              <div className="space-y-2">
                {[
                  { id: 'redox', name: 'Redox (Reduction-Oxidation)' },
                  { id: 'combination', name: 'Combination (Exothermic)' },
                  { id: 'displacement', name: 'Displacement (Reactivity)' },
                  { id: 'double-disp', name: 'Double Displacement (Precipitate)' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRxnType(r.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      rxnType === r.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 bg-slate-950/50 hover:bg-slate-800'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">NCERT Core Key Insight:</div>
                <p>
                  <strong>OIL RIG:</strong> Oxidation Is Loss of electrons (or addition of oxygen / removal of hydrogen); Reduction Is Gain of electrons (or addition of hydrogen / removal of oxygen).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ACIDS, BASES, UNIVERSAL pH SCALE & INDICATORS */}
      {/* ============================================================== */}
      {activeMode === 'acids-bases-ph' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>DYNAMIC pH TITRATION & HYDRONIUM CONCENTRATION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Beaker with solution colored by pH */}
                <rect x="130" y="70" width="140" height="120" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
                <rect
                  x="133"
                  y={190 - 90}
                  width="134"
                  height="88"
                  rx="6"
                  fill={getPhColor(phValue)}
                  fillOpacity="0.7"
                />

                {/* Ion Particles in solution */}
                {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                  const x = 145 + ((idx * 17 + animTime * 15) % 110);
                  const y = 115 + Math.sin(animTime * 2 + idx) * 20;
                  const isH3O = idx % 2 === 0;
                  if (isH3O && phValue > 10) return null;
                  if (!isH3O && phValue < 4) return null;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="7" fill={isH3O ? '#ef4444' : '#3b82f6'} fillOpacity="0.8" />
                      <text x={x} y={y + 3} textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">
                        {isH3O ? 'H⁺' : 'OH⁻'}
                      </text>
                    </g>
                  );
                })}

                {/* pH Scale Gradient Bar */}
                <g transform="translate(40, 20)">
                  <defs>
                    <linearGradient id="phGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="25%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#22c55e" />
                      <stop offset="75%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="320" height="14" rx="7" fill="url(#phGrad)" />
                  {/* Cursor Indicator */}
                  <polygon
                    points={`${(phValue / 14) * 320},18 ${(phValue / 14) * 320 - 6},26 ${(phValue / 14) * 320 + 6},26`}
                    fill="#ffffff"
                  />
                  <text x="5" y="10" fill="#ffffff" fontSize="8" fontWeight="bold">0 (Acid)</text>
                  <text x="160" y="10" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">7 (Neutral)</text>
                  <text x="315" y="10" textAnchor="end" fill="#ffffff" fontSize="8" fontWeight="bold">14 (Alkali)</text>
                </g>

                {/* Readout label */}
                <text x="200" y="208" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  pH = {phValue.toFixed(1)} {phValue < 6.8 ? '(Acidic)' : phValue > 7.2 ? '(Basic / Alkaline)' : '(Neutral)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">[H₃O⁺] = {hPlusConc.toExponential(2)} M</span>
                <span className="text-blue-400 font-bold">[OH⁻] = {ohMinusConc.toExponential(2)} M</span>
                <span className="text-emerald-400 font-bold">pOH = {(14 - phValue).toFixed(1)}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">pH Controller & Indicator</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Target pH:</span>
                  <span className="text-cyan-400 font-bold">{phValue.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.1"
                  value={phValue}
                  onChange={(e) => setPhValue(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Preset Common Substances:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button onClick={() => setPhValue(1.2)} className="p-1.5 rounded-lg bg-slate-800 text-rose-300 hover:bg-slate-700">Gastric Juice (1.2)</button>
                  <button onClick={() => setPhValue(2.2)} className="p-1.5 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700">Lemon Juice (2.2)</button>
                  <button onClick={() => setPhValue(7.0)} className="p-1.5 rounded-lg bg-slate-800 text-emerald-300 hover:bg-slate-700">Pure Water (7.0)</button>
                  <button onClick={() => setPhValue(7.4)} className="p-1.5 rounded-lg bg-slate-800 text-teal-300 hover:bg-slate-700">Human Blood (7.4)</button>
                  <button onClick={() => setPhValue(10.5)} className="p-1.5 rounded-lg bg-slate-800 text-cyan-300 hover:bg-slate-700">Milk of Magnesia (10.5)</button>
                  <button onClick={() => setPhValue(14.0)} className="p-1.5 rounded-lg bg-slate-800 text-purple-300 hover:bg-slate-700">NaOH Solution (14.0)</button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Indicator Type:</span>
                <div className="flex gap-2">
                  {(['universal', 'litmus', 'phenolphthalein'] as const).map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndicatorType(ind)}
                      className={`flex-1 py-1 rounded-lg text-[10px] capitalize font-semibold border ${
                        indicatorType === ind
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-transparent hover:text-white'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. METALS REACTIVITY & IONIC BONDING */}
      {/* ============================================================== */}
      {activeMode === 'metals-ionic' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>ELECTRON SHELL TRANSFER & IONIC CRYSTAL LATTICE</span>
              </div>

              <svg viewBox="0 0 420 220" className="w-full h-64 select-none">
                {/* Sodium Atom / Ion (Left) */}
                <g transform="translate(100, 110)">
                  <circle cx="0" cy="0" r="14" fill="#3b82f6" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">11p⁺</text>
                  {/* K shell */}
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {/* L shell */}
                  <circle cx="0" cy="0" r="48" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {/* M shell (valence) */}
                  <circle cx="0" cy="0" r="68" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />

                  {/* Valence electron jumping */}
                  {(() => {
                    const jumpT = (animTime * 0.7) % 1;
                    const jX = 68 + jumpT * (220 - 68);
                    const jY = -Math.sin(jumpT * Math.PI) * 40;
                    return (
                      <g>
                        <circle cx={jX} cy={jY} r="4" fill="#facc15" className="animate-pulse" />
                        <text x={jX} y={jY - 6} fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">e⁻</text>
                      </g>
                    );
                  })()}

                  <text x="0" y="85" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                    Na (2,8,1) ➔ Na⁺ (2,8)
                  </text>
                </g>

                {/* Electrostatic Force Arrow */}
                <g transform="translate(210, 110)">
                  <line x1="-30" y1="0" x2="30" y2="0" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="0" y="-10" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">Ionic Attraction</text>
                  <text x="0" y="16" textAnchor="middle" fill="#94a3b8" fontSize="8">F = k q₁q₂ / r²</text>
                </g>

                {/* Chlorine Atom / Ion (Right) */}
                <g transform="translate(320, 110)">
                  <circle cx="0" cy="0" r="15" fill="#22c55e" />
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">17p⁺</text>
                  {/* K shell */}
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {/* L shell */}
                  <circle cx="0" cy="0" r="48" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
                  {/* M shell */}
                  <circle cx="0" cy="0" r="68" fill="none" stroke="#22c55e" strokeWidth="1.2" />

                  <text x="0" y="85" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">
                    Cl (2,8,7) + e⁻ ➔ Cl⁻ (2,8,8)
                  </text>
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Bond Type: Electrovalent (Ionic)</span>
                <span className="text-emerald-400 font-bold">Noble Gas Octet Achieved</span>
                <span className="text-sky-400 font-bold">Lattice Energy: High (Exothermic)</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Reactivity Series</h4>

              <div className="space-y-1 text-xs">
                {[
                  { sym: 'K', name: 'Potassium (Most Reactive)', tag: 'Reacts violently with cold water' },
                  { sym: 'Na', name: 'Sodium', tag: 'Stored under kerosene' },
                  { sym: 'Ca', name: 'Calcium', tag: 'Reacts vigorously with water' },
                  { sym: 'Mg', name: 'Magnesium', tag: 'Reacts with hot steam' },
                  { sym: 'Zn', name: 'Zinc', tag: 'Displaces Copper from CuSO₄' },
                  { sym: 'Fe', name: 'Iron', tag: 'Displaces Copper, reacts slowly' },
                  { sym: 'Cu', name: 'Copper', tag: 'Does not react with dilute acids' },
                  { sym: 'Au', name: 'Gold (Least Reactive)', tag: 'Noble metal, inert' },
                ].map((m, i) => (
                  <div key={m.sym} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                    <span className="font-bold text-amber-300">{i + 1}. {m.sym} - {m.name}</span>
                    <span className="text-[9px] text-slate-400">{m.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CARBON BONDING, HYDROCARBONS & SOAP MICELLES */}
      {/* ============================================================== */}
      {activeMode === 'carbon-micelles' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>SOAP MICELLE EMULSIFICATION & HYDROPHOBIC ACTION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Central Oil / Dirt Droplet */}
                <circle
                  cx="200"
                  cy="110"
                  r={32 + Math.sin(animTime * 3) * 1.5}
                  fill="#78350f"
                  stroke="#b45309"
                  strokeWidth="2"
                />
                <text x="200" y="108" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="bold">
                  Oily Dirt
                </text>
                <text x="200" y="120" textAnchor="middle" fill="#d97706" fontSize="7">
                  Hydrophobic Core
                </text>

                {/* Radiating Soap Micelle Molecules (16 arms) */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 16 + (showAgitation ? animTime * 0.3 : 0);
                  const innerR = 34;
                  const outerR = 75;
                  const x1 = 200 + Math.cos(angle) * innerR;
                  const y1 = 110 + Math.sin(angle) * innerR;
                  const x2 = 200 + Math.cos(angle) * outerR;
                  const y2 = 110 + Math.sin(angle) * outerR;

                  return (
                    <g key={i}>
                      {/* Hydrophobic hydrocarbon zig-zag tail */}
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 2" />
                      {/* Hydrophilic Ionic Head (-COO⁻ Na⁺) facing water */}
                      <circle cx={x2} cy={y2} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                    </g>
                  );
                })}

                {/* Surrounding Water molecules (H2O) */}
                {[0, 1, 2, 3, 4, 5].map((w) => {
                  const wAngle = (w * 2 * Math.PI) / 6 - animTime * 0.2;
                  const wx = 200 + Math.cos(wAngle) * 98;
                  const wy = 110 + Math.sin(wAngle) * 98;
                  return (
                    <text key={w} x={wx} y={wy} textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                      H₂O
                    </text>
                  );
                })}

                <text x="200" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Soap Micelle: Hydrophobic Tail in Oil, Hydrophilic Head in Water
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-violet-400 font-bold">Soap: C₁₇H₃₅COO⁻ Na⁺</span>
                <span className="text-cyan-400 font-bold">Emulsion: Stable Suspension</span>
                <span className="text-emerald-400 font-bold">Dirt Removal: Mechanical Rinsing</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Carbon Bonding</h4>

              <div className="space-y-2">
                {[
                  { id: 'methane', name: 'Methane (CH₄) - Single Covalent' },
                  { id: 'ethene', name: 'Ethene (C₂H₄) - Double Bond' },
                  { id: 'ethyne', name: 'Ethyne (C₂H₂) - Triple Bond' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCarbonCompound(c.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      carbonCompound === c.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'text-slate-400 bg-slate-950/50 hover:bg-slate-800'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-violet-400">Versatile Nature of Carbon:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong>Catenation:</strong> Unique ability to form direct covalent bonds with other carbon atoms.</li>
                  <li><strong>Tetravalency:</strong> Valency of 4 allows bonding with 4 other atoms.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
