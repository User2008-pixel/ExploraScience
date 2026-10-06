import React, { useState } from 'react';
import { ConceptItem, DetectiveCase, StudentProgress } from '../../types/science';
import { GradeLevel } from '../../types/auth';
import { CONCEPTS_DATA } from '../../data/conceptsData';
import { DETECTIVE_CASES } from '../../data/detectiveCasesData';
import { Formula } from '../common/Formula';
import { ACHIEVEMENT_BADGES, calculateStudentXP, calculateStudentRank } from '../../data/achievementsData';
import {
  Compass,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  Play,
  Lightbulb,
  Search,
  BookOpen,
  Trophy,
  LineChart,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';

interface HomeDashboardProps {
  progress: StudentProgress;
  onNavigateTab: (tab: 'home' | 'concepts' | 'practicals' | 'detective' | 'calculator' | 'progress' | 'mistakes' | 'settings') => void;
  onSelectConcept: (conceptId: string) => void;
  onSelectCase: (caseId: string) => void;
  isPracticalsAvailable?: boolean;
  userGrade?: GradeLevel;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress,
  onNavigateTab,
  onSelectConcept,
  onSelectCase,
  isPracticalsAvailable = true,
  userGrade = 'Class 11',
}) => {
  // Mini interactive projectile hero simulation
  const [heroAngle, setHeroAngle] = useState(45);
  const heroVel = 24;
  const heroG = 9.8;
  const angleRad = (heroAngle * Math.PI) / 180;
  const heroRange = (heroVel * heroVel * Math.sin(2 * angleRad)) / heroG;
  const heroMaxH = (heroVel * heroVel * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * heroG);

  const featuredCase =
    DETECTIVE_CASES.find(
      (c) => c.gradeLevel === userGrade || (c.gradeLevels && c.gradeLevels.includes(userGrade))
    ) || DETECTIVE_CASES[0];

  const unlockedBadgesCount = ACHIEVEMENT_BADGES.filter((b) => b.isUnlocked(progress)).length;
  const totalXP = calculateStudentXP(progress);
  const { currentRank } = calculateStudentRank(totalXP);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section with Interactive Mini-Sim */}
      <div className="relative bg-gradient-to-br from-[#131E36] via-[#0E1729] to-[#0A0F1D] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Science Education • {userGrade} Curriculum</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ScienceLab <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Explorer</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Understand difficult scientific concepts through interactive visualization, empirical prediction, virtual manipulation, and forensic reasoning — not rote memorization.
            </p>

            {/* Core Loop Badge */}
            <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 inline-block w-full max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 block mb-1.5 font-bold">
                The Core Inquiry Loop:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-200">
                <span className="text-cyan-300">Explore</span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-300">Predict</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-300">Experiment</span>
                <span className="text-slate-500">→</span>
                <span className="text-sky-300">Observe</span>
                <span className="text-slate-500">→</span>
                <span className="text-purple-300">Explain</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('concepts')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition transform active:scale-95 flex items-center gap-2"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {isPracticalsAvailable && (
                <button
                  onClick={() => onNavigateTab('practicals')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-semibold text-sm transition flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4 text-amber-400" />
                  <span>Class 11 & 12 Practicals</span>
                </button>
              )}
              <button
                onClick={() => onNavigateTab('detective')}
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Science Detective</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {progress.exploredConceptIds.length} / {CONCEPTS_DATA.length}
            </div>
            <div className="text-xs text-slate-400">Concepts Explored</div>
          </div>
        </div>

        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {progress.completedInvestigations.length} / {DETECTIVE_CASES.length}
            </div>
            <div className="text-xs text-slate-400">Cases Solved</div>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('progress')}
          className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center gap-3 transition"
          title="View Achievements & Honors"
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-300 font-mono">
              {unlockedBadgesCount} / {ACHIEVEMENT_BADGES.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Badges</span>
              <span className="text-[10px] text-cyan-400">({totalXP} XP)</span>
            </div>
          </div>
        </div>

        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {progress.masteredConceptIds.length}
            </div>
            <div className="text-xs text-slate-400">Mastered Principles</div>
          </div>
        </div>

        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white font-mono">
              {progress.streakDays} Days
            </div>
            <div className="text-xs text-slate-400">Active Streak</div>
          </div>
        </div>
      </div>

      {/* Science Detective Forensic Mystery Spotlight */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
              Forensic Mystery
            </span>
            <span className="text-xs text-amber-400 font-mono font-semibold">{featuredCase.caseNumber}</span>
            <span className="text-xs text-slate-500 uppercase font-semibold">• {featuredCase.subject}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{featuredCase.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3 max-w-2xl">
            {featuredCase.premise}
          </p>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-900/40 text-left max-w-2xl">
            <span className="text-[10px] text-amber-400 font-mono font-bold block mb-0.5">
              Core Investigation
            </span>
            <p className="text-xs text-slate-200 italic">"{featuredCase.mysteryQuestion}"</p>
          </div>
        </div>

        <button
          onClick={() => onSelectCase(featuredCase.id)}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Accept Case Investigation</span>
        </button>
      </div>

      {/* Senior Secondary Practical Laboratory Experiments Banner (Class 11 & 12 only) */}
      {isPracticalsAvailable && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-[#131E36] to-cyan-950/40 rounded-2xl border border-emerald-500/30 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Class 11 & 12 Practical Lab Bench</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">CBSE / ISC / State / AP</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Hands-on virtual practical experiments: Vernier Calipers, Screw Gauge, Simple Pendulum, Meter Bridge, Convex Lens, Prism, Redox Titrations, Reaction Kinetics, and Mitosis in Onion Root Tip.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('practicals')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition whitespace-nowrap"
          >
            <span>Enter Practical Bench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mathematics & Graphing Lab Callout Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[#131E36] to-purple-950/40 rounded-2xl border border-cyan-500/30 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Mathematics & Graphing Lab</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">New Lab Tool</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-function curve plotter, dynamic tangents & derivatives, scientific constants evaluator, and empirical linear regression.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('calculator')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition whitespace-nowrap"
        >
          <span>Launch Math Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Experiments & Misconception Insights Peek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Experiments
            </h3>
            <button
              onClick={() => onNavigateTab('progress')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View Full History →
            </button>
          </div>

          {progress.completedInvestigations.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No investigations completed yet. Jump into Science Detective mode to conduct your first inquiry!
            </p>
          ) : (
            <div className="space-y-2">
              {progress.completedInvestigations.slice(-3).map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-slate-200">{inv.caseTitle}</h4>
                    <span className="text-[11px] text-slate-500">{inv.date}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    Score: {inv.understandingScore}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Misconception Diagnostics
            </h3>
            <button
              onClick={() => onNavigateTab('mistakes')}
              className="text-xs text-amber-400 hover:underline"
            >
              Analyze Difficulties →
            </button>
          </div>

          {progress.mistakesHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center">
              No misconception patterns recorded yet. As you make predictions and test experiments, conceptual gaps will be diagnosed here.
            </p>
          ) : (
            <div className="space-y-2">
              {progress.mistakesHistory.slice(-3).map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold">{m.caseOrConceptTitle}</span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {m.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{m.correctiveInsight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
