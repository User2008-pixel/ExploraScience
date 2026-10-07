import React, { useState } from 'react';
import { StudentProgress, CompletedInvestigation } from '../../types/science';
import { CONCEPTS_DATA } from '../../data/conceptsData';
import { DETECTIVE_CASES } from '../../data/detectiveCasesData';
import { AchievementsDashboard } from '../dashboard/AchievementsDashboard';
import { Leaderboard } from './Leaderboard';
import {
  ACHIEVEMENT_BADGES,
  calculateStudentXP,
  calculateStudentRank,
} from '../../data/achievementsData';
import {
  Award,
  Compass,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Calendar,
  FileText,
  Trophy,
  Activity,
  Sparkles,
} from 'lucide-react';

interface MyProgressViewProps {
  progress: StudentProgress;
  onReopenCase: (caseId: string) => void;
  onExploreConcepts?: () => void;
  onStartInvestigation?: () => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  progress,
  onReopenCase,
  onExploreConcepts,
  onStartInvestigation,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'achievements' | 'records'>('achievements');

  // Compute meaningful scientific performance metrics
  const totalCases = DETECTIVE_CASES.length;
  const completedCount = progress.completedInvestigations.length;
  const avgUnderstandingScore =
    completedCount > 0
      ? Math.round(
          progress.completedInvestigations.reduce((acc, c) => acc + c.understandingScore, 0) /
            completedCount
        )
      : 0;

  const totalHintsUsed = progress.completedInvestigations.reduce((acc, c) => acc + c.hintsUsed, 0);
  const avgHintsPerCase = completedCount > 0 ? (totalHintsUsed / completedCount).toFixed(1) : '0';

  const totalXP = calculateStudentXP(progress);
  const { currentRank } = calculateStudentRank(totalXP);
  const unlockedBadgesCount = ACHIEVEMENT_BADGES.filter((b) => b.isUnlocked(progress)).length;

  // Experimental accuracy based on score & minimal mistakes
  const accuracyRating =
    completedCount === 0
      ? 'Pending Tests'
      : avgUnderstandingScore >= 85
      ? 'Rigorous (95%+)'
      : avgUnderstandingScore >= 70
      ? 'Proficient (80%)'
      : 'Developing';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Scientific Progress & Empirical Mastery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Scientific Portfolio
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tracking rigorous scientific competency, badge honors, experimental accuracy, and forensic reasoning quality.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Rank: <span className="text-emerald-400 font-bold">{currentRank.title}</span>
          </div>
          <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            Difficulty: <span className="text-cyan-400 font-bold uppercase">{progress.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Navigation Switch Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('achievements')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeSubTab === 'achievements'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Achievements & Honors</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {unlockedBadgesCount} / {ACHIEVEMENT_BADGES.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('records')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeSubTab === 'records'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Investigation Dossiers & Metrics</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
            {completedCount} Solved
          </span>
        </button>
      </div>

      {activeSubTab === 'achievements' ? (
        /* Achievements Dashboard Component */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AchievementsDashboard
              progress={progress}
              onExploreMore={onExploreConcepts}
              onStartInvestigation={onStartInvestigation}
            />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      ) : (
        /* Investigation Records & Empirical Metrics */
        <div className="space-y-6">
          {/* Meaningful Performance Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Investigation Mastery</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {completedCount} <span className="text-sm text-slate-500 font-normal">/ {totalCases}</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">
                {Math.round((completedCount / totalCases) * 100)}% of forensic cases
              </div>
            </div>

            <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Reasoning Quality</span>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                {avgUnderstandingScore}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Average rubric score</div>
            </div>

            <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Experimental Accuracy</span>
              <div className="text-base font-bold text-amber-300 font-mono mt-1">
                {accuracyRating}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Variable isolation & control</div>
            </div>

            <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Autonomy Index</span>
              <div className="text-2xl font-extrabold text-purple-400 font-mono">
                {avgHintsPerCase}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Avg hints requested / case</div>
            </div>
          </div>

          {/* Completed Investigation Records */}
          <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Completed Investigation Dossiers & Experiment History
            </h3>

            {progress.completedInvestigations.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-slate-400 text-sm">
                <FileText className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                No investigation records yet. Solved cases with full hypotheses, empirical measurements, and conclusions will be recorded here.
              </div>
            ) : (
              <div className="space-y-4">
                {progress.completedInvestigations.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-white">{inv.caseTitle}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" /> {inv.date}
                          </span>
                          <span>•</span>
                          <span>{inv.measurementsCount} empirical trials logged</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <span className="text-xs text-slate-500 block">Understanding Score</span>
                          <span className="text-lg font-bold text-emerald-400">
                            {inv.understandingScore}%
                          </span>
                        </div>
                        <button
                          onClick={() => onReopenCase(inv.caseId)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                          title="Revisit investigation"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Revisit</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-cyan-400 block mb-1">Your Hypothesis:</span>
                        <p className="text-slate-300 italic">"{inv.hypothesis}"</p>
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-emerald-400 block mb-1">Empirical Conclusion:</span>
                        <p className="text-slate-300">"{inv.conclusion}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
