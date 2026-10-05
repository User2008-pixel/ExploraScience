import React, { useState, useEffect } from 'react';
import { Formula } from '../common/Formula';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Dna,
} from 'lucide-react';

interface DNAReplicationSimProps {
  replicationStep?: number;
  speed?: number;
}

const STAGES = [
  {
    step: 1,
    title: '1. Origin Recognition & Double Helix Relaxation',
    desc: 'DNA Topoisomerase (Gyrase) relieves supercoiling torque ahead of the replication fork, cutting and re-ligating phosphodiester backbones.',
    keyEnzyme: 'Topoisomerase / Gyrase',
  },
  {
    step: 2,
    title: '2. Unzipping by DNA Helicase & SSB Protein Stabilization',
    desc: 'Hexameric Helicase uses ATP hydrolysis to break hydrogen bonds between purines and pyrimidines. Single-Strand Binding Proteins (SSBs) prevent re-annealing and hairpin formation.',
    keyEnzyme: 'DNA Helicase & SSB Tetramers',
  },
  {
    step: 3,
    title: '3. RNA Priming by DNA Primase',
    desc: 'DNA Polymerase requires a pre-existing 3\'-OH group. RNA Primase synthesizes short (~10 nucleotide) RNA primers complementary to single-strand templates.',
    keyEnzyme: 'RNA Primase',
  },
  {
    step: 4,
    title: '4. Elongation: Leading (Continuous) & Lagging (Okazaki Fragments)',
    desc: 'DNA Polymerase III synthesizes strictly 5\' → 3\'. Leading strand proceeds continuously toward the fork; lagging strand forms discontinuous Okazaki fragments moving away from the fork.',
    keyEnzyme: 'DNA Polymerase III Holoenzyme',
  },
  {
    step: 5,
    title: '5. Primer Replacement & DNA Ligase Phosphodiester Sealing',
    desc: 'DNA Polymerase I uses its 5\' → 3\' exonuclease to degrade RNA primers and replace them with dNTPs. DNA Ligase couples NAD⁺/ATP hydrolysis to seal nicks with covalent phosphodiester bonds.',
    keyEnzyme: 'DNA Polymerase I & DNA Ligase',
  },
];

