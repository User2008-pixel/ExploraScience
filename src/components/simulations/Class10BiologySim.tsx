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
  Flame,
  Droplet,
  Shuffle,
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
  // MODE 1: PHOTOSYNTHESIS & STOMATA REGULATION (Manipulative)
  // ----------------------------------------------------------------------
  const [isDayTime, setIsDayTime] = useState<boolean>(true);
  const [lightIntensity, setLightIntensity] = useState<number>(variables.lightIntensity ?? 80);
  const [soilHydration, setSoilHydration] = useState<number>(75); // 0 - 100%
  // Stomata aperture depends on both light and hydration
  const stomataOpening = isDayTime && soilHydration > 20
    ? Math.min(100, (lightIntensity * 0.75 + soilHydration * 0.35))
    : 4;

  // ----------------------------------------------------------------------
  // MODE 2: HUMAN 4-CHAMBERED HEART & DOUBLE CIRCULATION (Manipulative)
  // ----------------------------------------------------------------------
  const [heartRateBpm, setHeartRateBpm] = useState<number>(variables.heartRateBpm ?? 72);
  const [strokeVolumeMl, setStrokeVolumeMl] = useState<number>(70); // 50 - 120 mL
  const cardiacOutputLpm = (heartRateBpm * strokeVolumeMl) / 1000;
  const cardiacCyclePeriod = 60 / heartRateBpm;
  const isSystole = (animTime % cardiacCyclePeriod) < (cardiacCyclePeriod * 0.4);

  // ----------------------------------------------------------------------
  // MODE 3: NEPHRON ULTRAFILTRATION (Manipulative)
  // ----------------------------------------------------------------------
  const [bloodPressureMmHg, setBloodPressureMmHg] = useState<number>(120); // 80 - 170 mmHg
  const [adhHydrationLevel, setAdhHydrationLevel] = useState<number>(65); // 10 - 100%
  const [bloodGlucoseMgDl, setBloodGlucoseMgDl] = useState<number>(100); // 70 - 300 mg/dL

  // GFR in L/day: normal ~ 180 L/day
  const gfrLitersDay = Math.round(180 * (bloodPressureMmHg / 120));
  // Urine output in L/day: high ADH -> concentrated low volume (~1.2L), low ADH -> dilute high volume (~4L)
  const urineOutputLiters = Math.max(0.6, Math.min(5.0, 1.5 * (100 / Math.max(25, adhHydrationLevel)) * (bloodPressureMmHg / 120)));
  const hasGlycosuria = bloodGlucoseMgDl > 180; // renal threshold for glucose

  // ----------------------------------------------------------------------
  // MODE 4: NEURON SYNAPSE & REFLEX ARC (Manipulative)
  // ----------------------------------------------------------------------
  const [stimulusStrengthMv, setStimulusStrengthMv] = useState<number>(35); // 10 - 60 mV (threshold ~ 15 mV)
  const [myelinationPercent, setMyelinationPercent] = useState<number>(85); // 10 - 100%
  const [reflexFiredTime, setReflexFiredTime] = useState<number | null>(null);

  const isActionPotentialTriggered = stimulusStrengthMv >= 15;
  const conductionSpeedMs = Math.round(5 + (myelinationPercent / 100) * 115);

  const handleTriggerReflex = () => {
    setReflexFiredTime(animTime);
  };

  // ----------------------------------------------------------------------
  // MODE 5: MENDELIAN GENETICS & PUNNETT SQUARE (Manipulative)
  // ----------------------------------------------------------------------
  const [parent1Allele, setParent1Allele] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [parent2Allele, setParent2Allele] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [sampleOffspring, setSampleOffspring] = useState<{ tall: number; dwarf: number } | null>(null);

  // Compute 2x2 Punnett outcomes
  const p1Gametes = parent1Allele.split('');
  const p2Gametes = parent2Allele.split('');
  const punnettOutcomes = [
    [p1Gametes[0] + p2Gametes[0], p1Gametes[0] + p2Gametes[1]],
    [p1Gametes[1] + p2Gametes[0], p1Gametes[1] + p2Gametes[1]],
  ].map((row) =>
    row.map((combo) => {
      // standard sort 'tT' -> 'Tt'
      const norm = combo.split('').sort().join('').replace('tT', 'Tt');
      const isTall = norm.includes('T');
      return { combo: norm, isTall };
    })
  );

  let tallCount = 0;
  let dwarfCount = 0;
  punnettOutcomes.flat().forEach((o) => {
    if (o.isTall) tallCount++;
    else dwarfCount++;
  });

  const handleSimulate100Offspring = () => {
    let t = 0;
    let d = 0;
    for (let i = 0; i < 100; i++) {
      const g1 = p1Gametes[Math.floor(Math.random() * 2)];
      const g2 = p2Gametes[Math.floor(Math.random() * 2)];
      if (g1 === 'T' || g2 === 'T') t++;
      else d++;
    }
    setSampleOffspring({ tall: t, dwarf: d });
  };

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
              Live beating 4-chambered heart, stomatal turgidity regulation, nephron filtration &amp; interactive Mendel Punnett genetics
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>GUARD CELL TURGOR &amp; TRANSPIRATIONAL PORE DYNAMICS</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {(() => {
                  const apertureW = (stomataOpening / 100) * 24;
                  return (
                    <g transform="translate(210, 115)">
                      {/* Left Guard Cell */}
                      <path
                        d={`M ${-apertureW}, -60 C -65, -45 -65, 45 ${-apertureW}, 60 C ${-apertureW - 18}, 35 ${-apertureW - 18}, -35 ${-apertureW}, -60 Z`}
                        fill="#15803d"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                      />
                      {/* Chloroplasts in Left Guard Cell */}
                      {[-35, -12, 12, 35].map((y, i) => (
                        <circle key={i} cx={-apertureW - 24} cy={y} r="4.5" fill="#86efac" />
                      ))}

                      {/* Right Guard Cell */}
                      <path
                        d={`M ${apertureW}, -60 C 65, -45 65, 45 ${apertureW}, 60 C ${apertureW + 18}, 35 ${apertureW + 18}, -35 ${apertureW}, -60 Z`}
                        fill="#15803d"
                        stroke="#22c55e"
                        strokeWidth="2.5"
                      />
                      {/* Chloroplasts in Right Guard Cell */}
                      {[-35, -12, 12, 35].map((y, i) => (
                        <circle key={i} cx={apertureW + 24} cy={y} r="4.5" fill="#86efac" />
                      ))}

                      {/* Stomatal Pore Aperture */}
                      {stomataOpening > 10 && (
                        <ellipse cx="0" cy="0" rx={apertureW * 0.9} ry="50" fill="#022c22" />
                      )}

                      {/* Gas and water vapor exchange particles */}
                      {stomataOpening > 15 &&
                        [0, 1, 2].map((p) => {
                          const py = -40 + ((animTime * 35 + p * 35) % 80);
                          return (
                            <g key={p}>
                              <circle cx="-6" cy={py} r="3" fill="#38bdf8" />
                              <text x="-6" y={py - 4} fill="#38bdf8" fontSize="6" fontWeight="bold">CO₂</text>
                              <circle cx="6" cy={-py} r="3" fill="#4ade80" />
                              <text x="6" y={-py - 4} fill="#4ade80" fontSize="6" fontWeight="bold">O₂</text>
                            </g>
                          );
                        })}
                    </g>
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {stomataOpening > 25 ? 'Stoma OPEN: Guard cells turgid (Water & K⁺ influx)' : 'Stoma CLOSED: Guard cells flaccid (Water loss prevented)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Pore Aperture: {Math.round(stomataOpening)}%</span>
                <span className="text-cyan-400 font-bold">Soil Water: {soilHydration}%</span>
                <span className="text-amber-400 font-bold">State: {stomataOpening > 25 ? 'Turgid' : 'Flaccid'}</span>
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
                  <span>{isDayTime ? 'Daylight (Photosynthesis ON)' : 'Nighttime (Stomata Closed)'}</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Light Intensity:</span>
                  <span className="text-emerald-400 font-bold">{lightIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightIntensity}
                  disabled={!isDayTime}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Soil Hydration (Osmotic Turgor):</span>
                  <span className="text-cyan-400 font-bold">{soilHydration}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={soilHydration}
                  onChange={(e) => setSoilHydration(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-rose-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                <span>CARDIAC OUTPUT: {cardiacOutputLpm.toFixed(1)} L/min ({isSystole ? 'SYSTOLE' : 'DIASTOLE'})</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {(() => {
                  const scale = isSystole ? 0.94 : 1.04;
                  return (
                    <g transform={`translate(210, 115) scale(${scale})`}>
                      {/* Heart Outline */}
                      <path
                        d="M 0,-30 C -60,-80 -100,-20 -50,40 L 0,85 L 50,40 C 100,-20 60,-80 0,-30 Z"
                        fill="#881337"
                        stroke="#f43f5e"
                        strokeWidth="3"
                      />

                      {/* Interventricular Septum separating deoxygenated & oxygenated */}
                      <line x1="0" y1="-25" x2="0" y2="80" stroke="#f8fafc" strokeWidth="3" />

                      {/* Right Atrium (Blue) */}
                      <rect x="-45" y="-35" width="40" height="35" rx="6" fill="#1e3a8a" fillOpacity="0.85" />
                      <text x="-25" y="-15" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">RA</text>

                      {/* Right Ventricle */}
                      <rect x="-45" y="5" width="40" height="40" rx="6" fill="#1e3a8a" fillOpacity="0.95" />
                      <text x="-25" y="28" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">RV</text>

                      {/* Left Atrium (Red) */}
                      <rect x="5" y="-35" width="40" height="35" rx="6" fill="#b91c1c" fillOpacity="0.85" />
                      <text x="25" y="-15" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">LA</text>

                      {/* Left Ventricle (Thick myocardium) */}
                      <rect x="5" y="5" width="40" height="40" rx="6" fill="#b91c1c" fillOpacity="0.95" />
                      <text x="25" y="28" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">LV</text>
                    </g>
                  );
                })()}

                {/* Animated flowing erythrocytes */}
                {[0, 1, 2, 3].map((i) => {
                  const t = (animTime * (heartRateBpm / 60) + i * 0.25) % 1;
                  const bx = 165 - Math.sin(t * Math.PI * 2) * 55;
                  const by = 115 - Math.cos(t * Math.PI * 2) * 65;
                  return (
                    <circle key={i} cx={bx} cy={by} r="3.5" fill="#3b82f6" className="animate-pulse" />
                  );
                })}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Cardiac Output = {heartRateBpm} BPM × {strokeVolumeMl} mL = {cardiacOutputLpm.toFixed(2)} L/min
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">HR: {heartRateBpm} BPM</span>
                <span className="text-cyan-400 font-bold">Stroke Vol: {strokeVolumeMl} mL</span>
                <span className="text-emerald-400 font-bold">Cardiac Output: {cardiacOutputLpm.toFixed(2)} L/min</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-rose-400 font-mono text-sm uppercase">Hemodynamic Controls</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Heart Rate (BPM):</span>
                  <span className="text-rose-400 font-bold">{heartRateBpm} BPM</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="160"
                  value={heartRateBpm}
                  onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Stroke Volume (Ventricular Ejection):</span>
                  <span className="text-cyan-400 font-bold">{strokeVolumeMl} mL</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="120"
                  value={strokeVolumeMl}
                  onChange={(e) => setStrokeVolumeMl(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setHeartRateBpm(135);
                    setStrokeVolumeMl(105);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:from-rose-500/30 hover:to-amber-500/30 transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Simulate Heavy Exercise / Adrenaline Surge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. NEPHRON EXCRETION & ULTRAFILTRATION (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'nephron-filtration' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>GLOMERULAR GFR: {gfrLitersDay} L/day ➔ FINAL URINE: {urineOutputLiters.toFixed(2)} L/day</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Bowman's Capsule Cup */}
                <path d="M 60,60 C 40,80 40,120 70,130 L 110,130" fill="none" stroke="#f59e0b" strokeWidth="4" />

                {/* Glomerulus Capillary Tuft inside Cup */}
                <circle cx="65" cy="95" r={14 + (bloodPressureMmHg / 120) * 3} fill="#dc2626" fillOpacity="0.85" />
                <text x="65" y="99" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Glomerulus</text>

                {/* Proximal Convoluted Tubule (PCT) */}
                <path d="M 110,130 Q 140,110 160,140 Q 180,170 200,140" fill="none" stroke="#facc15" strokeWidth="4" />

                {/* Loop of Henle Hairpin */}
                <path d="M 200,140 L 200,195 Q 215,210 230,195 L 230,120" fill="none" stroke="#38bdf8" strokeWidth="4" />

                {/* Distal Convoluted Tubule & Collecting Duct */}
                <path d="M 230,120 Q 260,100 290,120 L 330,120 L 330,200" fill="none" stroke="#10b981" strokeWidth="4" />

                {/* Reabsorption Arrows from PCT back to Blood */}
                <g transform="translate(150, 130)">
                  <line x1="0" y1="0" x2="0" y2="-20" stroke="#4ade80" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="0" y="-24" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">
                    99% Reabsorbed (Glucose, H₂O)
                  </text>
                </g>

                {/* Flowing filtrate droplets */}
                {[0, 1, 2, 3, 4].map((f) => {
                  const ft = (animTime * 0.9 + f * 0.2) % 1;
                  const fx = 70 + ft * 260;
                  const fy = 95 + Math.sin(ft * Math.PI * 4) * 20;
                  return (
                    <circle key={f} cx={fx} cy={fy} r="3" fill="#fde047" />
                  );
                })}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {hasGlycosuria ? '⚠️ GLYCOSURIA DETECTED: Renal Threshold (>180 mg/dL) Exceeded!' : 'Normal Selective Reabsorption: 100% of Glucose Salvaged in PCT'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Blood Pressure: {bloodPressureMmHg} mmHg</span>
                <span className="text-cyan-400 font-bold">ADH Hydration: {adhHydrationLevel}%</span>
                <span className={hasGlycosuria ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  Urine Sugar: {hasGlycosuria ? 'POSITIVE' : 'NEGATIVE'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Renal Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Glomerular Blood Pressure:</span>
                  <span className="text-amber-400 font-bold">{bloodPressureMmHg} mmHg</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="170"
                  value={bloodPressureMmHg}
                  onChange={(e) => setBloodPressureMmHg(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">ADH / Hydration Signal:</span>
                  <span className="text-cyan-400 font-bold">{adhHydrationLevel}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={adhHydrationLevel}
                  onChange={(e) => setAdhHydrationLevel(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Blood Glucose Level:</span>
                  <span className={hasGlycosuria ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {bloodGlucoseMgDl} mg/dL
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="300"
                  value={bloodGlucoseMgDl}
                  onChange={(e) => setBloodGlucoseMgDl(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. NEURON SYNAPSE & SPINAL REFLEX ARC (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'neuron-reflex-arc' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-sky-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                <span>CONDUCTION VELOCITY: {conductionSpeedMs} m/s ({myelinationPercent}% MYELINATED)</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Sensory Receptor (Finger with Heat / Pinprick) */}
                <circle cx="50" cy="115" r="16" fill="#f43f5e" />
                <text x="50" y="118" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Receptor</text>

                {/* Sensory Neuron with Myelin Sheath Nodes of Ranvier */}
                <line x1="66" y1="115" x2="160" y2="115" stroke="#38bdf8" strokeWidth="2.5" />
                {[80, 105, 130].map((mx) => (
                  <rect key={mx} x={mx - 8} y="110" width="16" height="10" rx="3" fill="#eab308" fillOpacity={myelinationPercent / 100} stroke="#ca8a04" strokeWidth="1" />
                ))}

                {/* Spinal Cord Relay Center */}
                <rect x="160" y="75" width="90" height="80" rx="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                <text x="205" y="110" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">Spinal Cord</text>
                <text x="205" y="122" fill="#94a3b8" fontSize="7" textAnchor="middle">Interneuron</text>

                {/* Motor Neuron */}
                <line x1="250" y1="115" x2="340" y2="115" stroke="#10b981" strokeWidth="2.5" />
                {[270, 295, 320].map((mx) => (
                  <rect key={mx} x={mx - 8} y="110" width="16" height="10" rx="3" fill="#eab308" fillOpacity={myelinationPercent / 100} stroke="#ca8a04" strokeWidth="1" />
                ))}

                {/* Effector Muscle */}
                <circle cx="360" cy="115" r="18" fill="#10b981" />
                <text x="360" y="118" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Effector</text>

                {/* Live Action Potential Impulse traveling */}
                {isActionPotentialTriggered && (() => {
                  const impulseX = 66 + ((animTime * (conductionSpeedMs * 1.5)) % 285);
                  return (
                    <circle cx={impulseX} cy="115" r="5" fill="#facc15" className="animate-pulse" />
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {isActionPotentialTriggered ? `Action Potential Firing: All-or-None Principle Satisfied (>15 mV)` : `Sub-threshold Stimulus: No Action Potential Generated`}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-sky-400 font-bold">Stimulus: {stimulusStrengthMv} mV</span>
                <span className="text-emerald-400 font-bold">Speed: ~{conductionSpeedMs} m/s</span>
                <span className="text-amber-400 font-bold">Bypasses Brain conscious delay</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-sky-400 font-mono text-sm uppercase">Neural Manipulations</h4>

              <div>
                <button
                  onClick={handleTriggerReflex}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:from-rose-500/30 hover:to-orange-500/30 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Apply Heat / Pain Stimulus to Finger</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Stimulus Intensity (Threshold = 15 mV):</span>
                  <span className="text-sky-400 font-bold">{stimulusStrengthMv} mV</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={stimulusStrengthMv}
                  onChange={(e) => setStimulusStrengthMv(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Axon Myelination (Saltatory Conduction):</span>
                  <span className="text-amber-400 font-bold">{myelinationPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={myelinationPercent}
                  onChange={(e) => setMyelinationPercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MENDELIAN GENETICS & PUNNETT SQUARE (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'mendelian-genetics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>MONOHYBRID CROSS: {parent1Allele} × {parent2Allele}</span>
              </div>

              <div className="w-72 h-72 grid grid-cols-2 gap-2 p-3 bg-slate-900 rounded-2xl border border-slate-800">
                {punnettOutcomes.flat().map((sq, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                      sq.isTall
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    <span className="text-2xl font-bold font-mono">{sq.combo}</span>
                    <span className="text-[11px] mt-1 font-semibold">{sq.isTall ? 'Tall (Dominant)' : 'Dwarf (Recessive)'}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-4 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Theoretical Ratio: {tallCount} Tall : {dwarfCount} Dwarf</span>
                {sampleOffspring && (
                  <span className="text-amber-400 font-bold">
                    Empirical 100 Sample: {sampleOffspring.tall} Tall : {sampleOffspring.dwarf} Dwarf
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Parental Cross Setup</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Parent 1 Genotype:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                  {(['TT', 'Tt', 'tt'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setParent1Allele(g)}
                      className={`p-2 rounded-xl transition border ${
                        parent1Allele === g
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Parent 2 Genotype:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                  {(['TT', 'Tt', 'tt'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setParent2Allele(g)}
                      className={`p-2 rounded-xl transition border ${
                        parent2Allele === g
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={handleSimulate100Offspring}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 text-violet-300 font-bold text-xs hover:from-violet-500/30 hover:to-purple-500/30 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Shuffle className="w-4 h-4 text-violet-400" />
                  <span>Random Fertilize 100 Offspring</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
