import React, { useState } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2 } from 'lucide-react';

interface DNAReplicationSimProps {
  replicationStep: number;
  speed: number;
}

const STAGES = [
  {
    step: 1,
    title: '1. Origin Recognition & Double Helix Relaxation',
    desc: 'Topoisomerase (Gyrase) relieves supercoiling tension ahead of the replication fork to prevent severe torsional strain.',
    keyEnzyme: 'Topoisomerase / Gyrase',
  },
  {
    step: 2,
    title: '2. Unzipping by DNA Helicase & SSB Binding',
    desc: 'Helicase breaks hydrogen bonds between complementary base pairs (A=T, G≡C). Single-Strand Binding Proteins (SSBs) coat template strands to prevent re-annealing.',
    keyEnzyme: 'DNA Helicase & SSB Proteins',
  },
  {
    step: 3,
    title: '3. RNA Priming by Primase',
    desc: 'DNA Polymerase cannot start de novo without a free 3\'-OH group. RNA Primase synthesizes short complementary RNA primers (~10 nt) to provide starting points.',
    keyEnzyme: 'RNA Primase',
  },
  {
    step: 4,
    title: '4. Elongation: Leading & Lagging Strands',
    desc: 'DNA Polymerase III synthesizes continuously 5\' → 3\' on the Leading Strand toward the fork. On the Lagging Strand, it synthesizes discontinuous Okazaki fragments moving away from the fork.',
    keyEnzyme: 'DNA Polymerase III',
  },
  {
    step: 5,
    title: '5. Primer Replacement & DNA Ligase Sealing',
    desc: 'DNA Polymerase I removes RNA primers with 5\' → 3\' exonuclease activity and fills with DNA nucleotides. DNA Ligase catalyzes phosphodiester bonds to seal nicks.',
    keyEnzyme: 'DNA Polymerase I & DNA Ligase',
  },
];

export const DNAReplicationSim: React.FC<DNAReplicationSimProps> = ({
  replicationStep: initialStep,
}) => {
  const [currentStage, setCurrentStage] = useState(initialStep || 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeStageInfo = STAGES[currentStage - 1] || STAGES[0];

  return (
    <div className="space-y-4">
      {/* Visual Canvas Representation */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="font-semibold text-slate-200 text-sm">{activeStageInfo.title}</h3>
          </div>
          <div className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2.5 py-1 rounded-full font-mono">
            Active Enzyme: <span className="font-bold">{activeStageInfo.keyEnzyme}</span>
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
              {/* Unopened Double Helix */}
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
              {/* Base pairs ladder in closed helix */}
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
              {/* Leading Template Strand (3' -> 5') */}
              <path
                d={currentStage >= 2 ? "M 50,50 L 300,50 Q 380,50 450,140" : "M 50,120 L 450,140"}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
              />
              <text x="50" y="38" fill="#38bdf8" fontSize="12" fontWeight="bold">3'</text>
              <text x="680" y="125" fill="#38bdf8" fontSize="12" fontWeight="bold">5'</text>

              {/* Lagging Template Strand (5' -> 3') */}
              <path
                d={currentStage >= 2 ? "M 50,230 L 300,230 Q 380,230 450,140" : "M 50,160 L 450,140"}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
              />
              <text x="50" y="250" fill="#38bdf8" fontSize="12" fontWeight="bold">5'</text>
              <text x="680" y="165" fill="#38bdf8" fontSize="12" fontWeight="bold">3'</text>
            </g>

            {/* Helicase Enzyme Wedge at the fork vertex */}
            {currentStage >= 2 && (
              <g transform="translate(425, 115)" filter="url(#glow)">
                <polygon points="0,0 45,25 0,50" fill="#10b981" stroke="#059669" strokeWidth="2" />
                <text x="8" y="30" fill="#ffffff" fontSize="10" fontWeight="bold">Helicase</text>
              </g>
            )}

            {/* Topoisomerase ahead of fork */}
            {currentStage >= 1 && (
              <g transform="translate(560, 115)">
                <circle cx="20" cy="25" r="22" fill="#8b5cf6" fillOpacity="0.85" stroke="#7c3aed" strokeWidth="2" />
                <text x="3" y="28" fill="#ffffff" fontSize="9" fontWeight="bold">Gyrase</text>
              </g>
            )}

            {/* Single Strand Binding Proteins (SSBs) coating open strands */}
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

            {/* Stage 3: RNA Primers added */}
            {currentStage >= 3 && (
              <g>
                {/* Primer on leading strand */}
                <rect x="70" y="58" width="45" height="8" rx="3" fill="#ec4899" />
                <text x="75" y="78" fill="#ec4899" fontSize="9" fontWeight="bold">Primer</text>

                {/* RNA Primers on lagging strand */}
                <rect x="230" y="214" width="35" height="8" rx="3" fill="#ec4899" />
                <rect x="130" y="214" width="35" height="8" rx="3" fill="#ec4899" />
              </g>
            )}

            {/* Stage 4: DNA Polymerase & Synthesis */}
            {currentStage >= 4 && (
              <g>
                {/* Continuous Leading Strand (5' -> 3') */}
                <path
                  d="M 115,62 L 390,62"
                  fill="none"
                  stroke="url(#newStrand)"
                  strokeWidth="5"
                  strokeDasharray="4,2"
                />
                {/* Polymerase III Leading */}
                <circle cx="395" cy="62" r="16" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                <text x="382" y="66" fill="#000" fontSize="9" fontWeight="bold">Pol III</text>
                {/* Arrow pointing toward fork */}
                <polygon points="415,62 405,57 405,67" fill="#f59e0b" />
                <text x="210" y="80" fill="#f59e0b" fontSize="11" fontWeight="bold">Leading Strand (Continuous 5' → 3')</text>

                {/* Discontinuous Okazaki Fragments on Lagging Strand */}
                <path d="M 230,218 L 175,218" fill="none" stroke="url(#newStrand)" strokeWidth="5" />
                <polygon points="170,218 180,213 180,223" fill="#f59e0b" />

                <path d="M 130,218 L 75,218" fill="none" stroke="url(#newStrand)" strokeWidth="5" />
                <polygon points="70,218 80,213 80,223" fill="#f59e0b" />

                {/* Polymerase on Lagging */}
                <circle cx="275" cy="218" r="15" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
                <text x="263" y="222" fill="#000" fontSize="9" fontWeight="bold">Pol III</text>
                <text x="140" y="205" fill="#f59e0b" fontSize="11" fontWeight="bold">Okazaki Fragment #2</text>
                <text x="40" y="205" fill="#f59e0b" fontSize="11" fontWeight="bold">Okazaki Fragment #1</text>
              </g>
            )}

            {/* Stage 5: DNA Ligase Sealing Nicks */}
            {currentStage === 5 && (
              <g transform="translate(160, 205)">
                <rect x="0" y="0" width="30" height="24" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
                <text x="4" y="16" fill="#ffffff" fontSize="9" fontWeight="bold">Ligase</text>
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

      {/* Directionality & Thermodynamics Cards */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Molecular Directionality & Energetics</h4>
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
