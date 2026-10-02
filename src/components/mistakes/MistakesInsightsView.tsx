import React, { useState } from 'react';
import { MistakeRecord, MistakeCategory } from '../../types/science';
import {
  AlertTriangle,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Coins,
  RefreshCw,
  X,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MistakesInsightsViewProps {
  mistakesHistory: MistakeRecord[];
  onResolveMisconception?: (mistakeId: string, earnedCredits: number) => void;
  onEarnCredits?: (amount: number, reason: string) => void;
}

const CATEGORY_LABELS: Record<MistakeCategory, { label: string; desc: string }> = {
  conceptual_misunderstanding: {
    label: 'Conceptual Misunderstanding',
    desc: 'Confusing fundamental definitions or scientific principles (e.g., heat vs temperature).',
  },
  incorrect_prediction: {
    label: 'Incorrect Prediction Intuition',
    desc: 'Applying common-sense everyday biases rather than rigorous theoretical laws.',
  },
  incorrect_variable_identification: {
    label: 'Variable Identification Error',
    desc: 'Misidentifying which physical parameter caused an observed effect.',
  },
  experimental_design_error: {
    label: 'Experimental Design Error',
    desc: 'Failing to isolate variables (changing more than one parameter at once).',
  },
  graph_interpretation_error: {
    label: 'Graph Interpretation Error',
    desc: 'Misjudging slopes, asymptotes, or non-linear curves in empirical data.',
  },
  mathematical_error: {
    label: 'Mathematical Formulation Error',
    desc: 'Calculation mistakes or inverse proportionality inversions.',
  },
  reasoning_error: {
    label: 'Logical Reasoning Error',
    desc: 'Drawing ungrounded conclusions that exceed empirical measurement boundaries.',
  },
  careless_error: {
    label: 'Trial Sufficiency & Careless Error',
    desc: 'Concluding prematurely with too few measurement trials.',
  },
};

interface DiagnosticChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface DiagnosticChallenge {
  title: string;
  question: string;
  context: string;
  choices: DiagnosticChoice[];
  correctExplanation: string;
}

const CATEGORY_CHALLENGES: Record<MistakeCategory, DiagnosticChallenge> = {
  conceptual_misunderstanding: {
    title: 'Heat Transfer vs Static Temperature',
    question: 'Why do two objects at the exact same ambient temperature (e.g., 20°C steel spoon vs wooden spoon) feel vastly different to human touch?',
    context: 'Human skin thermoreceptors detect heat transfer rate (heat flux dQ/dt), not static temperature.',
    choices: [
      {
        id: 'c1',
        text: 'Steel has a higher thermal conductivity (k), conducting thermal energy away from warm skin 100× faster than wood.',
        isCorrect: true,
        explanation: "Correct! By Fourier's Law (dQ/dt = -k A ΔT/Δx), steel's high thermal conductivity drains heat rapidly from 34°C fingertips, triggering rapid cooling nerve impulses.",
      },
      {
        id: 'c2',
        text: 'Steel naturally stays 5 to 10 degrees colder than the air in the room.',
        isCorrect: false,
        explanation: 'Misconception: By the Zeroth Law of Thermodynamics, all objects left in a room reach identical thermal equilibrium temperature with ambient air.',
      },
      {
        id: 'c3',
        text: 'Steel contains negative heat particles that repel skin temperature.',
        isCorrect: false,
        explanation: 'Misconception: Heat is not a fluid or material substance; it is thermal kinetic energy in transit between thermal reservoirs.',
      },
    ],
    correctExplanation: "By Fourier's Law of Thermal Conduction, human thermal receptors perceive the instantaneous rate of heat transfer (heat flux), which depends strictly on the material's thermal conductivity k, rather than static thermal equilibrium temperature.",
  },
  incorrect_prediction: {
    title: 'Inertia & Newton’s First Law of Motion',
    question: 'When a coin rests on a cardboard square placed over an open glass and the card is rapidly flicked horizontally with a finger, what is the true physical reason the coin falls into the glass?',
    context: 'Newton’s First Law describes the inertia of mass at rest.',
    choices: [
      {
        id: 'c1',
        text: 'Flicking the card creates a low-pressure vacuum pocket underneath that actively suctions the coin downwards.',
        isCorrect: false,
        explanation: 'Misconception: Atmospheric suction does not pull downward; downward motion is strictly caused by the unbalanced gravitational force (W = mg).',
      },
      {
        id: 'c2',
        text: 'Due to inertia of rest, the coin resists horizontal acceleration during the millisecond flick, and gravity immediately pulls it into the glass.',
        isCorrect: true,
        explanation: "Correct! The frictional force between smooth card and coin acts over too brief a time impulse (Δt ≈ 0) to accelerate the coin horizontally. Once support is gone, gravity pulls it downward.",
      },
      {
        id: 'c3',
        text: 'The card pushes air upward which deflects off the ceiling and drives the coin downward.',
        isCorrect: false,
        explanation: 'Misconception: Air circulation has negligible influence on the coin; inertia of rest is the primary governing principle.',
      },
    ],
    correctExplanation: "According to Newton's First Law of Motion, an object at rest remains at rest unless acted upon by an external unbalanced force. The quick impulse flick removes the supporting surface before friction can overcome the coin's inertia.",
  },
  incorrect_variable_identification: {
    title: 'Root Cause Variable Isolation',
    question: 'When identifying why an observed anomalous effect occurred in a controlled experiment, which rule must be followed to avoid confounding errors?',
    context: 'Scientific fair tests require identifying the single independent variable responsible for the measured effect.',
    choices: [
      {
        id: 'c1',
        text: 'Identify and vary the single root parameter that truly changed between tests, while verifying all other variables remain strictly controlled.',
        isCorrect: true,
        explanation: 'Correct! Isolating the true physical parameter ensures a direct causal link can be established without confounding factors.',
      },
      {
        id: 'c2',
        text: 'Pick whichever variable appears easiest to manipulate on the lab bench, regardless of whether it remained constant.',
        isCorrect: false,
        explanation: 'Misconception: If a parameter remained constant throughout both trials (e.g., room temperature), it cannot physically be the cause of the discrepancy.',
      },
      {
        id: 'c3',
        text: 'Assume that both temperature, friction, and mass all changed simultaneously.',
        isCorrect: false,
        explanation: 'Misconception: Assuming multiple uncontrolled variables without empirical verification invalidates scientific analysis.',
      },
    ],
    correctExplanation: 'A scientific investigation requires identifying the root physical parameter that distinguishes the conditions. Variables that remained constant or balanced cannot account for the observed difference.',
  },
  experimental_design_error: {
    title: 'Fair Testing & Single Variable Control',
    question: 'A student tests whether parachute canopy surface area affects descent velocity. Why is it an experimental error to drop a small nylon parachute and a large heavy canvas parachute together?',
    context: 'Controlled experiments require holding all confounding parameters constant.',
    choices: [
      {
        id: 'c1',
        text: 'Canopy area and total suspended weight were changed simultaneously, making it impossible to determine which variable caused the speed difference.',
        isCorrect: true,
        explanation: 'Correct! By changing both material weight and surface area simultaneously, two independent variables were altered at once, violating the Fair Test Rule.',
      },
      {
        id: 'c2',
        text: 'Nylon parachutes always fall at the speed of light.',
        isCorrect: false,
        explanation: 'Misconception: Material descent is governed by fluid aerodynamic drag and gravitational acceleration, not relativistic light speed.',
      },
      {
        id: 'c3',
        text: 'Gravity exerts twice as much acceleration on heavy objects in Earth air.',
        isCorrect: false,
        explanation: 'Misconception: Gravitational acceleration g = 9.8 m/s² is identical for all masses at Earth surface (Galileo Leaning Tower principle).',
      },
    ],
    correctExplanation: 'To establish a causal relationship, only one independent variable must be altered at a time. All other factors (payload mass, shape, dropping height) must be kept strictly identical.',
  },
  graph_interpretation_error: {
    title: 'Kinematic Graph Slope vs Area Integration',
    question: 'On a velocity-time (v-t) graph of an accelerating vehicle, what physical quantity is represented by the area bounded under the curve between time t₁ and t₂?',
    context: 'Graph analysis: dimensional analysis of axes (m/s) × s.',
    choices: [
      {
        id: 'c1',
        text: 'Total displacement (distance traveled in meters), calculated as the definite integral ∫ v dt.',
        isCorrect: true,
        explanation: 'Correct! Dimensional analysis: (meters/second) × seconds = meters. The area under a velocity-time graph equals the total distance traveled.',
      },
      {
        id: 'c2',
        text: 'Instantaneous vehicle acceleration in m/s².',
        isCorrect: false,
        explanation: 'Misconception: Acceleration is given by the slope (derivative dv/dt) of the velocity-time graph, not by the area.',
      },
      {
        id: 'c3',
        text: 'The total mechanical horsepower produced by the engine.',
        isCorrect: false,
        explanation: 'Misconception: Power requires knowledge of force and work (W/t); it cannot be derived purely from kinematic velocity-time graphs.',
      },
    ],
    correctExplanation: 'The area under a velocity-time graph represents displacement (Δx = ∫ v dt). In contrast, the gradient or slope represents instantaneous acceleration (a = dv/dt).',
  },
  mathematical_error: {
    title: 'Inverse Proportionality & Formula Derivation',
    question: 'In stopping distance physics (d = v₀² / (2 μ g)), if the road surface friction coefficient μ is halved (from dry asphalt 0.8 to wet ice 0.4) at constant speed, what happens to stopping distance?',
    context: 'Mathematical relationship between stopping distance and friction coefficient.',
    choices: [
      {
        id: 'c1',
        text: 'Stopping distance doubles, because friction μ appears in the denominator (inversely proportional).',
        isCorrect: true,
        explanation: 'Correct! Since d ∝ 1/μ, reducing μ by a factor of 2 increases d by a factor of 2 (doubles the stopping distance).',
      },
      {
        id: 'c2',
        text: 'Stopping distance is cut in half, because lower friction allows the car to slide easier.',
        isCorrect: false,
        explanation: 'Misconception: Lower friction provides less retarding force (f = μ N), meaning deceleration is halved and distance is doubled, not halved.',
      },
      {
        id: 'c3',
        text: 'Stopping distance remains completely unchanged because vehicle mass did not change.',
        isCorrect: false,
        explanation: 'Misconception: While mass cancels out of the stopping equation, the friction coefficient μ directly determines braking distance.',
      },
    ],
    correctExplanation: 'In an inverse relationship (y = k / x), halving the denominator doubles the output. Reducing road friction from 0.8 to 0.4 doubles the required stopping distance.',
  },
  reasoning_error: {
    title: 'Extrapolating Beyond Empirical Evidence',
    question: 'A student measures that heating water from 20°C to 40°C increases dissolved sugar solubility. They claim: "Therefore, heating water to 500°C will dissolve an infinite amount of sugar." Why is this conclusion logically flawed?',
    context: 'Scientific reasoning must remain bounded by phase boundaries and empirical evidence.',
    choices: [
      {
        id: 'c1',
        text: 'It makes an unjustified extrapolation past the 100°C liquid-gas boiling phase transition where liquid water evaporates and sugar decomposes/caramelizes.',
        isCorrect: true,
        explanation: 'Correct! Scientific models only hold within specific physical boundary conditions. Water boils into steam at 100°C, and sucrose thermally decomposes.',
      },
      {
        id: 'c2',
        text: 'Sugar becomes a noble gas at 300°C and cannot dissolve in anything.',
        isCorrect: false,
        explanation: 'Misconception: Sugar does not become a noble gas; it is an organic carbohydrate that pyrolyzes and chars.',
      },
      {
        id: 'c3',
        text: 'Water can never reach 500°C under any pressure conditions in the universe.',
        isCorrect: false,
        explanation: 'Misconception: Water can reach 500°C as supercritical steam under high pressure; however, it is no longer liquid water dissolving crystalline sucrose.',
      },
    ],
    correctExplanation: 'Inductive reasoning must respect physical state changes and thermodynamic boundaries. Extrapolating linear trends past phase changes leads to invalid scientific claims.',
  },
  careless_error: {
    title: 'Measurement Repeatability & Statistical Sufficiency',
    question: 'Why does scientific methodology mandate conducting multiple repeated trials (minimum 3-5) and computing an average rather than relying on a single trial?',
    context: 'Empirical reliability, precision, and reduction of random experimental noise.',
    choices: [
      {
        id: 'c1',
        text: 'Multiple trials allow researchers to detect random measurement anomalies, reduce experimental uncertainty, and verify reproducibility.',
        isCorrect: true,
        explanation: 'Correct! Individual trials are susceptible to reaction-time delays, instrument noise, and brief environmental fluctuations. Averaging multiple trials yields reliable data.',
      },
      {
        id: 'c2',
        text: 'Taking one measurement is always sufficient if the digital stopwatch displays three decimal places.',
        isCorrect: false,
        explanation: 'Misconception: High display precision on an instrument does not eliminate human reaction-time error or environmental fluctuation.',
      },
      {
        id: 'c3',
        text: 'Scientists repeat trials solely to pass laboratory safety inspections.',
        isCorrect: false,
        explanation: 'Misconception: Replication is the cornerstone of empirical proof, ensuring findings are reproducible and not flukes.',
      },
    ],
    correctExplanation: 'Empirical science requires repeatability. Taking multiple trials minimizes the impact of random measurement error, exposes outliers, and ensures the validity of experimental conclusions.',
  },
};

export const MistakesInsightsView: React.FC<MistakesInsightsViewProps> = ({
  mistakesHistory,
  onResolveMisconception,
  onEarnCredits,
}) => {
  // Misconception resolving challenge modal state
  const [solvingMistake, setSolvingMistake] = useState<MistakeRecord | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [mandatoryError, setMandatoryError] = useState<string | null>(null);

  // Compute counts per category
  const categoryCounts = Object.keys(CATEGORY_LABELS).reduce((acc, cat) => {
    acc[cat as MistakeCategory] = mistakesHistory.filter((m) => m.category === cat).length;
    return acc;
  }, {} as Record<MistakeCategory, number>);

  const resolvedCount = mistakesHistory.filter((m) => m.isResolved).length;
  const maxCount = Math.max(1, ...Object.values(categoryCounts));

  const handleOpenSolveChallenge = (mistake: MistakeRecord) => {
    setSolvingMistake(mistake);
    setSelectedChoiceId(null);
    setResolutionStatus('idle');
    setMandatoryError(null);
  };

  const handleCloseSolveChallenge = () => {
    setSolvingMistake(null);
    setSelectedChoiceId(null);
    setResolutionStatus('idle');
    setMandatoryError(null);
  };

  const handleVerifySolution = () => {
    if (!solvingMistake) return;

    // MANDATE 1: Must be selected, cannot be left blank!
    if (!selectedChoiceId) {
      setMandatoryError('⚠️ Mandatory: You must select an answer before verifying. Leaving answers blank is not permitted.');
      return;
    }

    setMandatoryError(null);
    const challenge = CATEGORY_CHALLENGES[solvingMistake.category];
    const chosen = challenge.choices.find((c) => c.id === selectedChoiceId);

    // MANDATE 2: Must be correct! If incorrect, explain why and DO NOT award credits!
    if (!chosen?.isCorrect) {
      setResolutionStatus('incorrect');
      // No credits awarded, misconception is NOT resolved!
      return;
    }

    // Correct! Award credits and resolve misconception
    setResolutionStatus('correct');
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    if (onResolveMisconception) {
      onResolveMisconception(solvingMistake.id, 25);
    } else if (onEarnCredits) {
      onEarnCredits(25, `Resolved misconception for ${solvingMistake.caseOrConceptTitle}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Cognitive Diagnostics & Misconception Resolution
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Misconceptions & Reasoning Insights
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            In science, confronting and solving errors builds rock-solid intuition. Resolve your logged misconceptions below to earn Science Credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Total Logged: <span className="text-amber-400 font-bold">{mistakesHistory.length}</span>
          </div>
          <div className="bg-emerald-950/70 px-4 py-2 rounded-xl border border-emerald-800/80 text-xs font-mono text-emerald-300">
            Resolved: <span className="text-emerald-400 font-bold">{resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Misconception Bar Chart Frequency */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Your Recurring Difficulties Profile
          </h3>
          <span className="text-xs text-slate-400 font-mono">Normalized Distribution</span>
        </div>

        <div className="space-y-3.5">
          {(Object.keys(CATEGORY_LABELS) as MistakeCategory[]).map((cat) => {
            const count = categoryCounts[cat];
            const pct = Math.round((count / maxCount) * 100);
            const info = CATEGORY_LABELS[cat];

            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{info.label}</span>
                  <span className="font-mono text-slate-400 font-bold">{count} occurrences</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      count === 0
                        ? 'bg-transparent'
                        : count >= 3
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.max(count > 0 ? 8 : 0, pct)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Log and Interactive Corrective Resolution */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Individual Misconception Incidents & Resolution Lab
          </h3>
          <span className="text-xs text-slate-400">
            Answers are mandatory and must be correct to resolve
          </span>
        </div>

        {mistakesHistory.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-slate-400 text-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            No reasoning errors logged yet! As you complete detective cases and concept predictions, detected misconceptions will be analyzed and solved here.
          </div>
        ) : (
          <div className="space-y-3">
            {mistakesHistory.map((m) => {
              const isResolved = !!m.isResolved;
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border space-y-3 transition ${
                    isResolved
                      ? 'bg-emerald-950/20 border-emerald-800/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {m.caseOrConceptTitle}
                      </span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-300 font-mono border border-slate-800">
                        {CATEGORY_LABELS[m.category]?.label || m.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-slate-900 px-2.5 py-0.5 rounded text-slate-400 font-mono">
                        {m.date}
                      </span>
                      {isResolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Solved (+25 ⚛️)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Unresolved
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-rose-300">Detected Gaps: </span>
                    {m.description}
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-emerald-400">Scientific Correction: </span>
                    {m.correctiveInsight}
                  </div>

                  {/* Action button to solve misconception */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {isResolved
                        ? `Resolved on ${m.resolvedDate || m.date}`
                        : 'Solve this diagnostic challenge to earn +25 Credits'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenSolveChallenge(m)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isResolved
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 shadow-md'
                      }`}
                    >
                      {isResolved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Review Solution</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Solve Misconception Challenge (+25 ⚛️)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diagnostic Challenge Modal */}
      {solvingMistake && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#131E36] border border-cyan-800/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                    Confronting Misconception: {solvingMistake.caseOrConceptTitle}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {CATEGORY_CHALLENGES[solvingMistake.category]?.title || 'Scientific Misconception Challenge'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseSolveChallenge}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context from the student's logged mistake */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold block">
                Your Logged Misconception
              </span>
              <p className="text-xs text-rose-300">{solvingMistake.description}</p>
            </div>

            {/* Diagnostic Question */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <HelpCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">
                  {CATEGORY_CHALLENGES[solvingMistake.category]?.question}
                </h3>
              </div>
              <p className="text-xs text-slate-300 italic">
                {CATEGORY_CHALLENGES[solvingMistake.category]?.context}
              </p>

              {/* Multiple Choice Options */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  Select the Scientifically Correct Model (Mandatory):
                </span>
                {CATEGORY_CHALLENGES[solvingMistake.category]?.choices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      disabled={resolutionStatus === 'correct'}
                      onClick={() => {
                        setSelectedChoiceId(choice.id);
                        setMandatoryError(null);
                        setResolutionStatus('idle');
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-md'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                              : 'border-slate-600'
                          }`}
                        >
                          {choice.id.replace('c', '')}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Error Alert */}
            {mandatoryError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/80 rounded-xl text-rose-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{mandatoryError}</span>
              </div>
            )}

            {/* Diagnostic Feedback if Incorrect */}
            {resolutionStatus === 'incorrect' && (
              <div className="bg-amber-950/70 border border-amber-500/70 rounded-xl p-4 space-y-2.5 shadow-lg animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Incorrect Answer — Misconception Unresolved</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 font-bold">
                    0 Credits Awarded
                  </span>
                </div>

                {/* Explanation of why their chosen answer is incorrect */}
                {(() => {
                  const chosen = CATEGORY_CHALLENGES[solvingMistake.category]?.choices.find(
                    (c) => c.id === selectedChoiceId
                  );
                  return (
                    <p className="text-xs text-amber-200 leading-relaxed">
                      {chosen?.explanation || 'This option represents an intuitive bias rather than empirical scientific law.'}
                    </p>
                  );
                })()}

                {/* Clear explanation of the correct scientific principle */}
                <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-900/50 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 block">
                    Correct Scientific Principle:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {CATEGORY_CHALLENGES[solvingMistake.category]?.correctExplanation}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-amber-400 font-medium">
                    Mandatory: You must deduce and select the correct answer to resolve this misconception.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResolutionStatus('idle');
                      setSelectedChoiceId(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" /> Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Feedback if Correct */}
            {resolutionStatus === 'correct' && (
              <div className="bg-emerald-950/70 border border-emerald-500/70 rounded-xl p-4 space-y-2 shadow-lg animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Outstanding Deduction! Misconception Resolved</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" /> +25 Credits Awarded!
                  </span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {CATEGORY_CHALLENGES[solvingMistake.category]?.correctExplanation}
                </p>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCloseSolveChallenge}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                Close
              </button>

              {resolutionStatus !== 'correct' ? (
                <button
                  type="button"
                  onClick={handleVerifySolution}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Verify & Resolve Misconception</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCloseSolveChallenge}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
