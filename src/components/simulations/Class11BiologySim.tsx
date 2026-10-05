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
  Flame,
  Droplet,
  Split,
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
  // MODE 1: FLUID MOSAIC MEMBRANE & TRANSPORT (Completely Manipulative)
  // ----------------------------------------------------------------------
  const [transportMode, setTransportMode] = useState<'diffusion' | 'facilitated' | 'active-pump'>('active-pump');
  const [membraneTempC, setMembraneTempC] = useState<number>(37); // 10 - 50 C
  const [cholesterolPercent, setCholesterolPercent] = useState<number>(20); // 0 - 50%
  const [atpPulses, setAtpPulses] = useState<number>(0);

  // ----------------------------------------------------------------------
  // MODE 2: MITOSIS CELL CYCLE (Full visual stages & scrubber)
  // ----------------------------------------------------------------------
  const [mitosisStage, setMitosisStage] = useState<'interphase' | 'prophase' | 'metaphase' | 'anaphase' | 'telophase'>('metaphase');
  const [spindleTension, setSpindleTension] = useState<number>(75); // 0 - 100%

  // ----------------------------------------------------------------------
  // MODE 3: ENZYME MICHAELIS-MENTEN & ENVIRONMENTAL KINETICS
  // ----------------------------------------------------------------------
  const [substrateConc, setSubstrateConc] = useState<number>(variables.substrateConcentration ?? 30);
  const [enzymeAmount, setEnzymeAmount] = useState<number>(1.0); // 0.5 to 2.5
  const [enzymeTempC, setEnzymeTempC] = useState<number>(37); // 10 - 70 C
  const [enzymePh, setEnzymePh] = useState<number>(7.4); // 2 - 12
  const [hasInhibitor, setHasInhibitor] = useState<'none' | 'competitive' | 'noncompetitive'>('none');

  // Thermal denaturation bell-curve factor (optimum ~ 37-40C, denatures severely > 55C)
  const tempDenatureFactor = Math.max(0.05, Math.exp(-Math.pow(enzymeTempC - 38, 2) / 220));
  // pH bell curve factor (optimum ~ 7.4)
  const phFactor = Math.max(0.1, Math.exp(-Math.pow(enzymePh - 7.4, 2) / 6.0));

  const kmBase = 20;
  const vmaxBase = 100 * enzymeAmount * tempDenatureFactor * phFactor;
  const kmEff = hasInhibitor === 'competitive' ? kmBase * 2.8 : kmBase;
  const vmaxEff = hasInhibitor === 'noncompetitive' ? vmaxBase * 0.45 : vmaxBase;
  const reactionRateV = (vmaxEff * substrateConc) / (kmEff + substrateConc);

  // ----------------------------------------------------------------------
  // MODE 4: Z-SCHEME PHOTOPHOSPHORYLATION (Completely Manipulative)
  // ----------------------------------------------------------------------
  const [lightPower, setLightPower] = useState<number>(85); // 0 - 100%
  const [pathwayType, setPathwayType] = useState<'non-cyclic' | 'cyclic'>('non-cyclic');
  const [photolysisBurst, setPhotolysisBurst] = useState<number>(0);
  const [protonGradient, setProtonGradient] = useState<number>(70); // 20 - 100%

  const atpProductionRate = Math.round((lightPower * 0.45 + protonGradient * 0.55) * (pathwayType === 'cyclic' ? 0.7 : 1.0));

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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-teal-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                <span>LIVE PHOSPHOLIPID BILAYER BROWNIAN FLUIDITY & TRANSPORT</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Fluidity amplitude modulated by temperature and cholesterol buffer */}
                {(() => {
                  const fluidityAmp = Math.max(0.5, (membraneTempC / 25) * (1 - cholesterolPercent * 0.008));
                  return (
                    <g>
                      {/* Upper Leaflet Phospholipids (Extracellular side) */}
                      {Array.from({ length: 22 }).map((_, i) => {
                        const x = 20 + i * 17;
                        if (x > 180 && x < 240) return null; // Space for integral channel
                        const waveY = Math.sin(animTime * 4 + i * 0.5) * (2.5 * fluidityAmp);
                        const isCholesterol = i % 5 === 0 && cholesterolPercent > 10;
                        return (
                          <g key={`up-${i}`}>
                            <circle cx={x} cy={80 + waveY} r="5.5" fill="#38bdf8" />
                            <line x1={x - 2} y1={85 + waveY} x2={x - 2} y2={98 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1={x + 2} y1={85 + waveY} x2={x + 2} y2={98 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                            {isCholesterol && (
                              <rect x={x + 5} y={88 + waveY} width="4" height="12" rx="1.5" fill="#eab308" opacity="0.9" />
                            )}
                          </g>
                        );
                      })}

                      {/* Lower Leaflet Phospholipids (Cytoplasmic side) */}
                      {Array.from({ length: 22 }).map((_, i) => {
                        const x = 20 + i * 17;
                        if (x > 180 && x < 240) return null;
                        const waveY = Math.sin(animTime * 4 + i * 0.5 + Math.PI) * (2.5 * fluidityAmp);
                        return (
                          <g key={`down-${i}`}>
                            <circle cx={x} cy={140 + waveY} r="5.5" fill="#38bdf8" />
                            <line x1={x - 2} y1={135 + waveY} x2={x - 2} y2={122 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                            <line x1={x + 2} y1={135 + waveY} x2={x + 2} y2={122 + waveY} stroke="#94a3b8" strokeWidth="1.5" />
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}

                {/* Integral Transport Protein Channel in center */}
                <rect x="185" y="68" width="50" height="84" rx="10" fill="#10b981" fillOpacity="0.9" stroke="#34d399" strokeWidth="2" />
                <text x="210" y="112" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {transportMode === 'active-pump' ? 'Na⁺/K⁺ ATPase' : transportMode === 'facilitated' ? 'Glucose GLUT' : 'Channel'}
                </text>

                {/* Animated Transporting Molecules */}
                {transportMode === 'active-pump' && (() => {
                  const pumpT = (animTime * 1.6 + atpPulses * 0.2) % 1;
                  const naY = 150 - pumpT * 85;
                  const kY = 70 + pumpT * 85;
                  return (
                    <g>
                      {/* 3 Na+ pumped outwards */}
                      <circle cx="202" cy={naY} r="4" fill="#facc15" className="animate-pulse" />
                      <text x="202" y={naY - 5} fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">3 Na⁺</text>

                      {/* 2 K+ pumped inwards */}
                      <circle cx="218" cy={kY} r="4" fill="#a855f7" className="animate-pulse" />
                      <text x="218" y={kY + 10} fill="#a855f7" fontSize="7" fontWeight="bold" textAnchor="middle">2 K⁺</text>

                      <text x="210" y="172" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">ATP ➔ ADP + Pi</text>
                    </g>
                  );
                })()}

                {transportMode === 'facilitated' && (() => {
                  const t = (animTime * 1.2) % 1;
                  const y = 60 + t * 90;
                  return (
                    <g>
                      <polygon points={`210,${y} 216,${y+6} 210,${y+12} 204,${y+6}`} fill="#38bdf8" />
                      <text x="210" y={y - 4} fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle">Glucose</text>
                      <text x="210" y="172" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Facilitated (No ATP required)</text>
                    </g>
                  );
                })()}

                {transportMode === 'diffusion' && (() => {
                  const t = (animTime * 1.8) % 1;
                  const y = 65 + t * 85;
                  return (
                    <g>
                      <circle cx="100" cy={y} r="3" fill="#4ade80" />
                      <text x="100" y={y - 4} fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">O₂</text>
                      <circle cx="320" cy={y} r="3" fill="#4ade80" />
                      <text x="320" y={y - 4} fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">CO₂</text>
                      <text x="210" y="172" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle">Simple Passive Trans-bilayer Dissolution</text>
                    </g>
                  );
                })()}

                {/* Labels */}
                <text x="40" y="45" fill="#38bdf8" fontSize="9" fontWeight="bold">Extracellular Fluid (High Na⁺, Low K⁺)</text>
                <text x="40" y="200" fill="#10b981" fontSize="9" fontWeight="bold">Cytoplasm (High K⁺, Low Na⁺)</text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-teal-400 font-bold">Temp: {membraneTempC}°C</span>
                <span className="text-cyan-400 font-bold">Cholesterol: {cholesterolPercent}%</span>
                <span className="text-amber-400 font-bold">Transport: {transportMode.toUpperCase()}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-teal-400 font-mono text-sm uppercase">Membrane Manipulations</h4>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 mb-1.5 block">Transport Mechanism:</span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'active-pump', name: '⚡ Active Transport (Na⁺/K⁺ ATPase)' },
                      { id: 'facilitated', name: 'Facilitated Diffusion (Glucose)' },
                      { id: 'diffusion', name: 'Simple Passive Diffusion (Gases)' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTransportMode(t.id as any)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                          transportMode === t.id
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {transportMode === 'active-pump' && (
                  <button
                    onClick={() => setAtpPulses((prev) => prev + 1)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:from-amber-500/30 hover:to-orange-500/30 transition flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hydrolyze ATP &amp; Pump Ions ({atpPulses})</span>
                  </button>
                )}

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">Temperature (Fluidity):</span>
                    <span className="text-teal-400 font-bold">{membraneTempC}°C</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={membraneTempC}
                    onChange={(e) => setMembraneTempC(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">Cholesterol Buffer Content:</span>
                    <span className="text-amber-400 font-bold">{cholesterolPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={cholesterolPercent}
                    onChange={(e) => setCholesterolPercent(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. MITOSIS & CELL DIVISION CYCLE (Full Stage Renders & Scrub) */}
      {/* ============================================================== */}
      {activeMode === 'mitosis-cell-cycle' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>MITOTIC APPARATUS: {mitosisStage.toUpperCase()}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Cell Membrane & Cleavage furrow */}
                {mitosisStage === 'telophase' ? (
                  // Deepened cleavage furrow pinching in center
                  <path
                    d="M 80,115 C 80,55 170,55 200,85 C 230,55 320,55 320,115 C 320,175 230,175 200,145 C 170,175 80,175 80,115 Z"
                    fill="#1e293b"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                ) : (
                  <ellipse cx="210" cy="115" rx="145" ry="80" fill="#1e293b" stroke="#334155" strokeWidth="2.5" />
                )}

                {/* Centrosomes / Spindle Poles */}
                {mitosisStage !== 'interphase' && (
                  <g>
                    <circle cx="95" cy="115" r="8" fill="#f59e0b" />
                    <text x="95" y="102" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">Pole</text>
                    <circle cx="325" cy="115" r="8" fill="#f59e0b" />
                    <text x="325" y="102" fill="#f59e0b" fontSize="7" fontWeight="bold" textAnchor="middle">Pole</text>
                  </g>
                )}

                {/* 1. INTERPHASE */}
                {mitosisStage === 'interphase' && (
                  <g>
                    <circle cx="210" cy="115" r="45" fill="#0f172a" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="210" y="90" fill="#94a3b8" fontSize="8" textAnchor="middle">Intact Nuclear Envelope</text>
                    {/* Diffuse Chromatin Network */}
                    <path d="M 180,110 Q 200,130 220,105 Q 235,125 195,130" fill="none" stroke="#c084fc" strokeWidth="2" />
                    <path d="M 190,100 Q 220,115 230,100 Q 210,135 225,120" fill="none" stroke="#a855f7" strokeWidth="2" />
                    <circle cx="230" cy="110" r="8" fill="#818cf8" fillOpacity="0.7" />
                    <text x="230" y="113" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">Nucleolus</text>
                  </g>
                )}

                {/* 2. PROPHASE */}
                {mitosisStage === 'prophase' && (
                  <g>
                    {/* Fragmenting nuclear envelope */}
                    <circle cx="210" cy="115" r="45" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 4" />
                    <text x="210" y="60" fill="#f43f5e" fontSize="7" textAnchor="middle">Nuclear Envelope Dissolves</text>
                    {/* Condensing X chromosomes */}
                    {[
                      { x: 190, y: 100 },
                      { x: 230, y: 100 },
                      { x: 190, y: 130 },
                      { x: 230, y: 130 },
                    ].map((pos, i) => (
                      <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                        <line x1="-7" y1="-8" x2="7" y2="8" stroke="#a855f7" strokeWidth="3.5" />
                        <line x1="-7" y1="8" x2="7" y2="-8" stroke="#a855f7" strokeWidth="3.5" />
                        <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                      </g>
                    ))}
                  </g>
                )}

                {/* 3. METAPHASE */}
                {mitosisStage === 'metaphase' && (
                  <g>
                    {/* Spindle Fibers to Equator */}
                    {[-35, 0, 35].map((yOff, i) => (
                      <g key={i}>
                        <line x1="95" y1="115" x2="210" y2={115 + yOff} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                        <line x1="325" y1="115" x2="210" y2={115 + yOff} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 2" />
                        <g transform={`translate(210, ${115 + yOff})`}>
                          <line x1="-8" y1="-10" x2="8" y2="10" stroke="#a855f7" strokeWidth="4" />
                          <line x1="-8" y1="10" x2="8" y2="-10" stroke="#a855f7" strokeWidth="4" />
                          <circle cx="0" cy="0" r="3" fill="#facc15" />
                        </g>
                      </g>
                    ))}
                    <line x1="210" y1="45" x2="210" y2="185" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                    <text x="210" y="38" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Equatorial Metaphase Plate
                    </text>
                  </g>
                )}

                {/* 4. ANAPHASE */}
                {mitosisStage === 'anaphase' && (
                  <g>
                    {[-35, 0, 35].map((yOff, i) => {
                      const spread = 45 + (spindleTension / 100) * 20;
                      return (
                        <g key={i}>
                          <line x1="95" y1="115" x2={210 - spread} y2={115 + yOff} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                          <line x1="325" y1="115" x2={210 + spread} y2={115 + yOff} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 2" />
                          {/* Leftward migrating chromatid */}
                          <path d={`M ${210 - spread + 7},${115 + yOff - 8} L ${210 - spread - 5},${115 + yOff} L ${210 - spread + 7},${115 + yOff + 8}`} fill="none" stroke="#a855f7" strokeWidth="4" />
                          {/* Rightward migrating chromatid */}
                          <path d={`M ${210 + spread - 7},${115 + yOff - 8} L ${210 + spread + 5},${115 + yOff} L ${210 + spread - 7},${115 + yOff + 8}`} fill="none" stroke="#a855f7" strokeWidth="4" />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 5. TELOPHASE */}
                {mitosisStage === 'telophase' && (
                  <g>
                    {/* Left Daughter Nucleus reforming */}
                    <circle cx="150" cy="115" r="32" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="150" y="118" fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">2n Chromosomes</text>

                    {/* Right Daughter Nucleus reforming */}
                    <circle cx="270" cy="115" r="32" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="270" y="118" fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">2n Chromosomes</text>

                    <text x="210" y="70" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">Cytokinesis Furrow</text>
                  </g>
                )}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Phase: {mitosisStage.toUpperCase()} (Equational Karyokinesis)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Ploidy: 2n = 46 Diploid</span>
                <span className="text-purple-400 font-bold">Kinetochores: {mitosisStage === 'anaphase' ? 'Splitting' : 'Intact'}</span>
                <span className="text-cyan-400 font-bold">Cytokinesis: {mitosisStage === 'telophase' ? 'Furrow Pinched' : 'Standby'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Mitosis Stage Scrubber</h4>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {(['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMitosisStage(st)}
                    className={`p-2 rounded-xl font-bold uppercase transition border flex items-center justify-between ${
                      mitosisStage === st
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{st}</span>
                    <span className="text-[10px] font-mono opacity-60">
                      {st === 'interphase' ? 'G₁/S/G₂' : st === 'metaphase' ? 'Equator' : st === 'anaphase' ? 'Centromere split' : st === 'telophase' ? 'Cytokinesis' : 'Chromatin condensation'}
                    </span>
                  </button>
                ))}
              </div>

              {mitosisStage === 'anaphase' && (
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-300">Spindle Fiber Pulling Tension:</span>
                    <span className="text-emerald-400 font-bold">{spindleTension}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={spindleTension}
                    onChange={(e) => setSpindleTension(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                <span>MICHAELIS-MENTEN HYPERBOLIC KINETICS & THERMAL / pH LIMITS</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Axes */}
                <line x1="50" y1="180" x2="380" y2="180" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="180" x2="50" y2="30" stroke="#475569" strokeWidth="2" />
                <text x="380" y="195" fill="#94a3b8" fontSize="9" textAnchor="end">Substrate [S] (mM)</text>
                <text x="45" y="25" fill="#94a3b8" fontSize="9" textAnchor="end">Velocity (v)</text>

                {/* Asymptotic Vmax line */}
                <line x1="50" y1={180 - Math.min(140, vmaxEff * 1.2)} x2="380" y2={180 - Math.min(140, vmaxEff * 1.2)} stroke="#ec4899" strokeWidth="1" strokeDasharray="3 3" />
                <text x="380" y={175 - Math.min(140, vmaxEff * 1.2)} fill="#ec4899" fontSize="8" fontWeight="bold" textAnchor="end">
                  Vmax = {vmaxEff.toFixed(1)} μmol/s
                </text>

                {/* Hyperbolic Curve: v = Vmax * S / (Km + S) */}
                {(() => {
                  let d = 'M 50,180';
                  for (let s = 1; s <= 110; s += 2) {
                    const v = (vmaxEff * s) / (kmEff + s);
                    const px = 50 + s * 3;
                    const py = 180 - Math.min(150, v * 1.2);
                    d += ` L ${px},${py}`;
                  }
                  const currPx = 50 + substrateConc * 3;
                  const currPy = 180 - Math.min(150, reactionRateV * 1.2);
                  return (
                    <g>
                      <path d={d} fill="none" stroke="#a855f7" strokeWidth="2.5" />
                      <circle cx={currPx} cy={currPy} r="5" fill="#facc15" className="animate-pulse" />
                      <line x1={currPx} y1="180" x2={currPx} y2={currPy} stroke="#facc15" strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                  );
                })()}

                <text x="210" y="210" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Velocity v = {reactionRateV.toFixed(1)} μmol/s | Km = {kmEff.toFixed(1)} mM
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-purple-400 font-bold">Km: {kmEff.toFixed(1)} mM</span>
                <span className="text-pink-400 font-bold">Vmax: {vmaxEff.toFixed(1)}</span>
                <span className="text-emerald-400 font-bold">Temp Factor: {(tempDenatureFactor * 100).toFixed(0)}%</span>
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
                  max="100"
                  value={substrateConc}
                  onChange={(e) => setSubstrateConc(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Temperature (Denaturation &gt;50°C):</span>
                  <span className="text-amber-400 font-bold">{enzymeTempC}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={enzymeTempC}
                  onChange={(e) => setEnzymeTempC(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">pH Level:</span>
                  <span className="text-cyan-400 font-bold">{enzymePh.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.2"
                  value={enzymePh}
                  onChange={(e) => setEnzymePh(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Inhibition Type:</span>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'none', name: 'No Inhibitor' },
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
      {/* 4. PHOTOSYNTHESIS Z-SCHEME PHOTOPHOSPHORYLATION (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'z-scheme-photophosphorylation' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{pathwayType === 'non-cyclic' ? 'NON-CYCLIC Z-SCHEME (PS II + PS I)' : 'CYCLIC ELECTRON FLOW (PS I ONLY)'}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* PS II on bottom left (only in non-cyclic) */}
                {pathwayType === 'non-cyclic' && (
                  <g>
                    <rect x="50" y="145" width="55" height="35" rx="6" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="77" y="166" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">PS II (P680)</text>

                    {/* Excited PS II Primary Acceptor */}
                    <rect x="50" y="45" width="55" height="30" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="77" y="63" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle">Pheophytin</text>

                    {/* Light excitation photon ray */}
                    <line x1="77" y1="145" x2="77" y2="75" stroke="#facc15" strokeWidth={1 + lightPower * 0.03} />

                    {/* Electron descent down b6f ETC */}
                    <line x1="105" y1="60" x2="200" y2="135" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                    <text x="155" y="92" fill="#38bdf8" fontSize="8" fontWeight="bold">Cyt b₆f Complex</text>

                    {/* Water photolysis reaction box at bottom left */}
                    <g transform="translate(50, 195)">
                      <rect x="-10" y="-10" width="105" height="20" rx="4" fill="#0284c725" stroke="#38bdf8" strokeWidth="1" />
                      <text x="42" y="3" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle">
                        2H₂O ➔ 4H⁺ + 4e⁻ + O₂ ↑
                      </text>
                    </g>
                  </g>
                )}

                {/* PS I (P700) */}
                <rect x="200" y="135" width="55" height="35" rx="6" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" />
                <text x="227" y="156" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">PS I (P700)</text>

                {/* Excited PS I Acceptor */}
                <rect x="200" y="45" width="55" height="30" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                <text x="227" y="63" fill="#a855f7" fontSize="8" fontWeight="bold" textAnchor="middle">A₀ / Fd</text>

                {/* Excitation line at PSI */}
                <line x1="227" y1="135" x2="227" y2="75" stroke="#facc15" strokeWidth={1 + lightPower * 0.03} />

                {/* Pathway routing: Non-cyclic to NADP+ vs Cyclic looping back to b6f */}
                {pathwayType === 'non-cyclic' ? (
                  <g>
                    <line x1="255" y1="60" x2="330" y2="60" stroke="#f43f5e" strokeWidth="2.5" />
                    <rect x="330" y="45" width="60" height="30" rx="6" fill="#881337" stroke="#f43f5e" strokeWidth="1.5" />
                    <text x="360" y="63" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">NADP⁺ Reductase</text>
                    <text x="360" y="90" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">➔ NADPH Made</text>
                  </g>
                ) : (
                  <g>
                    {/* Cyclic loop back from Fd to b6f */}
                    <path d="M 227,45 Q 160,20 160,100" fill="none" stroke="#facc15" strokeWidth="2.5" strokeDasharray="4 2" />
                    <text x="160" y="30" fill="#facc15" fontSize="8" fontWeight="bold">Cyclic Feedback Loop</text>
                  </g>
                )}

                {/* Rotating ATP Synthase turbine on right */}
                <g transform="translate(350, 150)">
                  <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
                  {/* Rotating rotor blades */}
                  {[0, 90, 180, 270].map((deg) => (
                    <line
                      key={deg}
                      x1="0"
                      y1="0"
                      x2={Math.cos(((deg + animTime * 120) * Math.PI) / 180) * 14}
                      y2={Math.sin(((deg + animTime * 120) * Math.PI) / 180) * 14}
                      stroke="#facc15"
                      strokeWidth="2"
                    />
                  ))}
                  <text x="0" y="28" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">ATP Synthase</text>
                  <text x="0" y="38" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">ADP + Pi ➔ ATP</text>
                </g>

                <text x="210" y="222" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Photophosphorylation: Light {lightPower}% | Output: {atpProductionRate} μmol ATP/m²/s {pathwayType === 'non-cyclic' ? '+ NADPH' : '(ATP only)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Light: {lightPower}%</span>
                <span className="text-cyan-400 font-bold">Proton Gradient: {protonGradient}%</span>
                <span className="text-amber-400 font-bold">ATP Turbine: {atpProductionRate} rate</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Z-Scheme Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Photophosphorylation Route:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setPathwayType('non-cyclic')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      pathwayType === 'non-cyclic'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Non-Cyclic (Z)
                  </button>
                  <button
                    onClick={() => setPathwayType('cyclic')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      pathwayType === 'cyclic'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Cyclic (PSI only)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Light Intensity (Photons):</span>
                  <span className="text-amber-400 font-bold">{lightPower}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightPower}
                  onChange={(e) => setLightPower(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Thylakoid H⁺ Gradient (Lumen):</span>
                  <span className="text-cyan-400 font-bold">{protonGradient}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={protonGradient}
                  onChange={(e) => setProtonGradient(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {pathwayType === 'non-cyclic' && (
                <button
                  onClick={() => setPhotolysisBurst((prev) => prev + 1)}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:from-emerald-500/30 hover:to-teal-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flash Water Photolysis ({photolysisBurst})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
