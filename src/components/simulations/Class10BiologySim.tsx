import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sun,
  Moon,
  Zap,
  Dna,
} from 'lucide-react';

interface Class10BiologySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Bio10Mode =
  | 'photosynthesis-stomata'
  | 'double-circulation'
  | 'nephron-filtration'
  | 'neuron-reflex-arc'
  | 'mendelian-genetics';

export const Class10BiologySim: React.FC<Class10BiologySimProps> = ({
  simulationType = 'class10-biology',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Bio10Mode => {
    if (conceptId.includes('photosynthesis') || conceptId.includes('stomata') || conceptId.includes('chloroplast')) return 'photosynthesis-stomata';
    if (conceptId.includes('heart') || conceptId.includes('circulation') || conceptId.includes('cardiac')) return 'double-circulation';
    if (conceptId.includes('nephron') || conceptId.includes('excretion') || conceptId.includes('kidney') || conceptId.includes('filtration')) return 'nephron-filtration';
    if (conceptId.includes('neuron') || conceptId.includes('synapse') || conceptId.includes('reflex')) return 'neuron-reflex-arc';
    if (conceptId.includes('mendel') || conceptId.includes('genetics') || conceptId.includes('punnett') || conceptId.includes('heredity')) return 'mendelian-genetics';
    return 'photosynthesis-stomata';
  };

  const [activeMode, setActiveMode] = useState<Bio10Mode>(getInitialMode());

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
  // MODE 1: PHOTOSYNTHESIS & STOMATA REGULATION
  // ----------------------------------------------------------------------
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<number>(variables.lightIntensity ?? 80);
  const stomataOpening = isDayTime ? Math.min(100, lightIntensity * 1.1) : 5;

  // ----------------------------------------------------------------------
  // MODE 2: HUMAN 4-CHAMBERED HEART & DOUBLE CIRCULATION
  // ----------------------------------------------------------------------
  const [heartRateBpm, setHeartRateBpm] = useState<number>(variables.heartRateBpm ?? 72);
  const cardiacCyclePeriod = 60 / heartRateBpm;
  const isSystole = (animTime % cardiacCyclePeriod) < (cardiacCyclePeriod * 0.4);

  // ----------------------------------------------------------------------
  // MODE 3: NEPHRON ULTRAFILTRATION
  // ----------------------------------------------------------------------
  const [bloodPressureGfr, setBloodPressureGfr] = useState<number>(120);

  // ----------------------------------------------------------------------
  // MODE 4: NEURON SYNAPSE & REFLEX ARC
  // ----------------------------------------------------------------------
  const [reflexTriggered, setReflexTriggered] = useState<boolean>(false);

  // ----------------------------------------------------------------------
  // MODE 5: MENDELIAN GENETICS & PUNNETT SQUARE
  // ----------------------------------------------------------------------
  const [parent1Allele, setParent1Allele] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [parent2Allele, setParent2Allele] = useState<'TT' | 'Tt' | 'tt'>('Tt');

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Heart className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 10 NCERT Biology Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live beating 4-chambered heart, stomatal turgidity regulation, nephron countercurrent filtration & Mendel Punnett squares
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
          { id: 'photosynthesis-stomata', label: '1. Photosynthesis & Stomata' },
          { id: 'double-circulation', label: '2. Heart & Double Circulation' },
          { id: 'nephron-filtration', label: '3. Nephron Excretion' },
          { id: 'neuron-reflex-arc', label: '4. Synapse & Reflex Arc' },
          { id: 'mendelian-genetics', label: '5. Mendelian Punnett' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Bio10Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. PHOTOSYNTHESIS & STOMATAL GUARD CELL REGULATION */}
      {/* ============================================================== */}
      {activeMode === 'photosynthesis-stomata' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE STOMATAL GUARD CELL TURGIDITY & GAS EXCHANGE</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Kidney-shaped Guard Cells */}
                {(() => {
                  const apertureW = (stomataOpening / 100) * 22; // 0 to 22px
                  return (
                    <g transform="translate(200, 110)">
                      {/* Left Guard Cell */}
                      <path
                        d={`M ${-apertureW}, -55 C -60, -40 -60, 40 ${-apertureW}, 55 C ${-apertureW - 15}, 30 ${-apertureW - 15}, -30 ${-apertureW}, -55 Z`}
                        fill="#15803d"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                      />
                      {/* Chloroplasts in Left Guard Cell */}
                      {[-30, -10, 10, 30].map((y, i) => (
                        <circle key={i} cx={-apertureW - 22} cy={y} r="4" fill="#86efac" />
                      ))}

                      {/* Right Guard Cell */}
                      <path
                        d={`M ${apertureW}, -55 C 60, -40 60, 40 ${apertureW}, 55 C ${apertureW + 15}, 30 ${apertureW + 15}, -30 ${apertureW}, -55 Z`}
                        fill="#15803d"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                      />
                      {/* Chloroplasts in Right Guard Cell */}
                      {[-30, -10, 10, 30].map((y, i) => (
                        <circle key={i} cx={apertureW + 22} cy={y} r="4" fill="#86efac" />
                      ))}

                      {/* Stomatal Pore Aperture */}
                      {stomataOpening > 10 && (
                        <ellipse cx="0" cy="0" rx={apertureW * 0.9} ry="45" fill="#022c22" />
                      )}

                      {/* Animated CO2 (inward) and O2/H2O (outward) particles when open */}
                      {stomataOpening > 20 &&
                        [0, 1, 2].map((p) => {
                          const py = -40 + ((animTime * 30 + p * 35) % 80);
                          return (
                            <g key={p}>
                              <circle cx="-5" cy={py} r="3" fill="#38bdf8" />
                              <text x="-5" y={py - 4} fill="#38bdf8" fontSize="6" fontWeight="bold">CO₂</text>
                              <circle cx="5" cy={-py} r="3" fill="#4ade80" />
                              <text x="5" y={-py - 4} fill="#4ade80" fontSize="6" fontWeight="bold">O₂</text>
                            </g>
                          );
                        })}
                    </g>
                  );
                })()}

                {/* Stoma Status Banner */}
                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {stomataOpening > 30 ? 'Stoma OPEN: Guard cells turgid (Water + K⁺ influx)' : 'Stoma CLOSED: Guard cells flaccid (Water loss prevented)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Pore Aperture: {Math.round(stomataOpening)}%</span>
                <span className="text-cyan-400 font-bold">Transpiration: {isDayTime ? 'High' : 'Minimal'}</span>
                <span className="text-amber-400 font-bold">State: {isDayTime ? 'Turgid' : 'Flaccid'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Environmental Factors</h4>

              <div>
                <button
                  onClick={() => setIsDayTime(!isDayTime)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
                    isDayTime
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  {isDayTime ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  <span>{isDayTime ? 'Daylight Active (Stomata Open)' : 'Nighttime (Stomata Closed)'}</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Light Intensity:</span>
                  <span className="text-emerald-400 font-bold">{lightIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={lightIntensity}
                  disabled={!isDayTime}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">NCERT Mechanism:</div>
                <p>
                  Guard cells contain chloroplasts. In daylight, active transport pumps $K^+$ ions in, causing water to enter by osmosis. The outer thin wall bulges out, pulling the thick elastic inner wall open.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. HUMAN 4-CHAMBERED HEART & DOUBLE CIRCULATION */}
      {/* ============================================================== */}
      {activeMode === 'double-circulation' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-rose-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>LIVE 4-CHAMBERED CARDIAC CYCLE & PULMONARY / SYSTEMIC CIRCUITS</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Beating Heart Shape */}
                {(() => {
                  const scale = isSystole ? 0.95 : 1.03;
                  return (
                    <g transform={`translate(200, 110) scale(${scale})`}>
                      {/* Heart Outline */}
                      <path
                        d="M 0,-30 C -60,-80 -100,-20 -50,40 L 0,85 L 50,40 C 100,-20 60,-80 0,-30 Z"
                        fill="#881337"
                        stroke="#f43f5e"
                        strokeWidth="3"
                      />

                      {/* Septum separating deoxygenated (right) & oxygenated (left) */}
                      <line x1="0" y1="-25" x2="0" y2="80" stroke="#f8fafc" strokeWidth="3" />

                      {/* Chambers */}
                      {/* Right Atrium (Deoxygenated blue) */}
                      <rect x="-45" y="-35" width="40" height="35" rx="6" fill="#1e3a8a" fillOpacity="0.8" />
                      <text x="-25" y="-15" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">RA</text>

                      {/* Right Ventricle */}
                      <rect x="-45" y="5" width="40" height="40" rx="6" fill="#1e3a8a" fillOpacity="0.9" />
                      <text x="-25" y="28" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">RV</text>

                      {/* Left Atrium (Oxygenated red) */}
                      <rect x="5" y="-35" width="40" height="35" rx="6" fill="#b91c1c" fillOpacity="0.8" />
                      <text x="25" y="-15" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">LA</text>

                      {/* Left Ventricle (Thick muscular wall) */}
                      <rect x="5" y="5" width="40" height="40" rx="6" fill="#b91c1c" fillOpacity="0.9" />
                      <text x="25" y="28" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">LV</text>
                    </g>
                  );
                })()}

                {/* Flowing Erythrocytes in circuits */}
                {[0, 1, 2, 3].map((i) => {
                  const t = (animTime * 1.2 + i * 0.25) % 1;
                  const bx = 160 - Math.sin(t * Math.PI * 2) * 50;
                  const by = 110 - Math.cos(t * Math.PI * 2) * 60;
                  return (
                    <circle key={i} cx={bx} cy={by} r="3" fill="#3b82f6" className="animate-pulse" />
                  );
                })}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Double Circulation: Pulmonary (Heart ➔ Lungs ➔ Heart) &amp; Systemic (Heart ➔ Body ➔ Heart)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">Heart Rate: {heartRateBpm} BPM</span>
                <span className="text-cyan-400 font-bold">Cardiac Phase: {isSystole ? 'Ventricular Systole' : 'Diastole'}</span>
                <span className="text-emerald-400 font-bold">Circulation: Complete Separation</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-rose-400 font-mono text-sm uppercase">Cardiac Controls</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Heart Rate (BPM):</span>
                  <span className="text-rose-400 font-bold">{heartRateBpm}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="140"
                  value={heartRateBpm}
                  onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-rose-400">Why Double Circulation?</div>
                <p>
                  Mammals and birds have high energy requirements to maintain constant body temperature (warm-blooded / homeothermy). Complete separation prevents mixing of oxygenated and deoxygenated blood.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. NEPHRON EXCRETION & ULTRAFILTRATION */}
      {/* ============================================================== */}
      {activeMode === 'nephron-filtration' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>GLOMERULAR ULTRAFILTRATION & SELECTIVE REABSORPTION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Bowman's Capsule Cup */}
                <path
                  d="M 60,60 C 40,80 40,120 70,130 L 110,130"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                />
                {/* Glomerulus Capillary Tuft inside Cup */}
                <circle cx="65" cy="95" r="16" fill="#dc2626" fillOpacity="0.8" />
                <text x="65" y="99" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Glomerulus</text>

                {/* Proximal Convoluted Tubule (PCT) */}
                <path
                  d="M 110,130 Q 140,110 160,140 Q 180,170 200,140"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="4"
                />

                {/* Loop of Henle Hairpin */}
                <path
                  d="M 200,140 L 200,190 Q 215,205 230,190 L 230,120"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                />

                {/* Distal Convoluted Tubule & Collecting Duct */}
                <path
                  d="M 230,120 Q 260,100 290,120 L 330,120 L 330,195"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                />

                {/* Flowing filtrate droplets */}
                {[0, 1, 2, 3, 4].map((f) => {
                  const ft = (animTime * 0.8 + f * 0.2) % 1;
                  const fx = 70 + ft * 260;
                  const fy = 95 + Math.sin(ft * Math.PI * 4) * 20;
                  return (
                    <circle key={f} cx={fx} cy={fy} r="3" fill="#fde047" />
                  );
                })}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Ultrafiltrate (180 L/day) ➔ Reabsorption (99% Glucose, Salts, H₂O) ➔ Urine (1.5 L/day)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Initial Filtrate: 180 L/day</span>
                <span className="text-emerald-400 font-bold">Reabsorbed: 99.2%</span>
                <span className="text-cyan-400 font-bold">Final Urine: ~1.5 L/day</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Tubular Functions</h4>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300">Bowman's Capsule:</div>
                  <div className="text-slate-400 text-[11px]">High blood pressure forces water, glucose, amino acids, urea out of blood.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300">PCT Selective Reabsorption:</div>
                  <div className="text-slate-400 text-[11px]">100% of glucose & amino acids actively returned to capillaries.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300">Loop of Henle & ADH:</div>
                  <div className="text-slate-400 text-[11px]">Water balance regulated to maintain blood osmolarity.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. NEURON SYNAPSE & SPINAL REFLEX ARC */}
      {/* ============================================================== */}
      {activeMode === 'neuron-reflex-arc' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-sky-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                <span>NEURAL TRANSMISSION & SPINAL REFLEX ARC</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Sensory Receptor (Finger) */}
                <circle cx="50" cy="110" r="14" fill="#f43f5e" />
                <text x="50" y="113" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Receptor</text>

                {/* Sensory Neuron */}
                <line x1="64" y1="110" x2="160" y2="110" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Spinal Cord Relay Center */}
                <rect x="160" y="70" width="80" height="80" rx="12" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="200" y="105" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">Spinal Cord</text>
                <text x="200" y="118" fill="#94a3b8" fontSize="7" textAnchor="middle">Relay Neuron</text>

                {/* Motor Neuron */}
                <line x1="240" y1="110" x2="330" y2="110" stroke="#10b981" strokeWidth="2.5" />

                {/* Effector Muscle */}
                <circle cx="350" cy="110" r="16" fill="#10b981" />
                <text x="350" y="113" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Effector</text>

                {/* Live Action Potential Impulse traveling */}
                {(() => {
                  const impulseX = 64 + ((animTime * 150) % 270);
                  return (
                    <circle cx={impulseX} cy="110" r="5" fill="#facc15" className="animate-pulse" />
                  );
                })()}

                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Reflex Arc: Receptor ➔ Sensory Neuron ➔ Spinal Interneuron ➔ Motor Neuron ➔ Effector Muscle
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-sky-400 font-bold">Signal: Action Potential</span>
                <span className="text-emerald-400 font-bold">Speed: ~100 m/s</span>
                <span className="text-amber-400 font-bold">Bypasses Brain conscious delay</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-sky-400 font-mono text-sm uppercase">Synaptic Cleft</h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-sky-400">Chemical Synapse:</div>
                <p>
                  Electrical impulses cannot jump the physical gap between neurons. Axon terminals release neurotransmitters (acetylcholine) which diffuse across the 20 nm synaptic cleft to trigger a new impulse.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MENDELIAN GENETICS & PUNNETT SQUARE */}
      {/* ============================================================== */}
      {activeMode === 'mendelian-genetics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>MONOHYBRID PUNNETT SQUARE & PHENOTYPIC RATIO (3:1)</span>
              </div>

              <div className="w-64 h-64 grid grid-cols-2 gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800">
                {[
                  { combo: 'TT', pheno: 'Tall (Pure)', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
                  { combo: 'Tt', pheno: 'Tall (Hybrid)', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
                  { combo: 'Tt', pheno: 'Tall (Hybrid)', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
                  { combo: 'tt', pheno: 'Dwarf (Recessive)', color: 'bg-rose-950 text-rose-300 border-rose-800' },
                ].map((sq, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${sq.color}`}>
                    <span className="text-xl font-bold font-mono">{sq.combo}</span>
                    <span className="text-[10px] mt-1">{sq.pheno}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-4 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Phenotypic Ratio: 3 Tall : 1 Dwarf</span>
                <span className="text-violet-400 font-bold">Genotypic Ratio: 1 TT : 2 Tt : 1 tt</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Mendel Laws</h4>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-violet-400">1. Law of Segregation:</div>
                <p>Allele pairs separate or segregate during gamete formation, and randomly unite at fertilization.</p>
                <div className="font-bold text-violet-400 mt-2">2. Law of Dominance:</div>
                <p>The dominant allele (T) masks the phenotypic expression of the recessive allele (t) in heterozygous condition (Tt).</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
