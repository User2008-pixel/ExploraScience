import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  TrendingUp,
  Layers,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';

interface Class12ChemistrySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Chem12Mode =
  | 'solutions-colligative'
  | 'electrochemistry-nernst'
  | 'kinetics-arrhenius'
  | 'coordination-cft';

export const Class12ChemistrySim: React.FC<Class12ChemistrySimProps> = ({
  simulationType = 'class12-chemistry',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Chem12Mode => {
    if (conceptId.includes('solution') || conceptId.includes('colligative') || conceptId.includes('raoult') || conceptId.includes('osmotic')) return 'solutions-colligative';
    if (conceptId.includes('electro') || conceptId.includes('nernst') || conceptId.includes('daniell') || conceptId.includes('galvanic')) return 'electrochemistry-nernst';
    if (conceptId.includes('kinetic') || conceptId.includes('arrhenius') || conceptId.includes('activation') || conceptId.includes('rate')) return 'kinetics-arrhenius';
    if (conceptId.includes('coordination') || conceptId.includes('cft') || conceptId.includes('crystal-field') || conceptId.includes('ligand')) return 'coordination-cft';
    return 'solutions-colligative';
  };

  const [activeMode, setActiveMode] = useState<Chem12Mode>(getInitialMode());

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
  // MODE 1: SOLUTIONS & COLLIGATIVE PROPERTIES (Manipulative)
  // ----------------------------------------------------------------------
  const [molalityM, setMolalityM] = useState<number>(variables.soluteMolality ?? 1.0);
  const [soluteType, setSoluteType] = useState<'glucose' | 'nacl' | 'cacl2'>('nacl');
  const vantHoffFactorI = soluteType === 'glucose' ? 1 : soluteType === 'nacl' ? 2 : 3;
  const kbWater = 0.52; // K kg / mol
  const kfWater = 1.86; // K kg / mol
  const deltaTb = vantHoffFactorI * kbWater * molalityM;
  const deltaTf = vantHoffFactorI * kfWater * molalityM;
  const boilingPointC = 100 + deltaTb;
  const freezingPointC = 0 - deltaTf;
  const osmoticPressureAtm = (vantHoffFactorI * molalityM * 0.0821 * 298).toFixed(1);

  // ----------------------------------------------------------------------
  // MODE 2: ELECTROCHEMISTRY & DANIELL CELL NERNST (Manipulative)
  // ----------------------------------------------------------------------
  const [anodeConc, setAnodeConc] = useState<number>(variables.anodeConcentration ?? 0.1);
  const [cathodeConc, setCathodeConc] = useState<number>(variables.cathodeConcentration ?? 1.0);
  const [cellTempK, setCellTempK] = useState<number>(298);
  const [cellPair, setCellPair] = useState<'Zn-Cu' | 'Cu-Ag' | 'Ni-Cu'>('Zn-Cu');

  const eZeroMap = {
    'Zn-Cu': { e0: 1.10, n: 2, anode: 'Zn', cathode: 'Cu' },
    'Cu-Ag': { e0: 0.46, n: 2, anode: 'Cu', cathode: 'Ag' },
    'Ni-Cu': { e0: 0.59, n: 2, anode: 'Ni', cathode: 'Cu' },
  };
  const activePairInfo = eZeroMap[cellPair];
  const qRatio = anodeConc / cathodeConc;
  const cellEmf = Math.round(
    (activePairInfo.e0 - ((8.314 * cellTempK) / (activePairInfo.n * 96485)) * 2.303 * Math.log10(qRatio)) * 1000
  ) / 1000;

  // ----------------------------------------------------------------------
  // MODE 3: KINETICS & ARRHENIUS ACTIVATION ENERGY (Manipulative)
  // ----------------------------------------------------------------------
  const [tempKelvin, setTempKelvin] = useState<number>(variables.temperature ?? 300);
  const [eaVal, setEaVal] = useState<number>(55); // kJ/mol
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);
  const eaEffective = hasCatalyst ? Math.max(15, eaVal - 22) : eaVal;
  const gasConstR = 8.314e-3; // kJ / (mol K)
  const rateConstantK = Math.exp(-eaEffective / (gasConstR * tempKelvin)) * 1e5;

  // ----------------------------------------------------------------------
  // MODE 4: COORDINATION COMPOUNDS & CFT (Completely Manipulative with Electrons)
  // ----------------------------------------------------------------------
  const [dElectronCount, setDElectronCount] = useState<number>(6); // d1 to d10
  const [ligandField, setLigandField] = useState<'weak' | 'strong'>('strong'); // high vs low spin

  // Compute distribution of electrons into t2g (lower 3 orbitals) and eg (upper 2 orbitals)
  const calculateElectronDistribution = () => {
    let t2gCount = 0;
    let egCount = 0;

    if (ligandField === 'strong') {
      // Low spin: fills t2g up to 6 before placing in eg
      t2gCount = Math.min(6, dElectronCount);
      egCount = Math.max(0, dElectronCount - 6);
    } else {
      // Weak spin: follows Hund's rule across all 5 orbitals (d1-d5 each get 1, then pair up)
      if (dElectronCount <= 3) {
        t2gCount = dElectronCount;
        egCount = 0;
      } else if (dElectronCount <= 5) {
        t2gCount = 3;
        egCount = dElectronCount - 3;
      } else {
        // d6-d10
        t2gCount = 3 + Math.min(3, dElectronCount - 5);
        egCount = 2 + Math.max(0, dElectronCount - 8);
      }
    }

    // Compute unpaired electrons (n)
    // t2g has 3 orbitals: paired count = max(0, t2gCount - 3)
    const t2gUnpaired = t2gCount <= 3 ? t2gCount : 6 - t2gCount;
    const egUnpaired = egCount <= 2 ? egCount : 4 - egCount;
    const totalUnpaired = t2gUnpaired + egUnpaired;
    const spinOnlyMoment = Math.sqrt(totalUnpaired * (totalUnpaired + 2)).toFixed(2);

    return { t2gCount, egCount, totalUnpaired, spinOnlyMoment };
  };

  const cftStats = calculateElectronDistribution();

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 12 NCERT Chemistry Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live Galvanic Nernst cell, colligative Raoult osmosis, Arrhenius collision activation &amp; CFT crystal field splitting
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition border border-amber-500/30"
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
                  simSpeed === s ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
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
          { id: 'solutions-colligative', label: '1. Solutions & Colligative' },
          { id: 'electrochemistry-nernst', label: '2. Nernst Electrochemistry' },
          { id: 'kinetics-arrhenius', label: '3. Arrhenius Kinetics' },
          { id: 'coordination-cft', label: '4. Coordination CFT Splitting' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Chem12Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. SOLUTIONS & COLLIGATIVE PROPERTIES */}
      {/* ============================================================== */}
      {activeMode === 'solutions-colligative' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>COLLIGATIVE: ΔTb = +{deltaTb.toFixed(2)}°C | ΔTf = -{deltaTf.toFixed(2)}°C</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* U-Tube Osmometer with Semi-Permeable Membrane */}
                <path
                  d="M 120,40 L 120,160 Q 120,185 160,185 L 260,185 Q 300,185 300,160 L 300,40"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="8"
                />

                {/* Semipermeable membrane vertical divider at center bottom */}
                <line x1="210" y1="160" x2="210" y2="185" stroke="#facc15" strokeWidth="4" strokeDasharray="3 2" />
                <text x="210" y="200" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">SPM</text>

                {/* Left Arm: Pure Solvent (Water) */}
                <rect x="124" y="110" width="30" height="60" fill="#38bdf8" fillOpacity="0.5" />
                <text x="140" y="80" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Pure H₂O</text>

                {/* Right Arm: Solution with osmotic liquid rise h */}
                {(() => {
                  const riseH = Math.min(65, molalityM * vantHoffFactorI * 18);
                  const rightY = 110 - riseH;
                  return (
                    <g>
                      <rect x="266" y={rightY} width="30" height={60 + riseH} fill="#f59e0b" fillOpacity="0.6" />
                      <text x="280" y={rightY - 10} fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Solution (+{riseH}px)
                      </text>
                      {/* Dissolved Solute ions in solution */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <circle
                          key={i}
                          cx={272 + (i % 2) * 16}
                          cy={rightY + 15 + i * 8}
                          r="3"
                          fill="#ef4444"
                        />
                      ))}
                    </g>
                  );
                })()}

                <text x="210" y="30" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  Osmotic Pressure Π = i·C·R·T = {osmoticPressureAtm} atm | i = {vantHoffFactorI} ({soluteType})
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Boiling Pt: {boilingPointC.toFixed(2)}°C</span>
                <span className="text-rose-400 font-bold">Freezing Pt: {freezingPointC.toFixed(2)}°C</span>
                <span className="text-amber-400 font-bold">Osmotic Press: {osmoticPressureAtm} atm</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Colligative Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Solute (Van 't Hoff Factor i):</span>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'glucose', name: 'Glucose (i = 1, Non-electrolyte)' },
                    { id: 'nacl', name: 'NaCl (i = 2, Dissociates 1Na⁺ + 1Cl⁻)' },
                    { id: 'cacl2', name: 'CaCl₂ (i = 3, Dissociates 1Ca²⁺ + 2Cl⁻)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSoluteType(s.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl transition border ${
                        soluteType === s.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Solute Molality (m):</span>
                  <span className="text-amber-400 font-bold">{molalityM.toFixed(1)} mol/kg</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={molalityM}
                  onChange={(e) => setMolalityM(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ELECTROCHEMISTRY & DANIELL CELL NERNST EQUATION */}
      {/* ============================================================== */}
      {activeMode === 'electrochemistry-nernst' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>VOLTMETER: {cellEmf.toFixed(3)} V (E° = {activePairInfo.e0} V)</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Anode Half-Cell (Left) */}
                <rect x="70" y="80" width="80" height="90" rx="6" fill="#1e3a8a30" stroke="#3b82f6" strokeWidth="2" />
                <rect x="95" y="50" width="16" height="80" fill="#94a3b8" stroke="#ffffff" strokeWidth="1" />
                <text x="103" y="42" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Anode ({activePairInfo.anode})
                </text>

                {/* Salt Bridge linking both cells */}
                <path d="M 130,100 L 130,55 L 290,55 L 290,100" fill="none" stroke="#facc15" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
                <text x="210" y="50" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                  KCl / Agar-Agar Salt Bridge
                </text>

                {/* Digital Voltmeter in wire circuit */}
                <path d="M 103,45 L 103,20 L 317,20 L 317,45" fill="none" stroke="#64748b" strokeWidth="2" />
                <g transform="translate(210, 20)">
                  <circle cx="0" cy="0" r="16" fill="#020617" stroke="#10b981" strokeWidth="2" />
                  <text x="0" y="4" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {cellEmf.toFixed(2)}V
                  </text>
                </g>

                {/* Cathode Half-Cell (Right) */}
                <rect x="270" y="80" width="80" height="90" rx="6" fill="#0284c730" stroke="#0284c7" strokeWidth="2" />
                <rect x="309" y="50" width="16" height="80" fill="#b45309" stroke="#ffffff" strokeWidth="1" />
                <text x="317" y="42" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Cathode ({activePairInfo.cathode})
                </text>

                {/* Electron flow arrow on top wire */}
                {(() => {
                  const ePos = 110 + ((animTime * 120) % 190);
                  return (
                    <circle cx={ePos} cy="20" r="3" fill="#facc15" className="animate-pulse" />
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Nernst: E_cell = E° - (0.0591/n) · log₁₀([{activePairInfo.anode}²⁺] / [{activePairInfo.cathode}²⁺]) = {cellEmf.toFixed(3)} V
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">EMF: {cellEmf.toFixed(3)} V</span>
                <span className="text-cyan-400 font-bold">Anode: {anodeConc} M</span>
                <span className="text-amber-400 font-bold">Cathode: {cathodeConc} M</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Galvanic Cell Controls</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Electrode Couple:</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  {(['Zn-Cu', 'Cu-Ag', 'Ni-Cu'] as const).map((pair) => (
                    <button
                      key={pair}
                      onClick={() => setCellPair(pair)}
                      className={`p-1.5 rounded-xl transition border text-center ${
                        cellPair === pair
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {pair}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Anode [{activePairInfo.anode}²⁺] Conc:</span>
                  <span className="text-cyan-400 font-bold">{anodeConc} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.05"
                  value={anodeConc}
                  onChange={(e) => setAnodeConc(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Cathode [{activePairInfo.cathode}²⁺] Conc:</span>
                  <span className="text-amber-400 font-bold">{cathodeConc} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.05"
                  value={cathodeConc}
                  onChange={(e) => setCathodeConc(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Cell Temp (T):</span>
                  <span className="text-rose-400 font-bold">{cellTempK} K</span>
                </div>
                <input
                  type="range"
                  min="273"
                  max="350"
                  step="5"
                  value={cellTempK}
                  onChange={(e) => setCellTempK(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. KINETICS & ARRHENIUS ACTIVATION ENERGY */}
      {/* ============================================================== */}
      {activeMode === 'kinetics-arrhenius' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-rose-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>ARRHENIUS KINETICS: Ea = {eaEffective} kJ/mol | T = {tempKelvin} K</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Axes */}
                <line x1="50" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="180" x2="50" y2="30" stroke="#475569" strokeWidth="2" />
                <text x="380" y="195" fill="#94a3b8" fontSize="9" textAnchor="end">Molecular Kinetic Energy (E)</text>
                <text x="45" y="25" fill="#94a3b8" fontSize="9" textAnchor="end">Fraction of Molecules</text>

                {/* Maxwell-Boltzmann Distribution Curve */}
                {(() => {
                  let d = 'M 50,180';
                  const peakE = 40 + (tempKelvin - 280) * 0.25;
                  for (let x = 50; x <= 370; x += 4) {
                    const e = x - 50;
                    const yVal = 180 - (Math.pow(e, 1.3) * Math.exp(-e / peakE)) * 2.8;
                    d += ` L ${x},${Math.max(40, yVal)}`;
                  }
                  return (
                    <path d={d} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  );
                })()}

                {/* Activation Energy Barrier Threshold Line */}
                {(() => {
                  const barrierX = 50 + eaEffective * 2.8;
                  return (
                    <g>
                      <line x1={barrierX} y1="35" x2={barrierX} y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                      <text x={barrierX} y="30" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Ea = {eaEffective} kJ
                      </text>
                      {/* Shaded reaction-ready fraction */}
                      <rect x={barrierX} y="35" width={380 - barrierX} height="145" fill="#10b981" fillOpacity="0.2" />
                    </g>
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Rate constant k = A · e^(-Ea / RT) ➔ Relative Velocity = {rateConstantK.toFixed(1)}x
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">Barrier Ea = {eaEffective} kJ/mol</span>
                <span className="text-amber-400 font-bold">Temp = {tempKelvin} K</span>
                <span className="text-emerald-400 font-bold">Effective Rate = {rateConstantK.toFixed(1)}x</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-rose-400 font-mono text-sm uppercase">Kinetics Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Temperature (T):</span>
                  <span className="text-rose-400 font-bold">{tempKelvin} K</span>
                </div>
                <input
                  type="range"
                  min="280"
                  max="500"
                  value={tempKelvin}
                  onChange={(e) => setTempKelvin(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Uncatalyzed Barrier (Ea):</span>
                  <span className="text-amber-400 font-bold">{eaVal} kJ/mol</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={eaVal}
                  onChange={(e) => setEaVal(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setHasCatalyst(!hasCatalyst)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition border ${
                  hasCatalyst
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {hasCatalyst ? '✓ Catalyst Added (Lowers Ea by 22 kJ)' : '+ Add Positive Catalyst'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. COORDINATION CFT & ELECTRON ARROW FILLING (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'coordination-cft' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                <span>OCTAHEDRAL SPLITTING Δo: {ligandField.toUpperCase()} FIELD (d{dElectronCount})</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Free Metal Ion degenerate 5d orbitals on left */}
                <g transform="translate(60, 115)">
                  <text x="0" y="-30" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Free Ion (Degenerate)
                  </text>
                  {[-36, -18, 0, 18, 36].map((x, i) => (
                    <rect key={i} x={x - 8} y="-8" width="16" height="16" fill="#1e293b" stroke="#64748b" />
                  ))}
                  <text x="0" y="24" fill="#64748b" fontSize="8" textAnchor="middle">5 d-orbitals</text>
                </g>

                {/* Crystal Field Splitting connecting lines */}
                <line x1="110" y1="115" x2="210" y2="65" stroke="#475569" strokeDasharray="3 3" />
                <line x1="110" y1="115" x2="210" y2="155" stroke="#475569" strokeDasharray="3 3" />

                {/* Upper eg level (2 orbitals dx2-y2, dz2) */}
                <g transform="translate(250, 65)">
                  <text x="0" y="-18" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                    eg (+0.6 Δo) [{cftStats.egCount}e⁻]
                  </text>
                  {[-18, 18].map((x, i) => {
                    const eInThisBox = i === 0 ? Math.min(2, Math.ceil(cftStats.egCount / 2)) : Math.floor(cftStats.egCount / 2);
                    return (
                      <g key={i}>
                        <rect x={x - 12} y="-12" width="24" height="24" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
                        {/* Electron arrows */}
                        {eInThisBox >= 1 && (
                          <text x={x - 4} y="5" fill="#facc15" fontSize="13" fontWeight="bold">↑</text>
                        )}
                        {eInThisBox >= 2 && (
                          <text x={x + 4} y="5" fill="#38bdf8" fontSize="13" fontWeight="bold">↓</text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Lower t2g level (3 orbitals dxy, dyz, dzx) */}
                <g transform="translate(250, 155)">
                  <text x="0" y="28" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    t2g (-0.4 Δo) [{cftStats.t2gCount}e⁻]
                  </text>
                  {[-28, 0, 28].map((x, i) => {
                    const eInThisBox = cftStats.t2gCount > i ? (cftStats.t2gCount >= i + 4 ? 2 : 1) : 0;
                    return (
                      <g key={i}>
                        <rect x={x - 12} y="-12" width="24" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                        {eInThisBox >= 1 && (
                          <text x={x - 4} y="5" fill="#facc15" fontSize="13" fontWeight="bold">↑</text>
                        )}
                        {eInThisBox >= 2 && (
                          <text x={x + 4} y="5" fill="#38bdf8" fontSize="13" fontWeight="bold">↓</text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Energy Gap Arrow Δo */}
                <line x1="330" y1="65" x2="330" y2="155" stroke="#facc15" strokeWidth="2" />
                <text x="345" y="115" fill="#facc15" fontSize="11" fontWeight="bold">
                  Δo
                </text>

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Unpaired Electrons n = {cftStats.totalUnpaired} ➔ Spin-only Magnetic Moment μ = {cftStats.spinOnlyMoment} BM
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-purple-400 font-bold">Config: t2g^{cftStats.t2gCount} eg^{cftStats.egCount}</span>
                <span className="text-cyan-400 font-bold">Unpaired: {cftStats.totalUnpaired} e⁻</span>
                <span className="text-emerald-400 font-bold">μ: {cftStats.spinOnlyMoment} BM ({cftStats.totalUnpaired === 0 ? 'Diamagnetic' : 'Paramagnetic'})</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">CFT Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Ligand Field Strength:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setLigandField('strong')}
                    className={`p-2 rounded-xl transition border text-center ${
                      ligandField === 'strong'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Strong Field (Low Spin)
                  </button>
                  <button
                    onClick={() => setLigandField('weak')}
                    className={`p-2 rounded-xl transition border text-center ${
                      ligandField === 'weak'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Weak Field (High Spin)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">d-Electrons Count:</span>
                  <span className="text-purple-400 font-bold">d{dElectronCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dElectronCount}
                  onChange={(e) => setDElectronCount(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-xs font-mono font-bold">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDElectronCount(d)}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      dElectronCount === d
                        ? 'bg-purple-500 text-slate-950 font-bold border-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    d{d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