export const DNAReplicationSim: React.FC<DNAReplicationSimProps> = ({
  replicationStep: initialStep = 1,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(initialStep || 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [forkSpeed, setForkSpeed] = useState<number>(2); // 1 to 5x
  const [dntpLevel, setDntpLevel] = useState<number>(50); // 10 to 100 uM
  const [proofreadingActive, setProofreadingActive] = useState<boolean>(true);
  const [bpSynthesized, setBpSynthesized] = useState<number>(140);
  const [mismatchDetected, setMismatchDetected] = useState<boolean>(false);

  const activeStageInfo = STAGES[currentStage - 1] || STAGES[0];

  // Auto-play timer through stages
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 5) {
          setIsPlaying(false);
          return 5;
        }
        return prev + 1;
      });
      setBpSynthesized((prev) => prev + Math.round(dntpLevel * forkSpeed * 0.8));
    }, 3200 / forkSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, forkSpeed, dntpLevel]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas Representation */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="font-semibold text-slate-200 text-sm">{activeStageInfo.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2.5 py-1 rounded-full font-mono">
              Enzyme: <span className="font-bold">{activeStageInfo.keyEnzyme}</span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title={isPlaying ? 'Pause' : 'Play Auto-Advance'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setCurrentStage(1);
                setIsPlaying(false);
                setBpSynthesized(140);
                setMismatchDetected(false);
              }}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Replication Fork Schematic SVG */}
        <div className="relative w-full h-64 sm:h-72 bg-[#090e17] rounded-xl border border-slate-800/80 flex items-center justify-center p-4 overflow-hidden">
          <svg viewBox="0 0 700 280" className="w-full h-full select-none">
            <defs>
              <linearGradient id="parentStrand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="newStrand" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stage 1: Closed double helix on right */}
            <g className="transition-all duration-700">
              <path
                d="M 450,140 Q 520,100 580,140 T 700,140"
                fill="none"
                stroke="url(#parentStrand)"
                strokeWidth="4"
              />
              <path
                d="M 450,140 Q 520,180 580,140 T 700,140"
                fill="none"
                stroke="url(#parentStrand)"
                strokeWidth="4"
              />
              {[470, 500, 530, 560, 590, 620, 650, 680].map((bx, i) => (
                <line
                  key={i}
                  x1={bx}
                  y1={130 + Math.sin(i) * 12}
                  x2={bx}
                  y2={150 - Math.sin(i) * 12}
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="2,2"
                />
              ))}
            </g>

            {/* Replication Fork Split: Upper (Leading Template) & Lower (Lagging Template) */}
            <g className="transition-all duration-700">
              <path
                d={currentStage >= 2 ? 'M 50,50 L 300,50 Q 380,50 450,140' : 'M 50,120 L 450,140'}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
              />
              <text x="50" y="38" fill="#38bdf8" fontSize="12" fontWeight="bold">
                3&apos;
              </text>
              <text x="680" y="125" fill="#38bdf8" fontSize="12" fontWeight="bold">
                5&apos;
              </text>

              <path
                d={currentStage >= 2 ? 'M 50,230 L 300,230 Q 380,230 450,140' : 'M 50,160 L 450,140'}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
              />
              <text x="50" y="250" fill="#38bdf8" fontSize="12" fontWeight="bold">
                5&apos;
              </text>
              <text x="680" y="165" fill="#38bdf8" fontSize="12" fontWeight="bold">
                3&apos;
              </text>
            </g>

            {/* Helicase Enzyme Wedge */}
            {currentStage >= 2 && (
              <g transform="translate(425, 115)" filter="url(#glow)">
                <polygon points="0,0 45,25 0,50" fill="#10b981" stroke="#059669" strokeWidth="2" />
                <text x="8" y="30" fill="#ffffff" fontSize="10" fontWeight="bold">
                  Helicase
                </text>
              </g>
            )}

            {/* Topoisomerase */}
            {currentStage >= 1 && (
              <g transform="translate(560, 115)">
                <circle cx="20" cy="25" r="22" fill="#8b5cf6" fillOpacity="0.85" stroke="#7c3aed" strokeWidth="2" />
                <text x="3" y="28" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Gyrase
                </text>
              </g>
            )}

            {/* Single Strand Binding Proteins (SSBs) */}
            {currentStage >= 2 && (
              <g>
                {[120, 160, 200, 240, 280, 320].map((pos) => (
                  <React.Fragment key={pos}>
                    <circle cx={pos} cy={42} r="6" fill="#f43f5e" />
                    <circle cx={pos} cy={238} r="6" fill="#f43f5e" />
                  </React.Fragment>
                ))}
              </g>
            )}

            {/* Stage 3: RNA Primers */}
            {currentStage >= 3 && (
              <g>
                <rect x="70" y="58" width="45" height="8" rx="3" fill="#ec4899" />
                <text x="75" y="78" fill="#ec4899" fontSize="9" fontWeight="bold">
                  RNA Primer
                </text>

                <rect x="230" y="214" width="35" height="8" rx="3" fill="#ec4899" />
                <rect x="130" y="214" width="35" height="8" rx="3" fill="#ec4899" />
              </g>
            )}

            {/* Stage 4: DNA Polymerase & Synthesis */}
            {currentStage >= 4 && (
              <g>
                <path
                  d="M 115,62 L 390,62"
                  fill="none"
                  stroke="url(#newStrand)"
                  strokeWidth="5"
                  strokeDasharray="4,2"
                />
                <circle cx="395" cy="62" r="16" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                <text x="382" y="66" fill="#000" fontSize="9" fontWeight="bold">
                  Pol III
                </text>
                <polygon points="415,62 405,57 405,67" fill="#f59e0b" />
                <text x="210" y="80" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  Leading Strand (5&apos; → 3&apos; Continuous)
                </text>

                <path d="M 230,218 L 175,218" fill="none" stroke="url(#newStrand)" strokeWidth="5" />
                <polygon points="170,218 180,213 180,223" fill="#f59e0b" />

                <path d="M 130,218 L 75,218" fill="none" stroke="url(#newStrand)" strokeWidth="5" />
                <polygon points="70,218 80,213 80,223" fill="#f59e0b" />

                <circle cx="275" cy="218" r="15" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                <text x="263" y="222" fill="#000" fontSize="9" fontWeight="bold">
                  Pol III
                </text>
                <text x="140" y="205" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  Okazaki Fragment #2
                </text>
                <text x="40" y="205" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  Okazaki Fragment #1
                </text>
              </g>
            )}

            {/* Stage 5: DNA Ligase Sealing Nicks */}
            {currentStage === 5 && (
              <g transform="translate(160, 205)" filter="url(#glow)">
                <rect x="0" y="0" width="36" height="26" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
                <text x="6" y="17" fill="#ffffff" fontSize="9" fontWeight="bold">
                  Ligase
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Stepper Timeline Navigation */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STAGES.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStage(s.step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  currentStage === s.step
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span>Step {s.step}</span>
                {currentStage > s.step && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
              disabled={currentStage <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStage(Math.min(5, currentStage + 1))}
              disabled={currentStage >= 5}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-xs font-semibold text-slate-950 transition"
            >
              <span>Next Stage</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          {activeStageInfo.desc}
        </p>
      </div>

      {/* Direct Manipulation Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Replication Machinery Sliders & Perturbations
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
            Elongation Rate: ~{forkSpeed * 500} nt/sec
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Replication Fork Speed:</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{forkSpeed}x Speed</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={forkSpeed}
              onChange={(e) => setForkSpeed(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1x (In Vivo Basal)</span>
              <span>3x</span>
              <span>5x (High Processivity)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Free dNTP Pool Concentration:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{dntpLevel} μM</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={dntpLevel}
              onChange={(e) => setDntpLevel(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 μM (Depleted)</span>
              <span>50 μM (Physiological)</span>
              <span>100 μM (Saturated)</span>
            </div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMismatchDetected(true);
                setTimeout(() => setMismatchDetected(false), 2500);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Mismatched Base (3&apos;→5&apos; Exonuclease)</span>
            </button>
            <button
              onClick={() => {
                setBpSynthesized((prev) => prev + 500);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Synthesize 500 bp Burst</span>
            </button>
          </div>

          {mismatchDetected && (
            <span className="text-xs text-rose-400 font-bold animate-pulse">
              ⚡ ε-subunit 3&apos;→5&apos; Exonuclease excised incorrect base pair!
            </span>
          )}
        </div>
      </div>

      {/* Directionality & Thermodynamics Cards */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Molecular Directionality & Energetics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Phosphodiester Bond Synthesis</div>
            <Formula tex="3'\text{-OH} + \text{dNTP} \xrightarrow{\text{DNA Pol III}} \text{DNA}_{n+1} + \text{PP}_i \xrightarrow{\text{Pyrophosphatase}} 2\text{P}_i" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Strict Enzymatic Directionality</div>
            <Formula tex="\text{Template: } 3' \to 5' \implies \text{New Strand: } 5' \to 3' \quad (\text{Okazaki synthesis on lagging})" />
          </div>
        </div>
      </div>
    </div>
  );
};
