import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Calendar,
  Zap,
  TestTube,
  ShieldCheck,
} from 'lucide-react';

interface Class12BiologySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Bio12Mode =
  | 'menstrual-cycle'
  | 'dna-replication-fork'
  | 'lac-operon'
  | 'gel-electrophoresis';

export const Class12BiologySim: React.FC<Class12BiologySimProps> = ({
  simulationType = 'class12-biology',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Bio12Mode => {
    if (conceptId.includes('menstrual') || conceptId.includes('reproduction') || conceptId.includes('ovulation')) return 'menstrual-cycle';
    if (conceptId.includes('replication') || conceptId.includes('fork') || conceptId.includes('dna')) return 'dna-replication-fork';
    if (conceptId.includes('lac-operon') || conceptId.includes('operon') || conceptId.includes('gene-regulation')) return 'lac-operon';
    if (conceptId.includes('electrophoresis') || conceptId.includes('gel') || conceptId.includes('biotechnology')) return 'gel-electrophoresis';
    return 'menstrual-cycle';
  };

  const [activeMode, setActiveMode] = useState<Bio12Mode>(getInitialMode());

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
  // MODE 1: MENSTRUAL CYCLE & SYNCHRONIZED HORMONES
  // ----------------------------------------------------------------------
  const [cycleDay, setCycleDay] = useState<number>(variables.cycleDay ?? 14);
  const [isContraceptiveActive, setIsContraceptiveActive] = useState<boolean>(false);
  const [isPregnantHcg, setIsPregnantHcg] = useState<boolean>(false);

  // ----------------------------------------------------------------------
  // MODE 2: DNA REPLICATION FORK ARCHITECTURE (Completely Manipulative)
  // ----------------------------------------------------------------------
  const [forkSpeed, setForkSpeed] = useState<number>(2); // 1 - 5x
  const [dntpConcentration, setDntpConcentration] = useState<number>(60); // 10 - 100 uM
  const [ligaseActionTriggered, setLigaseActionTriggered] = useState<boolean>(true);
  const [proofreadingExo, setProofreadingExo] = useState<boolean>(true);

  // ----------------------------------------------------------------------
  // MODE 3: LAC OPERON GENE REGULATION (Completely Manipulative)
  // ----------------------------------------------------------------------
  const [lactosePresent, setLactosePresent] = useState<boolean>(true);
  const [glucoseLevel, setGlucoseLevel] = useState<'high' | 'low'>('low'); // Catabolite repression
  const [operonGenotype, setOperonGenotype] = useState<'wild-type' | 'lacI-minus' | 'lacOc'>('wild-type');

  // Transcription rate computation
  const isRepressorActive = operonGenotype === 'wild-type' && !lactosePresent;
  const isCapCampActive = glucoseLevel === 'low';
  const isTranscribing = !isRepressorActive;
  const betaGalactosidaseRate = isTranscribing ? (isCapCampActive ? 100 : 25) : 1;

  // ----------------------------------------------------------------------
  // MODE 4: AGAROSE GEL ELECTROPHORESIS (Completely Manipulative)
  // ----------------------------------------------------------------------
  const [voltageV, setVoltageV] = useState<number>(100);
  const [uvLightOn, setUvLightOn] = useState<boolean>(true);
  const [agarosePercent, setAgarosePercent] = useState<number>(1.0); // 0.8% - 2.0%
  const [runTimeMinutes, setRunTimeMinutes] = useState<number>(30); // 0 - 60 min

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Dna className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 12 NCERT Biology Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live synchronized menstrual hormone tracks, DNA replication fork unwinding, Lac Operon induction &amp; Agarose electrophoresis
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition border border-pink-500/30"
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
                  simSpeed === s ? 'bg-pink-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
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
          { id: 'menstrual-cycle', label: '1. Menstrual Cycle' },
          { id: 'dna-replication-fork', label: '2. DNA Replication Fork' },
          { id: 'lac-operon', label: '3. Lac Operon Regulation' },
          { id: 'gel-electrophoresis', label: '4. Gel Electrophoresis' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Bio12Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. MENSTRUAL CYCLE & SYNCHRONOUS HORMONAL FEEDBACK */}
      {/* ============================================================== */}
      {activeMode === 'menstrual-cycle' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-pink-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
                <span>28-DAY SYNCHRONIZED OVARIAN &amp; UTERINE HORMONES</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* 28 Day Timeline Grid */}
                <line x1="50" y1="180" x2="380" y2="180" stroke="#334155" strokeWidth="1.5" />
                {[1, 5, 14, 21, 28].map((d) => {
                  const x = 50 + ((d - 1) / 27) * 330;
                  return (
                    <g key={d}>
                      <line x1={x} y1="175" x2={x} y2="185" stroke="#64748b" />
                      <text x={x} y="196" fill="#94a3b8" fontSize="8" textAnchor="middle">Day {d}</text>
                    </g>
                  );
                })}

                {/* LH Surge curve (Suppressed if on contraceptive pill) */}
                {!isContraceptiveActive ? (
                  <path
                    d="M 50,140 Q 150,140 195,130 Q 212,40 230,130 Q 270,140 380,140"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                  />
                ) : (
                  <line x1="50" y1="145" x2="380" y2="145" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                )}
                <text x="212" y="32" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {isContraceptiveActive ? 'LH Peak Suppressed (Anovulatory)' : 'LH Surge (Induces Ovulation)'}
                </text>

                {/* Estrogen Curve */}
                <path
                  d={isContraceptiveActive ? "M 50,130 L 380,130" : "M 50,150 Q 140,150 185,75 Q 215,140 280,110 Q 340,160 380,165"}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Progesterone Curve (High in pregnancy or luteal) */}
                <path
                  d={isPregnantHcg ? "M 50,165 L 195,165 Q 260,65 380,65" : "M 50,165 L 195,165 Q 270,75 340,165 L 380,165"}
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2"
                />
                <text x="275" y="70" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {isPregnantHcg ? 'Progesterone Sustained by hCG' : 'Progesterone (Corpus Luteum)'}
                </text>

                {/* Current Day Cursor Marker */}
                {(() => {
                  const cx = 50 + ((cycleDay - 1) / 27) * 330;
                  return (
                    <g>
                      <line x1={cx} y1="35" x2={cx} y2="180" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx={cx} cy="180" r="5" fill="#ec4899" className="animate-pulse" />
                      <text x={cx} y="25" fill="#ec4899" fontSize="9" fontWeight="bold" textAnchor="middle">
                        Day {cycleDay}
                      </text>
                    </g>
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {cycleDay <= 5 ? 'Menstrual Phase: Endometrium sheds' : cycleDay < 14 ? 'Follicular / Proliferative: Estrogen rebuilds lining' : cycleDay === 14 ? 'Ovulatory Day: Graafian follicle ruptures' : 'Luteal / Secretory Phase: Corpus luteum secretes progesterone'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-pink-400 font-bold">Day: {cycleDay} of 28</span>
                <span className="text-cyan-400 font-bold">Pill Active: {isContraceptiveActive ? 'YES (No Ovulation)' : 'NO'}</span>
                <span className="text-amber-400 font-bold">hCG / Pregnancy: {isPregnantHcg ? 'ACTIVE' : 'NONE'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-pink-400 font-mono text-sm uppercase">Cycle Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Scrub Day:</span>
                  <span className="text-pink-400 font-bold">Day {cycleDay}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="28"
                  value={cycleDay}
                  onChange={(e) => setCycleDay(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button onClick={() => setCycleDay(3)} className="p-1.5 rounded-lg bg-slate-950 text-rose-300 border border-slate-800 hover:bg-slate-800">Day 3 (Menses)</button>
                <button onClick={() => setCycleDay(10)} className="p-1.5 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 hover:bg-slate-800">Day 10 (Prolif)</button>
                <button onClick={() => setCycleDay(14)} className="p-1.5 rounded-lg bg-slate-950 text-pink-300 border border-slate-800 hover:bg-slate-800">Day 14 (Ovulation)</button>
                <button onClick={() => setCycleDay(21)} className="p-1.5 rounded-lg bg-slate-950 text-amber-300 border border-slate-800 hover:bg-slate-800">Day 21 (Luteal)</button>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsContraceptiveActive(!isContraceptiveActive)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border ${
                    isContraceptiveActive
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {isContraceptiveActive ? '✓ Oral Contraceptive Pill Active (LH Peak Suppressed)' : '+ Simulate Contraceptive Pill'}
                </button>

                <button
                  onClick={() => setIsPregnantHcg(!isPregnantHcg)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border ${
                    isPregnantHcg
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {isPregnantHcg ? '✓ Fertilization / hCG (Corpus Luteum Maintained)' : '+ Simulate hCG / Pregnancy Signal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DNA REPLICATION FORK ARCHITECTURE (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'dna-replication-fork' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SEMI-CONSERVATIVE REPLICATION FORK &amp; LIGASE SEALING</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Unwound DNA Y-Fork */}
                {/* Parental Double Helix on Right */}
                <line x1="280" y1="115" x2="400" y2="115" stroke="#38bdf8" strokeWidth="4" />

                {/* Helicase Enzyme unwinding at fork junction */}
                <polygon points="260,100 290,115 260,130" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <text x="270" y="118" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Helicase</text>

                {/* Top Leading Strand (Continuous 5' to 3') */}
                <path d="M 270,115 L 160,65 L 40,65" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* Synthesized new leading strand */}
                <path d="M 250,110 L 160,75 L 70,75" fill="none" stroke="#4ade80" strokeWidth="2.5" />
                <text x="70" y="55" fill="#38bdf8" fontSize="8" fontWeight="bold">Leading Strand (5' ➔ 3' Continuous)</text>

                {/* Bottom Lagging Strand (Discontinuous Okazaki fragments) */}
                <path d="M 270,115 L 160,165 L 40,165" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* Okazaki Fragments with RNA Primers */}
                <line x1="70" y1="155" x2="100" y2="155" stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="100" y1="155" x2="150" y2="155" stroke="#4ade80" strokeWidth="2.5" />

                {/* Ligase sealing indicator between fragments */}
                {ligaseActionTriggered ? (
                  <line x1="150" y1="155" x2="175" y2="148" stroke="#10b981" strokeWidth="2.5" />
                ) : (
                  <circle cx="150" cy="155" r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                )}

                <line x1="175" y1="148" x2="195" y2="140" stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="195" y1="140" x2="235" y2="125" stroke="#4ade80" strokeWidth="2.5" />
                <text x="70" y="185" fill="#f43f5e" fontSize="8" fontWeight="bold">Lagging Strand (Okazaki + RNA Primer)</text>

                {/* Moving DNA Polymerase Engine */}
                {(() => {
                  const pX = 140 + Math.sin(animTime * forkSpeed) * 30;
                  return (
                    <g>
                      <circle cx={pX} cy="70" r="8" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1" />
                      <text x={pX} y="73" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">Pol III</text>
                    </g>
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Synthesis Rate: {Math.round(forkSpeed * 500)} bp/s | Substrate dNTP: {dntpConcentration} μM | {proofreadingExo ? '3\'➔5\' Proofreading ON' : 'High Mutation Rate'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Speed: {forkSpeed}x (~{forkSpeed * 500} nt/s)</span>
                <span className="text-emerald-400 font-bold">DNA Ligase: {ligaseActionTriggered ? 'SEALED' : 'UNSEALED NICK'}</span>
                <span className="text-purple-400 font-bold">dNTP Conc: {dntpConcentration} μM</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Replication Controls</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Helicase Unwinding Speed:</span>
                  <span className="text-cyan-400 font-bold">{forkSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={forkSpeed}
                  onChange={(e) => setForkSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">dNTP Precursor Concentration:</span>
                  <span className="text-emerald-400 font-bold">{dntpConcentration} μM</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={dntpConcentration}
                  onChange={(e) => setDntpConcentration(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setLigaseActionTriggered(!ligaseActionTriggered)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border ${
                    ligaseActionTriggered
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {ligaseActionTriggered ? '✓ DNA Ligase Active (Phosphodiester sealed)' : '✕ Inhibit DNA Ligase (Nicks exposed)'}
                </button>

                <button
                  onClick={() => setProofreadingExo(!proofreadingExo)}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border ${
                    proofreadingExo
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {proofreadingExo ? '✓ 3\' ➔ 5\' Exonuclease Proofreading (1 error / 10⁹ bp)' : '✕ Proofreading Off (1 error / 10⁴ bp)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LAC OPERON GENE REGULATION (Manipulative) */}
      {/* ============================================================== */}
      {activeMode === 'lac-operon' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>JACOB &amp; MONOD OPERON: {isTranscribing ? 'TRANSCRIBING (ON)' : 'REPRESSED (OFF)'}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Operon Gene Track */}
                <rect x="40" y="90" width="40" height="30" fill="#64748b" rx="4" />
                <text x="60" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">i</text>

                <rect x="90" y="90" width="35" height="30" fill="#3b82f6" rx="4" />
                <text x="107" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">p</text>

                <rect x="135" y="90" width="35" height="30" fill="#f59e0b" rx="4" />
                <text x="152" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">o</text>

                <rect x="180" y="90" width="65" height="30" fill="#10b981" rx="4" />
                <text x="212" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacZ</text>

                <rect x="255" y="90" width="50" height="30" fill="#10b981" rx="4" />
                <text x="280" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacY</text>

                <rect x="315" y="90" width="50" height="30" fill="#10b981" rx="4" />
                <text x="340" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacA</text>

                {/* Repressor Protein Binding vs Inactivation */}
                {isRepressorActive ? (
                  <g>
                    {/* Active Repressor bound to Operator 'o' */}
                    <circle cx="152" cy="72" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="152" y="75" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Repressor</text>
                    <text x="210" y="48" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Operator Blocked: RNA Polymerase physically obstructed
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* Inactivated Repressor or Defective Mutant */}
                    <circle cx="152" cy="155" r="14" fill="#94a3b8" />
                    <circle cx="160" cy="150" r="5" fill="#facc15" />
                    <text x="152" y="180" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {operonGenotype === 'lacI-minus' ? 'Defective lacI Repressor' : 'Inactivated by Allolactose'}
                    </text>

                    {/* Transcribing RNA Polymerase moving across lacZYA */}
                    {(() => {
                      const polX = 180 + ((animTime * 60) % 180);
                      return (
                        <g>
                          <rect x={polX - 10} y="65" width="28" height="20" rx="4" fill="#8b5cf6" stroke="#ffffff" />
                          <text x={polX + 4} y="78" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">RNAP</text>
                          <line x1="180" y1="135" x2={polX} y2="135" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 2" />
                          <text x="210" y="148" fill="#f43f5e" fontSize="7" fontWeight="bold">Polycistronic mRNA</text>
                        </g>
                      );
                    })()}
                  </g>
                )}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Lactose: {lactosePresent ? 'PRESENT' : 'ABSENT'} | Glucose: {glucoseLevel.toUpperCase()} | Enzyme Yield: {betaGalactosidaseRate}%
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Transcription: {isTranscribing ? 'ACTIVE' : 'REPRESSED'}</span>
                <span className="text-cyan-400 font-bold">CAP-cAMP complex: {isCapCampActive ? 'Bound (High Yield)' : 'Unbound'}</span>
                <span className="text-amber-400 font-bold">Genotype: {operonGenotype}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Operon Manipulations</h4>

              <div>
                <button
                  onClick={() => setLactosePresent(!lactosePresent)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition border ${
                    lactosePresent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {lactosePresent ? '✓ Lactose (Inducer) Present' : '✕ Lactose Absent'}
                </button>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Glucose / Catabolite Repression:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setGlucoseLevel('low')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      glucoseLevel === 'low'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Low Glucose (cAMP High)
                  </button>
                  <button
                    onClick={() => setGlucoseLevel('high')}
                    className={`p-2 rounded-xl font-bold transition border ${
                      glucoseLevel === 'high'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    High Glucose (Repressed)
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Operon Genotype:</span>
                <div className="space-y-1 text-xs">
                  {[
                    { id: 'wild-type', name: 'Wild-Type (i⁺ p⁺ o⁺ z⁺)' },
                    { id: 'lacI-minus', name: 'lacI⁻ Mutant (Constitutive)' },
                    { id: 'lacOc', name: 'lacOᶜ Operator Mutant (Constitutive)' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setOperonGenotype(g.id as any)}
                      className={`w-full text-left p-1.5 rounded-lg border transition ${
                        operonGenotype === g.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. AGAROSE GEL ELECTROPHORESIS & RESTRICTION DIGESTION */}
      {/* ============================================================== */}
      {activeMode === 'gel-electrophoresis' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>SUBMARINE AGAROSE BED ({agarosePercent}% MATRIX) &amp; UV BANDS</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Gel Bed Chamber */}
                <rect x="50" y="30" width="320" height="160" rx="8" fill={uvLightOn ? '#172554' : '#1e293b'} stroke="#3b82f6" strokeWidth="2" />

                {/* Electrodes: Cathode (-) at top, Anode (+) at bottom */}
                <rect x="50" y="30" width="320" height="12" fill="#ef4444" fillOpacity="0.8" />
                <text x="210" y="39" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Cathode (-) [Negative Pole]</text>

                <rect x="50" y="178" width="320" height="12" fill="#10b981" fillOpacity="0.8" />
                <text x="210" y="187" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Anode (+) [Positive Pole]</text>

                {/* Sample Wells */}
                {[80, 150, 220, 290].map((wx, i) => (
                  <g key={i}>
                    <rect x={wx} y="48" width="28" height="10" rx="2" fill="#020617" stroke="#475569" />
                    <text x={wx + 14} y="45" fill="#94a3b8" fontSize="7" textAnchor="middle">
                      {i === 0 ? 'Ladder' : i === 1 ? 'EcoRI' : i === 2 ? 'HindIII' : 'Uncut'}
                    </text>
                  </g>
                ))}

                {/* DNA Migration Bands (Dynamic position based on runTime and voltage and agarose density) */}
                {uvLightOn && (() => {
                  const runProgress = (runTimeMinutes / 60) * (voltageV / 100) * (1.2 / agarosePercent);
                  return (
                    <g>
                      {/* Lane 1: Ladder */}
                      {[65, 85, 110, 135, 160].map((baseY, i) => {
                        const bandY = Math.min(170, 48 + (baseY - 48) * runProgress);
                        return (
                          <line key={`lad-${i}`} x1="82" y1={bandY} x2="106" y2={bandY} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                        );
                      })}

                      {/* Lane 2: EcoRI Digested Product */}
                      {[75, 140].map((baseY, i) => {
                        const bandY = Math.min(170, 48 + (baseY - 48) * runProgress);
                        return (
                          <line key={`s1-${i}`} x1="152" y1={bandY} x2="176" y2={bandY} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                        );
                      })}

                      {/* Lane 3: HindIII Product */}
                      {[95, 120, 150].map((baseY, i) => {
                        const bandY = Math.min(170, 48 + (baseY - 48) * runProgress);
                        return (
                          <line key={`s2-${i}`} x1="222" y1={bandY} x2="246" y2={bandY} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                        );
                      })}

                      {/* Lane 4: Uncut Circular Plasmid (Coiled) */}
                      {(() => {
                        const bandY = Math.min(170, 48 + (80 - 48) * runProgress);
                        return (
                          <line x1="292" y1={bandY} x2="316" y2={bandY} stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                        );
                      })()}
                    </g>
                  );
                })()}

                <text x="210" y="215" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Agarose Matrix {agarosePercent}% | Migration Time: {runTimeMinutes} min @ {voltageV} V
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Voltage: {voltageV} V</span>
                <span className="text-cyan-400 font-bold">Matrix: {agarosePercent}% Agarose</span>
                <span className="text-emerald-400 font-bold">Migration Time: {runTimeMinutes} min</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Electrophoresis Rig</h4>

              <div>
                <button
                  onClick={() => setUvLightOn(!uvLightOn)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition border ${
                    uvLightOn
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {uvLightOn ? '💡 UV Transilluminator ON' : 'Turn UV Light ON'}
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Run Duration (Time):</span>
                  <span className="text-amber-400 font-bold">{runTimeMinutes} min</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={runTimeMinutes}
                  onChange={(e) => setRunTimeMinutes(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Voltage:</span>
                  <span className="text-cyan-400 font-bold">{voltageV} V</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={voltageV}
                  onChange={(e) => setVoltageV(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Agarose Gel Concentration:</span>
                  <span className="text-emerald-400 font-bold">{agarosePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="2.0"
                  step="0.1"
                  value={agarosePercent}
                  onChange={(e) => setAgarosePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
