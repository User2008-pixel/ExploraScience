import React, { useState, useEffect } from 'react';
import { Subject, ConceptItem } from '../../types/science';
import { GradeLevel } from '../../types/auth';
import { CONCEPTS_DATA } from '../../data/conceptsData';
import { DETECTIVE_CASES } from '../../data/detectiveCasesData';
import { Formula } from '../common/Formula';
import { Search, Atom, Dna, Zap, ArrowRight, ShieldAlert, Sparkles, Filter, GraduationCap } from 'lucide-react';

interface ConceptLibraryViewProps {
  onSelectConcept: (conceptId: string) => void;
  onOpenDetectiveCase: (caseId: string) => void;
  userGrade?: GradeLevel;
  onUpdateGrade?: (grade: GradeLevel) => void;
}

export const ConceptLibraryView: React.FC<ConceptLibraryViewProps> = ({
  onSelectConcept,
  onOpenDetectiveCase,
  userGrade = 'Class 11',
  onUpdateGrade,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(userGrade);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedGrade(userGrade);
  }, [userGrade]);

  const activeGrade = userGrade || selectedGrade;

  const filteredConcepts = CONCEPTS_DATA.filter((c) => {
    if (selectedSubject !== 'all' && c.subject !== selectedSubject) return false;
    // Strictly show only the material of the selected class
    if (c.gradeLevel !== activeGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Interactive Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Explore Scientific Concepts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Understand → Visualise → Manipulate → Investigate → Apply
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts, equations, topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Subjects', icon: Sparkles },
            { id: 'physics', label: 'Physics', icon: Zap },
            { id: 'chemistry', label: 'Chemistry', icon: Atom },
            { id: 'biology', label: 'Biology', icon: Dna },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = selectedSubject === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSubject(tab.id as Subject | 'all')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  isSel
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Selected Class:</span>
          <select
            value={activeGrade}
            onChange={(e) => {
              const newG = e.target.value as GradeLevel;
              setSelectedGrade(newG);
              if (onUpdateGrade) onUpdateGrade(newG);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
          >
            <option value="Class 9">Class 9 Only</option>
            <option value="Class 10">Class 10 Only</option>
            <option value="Class 11">Class 11 Only</option>
            <option value="Class 12">Class 12 Only</option>
          </select>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/60">
            {filteredConcepts.length} concepts
          </span>
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConcepts.map((concept) => {
          // Check if there is an affiliated Science Detective case
          const matchingCase = DETECTIVE_CASES.find((c) => c.subject === concept.subject);

          return (
            <div
              key={concept.id}
              className="bg-[#131E36] rounded-2xl border border-slate-800/90 hover:border-cyan-500/50 transition-all p-5 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      concept.subject === 'physics'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : concept.subject === 'chemistry'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {concept.subject} • {concept.gradeLevel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {concept.variables.length} Variables
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {concept.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {concept.tagline}
                </p>

                {/* Mathematical Equation Preview with KaTeX */}
                <div className="my-3.5 p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 text-center overflow-x-hidden">
                  <Formula tex={concept.formulaLaTeX} className="text-xs scale-90" />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectConcept(concept.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-sm"
                >
                  <span>Launch Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {matchingCase && (
                  <button
                    onClick={() => onOpenDetectiveCase(matchingCase.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition"
                  >
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>Investigate Related Case</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
