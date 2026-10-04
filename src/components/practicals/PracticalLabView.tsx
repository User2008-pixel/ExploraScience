import React, { useState, useEffect } from 'react';
import { PRACTICAL_LABS_DATA } from '../../data/practicalLabsData';
import { PracticalExperiment, PracticalGrade, PracticalSubject } from '../../types/practicals';
import { GradeLevel } from '../../types/auth';
import { Formula } from '../common/Formula';
import { VernierCaliperSim } from './VernierCaliperSim';
import { ScrewGaugeSim } from './ScrewGaugeSim';
import { SimplePendulumSim } from './SimplePendulumSim';
import { MeterBridgeSim } from './MeterBridgeSim';
import { ConvexLensSim } from './ConvexLensSim';
import { PotentiometerSim } from './PotentiometerSim';
import { PrismDeviationSim } from './PrismDeviationSim';
import { SonometerSim } from './SonometerSim';
import { TitrationSim } from './TitrationSim';
import { ThiosulfateKineticsSim } from './ThiosulfateKineticsSim';
import { SaltAnalysisSim } from './SaltAnalysisSim';
import { PaperChromatographySim } from './PaperChromatographySim';
import { MitosisRootTipSim } from './MitosisRootTipSim';
import { BiochemicalFoodTestsSim } from './BiochemicalFoodTestsSim';
import { ResonanceTubeSim } from './ResonanceTubeSim';
import { PNJunctionSim } from './PNJunctionSim';
import {
  FlaskConical,
  Atom,
  Dna,
  BookOpen,
  Sliders,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  Bot,
  ExternalLink,
  Search,
  Coins,
  Check,
  Lock,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticalLabViewProps {
  initialExperimentId?: string;
  onOpenTutorWithQuestion?: (question: string) => void;
  scienceCredits?: number;
  onEarnCredits?: (amount: number, reason: string) => void;
  userGrade?: GradeLevel;
  onUpgradeGrade?: (newGrade: GradeLevel) => void;
}

export const PracticalLabView: React.FC<PracticalLabViewProps> = ({
  initialExperimentId,
  onOpenTutorWithQuestion,
  scienceCredits = 0,
  onEarnCredits,
  userGrade,
  onUpgradeGrade,
}) => {
  const effectiveGrade: PracticalGrade = userGrade === 'Class 12' ? 'Class 12' : 'Class 11';
  const [selectedSubject, setSelectedSubject] = useState<'all' | PracticalSubject>('all');
  const initialExp =
    (initialExperimentId && PRACTICAL_LABS_DATA.find((e) => e.id === initialExperimentId)) ||
    PRACTICAL_LABS_DATA.find((e) => e.gradeLevel === effectiveGrade) ||
    PRACTICAL_LABS_DATA[0];
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>(initialExperimentId || initialExp.id);
  const [activeTab, setActiveTab] = useState<'apparatus' | 'theory' | 'procedure' | 'viva'>('apparatus');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedVivaIndices, setCompletedVivaIndices] = useState<number[]>([]);

  useEffect(() => {
    if (initialExperimentId) {
      setSelectedExperimentId(initialExperimentId);
      const matched = PRACTICAL_LABS_DATA.find((e) => e.id === initialExperimentId);
      if (matched) {
        setSelectedSubject(matched.subject);
      }
    }
  }, [initialExperimentId]);

  // If student is in Class 9 or Class 10, hide laboratory practicals and explain curriculum alignment
  if (userGrade === 'Class 9' || userGrade === 'Class 10') {
    return (
      <div className="bg-[#111A30] border border-amber-500/30 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-6 my-8 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            Curriculum Alignment Restricted
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Practicals are Reserved for Classes 11 & 12
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your current academic profile is set to <strong>{userGrade}</strong>. Practical Laboratory experiments (Vernier Calipers, Screw Gauge, Simple Pendulum, Meter Bridge, Potentiometer, Optical Bench, and Titrations) are designed exclusively for Senior Secondary <strong>Class 11 and Class 12</strong> syllabi.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-2 text-left max-w-md mx-auto">
          <div className="text-slate-300 font-bold font-mono">Available for your grade:</div>
          <ul className="space-y-1 text-slate-400 text-[11px]">
            <li>• Explore Concepts & Interactive Simulators (Classes 9–12)</li>
            <li>• Science Detective Forensic Investigations</li>
            <li>• Mathematics & Graphing Calculator</li>
          </ul>
        </div>

        {onUpgradeGrade && (
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onUpgradeGrade('Class 11')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
            >
              Unlock Class 11 Practicals
            </button>
            <button
              onClick={() => onUpgradeGrade('Class 12')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              Unlock Class 12 Practicals
            </button>
          </div>
        )}
      </div>
    );
  }

  const filteredExperiments = PRACTICAL_LABS_DATA.filter((exp) => {
    // Strictly show only the experiments of the selected senior secondary class
    if (exp.gradeLevel !== effectiveGrade) return false;
    if (selectedSubject !== 'all' && exp.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.aim.toLowerCase().includes(q) ||
        exp.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentExperiment =
    PRACTICAL_LABS_DATA.find((e) => e.id === selectedExperimentId) ||
    PRACTICAL_LABS_DATA[0];

  const handleClaimVivaCredit = (idx: number, qTitle: string) => {
    if (completedVivaIndices.includes(idx)) return;
    setCompletedVivaIndices((prev) => [...prev, idx]);
    if (onEarnCredits) {
      onEarnCredits(15, `Viva Voce Mastery: Q${idx + 1} (${currentExperiment.title.split(':')[0]})`);
    }
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const renderSimulation = (exp: PracticalExperiment) => {
    switch (exp.simulationType) {
      case 'vernier-caliper':
        return <VernierCaliperSim />;
      case 'screw-gauge':
        return <ScrewGaugeSim />;
      case 'simple-pendulum':
        return <SimplePendulumSim />;
      case 'meter-bridge':
        return <MeterBridgeSim />;
      case 'convex-lens':
        return <ConvexLensSim />;
      case 'potentiometer':
        return <PotentiometerSim />;
      case 'prism-deviation':
        return <PrismDeviationSim />;
      case 'sonometer':
        return <SonometerSim />;
      case 'titration-kmno4':
      case 'titration-mohr':
        return <TitrationSim />;
      case 'reaction-kinetics-thiosulfate':
        return <ThiosulfateKineticsSim />;
      case 'salt-analysis':
        return <SaltAnalysisSim />;
      case 'paper-chromatography':
        return <PaperChromatographySim />;
      case 'mitosis-root-tip':
        return <MitosisRootTipSim />;
      case 'food-tests':
        return <BiochemicalFoodTestsSim />;
      case 'resonance-tube':
        return <ResonanceTubeSim />;
      case 'pn-junction':
        return <PNJunctionSim />;
      default:
        // Default high-precision specialized practical bench
        return (
          <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                {exp.gradeLevel} {exp.subject.toUpperCase()} PRACTICAL
              </span>
              <h4 className="text-base font-bold text-white">{exp.title} Apparatus</h4>
            </div>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              {exp.aim}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono max-w-xl mx-auto text-cyan-300">
              <Formula tex={exp.governingFormulaLaTeX} />
            </div>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              {exp.formulaDescription}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#152342] via-[#0E1729] to-[#0A0F1D] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              CBSE / ISC / State Board / AP / IB
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Classes 11 & 12 Syllabus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Practical Laboratory Bench
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Hands-on virtual practical experiments designed specifically for senior secondary STEM students. Master apparatus manipulation, least count calculations, zero error adjustments, observation tables, and viva voce exams.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-col gap-2.5 w-full md:w-auto">
          {/* Grade Badge for Selected Class */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <span className="text-slate-400 px-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" /> Class:
            </span>
            <span className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold shadow-sm">
              {effectiveGrade} Practical Experiments
            </span>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <span className="text-slate-400 px-2">Subject:</span>
            {(['all', 'physics', 'chemistry', 'biology'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1 rounded-lg transition capitalize ${
                  selectedSubject === sub
                    ? 'bg-purple-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Experiment List & Active Experiment Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Directory of Class 11 & 12 Experiments */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Experiments Directory ({filteredExperiments.length})
            </h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search experiments by topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredExperiments.map((exp) => {
              const isSelected = exp.id === selectedExperimentId;
              const SubjectIcon =
                exp.subject === 'physics'
                  ? Atom
                  : exp.subject === 'chemistry'
                  ? FlaskConical
                  : Dna;

              return (
                <button
                  key={exp.id}
                  onClick={() => {
                    setSelectedExperimentId(exp.id);
                    setActiveTab('apparatus');
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#152342] border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <SubjectIcon className="w-4 h-4" />
                  </div>

                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {exp.gradeLevel}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {exp.subject}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{exp.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {exp.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Experiment Lab Workbench */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header of Active Experiment */}
          <div className="bg-[#111A30] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentExperiment.gradeLevel}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                  {currentExperiment.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentExperiment.curriculum}
                </span>
              </div>

              {onOpenTutorWithQuestion && (
                <button
                  onClick={() =>
                    onOpenTutorWithQuestion(
                      `Explain the practical procedure, formulas, and viva questions for ${currentExperiment.title}`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ask Dr. Nova about this Lab</span>
                </button>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {currentExperiment.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Aim:</strong> {currentExperiment.aim}
            </p>
          </div>

          {/* Practical Workbench Tabs */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-1 flex gap-1 text-xs font-semibold">
            {[
              { id: 'apparatus', label: '1. Virtual Apparatus & Simulator', icon: Sliders },
              { id: 'theory', label: '2. Principle & Formulas', icon: BookOpen },
              { id: 'procedure', label: '3. Procedure & Precautions', icon: CheckCircle },
              { id: 'viva', label: '4. Viva Voce & Exam Q&A', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Virtual Apparatus */}
          {activeTab === 'apparatus' && (
            <div className="space-y-4">
              {renderSimulation(currentExperiment)}
            </div>
          )}

          {/* Tab 2: Theory & Formulas */}
          {activeTab === 'theory' && (
            <div className="bg-[#111A30] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                  Governing Principle & Formula
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-sm font-mono text-cyan-200">
                  <Formula tex={currentExperiment.governingFormulaLaTeX} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                  {currentExperiment.formulaDescription}
                </p>
              </div>

              {currentExperiment.leastCountOrConstantInfo && (
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-xs text-cyan-200 space-y-1">
                  <span className="font-bold text-cyan-300 block uppercase text-[10px]">
                    Least Count & Constant Information:
                  </span>
                  <p>{currentExperiment.leastCountOrConstantInfo}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Apparatus & Materials Required
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {currentExperiment.apparatusRequired.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 3: Procedure & Precautions */}
          {activeTab === 'procedure' && (
            <div className="bg-[#111A30] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 font-mono">
                  Laboratory Procedure Steps
                </h3>
                <div className="space-y-2.5">
                  {currentExperiment.procedureSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Key Precautions
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {currentExperiment.precautions.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Sources of Error
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    {currentExperiment.sourcesOfError.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Viva Voce */}
          {activeTab === 'viva' && (
            <div className="bg-[#111A30] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Oral Viva Voce & Practical Exam Questions
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Common examiner questions asked during board practical examinations.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  {currentExperiment.vivaQuestions.length} Questions
                </span>
              </div>

              <div className="space-y-3">
                {currentExperiment.vivaQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-cyan-300 leading-snug">
                        Q{idx + 1}: {q.question}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 shrink-0">
                        {q.scientificConcept}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                      <strong className="text-emerald-400 block mb-1">Answer:</strong>
                      {q.answer}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                      {onOpenTutorWithQuestion && (
                        <button
                          onClick={() =>
                            onOpenTutorWithQuestion(
                              `Explain the practical viva question for ${currentExperiment.title}: "${q.question}" with its underlying scientific principle (${q.scientificConcept}).`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-400 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-800 transition"
                        >
                          <Bot className="w-3 h-3 text-cyan-400" />
                          <span>Ask Dr. Nova to Explain</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleClaimVivaCredit(idx, q.question)}
                        disabled={completedVivaIndices.includes(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                          completedVivaIndices.includes(idx)
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-sm'
                        }`}
                      >
                        {completedVivaIndices.includes(idx) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Mastered (+15 ⚛️ Claimed)</span>
                          </>
                        ) : (
                          <>
                            <Coins className="w-3 h-3 text-slate-950" />
                            <span>Master Viva (+15 Credits)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
