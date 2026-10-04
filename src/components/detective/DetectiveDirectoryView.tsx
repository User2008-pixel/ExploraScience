import React, { useState } from 'react';
import { Subject, DifficultyLevel } from '../../types/science';
import { GradeLevel } from '../../types/auth';
import { DETECTIVE_CASES } from '../../data/detectiveCasesData';
import { Formula } from '../common/Formula';
import { ShieldAlert, Search, Filter, Play, CheckCircle2, GraduationCap } from 'lucide-react';

interface DetectiveDirectoryViewProps {
  onOpenCase: (caseId: string) => void;
  completedCaseIds: string[];
  userGrade?: GradeLevel;
}

export const DetectiveDirectoryView: React.FC<DetectiveDirectoryViewProps> = ({
  onOpenCase,
  completedCaseIds,
  userGrade,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const availableCasesForGrade = DETECTIVE_CASES.filter((c) => {
    if (!userGrade) return true;
    return c.gradeLevel === userGrade || (c.gradeLevels && c.gradeLevels.includes(userGrade));
  });

  const filteredCases = availableCasesForGrade.filter((c) => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Science Detective Division
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Scientific Investigation Cases
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Solve authentic anomalies through virtual experiments, controlled manipulation, and empirical reasoning.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userGrade && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{userGrade} Forensic Cases ({availableCasesForGrade.length})</span>
            </span>
          )}
          <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <span>Solved: </span>
            <span className="text-emerald-400 font-bold">
              {completedCaseIds.filter((id) => availableCasesForGrade.some((c) => c.id === id)).length} / {availableCasesForGrade.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'physics', 'chemistry', 'biology'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub as Subject | 'all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                selectedSubject === sub
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sub === 'all' ? 'All Disciplines' : sub}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Tier:</span>
          {(['all', 'explorer', 'investigator', 'scientist'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition ${
                selectedDifficulty === diff
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((c) => {
          const isSolved = completedCaseIds.includes(c.id);

          return (
            <div
              key={c.id}
              className="bg-[#131E36] rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/60">
                      {c.caseNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      {c.subject} • {c.difficulty}
                    </span>
                  </div>
                  {isSolved ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
                      <CheckCircle2 className="w-3 h-3" /> Solved (1x Credits Claimed)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                      +100-150 ⚛️ Credits (First Completion)
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {c.premise}
                </p>

                {/* Mystery Inquiry Banner */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-4">
                  <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold block mb-1">
                    Mystery Question
                  </span>
                  <p className="text-xs text-slate-200 italic">"{c.mysteryQuestion}"</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  {c.availableVariables.length} Controlled Variables
                </span>
                <button
                  onClick={() => onOpenCase(c.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSolved ? 'Re-open Investigation' : 'Accept Case'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
