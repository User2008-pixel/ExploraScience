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
  // MODE 1: MENSTRUAL CYCLE & HORMONES
  // ----------------------------------------------------------------------
  const [cycleDay, setCycleDay] = useState<number>(variables.cycleDay ?? 14);

  // ----------------------------------------------------------------------
  // MODE 2: DNA REPLICATION FORK ARCHITECTURE
  // ----------------------------------------------------------------------
  const [replicationSpeed, setReplicationSpeed] = useState<number>(1);

  // ----------------------------------------------------------------------
  // MODE 3: LAC OPERON GENE REGULATION
  // ----------------------------------------------------------------------
  const [lactosePresent, setLactosePresent] = useState<boolean>(true);

  // ----------------------------------------------------------------------
  // MODE 4: GEL ELECTROPHORESIS
  // ----------------------------------------------------------------------
  const [voltageV, setVoltageV] = useState<number>(100);
  const [uvLightOn, setUvLightOn] = useState<boolean>(true);

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
              Live synchronized menstrual hormone tracks, DNA replication fork unwinding, Lac Operon induction & Agarose electrophoresis
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-pink-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
                <span>28-DAY SYNCHRONIZED OVARIAN &amp; UTERINE HORMONAL DYNAMICS</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* 28 Day Timeline Grid */}
                <line x1="50" y1="180" x2="360" y2="180" stroke="#334155" strokeWidth="1.5" />
                {[1, 5, 14, 21, 28].map((d) => {
                  const x = 50 + ((d - 1) / 27) * 310;
                  return (
                    <g key={d}>
                      <line x1={x} y1="175" x2={x} y2="185" stroke="#64748b" />
                      <text x={x} y="196" fill="#94a3b8" fontSize="8" textAnchor="middle">Day {d}</text>
                    </g>
                  );
                })}

                {/* LH Surge curve (peaks sharply at Day 14) */}
                <path
                  d="M 50,140 Q 150,140 190,130 Q 205,40 220,130 Q 260,140 360,140"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
                <text x="210" y="35" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">LH Surge (Ovulation)</text>

                {/* Estrogen Curve (peaks prior to ovulation) */}
                <path
                  d="M 50,150 Q 140,150 180,80 Q 210,140 270,110 Q 330,160 360,165"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Progesterone Curve (peaks in luteal phase, Day 21) */}
                <path
                  d="M 50,165 L 190,165 Q 260,75 330,165 L 360,165"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2"
                />
                <text x="265" y="70" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">Progesterone Peak</text>

                {/* Current Day Cursor Marker */}
                {(() => {
                  const cx = 50 + ((cycleDay - 1) / 27) * 310;
                  return (
                    <g>
                      <line x1={cx} y1="30" x2={cx} y2="180" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx={cx} cy="180" r="5" fill="#ec4899" className="animate-pulse" />
                      <text x={cx} y="25" fill="#ec4899" fontSize="8" fontWeight="bold" textAnchor="middle">
                        Day {cycleDay}
                      </text>
                    </g>
                  );
                })()}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {cycleDay <= 5 ? 'Menstrual Phase: Endometrium sheds' : cycleDay < 14 ? 'Follicular / Proliferative: Estrogen stimulates lining' : cycleDay === 14 ? 'Ovulation: Graafian follicle ruptures' : 'Luteal / Secretory Phase: Corpus luteum secretes progesterone'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-pink-400 font-bold">Selected Day: {cycleDay}</span>
                <span className="text-cyan-400 font-bold">Primary Hormone: {cycleDay === 14 ? 'LH Peak' : cycleDay > 14 ? 'Progesterone' : 'Estrogen & FSH'}</span>
                <span className="text-amber-400 font-bold">Endometrium: {cycleDay <= 5 ? 'Shedding' : 'Vascularized'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-pink-400 font-mono text-sm uppercase">Cycle Timeline Scrubber</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Day in 28-day cycle:</span>
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
                <button onClick={() => setCycleDay(3)} className="p-1.5 rounded-lg bg-slate-950 text-rose-300 border border-slate-800 hover:bg-slate-800">Menstruation (Day 3)</button>
                <button onClick={() => setCycleDay(10)} className="p-1.5 rounded-lg bg-slate-950 text-cyan-300 border border-slate-800 hover:bg-slate-800">Proliferative (Day 10)</button>
                <button onClick={() => setCycleDay(14)} className="p-1.5 rounded-lg bg-slate-950 text-pink-300 border border-slate-800 hover:bg-slate-800">Ovulation (Day 14)</button>
                <button onClick={() => setCycleDay(21)} className="p-1.5 rounded-lg bg-slate-950 text-amber-300 border border-slate-800 hover:bg-slate-800">Secretory (Day 21)</button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-pink-400">NCERT LH Surge Insight:</div>
                <p>
                  Rapid secretion of LH leading to its maximum level during the mid-cycle induces rupture of the mature Graafian follicle, thereby releasing the ovum (ovulation).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DNA REPLICATION FORK ARCHITECTURE */}
      {/* ============================================================== */}
      {activeMode === 'dna-replication-fork' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>SEMI-CONSERVATIVE REPLICATION FORK &amp; OKAZAKI FRAGMENTS</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Unwound DNA Y-Fork */}
                {/* Parental Double Helix on Right */}
                <line x1="280" y1="110" x2="380" y2="110" stroke="#38bdf8" strokeWidth="4" />

                {/* Helicase Enzyme unwinding at fork junction */}
                <polygon points="260,95 290,110 260,125" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                <text x="270" y="113" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Helicase</text>

                {/* Top Leading Strand (Continuous 5' to 3') */}
                <path d="M 270,110 L 160,60 L 50,60" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* Synthesized new leading strand */}
                <path d="M 250,105 L 160,70 L 80,70" fill="none" stroke="#4ade80" strokeWidth="2.5" />
                <text x="80" y="50" fill="#38bdf8" fontSize="8" fontWeight="bold">Leading Strand (Continuous)</text>

                {/* Bottom Lagging Strand (Discontinuous Okazaki fragments) */}
                <path d="M 270,110 L 160,160 L 50,160" fill="none" stroke="#38bdf8" strokeWidth="3" />
                {/* Okazaki Fragments with RNA Primers */}
                <line x1="80" y1="150" x2="110" y2="150" stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="110" y1="150" x2="160" y2="150" stroke="#4ade80" strokeWidth="2.5" />
                <line x1="180" y1="140" x2="200" y2="135" stroke="#f43f5e" strokeWidth="2.5" />
                <line x1="200" y1="135" x2="240" y2="120" stroke="#4ade80" strokeWidth="2.5" />
                <text x="80" y="180" fill="#f43f5e" fontSize="8" fontWeight="bold">Lagging Strand (Okazaki + RNA Primer)</text>

                {/* Moving DNA Polymerase Engine */}
                {(() => {
                  const pX = 140 + Math.sin(animTime * 3) * 20;
                  return (
                    <circle cx={pX} cy="65" r="7" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1" />
                  );
                })()}

                <text x="200" y="208" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  DNA Polymerase III synthesizes strictly 5' ➔ 3' direction | Ligase seals nicks
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Template: Semi-conservative</span>
                <span className="text-emerald-400 font-bold">Leading: Continuous</span>
                <span className="text-rose-400 font-bold">Lagging: DNA Ligase joins fragments</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Replication Machinery</h4>

              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-amber-300">Helicase:</div>
                  <div className="text-slate-400 text-[11px]">Unzips double helix breaking H-bonds.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-purple-300">DNA Polymerase:</div>
                  <div className="text-slate-400 text-[11px]">Adds dNTPs with proofreading capability.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-300">DNA Ligase:</div>
                  <div className="text-slate-400 text-[11px]">Catalyzes phosphodiester bond between Okazaki segments.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. LAC OPERON GENE REGULATION */}
      {/* ============================================================== */}
      {activeMode === 'lac-operon' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>JACOB &amp; MONOD LAC OPERON INDUCTION MECHANISM</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Operon Gene Track */}
                <rect x="40" y="90" width="40" height="30" fill="#64748b" rx="4" />
                <text x="60" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">i</text>

                <rect x="90" y="90" width="35" height="30" fill="#3b82f6" rx="4" />
                <text x="107" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">p</text>

                <rect x="135" y="90" width="35" height="30" fill="#f59e0b" rx="4" />
                <text x="152" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">o</text>

                <rect x="180" y="90" width="60" height="30" fill="#10b981" rx="4" />
                <text x="210" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacZ</text>

                <rect x="250" y="90" width="45" height="30" fill="#10b981" rx="4" />
                <text x="272" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacY</text>

                <rect x="305" y="90" width="45" height="30" fill="#10b981" rx="4" />
                <text x="327" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">lacA</text>

                {/* Repressor Protein */}
                {!lactosePresent ? (
                  <g>
                    {/* Active Repressor bound to Operator 'o' */}
                    <circle cx="152" cy="75" r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="152" y="78" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">Repressor</text>
                    <text x="200" y="50" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Operator Blocked: RNA Polymerase cannot transcribe
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* Inactivated Repressor with Inducer (Lactose) bound */}
                    <circle cx="152" cy="150" r="14" fill="#94a3b8" />
                    <circle cx="160" cy="145" r="5" fill="#facc15" />
                    <text x="152" y="175" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Inactivated by Inducer (Allolactose)
                    </text>

                    {/* Transcribing RNA Polymerase moving across lacZYA */}
                    {(() => {
                      const polX = 180 + ((animTime * 60) % 170);
                      return (
                        <g>
                          <rect x={polX - 10} y="65" width="28" height="20" rx="4" fill="#8b5cf6" stroke="#ffffff" />
                          <text x={polX + 4} y="78" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">RNAP</text>
                          {/* Polycistronic mRNA line */}
                          <line x1="180" y1="135" x2={polX} y2="135" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 2" />
                        </g>
                      );
                    })()}
                  </g>
                )}

                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {lactosePresent ? 'Lactose Present (Induced): β-galactosidase, Permease, Transacetylase synthesized' : 'Lactose Absent (Repressed): Operon switched OFF (Energy conserved)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Inducer: {lactosePresent ? 'Lactose Present' : 'Absent'}</span>
                <span className="text-cyan-400 font-bold">Transcription: {lactosePresent ? 'ACTIVE (ON)' : 'REPRESSED (OFF)'}</span>
                <span className="text-amber-400 font-bold">Control: Negative Regulation</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Inducer Switch</h4>

              <div>
                <button
                  onClick={() => setLactosePresent(!lactosePresent)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition border ${
                    lactosePresent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {lactosePresent ? '✓ Lactose (Inducer) Added: Operon ON' : '✕ Lactose Absent: Operon OFF'}
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">Structural Genes:</div>
                <div className="space-y-1 text-slate-400">
                  <p><strong>lacZ:</strong> Beta-galactosidase (hydrolyzes lactose into glucose + galactose)</p>
                  <p><strong>lacY:</strong> Permease (increases membrane permeability to lactose)</p>
                  <p><strong>lacA:</strong> Transacetylase</p>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>SUBMARINE AGAROSE GEL BED &amp; UV TRANSILLUMINATOR BANDS</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Gel Bed Chamber */}
                <rect x="60" y="30" width="280" height="150" rx="8" fill={uvLightOn ? '#172554' : '#1e293b'} stroke="#3b82f6" strokeWidth="2" />

                {/* Electrodes: Cathode (-) at top, Anode (+) at bottom */}
                <rect x="60" y="30" width="280" height="12" fill="#ef4444" fillOpacity="0.8" />
                <text x="200" y="40" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Cathode (-) [Negative Pole]</text>

                <rect x="60" y="168" width="280" height="12" fill="#10b981" fillOpacity="0.8" />
                <text x="200" y="177" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Anode (+) [Positive Pole]</text>

                {/* Sample Wells */}
                {[90, 150, 210, 270].map((wx, i) => (
                  <rect key={i} x={wx} y="48" width="24" height="10" rx="2" fill="#020617" stroke="#475569" />
                ))}

                {/* DNA Migration Bands (Fluorescent orange under UV) */}
                {uvLightOn && (
                  <g>
                    {/* Lane 1: DNA Ladder (10kb, 6kb, 3kb, 1kb, 0.5kb) */}
                    {[65, 85, 110, 135, 155].map((by, i) => (
                      <line key={`lad-${i}`} x1="92" y1={by} x2="112" y2={by} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                    ))}

                    {/* Lane 2: EcoRI Digested Product */}
                    {[75, 140].map((by, i) => (
                      <line key={`s1-${i}`} x1="152" y1={by} x2="172" y2={by} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                    ))}

                    {/* Lane 3: HindIII Product */}
                    {[95, 120, 150].map((by, i) => (
                      <line key={`s2-${i}`} x1="212" y1={by} x2="232" y2={by} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                    ))}

                    {/* Lane 4: Uncut Circular Plasmid */}
                    <line x1="272" y1="80" x2="292" y2="80" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                  </g>
                )}

                <text x="200" y="205" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Sieving Effect: Smaller DNA fragments travel faster through agarose matrix towards Anode (+)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold">Voltage: {voltageV} V</span>
                <span className="text-cyan-400 font-bold">Dye: Ethidium Bromide (EtBr)</span>
                <span className="text-emerald-400 font-bold">Matrix: 1.0% Agarose</span>
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
                  <span className="text-slate-300">Run Voltage:</span>
                  <span className="text-amber-400 font-bold">{voltageV} V</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={voltageV}
                  onChange={(e) => setVoltageV(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-amber-400">NCERT Principle:</div>
                <p>
                  DNA fragments are negatively charged due to phosphate backbone (PO₄³⁻). Under electric field, they migrate towards the positive anode (+), separated strictly according to size via agarose sieving.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
