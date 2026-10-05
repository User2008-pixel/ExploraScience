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
  // MODE 1: CHEMICAL REACTIONS & REDOX (Manipulative)
  // ----------------------------------------------------------------------
  const [rxnType, setRxnType] = useState<'redox' | 'combination' | 'displacement' | 'double-disp'>('redox');
  const [reactProgress, setReactProgress] = useState<number>(65); // 0 - 100%
  const [burnerHeatOn, setBurnerHeatOn] = useState<boolean>(true);
  const [reactionTempC, setReactionTempC] = useState<number>(150); // 25 - 400 C

  // ----------------------------------------------------------------------
  // MODE 2: ACIDS, BASES & pH SCALE (Manipulative with titration drops)
  // ----------------------------------------------------------------------
  const [phValue, setPhValue] = useState<number>(variables.ph ?? 7.0);
  const [indicatorType, setIndicatorType] = useState<'universal' | 'litmus' | 'phenolphthalein'>('universal');
  const [titrationDrops, setTitrationDrops] = useState<number>(0);

  const getPhColor = (ph: number) => {
    if (indicatorType === 'phenolphthalein') {
      return ph >= 8.3 ? '#f43f5e' : '#f8fafc'; // pink in base, colorless in acid
    }
    if (indicatorType === 'litmus') {
      return ph < 7 ? '#ef4444' : '#3b82f6'; // red in acid, blue in base
    }
    // Universal indicator gradient
    if (ph <= 2) return '#ef4444';
    if (ph <= 4) return '#f97316';
    if (ph <= 6) return '#eab308';
    if (ph <= 7.5) return '#22c55e';
    if (ph <= 9) return '#06b6d4';
    if (ph <= 11) return '#3b82f6';
    return '#8b5cf6';
  };

  const hPlusConc = Math.pow(10, -phValue);
  const ohMinusConc = Math.pow(10, -(14 - phValue));

  const handleAddDropNaOH = () => {
    setTitrationDrops((prev) => prev + 1);
    setPhValue((prev) => Math.min(14, parseFloat((prev + (prev < 7 ? 0.8 : 0.3)).toFixed(1))));
  };

  const handleAddDropHCl = () => {
    setTitrationDrops((prev) => prev + 1);
    setPhValue((prev) => Math.max(0, parseFloat((prev - (prev > 7 ? 0.8 : 0.3)).toFixed(1))));
  };

  // ----------------------------------------------------------------------
  // MODE 3: METALS REACTIVITY & IONIC BONDING (Manipulative)
  // ----------------------------------------------------------------------
  const [selectedMetal, setSelectedMetal] = useState<'K' | 'Na' | 'Ca' | 'Mg' | 'Zn' | 'Fe' | 'Cu' | 'Au'>('Zn');
  const [targetSolution, setTargetSolution] = useState<'HCl' | 'CuSO4'>('HCl');
  const [ionicCompound, setIonicCompound] = useState<'NaCl' | 'MgO'>('NaCl');

  // Reactivity ranking (1 = most reactive, 8 = least reactive)
  const REACTIVITY_RANKS: Record<string, number> = {
    K: 1, Na: 2, Ca: 3, Mg: 4, Zn: 5, Fe: 6, Cu: 7, Au: 8,
  };
  const metalRank = REACTIVITY_RANKS[selectedMetal];
  const isReactiveWithHCl = metalRank <= 6; // Cu and Au do not react with dilute HCl
  const isDisplacementOccurring = targetSolution === 'CuSO4' ? metalRank < 7 : isReactiveWithHCl;
  const bubbleIntensity = isReactiveWithHCl ? Math.max(1, 9 - metalRank) : 0;

  // ----------------------------------------------------------------------
  // MODE 4: CARBON BONDING & SOAP MICELLES (Manipulative)
  // ----------------------------------------------------------------------
  const [carbonViewType, setCarbonViewType] = useState<'micelle' | 'hydrocarbon'>('micelle');
  const [carbonCompound, setCarbonCompound] = useState<'methane' | 'ethene' | 'ethyne'>('methane');
  const [agitationSpeed, setAgitationSpeed] = useState<number>(3); // 1 - 5x
  const [dirtSize, setDirtSize] = useState<number>(35); // 20 - 55 px

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
              Live molecular kinetics, displacement series, dynamic acid-base indicators &amp; carbon bonding / micelles
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
          { id: 'carbon-micelles', label: '4. Carbon Compounds & Micelles' },
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>REACTION PROGRESS: {reactProgress}% | TEMP: {reactionTempC}°C</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Laboratory Bench */}
                <line x1="30" y1="195" x2="390" y2="195" stroke="#334155" strokeWidth="3" />

                {/* Bunsen Burner underneath if ON */}
                {burnerHeatOn && (
                  <g transform="translate(200, 205)">
                    <rect x="-8" y="-10" width="16" height="15" fill="#64748b" rx="2" />
                    <polygon
                      points={`-8,-10 0,${-25 - Math.sin(animTime * 15) * 5} 8,-10`}
                      fill="#38bdf8"
                      opacity="0.9"
                    />
                    <polygon
                      points={`-4,-10 0,${-20 - Math.sin(animTime * 15) * 4} 4,-10`}
                      fill="#facc15"
                    />
                  </g>
                )}

                {/* Conical Flask */}
                <path
                  d="M 175,60 L 225,60 L 225,80 L 270,180 L 130,180 L 175,80 Z"
                  fill="#0f172a99"
                  stroke="#64748b"
                  strokeWidth="2.5"
                />

                {/* Reacting Liquid Level */}
                {(() => {
                  const pRatio = reactProgress / 100;
                  let fillCol = '#0284c7';
                  if (rxnType === 'redox') {
                    // CuO black to Cu brown
                    fillCol = pRatio > 0.5 ? '#b45309' : '#1e293b';
                  } else if (rxnType === 'displacement') {
                    // CuSO4 blue turns to FeSO4 green
                    fillCol = pRatio > 0.5 ? '#15803d' : '#0284c7';
                  } else if (rxnType === 'combination') {
                    fillCol = '#e2e8f0';
                  } else {
                    fillCol = '#cbd5e1';
                  }
                  return (
                    <path
                      d="M 140,180 L 260,180 L 245,135 L 155,135 Z"
                      fill={fillCol}
                      fillOpacity={0.6 + pRatio * 0.25}
                    />
                  );
                })()}

                {/* Dynamic Bubbles */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const bY = 175 - ((animTime * (reactionTempC * 0.3) + i * 25) % 110);
                  const bX = 180 + ((i * 12 + Math.sin(animTime * 4 + i) * 15) % 40);
                  return (
                    <circle key={i} cx={bX} cy={bY} r={2 + (i % 2)} fill="#38bdf8" fillOpacity="0.7" />
                  );
                })}

                {/* Redox Electron Stream in Redox mode */}
                {rxnType === 'redox' && (
                  <g>
                    <circle cx="80" cy="115" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="80" y="119" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">H₂</text>
                    <text x="80" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">Oxidized (0 ➔ +1)</text>

                    <circle cx="330" cy="115" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="330" y="119" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">CuO</text>
                    <text x="330" y="135" fill="#94a3b8" fontSize="8" textAnchor="middle">Reduced (+2 ➔ 0)</text>

                    {(() => {
                      const eProgress = (animTime * 0.8) % 1;
                      const ex = 108 + eProgress * (330 - 108 - 28);
                      const ey = 115 - Math.sin(eProgress * Math.PI) * 35;
                      return (
                        <g>
                          <path d="M 108,115 Q 200,65 302,115" fill="none" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.5" />
                          <circle cx={ex} cy={ey} r="5" fill="#38bdf8" className="animate-pulse" />
                          <text x={ex} y={ey - 8} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">2e⁻</text>
                        </g>
                      );
                    })()}
                  </g>
                )}

                <text x="210" y="30" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {rxnType === 'redox' && 'CuO (black) + H₂ (g) ➔ Cu (red-brown) + H₂O (l)'}
                  {rxnType === 'combination' && 'CaO (quicklime) + H₂O ➔ Ca(OH)₂ (slaked lime) + Heat'}
                  {rxnType === 'displacement' && 'Fe (s) + CuSO₄ (blue) ➔ FeSO₄ (green) + Cu (s)'}
                  {rxnType === 'double-disp' && 'Na₂SO₄ (aq) + BaCl₂ (aq) ➔ BaSO₄ ↓ (white ppt) + 2NaCl'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Type: {rxnType.toUpperCase()}</span>
                <span className="text-amber-400 font-bold">Heat: {burnerHeatOn ? `${reactionTempC}°C (Active)` : '25°C (Ambient)'}</span>
                <span className="text-cyan-400 font-bold">Conversion: {reactProgress}% Complete</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Reaction Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Reaction Archetype:</span>
                <div className="space-y-1.5">
                  {[
                    { id: 'redox', name: 'Redox (H₂ + CuO ➔ Cu + H₂O)' },
                    { id: 'combination', name: 'Combination (Quicklime + H₂O)' },
                    { id: 'displacement', name: 'Single Displacement (Fe + CuSO₄)' },
                    { id: 'double-disp', name: 'Double Displacement (BaSO₄ ppt)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRxnType(r.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        rxnType === r.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Reaction Progress:</span>
                  <span className="text-emerald-400 font-bold">{reactProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reactProgress}
                  onChange={(e) => setReactProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Burner Temperature:</span>
                  <span className="text-amber-400 font-bold">{reactionTempC}°C</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="400"
                  step="25"
                  value={reactionTempC}
                  onChange={(e) => setReactionTempC(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setBurnerHeatOn(!burnerHeatOn)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border flex items-center justify-center gap-1.5 ${
                  burnerHeatOn
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{burnerHeatOn ? 'Bunsen Burner ON (Ignited)' : 'Ignite Bunsen Burner'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ACIDS, BASES & pH SCALE */}
      {/* ============================================================== */}
      {activeMode === 'acids-bases-ph' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>pH = {phValue.toFixed(1)} | {indicatorType.toUpperCase()} INDICATOR</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Beaker with Indicator Solution */}
                <rect x="150" y="50" width="120" height="130" rx="8" fill="#1e293b50" stroke="#64748b" strokeWidth="2.5" />
                {/* Liquid Level with live dynamic pH indicator color */}
                <rect
                  x="153"
                  y="85"
                  width="114"
                  height="92"
                  rx="6"
                  fill={getPhColor(phValue)}
                  fillOpacity="0.75"
                />

                {/* pH Spectrum scale strip at bottom */}
                <g transform="translate(50, 190)">
                  {Array.from({ length: 15 }).map((_, p) => (
                    <rect
                      key={p}
                      x={p * 21}
                      y="0"
                      width="21"
                      height="12"
                      fill={getPhColor(p)}
                    />
                  ))}
                  {/* Cursor Indicator */}
                  <polygon
                    points={`${phValue * 21 + 10},12 ${phValue * 21 + 5},22 ${phValue * 21 + 15},22`}
                    fill="#ffffff"
                  />
                </g>

                <text x="210" y="40" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="monospace">
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
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">pH Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Continuous pH Slider:</span>
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
                <span className="text-xs text-slate-400 mb-1.5 block">Titration Burette Dropper:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleAddDropNaOH}
                    className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold flex items-center justify-center gap-1 hover:bg-blue-500/30"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>+ Drop NaOH</span>
                  </button>
                  <button
                    onClick={handleAddDropHCl}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center justify-center gap-1 hover:bg-rose-500/30"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>+ Drop HCl</span>
                  </button>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>METAL: {selectedMetal} in {targetSolution} | DISPLACEMENT: {isDisplacementOccurring ? 'ACTIVE' : 'NO REACTION'}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Test Tube on Left */}
                <g transform="translate(100, 30)">
                  <rect x="0" y="0" width="40" height="150" rx="10" fill="#1e293b40" stroke="#64748b" strokeWidth="2" />
                  {/* Solution inside test tube */}
                  <rect
                    x="2"
                    y="50"
                    width="36"
                    height="98"
                    rx="8"
                    fill={targetSolution === 'CuSO4' ? (isDisplacementOccurring ? '#15803d' : '#0284c7') : '#38bdf8'}
                    fillOpacity="0.6"
                  />
                  {/* Metal Strip inserted */}
                  <rect x="14" y="20" width="12" height="110" fill="#94a3b8" stroke="#ffffff" strokeWidth="1" />
                  <text x="20" y="15" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">{selectedMetal}</text>

                  {/* Bubbles if reacting */}
                  {bubbleIntensity > 0 &&
                    Array.from({ length: bubbleIntensity * 2 }).map((_, i) => {
                      const by = 130 - ((animTime * 40 + i * 20) % 80);
                      return (
                        <circle key={i} cx={15 + (i % 2) * 10} cy={by} r="2" fill="#ffffff" fillOpacity="0.8" />
                      );
                    })}
                </g>

                {/* Ionic Bonding Transfer Diagram on Right */}
                <g transform="translate(240, 115)">
                  {ionicCompound === 'NaCl' ? (
                    <g>
                      {/* Na+ (2,8) */}
                      <circle cx="-40" cy="0" r="22" fill="#3b82f6" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="2" />
                      <text x="-40" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Na⁺</text>
                      <text x="-40" y="32" textAnchor="middle" fill="#94a3b8" fontSize="8">[2, 8]</text>

                      {/* Electron Arrow */}
                      <line x1="-15" y1="0" x2="15" y2="0" stroke="#facc15" strokeWidth="2" strokeDasharray="3 2" />
                      <circle cx="0" cy="-6" r="3" fill="#facc15" className="animate-pulse" />
                      <text x="0" y="-12" textAnchor="middle" fill="#facc15" fontSize="7" fontWeight="bold">1e⁻ transfer</text>

                      {/* Cl- (2,8,8) */}
                      <circle cx="45" cy="0" r="28" fill="#10b981" fillOpacity="0.7" stroke="#34d399" strokeWidth="2" />
                      <text x="45" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Cl⁻</text>
                      <text x="45" y="38" textAnchor="middle" fill="#94a3b8" fontSize="8">[2, 8, 8]</text>
                    </g>
                  ) : (
                    <g>
                      {/* Mg2+ (2,8) */}
                      <circle cx="-40" cy="0" r="20" fill="#f59e0b" fillOpacity="0.7" stroke="#facc15" strokeWidth="2" />
                      <text x="-40" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Mg²⁺</text>
                      <text x="-40" y="30" textAnchor="middle" fill="#94a3b8" fontSize="8">[2, 8]</text>

                      <line x1="-15" y1="0" x2="15" y2="0" stroke="#facc15" strokeWidth="2" strokeDasharray="3 2" />
                      <text x="0" y="-12" textAnchor="middle" fill="#facc15" fontSize="7" fontWeight="bold">2e⁻ transfer</text>

                      {/* O2- (2,8) */}
                      <circle cx="40" cy="0" r="22" fill="#ef4444" fillOpacity="0.7" stroke="#f87171" strokeWidth="2" />
                      <text x="40" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">O²⁻</text>
                      <text x="40" y="32" textAnchor="middle" fill="#94a3b8" fontSize="8">[2, 8]</text>
                    </g>
                  )}
                  <text x="0" y="65" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                    Electrovalent Crystal Lattice: {ionicCompound}
                  </text>
                </g>

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Reactivity: {selectedMetal} rank #{metalRank} in series | {isDisplacementOccurring ? 'Displacement reaction occurs readily' : 'Inert metal: No reaction with solution'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Metal: {selectedMetal}</span>
                <span className="text-cyan-400 font-bold">Solution: {targetSolution}</span>
                <span className="text-emerald-400 font-bold">Ionic Lattice: {ionicCompound}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Reactivity &amp; Bonds</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Select Metal Strip:</span>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                  {(['K', 'Na', 'Ca', 'Mg', 'Zn', 'Fe', 'Cu', 'Au'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMetal(m)}
                      className={`p-2 rounded-xl transition border text-center ${
                        selectedMetal === m
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Test Solution:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setTargetSolution('HCl')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      targetSolution === 'HCl'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Dilute HCl
                  </button>
                  <button
                    onClick={() => setTargetSolution('CuSO4')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      targetSolution === 'CuSO4'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    CuSO₄ (aq)
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Ionic Electron Transfer Model:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setIonicCompound('NaCl')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      ionicCompound === 'NaCl'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    NaCl (1e⁻ transfer)
                  </button>
                  <button
                    onClick={() => setIonicCompound('MgO')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      ionicCompound === 'MgO'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    MgO (2e⁻ transfer)
                  </button>
                </div>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>{carbonViewType === 'micelle' ? 'SOAP MICELLE EMULSIFICATION' : `COVALENT BONDING: ${carbonCompound.toUpperCase()}`}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {carbonViewType === 'micelle' ? (
                  <g>
                    {/* Central Oil / Dirt Droplet */}
                    <circle
                      cx="210"
                      cy="115"
                      r={dirtSize + Math.sin(animTime * 3) * 1.5}
                      fill="#78350f"
                      stroke="#b45309"
                      strokeWidth="2"
                    />
                    <text x="210" y="113" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="bold">
                      Oily Dirt
                    </text>
                    <text x="210" y="125" textAnchor="middle" fill="#d97706" fontSize="7">
                      Hydrophobic
                    </text>

                    {/* Radiating Soap Micelle Molecules (16 arms) */}
                    {Array.from({ length: 16 }).map((_, i) => {
                      const angle = (i * 2 * Math.PI) / 16 + animTime * (agitationSpeed * 0.15);
                      const innerR = dirtSize + 2;
                      const outerR = dirtSize + 42;
                      const x1 = 210 + Math.cos(angle) * innerR;
                      const y1 = 115 + Math.sin(angle) * innerR;
                      const x2 = 210 + Math.cos(angle) * outerR;
                      const y2 = 115 + Math.sin(angle) * outerR;

                      return (
                        <g key={i}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 2" />
                          <circle cx={x2} cy={y2} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                        </g>
                      );
                    })}

                    <text x="210" y="215" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      Hydrophobic Tail Dissolved in Oil | Hydrophilic Head (-COO⁻Na⁺) Facing Water
                    </text>
                  </g>
                ) : (
                  // Hydrocarbon Covalent structures
                  <g transform="translate(210, 115)">
                    {carbonCompound === 'methane' && (
                      <g>
                        <circle cx="0" cy="0" r="22" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                        <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">C</text>
                        {/* 4 Single Covalent Bonds */}
                        {[
                          { x: 0, y: -50, label: 'H' },
                          { x: -50, y: 0, label: 'H' },
                          { x: 50, y: 0, label: 'H' },
                          { x: 0, y: 50, label: 'H' },
                        ].map((h, idx) => (
                          <g key={idx}>
                            <line x1="0" y1="0" x2={h.x} y2={h.y} stroke="#38bdf8" strokeWidth="3" />
                            <circle cx={h.x} cy={h.y} r="14" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                            <text x={h.x} y={h.y + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">{h.label}</text>
                          </g>
                        ))}
                        <text x="0" y="85" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                          Tetrahedral CH₄: 4 Single C-H Covalent Bonds (sp³ hybridized, 109.5°)
                        </text>
                      </g>
                    )}

                    {carbonCompound === 'ethene' && (
                      <g>
                        {/* C = C Double Bond */}
                        <circle cx="-35" cy="0" r="20" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                        <text x="-35" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

                        <circle cx="35" cy="0" r="20" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                        <text x="35" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

                        {/* Double bond lines */}
                        <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#f43f5e" strokeWidth="3" />
                        <line x1="-15" y1="5" x2="15" y2="5" stroke="#f43f5e" strokeWidth="3" />
                        <text x="0" y="-12" textAnchor="middle" fill="#f43f5e" fontSize="8" fontWeight="bold">1σ + 1π</text>

                        {/* H atoms */}
                        {[
                          { x: -70, y: -35 },
                          { x: -70, y: 35 },
                          { x: 70, y: -35 },
                          { x: 70, y: 35 },
                        ].map((h, idx) => (
                          <g key={idx}>
                            <line x1={idx < 2 ? -35 : 35} y1="0" x2={h.x} y2={h.y} stroke="#38bdf8" strokeWidth="2.5" />
                            <circle cx={h.x} cy={h.y} r="12" fill="#0284c7" />
                            <text x={h.x} y={h.y + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">H</text>
                          </g>
                        ))}
                        <text x="0" y="85" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="bold">
                          Ethene C₂H₄: Planar sp² Carbons with 1 Sigma + 1 Pi Bond (120°)
                        </text>
                      </g>
                    )}

                    {carbonCompound === 'ethyne' && (
                      <g>
                        {/* C ≡ C Triple Bond */}
                        <circle cx="-35" cy="0" r="20" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                        <text x="-35" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

                        <circle cx="35" cy="0" r="20" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                        <text x="35" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">C</text>

                        {/* Triple bond lines */}
                        <line x1="-15" y1="-7" x2="15" y2="-7" stroke="#facc15" strokeWidth="2.5" />
                        <line x1="-15" y1="0" x2="15" y2="0" stroke="#facc15" strokeWidth="2.5" />
                        <line x1="-15" y1="7" x2="15" y2="7" stroke="#facc15" strokeWidth="2.5" />
                        <text x="0" y="-14" textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold">1σ + 2π</text>

                        {/* Collinear H atoms */}
                        <line x1="-55" y1="0" x2="-85" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
                        <circle cx="-85" cy="0" r="12" fill="#0284c7" />
                        <text x="-85" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">H</text>

                        <line x1="55" y1="0" x2="85" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
                        <circle cx="85" cy="0" r="12" fill="#0284c7" />
                        <text x="85" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">H</text>

                        <text x="0" y="85" textAnchor="middle" fill="#facc15" fontSize="11" fontWeight="bold">
                          Ethyne C₂H₂: Linear sp Carbons with 1 Sigma + 2 Pi Bonds (180°)
                        </text>
                      </g>
                    )}
                  </g>
                )}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-violet-400 font-bold">Mode: {carbonViewType.toUpperCase()}</span>
                <span className="text-cyan-400 font-bold">Compound: {carbonViewType === 'micelle' ? 'Soap (C₁₇H₃₅COONa)' : carbonCompound}</span>
                <span className="text-emerald-400 font-bold">Catenation: Active</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Carbon Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">View Selector:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setCarbonViewType('micelle')}
                    className={`p-2 rounded-xl transition border ${
                      carbonViewType === 'micelle'
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Soap Micelle
                  </button>
                  <button
                    onClick={() => setCarbonViewType('hydrocarbon')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      carbonViewType === 'hydrocarbon'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Hydrocarbons
                  </button>
                </div>
              </div>

              {carbonViewType === 'micelle' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-300">Mechanical Agitation (Stir):</span>
                      <span className="text-violet-400 font-bold">{agitationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={agitationSpeed}
                      onChange={(e) => setAgitationSpeed(Number(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-300">Dirt Droplet Size:</span>
                      <span className="text-amber-400 font-bold">{dirtSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="55"
                      value={dirtSize}
                      onChange={(e) => setDirtSize(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 block">Covalent Molecule:</span>
                  {[
                    { id: 'methane', name: 'Methane (CH₄) - Single Bonds' },
                    { id: 'ethene', name: 'Ethene (C₂H₄) - Double Bond' },
                    { id: 'ethyne', name: 'Ethyne (C₂H₂) - Triple Bond' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCarbonCompound(c.id as any)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                        carbonCompound === c.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
