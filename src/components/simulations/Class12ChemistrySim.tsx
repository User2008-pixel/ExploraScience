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
  // MODE 1: SOLUTIONS & COLLIGATIVE PROPERTIES
  // ----------------------------------------------------------------------
  const [molalityM, setMolalityM] = useState<number>(variables.soluteMolality ?? 1.0);
  const [soluteType, setSoluteType] = useState<'glucose' | 'nacl' | 'cacl2'>('nacl');
  const vantHoffFactorI = soluteType === 'glucose' ? 1 : soluteType === 'nacl' ? 2 : 3;
  const kbWater = 0.52; // K kg / mol
  const deltaTb = vantHoffFactorI * kbWater * molalityM;
  const boilingPointC = 100 + deltaTb;

  // ----------------------------------------------------------------------
  // MODE 2: ELECTROCHEMISTRY & DANIELL CELL NERNST
  // ----------------------------------------------------------------------
  const [znConc, setZnConc] = useState<number>(variables.anodeConcentration ?? 0.1);
  const [cuConc, setCuConc] = useState<number>(variables.cathodeConcentration ?? 1.0);
  const eZeroCell = 1.10; // Volts for Zn/Cu
  const cellEmf = Math.round((eZeroCell - (0.0591 / 2) * Math.log10(znConc / cuConc)) * 1000) / 1000;

  // ----------------------------------------------------------------------
  // MODE 3: KINETICS & ARRHENIUS ACTIVATION ENERGY
  // ----------------------------------------------------------------------
  const [tempKelvin, setTempKelvin] = useState<number>(variables.temperature ?? 300);
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);
  const eaUncatalyzed = 60; // kJ/mol
  const eaEffective = hasCatalyst ? 35 : eaUncatalyzed;
  const gasConstR = 8.314e-3; // kJ / (mol K)
  const rateConstantK = Math.exp(-eaEffective / (gasConstR * tempKelvin)) * 1e5;

  // ----------------------------------------------------------------------
  // MODE 4: COORDINATION COMPOUNDS & CRYSTAL FIELD THEORY
  // ----------------------------------------------------------------------
  const [dElectronCount, setDElectronCount] = useState<number>(6); // Fe2+ d6
  const [ligandField, setLigandField] = useState<'weak' | 'strong'>('strong'); // high vs low spin

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
              Live Galvanic Nernst cell, colligative Raoult osmosis, Arrhenius collision activation & CFT crystal field splitting
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
          { id: 'solutions-colligative', label: '1. Colligative & Osmosis' },
          { id: 'electrochemistry-nernst', label: '2. Nernst Galvanic Cell' },
          { id: 'kinetics-arrhenius', label: '3. Arrhenius Kinetics' },
          { id: 'coordination-cft', label: '4. Crystal Field Theory' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Chem12Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SEMI-PERMEABLE MEMBRANE & OSMOTIC LIQUID COLUMN</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* U-Tube Vessel */}
                <path
                  d="M 120,40 L 120,160 Q 120,190 150,190 L 250,190 Q 280,190 280,160 L 280,40"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="6"
                />

                {/* Semi-permeable Membrane at center */}
                <line x1="200" y1="165" x2="200" y2="190" stroke="#f59e0b" strokeWidth="4" strokeDasharray="3 2" />
                <text x="200" y="206" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">SPM</text>

                {/* Pure Solvent Left Column */}
                <rect x="123" y="100" width="34" height="65" fill="#38bdf8" fillOpacity="0.5" />
                {/* Solution Right Column (Elevated by Osmotic Pressure) */}
                {(() => {
                  const osmoticHeight = 100 - molalityM * vantHoffFactorI * 12;
                  return (
                    <g>
                      <rect x="243" y={osmoticHeight} width="34" height={165 - osmoticHeight} fill="#38bdf8" fillOpacity="0.7" />
                      {/* Solute particles floating in right column */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <circle
                          key={i}
                          cx={250 + (i % 3) * 10}
                          cy={osmoticHeight + 15 + ((i * 18 + animTime * 10) % (145 - osmoticHeight))}
                          r="3"
                          fill="#facc15"
                        />
                      ))}
                      {/* Osmotic Head delta h */}
                      <line x1="288" y1="100" x2="288" y2={osmoticHeight} stroke="#ec4899" strokeWidth="2" />
                      <text x="315" y={(100 + osmoticHeight) / 2 + 3} fill="#ec4899" fontSize="9" fontWeight="bold">
                        Δh (Π)
                      </text>
                    </g>
                  );
                })()}

                {/* Column labels */}
                <text x="140" y="30" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Pure Water</text>
                <text x="260" y="30" fill="#facc15" fontSize="10" fontWeight="bold" textAnchor="middle">Solution</text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">van 't Hoff (i) = {vantHoffFactorI}</span>
                <span className="text-rose-400 font-bold">ΔTb = +{deltaTb.toFixed(3)} °C</span>
                <span className="text-cyan-400 font-bold">Boiling Point = {boilingPointC.toFixed(3)} °C</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Colligative Variables</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Solute Type:</span>
                <div className="flex gap-1.5 text-xs">
                  {[
                    { id: 'glucose', name: 'Glucose (i=1)' },
                    { id: 'nacl', name: 'NaCl (i=2)' },
                    { id: 'cacl2', name: 'CaCl₂ (i=3)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSoluteType(s.id as any)}
                      className={`flex-1 p-1.5 rounded-lg font-bold transition border ${
                        soluteType === s.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
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
                  <span className="text-slate-300">Molality (m):</span>
                  <span className="text-amber-400 font-bold">{molalityM.toFixed(1)} mol/kg</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={molalityM}
                  onChange={(e) => setMolalityM(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-amber-400">NCERT Colligative Laws:</div>
                <p>
                  Colligative properties depend solely on the <em>number of solute particles</em>, not their chemical nature. Osmotic pressure: Π = i C R T.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ELECTROCHEMISTRY & NERNST DANIELL CELL */}
      {/* ============================================================== */}
      {activeMode === 'electrochemistry-nernst' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE DANIELL CELL & ELECTRON CURRENT MIGRATION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Left Beaker: Zinc Half Cell */}
                <rect x="60" y="90" width="110" height="95" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="62" y="115" width="106" height="68" rx="4" fill="#94a3b8" fillOpacity="0.4" />
                {/* Zinc Electrode (Anode -) */}
                <rect x="95" y="65" width="18" height="90" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="104" y="60" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Zn Anode (-)</text>

                {/* Right Beaker: Copper Half Cell */}
                <rect x="230" y="90" width="110" height="95" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="232" y="115" width="106" height="68" rx="4" fill="#0284c7" fillOpacity="0.5" />
                {/* Copper Electrode (Cathode +) */}
                <rect x="285" y="65" width="18" height="90" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="294" y="60" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">Cu Cathode (+)</text>

                {/* Inverted U-Tube Salt Bridge */}
                <path
                  d="M 140,140 L 140,85 Q 140,75 150,75 L 250,75 Q 260,75 260,85 L 260,140"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeOpacity="0.6"
                />
                <text x="200" y="70" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">KNO₃ Salt Bridge</text>

                {/* External Circuit Wire */}
                <path d="M 104,65 L 104,25 L 180,25" fill="none" stroke="#facc15" strokeWidth="2" />
                <path d="M 220,25 L 294,25 L 294,65" fill="none" stroke="#facc15" strokeWidth="2" />

                {/* Digital Voltmeter in Middle */}
                <circle cx="200" cy="25" r="18" fill="#0f172a" stroke="#facc15" strokeWidth="2" />
                <text x="200" y="29" fill="#facc15" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {cellEmf}V
                </text>

                {/* Flowing electrons along wire */}
                {(() => {
                  const eT = (animTime * 1.5) % 1;
                  const eX = 104 + eT * (294 - 104);
                  return (
                    <g>
                      <circle cx={eX} cy="25" r="3.5" fill="#38bdf8" className="animate-pulse" />
                    </g>
                  );
                })()}

                {/* Chemical Equations */}
                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Zn(s) + Cu²⁺(aq) ➔ Zn²⁺(aq) + Cu(s) | E° = 1.10 V
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Cell EMF: {cellEmf} V</span>
                <span className="text-cyan-400 font-bold">[Zn²⁺]: {znConc} M</span>
                <span className="text-amber-400 font-bold">[Cu²⁺]: {cuConc} M</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Nernst Controls</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Anode [Zn²⁺]:</span>
                  <span className="text-cyan-400 font-bold">{znConc} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.01"
                  value={znConc}
                  onChange={(e) => setZnConc(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Cathode [Cu²⁺]:</span>
                  <span className="text-amber-400 font-bold">{cuConc} M</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="2.0"
                  step="0.01"
                  value={cuConc}
                  onChange={(e) => setCuConc(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">Nernst Equation:</div>
                <p>
                  E_cell = E°_cell - (0.0591 / 2) · log([Zn²⁺] / [Cu²⁺]). Increasing [Cu²⁺] increases cell voltage; increasing [Zn²⁺] decreases voltage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CHEMICAL KINETICS & ARRHENIUS EQUATION */}
      {/* ============================================================== */}
      {activeMode === 'kinetics-arrhenius' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-rose-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>MAXWELL-BOLTZMANN ENERGY DISTRIBUTION & ACTIVATION BARRIER</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Axes */}
                <line x1="50" y1="180" x2="360" y2="180" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="180" x2="50" y2="30" stroke="#475569" strokeWidth="2" />
                <text x="360" y="195" fill="#94a3b8" fontSize="9" textAnchor="end">Kinetic Energy (E)</text>
                <text x="45" y="25" fill="#94a3b8" fontSize="9" textAnchor="end">Fraction of Molecules</text>

                {/* Maxwell Boltzmann Bell Curves */}
                {/* Peak shifts right and flattens with higher temperature */}
                {(() => {
                  const peakX = 110 + (tempKelvin - 300) * 0.15;
                  const peakY = 80 + (tempKelvin - 300) * 0.1;
                  const curvePath = `M 50,180 Q ${peakX},${peakY - 40} 240,160 T 360,178`;
                  const barrierX = hasCatalyst ? 210 : 260;

                  return (
                    <g>
                      <path d={curvePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                      {/* Activation energy barrier line */}
                      <line x1={barrierX} y1="30" x2={barrierX} y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                      <text x={barrierX} y="25" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                        {hasCatalyst ? 'Ea (Catalyzed = 35 kJ)' : 'Ea (Uncatalyzed = 60 kJ)'}
                      </text>
                      {/* Shaded reaction fraction */}
                      <rect x={barrierX} y="30" width={360 - barrierX} height="150" fill="#ef4444" fillOpacity="0.2" />
                    </g>
                  );
                })()}

                {/* Bouncing reacting particles */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const pSpeed = (tempKelvin / 300) * 20;
                  const px = 60 + ((i * 31 + animTime * pSpeed) % 280);
                  const py = 120 + Math.sin(animTime * 3 + i) * 35;
                  const hasEa = px >= (hasCatalyst ? 210 : 260);

                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py}
                      r={hasEa ? 5 : 3.5}
                      fill={hasEa ? '#10b981' : '#38bdf8'}
                      className={hasEa ? 'animate-pulse' : ''}
                    />
                  );
                })}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Arrhenius: k = A · e^(-Ea / RT) | T = {tempKelvin} K
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">Barrier Ea = {eaEffective} kJ/mol</span>
                <span className="text-amber-400 font-bold">Temp = {tempKelvin} K</span>
                <span className="text-emerald-400 font-bold">Relative Rate = {rateConstantK.toFixed(2)}x</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-rose-400 font-mono text-sm uppercase">Kinetics Controls</h4>

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
                <button
                  onClick={() => setHasCatalyst(!hasCatalyst)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition border ${
                    hasCatalyst
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {hasCatalyst ? '✓ Catalyst Added (Lowers Ea)' : '+ Add Catalyst'}
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-rose-400">NCERT Arrhenius Rule:</div>
                <p>
                  A 10° rise in temperature approximately <strong>doubles</strong> the reaction rate due to a massive surge in the fraction of molecules possessing kinetic energy greater than $E_a$.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. COORDINATION COMPOUNDS & CRYSTAL FIELD THEORY (CFT) */}
      {/* ============================================================== */}
      {activeMode === 'coordination-cft' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                <span>OCTAHEDRAL CRYSTAL FIELD SPLITTING (Δo) & d-ORBITAL DEGENERACY</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Free ion 5 degenerate d-orbitals on left */}
                <g transform="translate(60, 110)">
                  <text x="0" y="-30" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Free Metal Ion
                  </text>
                  {[-40, -20, 0, 20, 40].map((x, i) => (
                    <rect key={i} x={x - 8} y="-8" width="16" height="16" fill="#1e293b" stroke="#64748b" />
                  ))}
                  <text x="0" y="25" fill="#64748b" fontSize="8" textAnchor="middle">Degenerate 5d</text>
                </g>

                {/* Splitting connector lines */}
                <path d="M 110,110 L 220,60" fill="none" stroke="#475569" strokeDasharray="3 3" />
                <path d="M 110,110 L 220,150" fill="none" stroke="#475569" strokeDasharray="3 3" />

                {/* Upper eg level (2 orbitals) */}
                <g transform="translate(260, 60)">
                  <text x="0" y="-20" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">
                    eg (+0.6 Δo)
                  </text>
                  {[-15, 15].map((x, i) => (
                    <rect key={i} x={x - 10} y="-10" width="20" height="20" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
                  ))}
                  <text x="0" y="25" fill="#94a3b8" fontSize="8" textAnchor="middle">dx²-y², dz²</text>
                </g>

                {/* Lower t2g level (3 orbitals) */}
                <g transform="translate(260, 150)">
                  <text x="0" y="32" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    t2g (-0.4 Δo)
                  </text>
                  {[-30, 0, 30].map((x, i) => (
                    <rect key={i} x={x - 10} y="-10" width="20" height="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  ))}
                  <text x="0" y="-16" fill="#94a3b8" fontSize="8" textAnchor="middle">dxy, dyz, dzx</text>
                </g>

                {/* Energy Gap Arrow Δo */}
                <line x1="330" y1="60" x2="330" y2="150" stroke="#facc15" strokeWidth="2" />
                <text x="345" y="110" fill="#facc15" fontSize="11" fontWeight="bold">
                  Δo
                </text>

                <text x="200" y="205" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {ligandField === 'strong' ? 'Strong Field Ligand (CN⁻): Low Spin (Δo > Pairing Energy)' : 'Weak Field Ligand (Cl⁻): High Spin (Δo < Pairing Energy)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-purple-400 font-bold">d-Electrons: d{dElectronCount}</span>
                <span className="text-cyan-400 font-bold">Spin State: {ligandField === 'strong' ? 'Low Spin' : 'High Spin'}</span>
                <span className="text-emerald-400 font-bold">Magnetic: {ligandField === 'strong' && dElectronCount === 6 ? 'Diamagnetic (0 unpaired)' : 'Paramagnetic'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">Ligand Field Strength</h4>

              <div className="space-y-2">
                <button
                  onClick={() => setLigandField('strong')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition border ${
                    ligandField === 'strong'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Strong Field (CN⁻, CO) ➔ Large Δo (Low Spin)
                </button>
                <button
                  onClick={() => setLigandField('weak')}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition border ${
                    ligandField === 'weak'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Weak Field (I⁻, Cl⁻, H₂O) ➔ Small Δo (High Spin)
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-purple-400">Spectrochemical Series:</div>
                <p className="text-[10px] text-slate-400">
                  I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; CN⁻ &lt; CO.
                  Strong field ligands produce large splitting energy Δo, forcing electron pairing in lower t₂g before filling eg.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
