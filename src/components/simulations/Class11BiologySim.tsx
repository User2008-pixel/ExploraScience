import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Zap,
  Sun,
} from 'lucide-react';

interface Class11BiologySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Bio11Mode =
  | 'fluid-mosaic-membrane'
  | 'mitosis-cell-cycle'
  | 'enzyme-michaelis-menten'
  | 'z-scheme-photophosphorylation';

export const Class11BiologySim: React.FC<Class11BiologySimProps> = ({
  simulationType = 'class11-biology',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Bio11Mode => {
    if (conceptId.includes('membrane') || conceptId.includes('fluid-mosaic') || conceptId.includes('transport')) return 'fluid-mosaic-membrane';
    if (conceptId.includes('mitosis') || conceptId.includes('cell-cycle') || conceptId.includes('division')) return 'mitosis-cell-cycle';
    if (conceptId.includes('enzyme') || conceptId.includes('michaelis') || conceptId.includes('kinetics')) return 'enzyme-michaelis-menten';
    if (conceptId.includes('photosynthesis') || conceptId.includes('z-scheme') || conceptId.includes('thylakoid') || conceptId.includes('light-reaction')) return 'z-scheme-photophosphorylation';
    return 'fluid-mosaic-membrane';
  };

  const [activeMode, setActiveMode] = useState<Bio11Mode>(getInitialMode());

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
  // MODE 1: FLUID MOSAIC MEMBRANE & TRANSPORT
  // ----------------------------------------------------------------------
  const [transportMode, setTransportMode] = useState<'diffusion' | 'facilitated' | 'active-pump'>('active-pump');

  // ----------------------------------------------------------------------
  // MODE 2: MITOSIS CELL CYCLE
  // ----------------------------------------------------------------------
  const [mitosisStage, setMitosisStage] = useState<'prophase' | 'metaphase' | 'anaphase' | 'telophase'>('metaphase');

  // ----------------------------------------------------------------------
  // MODE 3: ENZYME MICHAELIS-MENTEN
  // ----------------------------------------------------------------------
  const [substrateConc, setSubstrateConc] = useState<number>(variables.substrateConcentration ?? 25);
  const [hasInhibitor, setHasInhibitor] = useState<'none' | 'competitive' | 'noncompetitive'>('none');
  const kmBase = 20;
  const vmaxBase = 100;
  const kmEff = hasInhibitor === 'competitive' ? kmBase * 2.5 : kmBase;
  const vmaxEff = hasInhibitor === 'noncompetitive' ? vmaxBase * 0.5 : vmaxBase;
  const reactionRateV = (vmaxEff * substrateConc) / (kmEff + substrateConc);

  // ----------------------------------------------------------------------
  // MODE 4: Z-SCHEME PHOTOPHOSPHORYLATION
  // ----------------------------------------------------------------------
  const [lightPower, setLightPower] = useState<number>(80);

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Layers className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 11 NCERT Biology Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live Singer-Nicolson fluid mosaic transport, mitotic spindle segregation, Michaelis-Menten active sites & Z-Scheme ETC
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition border border-teal-500/30"
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
                  simSpeed === s ? 'bg-teal-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
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
          { id: 'fluid-mosaic-membrane', label: '1. Fluid Mosaic Membrane' },
          { id: 'mitosis-cell-cycle', label: '2. Mitosis Cell Cycle' },
          { id: 'enzyme-michaelis-menten', label: '3. Enzyme Kinetics' },
          { id: 'z-scheme-photophosphorylation', label: '4. Photosynthesis Z-Scheme' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Bio11Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. SINGER-NICOLSON FLUID MOSAIC MEMBRANE & TRANSPORT */}
      {/* ============================================================== */}
      {activeMode === 'fluid-mosaic-membrane' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-teal-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                <span>LIVE PHOSPHOLIPID BILAYER BROWNIAN FLUIDITY & PUMP</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Upper Leaflet Phospholipids (Extracellular side) */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const x = 30 + i * 18;
                  const waveY = Math.sin(animTime * 3 + i * 0.4) * 2;
                  return (
                    <g key={`up-${i}`}>
                      <circle cx={x} cy={80 + waveY} r="6" fill="#38bdf8" />
                      <line x1={x - 2} y1={86 + waveY} x2={x - 2} y2={100 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1={x + 2} y1={86 + waveY} x2={x + 2} y2={100 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                    </g>
                  );
                })}

                {/* Lower Leaflet Phospholipids (Cytoplasmic side) */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const x = 30 + i * 18;
                  const waveY = Math.sin(animTime * 3 + i * 0.4 + Math.PI) * 2;
                  return (
                    <g key={`down-${i}`}>
                      <circle cx={x} cy={140 + waveY} r="6" fill="#38bdf8" />
                      <line x1={x - 2} y1={134 + waveY} x2={x - 2} y2={120 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1={x + 2} y1={134 + waveY} x2={x + 2} y2={120 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                    </g>
                  );
                })}

                {/* Integral Transport Protein Channel in center */}
                <rect x="180" y="70" width="40" height="80" rx="8" fill="#10b981" fillOpacity="0.85" stroke="#34d399" strokeWidth="1.5" />
                <text x="200" y="114" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {transportMode === 'active-pump' ? 'Na⁺/K⁺' : 'Channel'}
                </text>

                {/* Animated Transporting Ions */}
                {transportMode === 'active-pump' && (() => {
                  const pumpT = (animTime * 1.5) % 1;
                  const ionY = 150 - pumpT * 80;
                  return (
                    <g>
                      <circle cx="200" cy={ionY} r="4" fill="#facc15" className="animate-pulse" />
                      <text x="200" y={ionY - 5} fill="#facc15" fontSize="6" fontWeight="bold" textAnchor="middle">3 Na⁺</text>
                      <text x="200" y="165" fill="#f43f5e" fontSize="7" fontWeight="bold" textAnchor="middle">ATP ➔ ADP + Pi</text>
                    </g>
                  );
                })()}

                {/* Labels */}
                <text x="50" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold">Extracellular Fluid</text>
                <text x="50" y="185" fill="#10b981" fontSize="9" fontWeight="bold">Cytoplasm</text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-teal-400 font-bold">Model: Singer &amp; Nicolson (1972)</span>
                <span className="text-cyan-400 font-bold">Nature: Quasi-fluid Bilayer</span>
                <span className="text-amber-400 font-bold">Transport: {transportMode.toUpperCase()}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-teal-400 font-mono text-sm uppercase">Transport Mode</h4>

              <div className="space-y-2">
                {[
                  { id: 'active-pump', name: 'Active Transport (Na⁺/K⁺ ATPase)' },
                  { id: 'facilitated', name: 'Facilitated Diffusion (Channel)' },
                  { id: 'diffusion', name: 'Simple Passive Diffusion' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTransportMode(t.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                      transportMode === t.id
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-teal-400">NCERT Fluidity Insight:</div>
                <p>
                  Lipids enable lateral movement of proteins within the overall bilayer. This fluid nature is crucial for cell growth, secretion, endocytosis, and cell division.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MITOSIS & CELL DIVISION CYCLE */}
      {/* ============================================================== */}
      {activeMode === 'mitosis-cell-cycle' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>MITOTIC SPINDLE APPARATUS & CHROMOSOME SEGREGATION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Cell Membrane */}
                <ellipse cx="200" cy="110" rx="140" ry="75" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />

                {/* Centrosomes / Spindle Poles */}
                <circle cx="80" cy="110" r="8" fill="#f59e0b" />
                <circle cx="320" cy="110" r="8" fill="#f59e0b" />

                {/* Spindle Fibers radiating to chromosomes */}
                <line x1="80" y1="110" x2="200" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="80" y1="110" x2="200" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="80" y1="110" x2="200" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="320" y1="110" x2="200" y2="70" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="320" y1="110" x2="200" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="320" y1="110" x2="200" y2="150" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

                {/* Chromosomes at Metaphase Plate (Vertical equator) */}
                {mitosisStage === 'metaphase' && (
                  <g>
                    {[-40, 0, 40].map((yOff, i) => (
                      <g key={i} transform={`translate(200, ${110 + yOff})`}>
                        {/* Sister chromatids X-shape */}
                        <line x1="-8" y1="-10" x2="8" y2="10" stroke="#a855f7" strokeWidth="4" />
                        <line x1="-8" y1="10" x2="8" y2="-10" stroke="#a855f7" strokeWidth="4" />
                        <circle cx="0" cy="0" r="3" fill="#facc15" />
                      </g>
                    ))}
                    <line x1="200" y1="45" x2="200" y2="175" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="200" y="38" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Equatorial Metaphase Plate
                    </text>
                  </g>
                )}

                {/* Anaphase Separation */}
                {mitosisStage === 'anaphase' && (
                  <g>
                    {/* Leftward pulling sister chromatids */}
                    {[-40, 0, 40].map((yOff, i) => (
                      <g key={`l-${i}`} transform={`translate(${160 - Math.sin(animTime * 2) * 5}, ${110 + yOff})`}>
                        <path d="M 6,-8 L -4,0 L 6,8" fill="none" stroke="#a855f7" strokeWidth="4" />
                      </g>
                    ))}
                    {/* Rightward pulling sister chromatids */}
                    {[-40, 0, 40].map((yOff, i) => (
                      <g key={`r-${i}`} transform={`translate(${240 + Math.sin(animTime * 2) * 5}, ${110 + yOff})`}>
                        <path d="M -6,-8 L 4,0 L -6,8" fill="none" stroke="#a855f7" strokeWidth="4" />
                      </g>
                    ))}
                  </g>
                )}

                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Stage: {mitosisStage.toUpperCase()} (Equational Division)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Kinetochores: Connected</span>
                <span className="text-purple-400 font-bold">Chromosomes: 2n = 46</span>
                <span className="text-cyan-400 font-bold">Cytokinesis: Telophase furrow</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Mitosis Stage</h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['prophase', 'metaphase', 'anaphase', 'telophase'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMitosisStage(st)}
                    className={`p-2 rounded-xl font-bold uppercase transition border ${
                      mitosisStage === st
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">Anaphase Hallmark:</div>
                <p>
                  Centromeres split simultaneously, allowing sister chromatids to separate and migrate to opposite poles as individual daughter chromosomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ENZYME KINETICS & MICHAELIS-MENTEN */}
      {/* ============================================================== */}
      {activeMode === 'enzyme-michaelis-menten' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                <span>MICHAELIS-MENTEN HYPERBOLIC SATURATION CURVE</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Axes */}
                <line x1="50" y1="180" x2="360" y2="180" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="180" x2="50" y2="30" stroke="#475569" strokeWidth="2" />
                <text x="360" y="195" fill="#94a3b8" fontSize="9" textAnchor="end">Substrate [S]</text>
                <text x="45" y="25" fill="#94a3b8" fontSize="9" textAnchor="end">Velocity (v)</text>

                {/* Asymptotic Vmax line */}
                <line x1="50" y1={180 - vmaxEff} x2="360" y2={180 - vmaxEff} stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
                <text x="360" y={175 - vmaxEff} fill="#ec4899" fontSize="8" fontWeight="bold" textAnchor="end">
                  Vmax = {vmaxEff}
                </text>

                {/* Hyperbolic Curve: v = Vmax * S / (Km + S) */}
                {(() => {
                  let d = 'M 50,180';
                  for (let s = 1; s <= 100; s += 2) {
                    const v = (vmaxEff * s) / (kmEff + s);
                    const px = 50 + s * 3;
                    const py = 180 - v;
                    d += ` L ${px},${py}`;
                  }
                  return (
                    <g>
                      <path d={d} fill="none" stroke="#a855f7" strokeWidth="2.5" />
                      {/* Current operating point */}
                      <circle cx={50 + substrateConc * 3} cy={180 - reactionRateV} r="5" fill="#facc15" className="animate-pulse" />
                    </g>
                  );
                })()}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  v = (Vmax · [S]) / (Km + [S]) | Velocity v = {reactionRateV.toFixed(1)}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-purple-400 font-bold">Km = {kmEff} mM</span>
                <span className="text-pink-400 font-bold">Vmax = {vmaxEff} μmol/s</span>
                <span className="text-emerald-400 font-bold">Inhibitor: {hasInhibitor.toUpperCase()}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">Enzyme Parameters</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Substrate [S]:</span>
                  <span className="text-purple-400 font-bold">{substrateConc} mM</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="90"
                  value={substrateConc}
                  onChange={(e) => setSubstrateConc(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Inhibition Type:</span>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'none', name: 'No Inhibitor (Baseline)' },
                    { id: 'competitive', name: 'Competitive (Increases Km)' },
                    { id: 'noncompetitive', name: 'Non-Competitive (Lowers Vmax)' },
                  ].map((inh) => (
                    <button
                      key={inh.id}
                      onClick={() => setHasInhibitor(inh.id as any)}
                      className={`w-full text-left p-1.5 rounded-lg border transition ${
                        hasInhibitor === inh.id
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {inh.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PHOTOSYNTHESIS Z-SCHEME PHOTOPHOSPHORYLATION */}
      {/* ============================================================== */}
      {activeMode === 'z-scheme-photophosphorylation' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>NON-CYCLIC ELECTRON FLOW (PSII ➔ ETC ➔ PSI ➔ NADPH)</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Z-Scheme Redox Potential Profile */}
                {/* PSII P680 on bottom left */}
                <rect x="70" y="140" width="45" height="35" rx="6" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
                <text x="92" y="160" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">PS II (P680)</text>

                {/* Excited PSII Primary Acceptor at top */}
                <rect x="70" y="40" width="45" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="92" y="58" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Acceptor</text>

                {/* Light excitation arrow upward */}
                <line x1="92" y1="140" x2="92" y2="70" stroke="#facc15" strokeWidth="2.5" />

                {/* Electron Transport Chain cascading downward */}
                <line x1="115" y1="55" x2="200" y2="135" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                <text x="160" y="90" fill="#38bdf8" fontSize="8" fontWeight="bold">b₆f Complex</text>

                {/* PSI P700 */}
                <rect x="200" y="130" width="45" height="35" rx="6" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
                <text x="222" y="150" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">PS I (P700)</text>

                {/* Excited PSI Acceptor & Ferredoxin */}
                <rect x="290" y="35" width="45" height="30" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
                <text x="312" y="53" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">Fd / NADP⁺</text>

                {/* Moving electron packet */}
                {(() => {
                  const zT = (animTime * 1.2) % 1;
                  const zX = 92 + zT * 220;
                  const zY = 55 + Math.sin(zT * Math.PI * 2) * 40;
                  return (
                    <circle cx={zX} cy={zY} r="4" fill="#facc15" className="animate-pulse" />
                  );
                })()}

                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Photolysis: 2H₂O ➔ 4H⁺ + 4e⁻ + O₂ | Generates ATP &amp; NADPH for Calvin Cycle
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Photolysis: Active (O₂ released)</span>
                <span className="text-cyan-400 font-bold">Proton Gradient: Stroma ➔ Lumen</span>
                <span className="text-amber-400 font-bold">ATP Synthase: Chemiosmosis</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Light Reaction</h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">Why called 'Z-Scheme'?</div>
                <p>
                  Due to its characteristic zigzag shape when all carriers are placed in a sequence according to their redox potential values.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
