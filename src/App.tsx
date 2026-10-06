import React, { useState, useEffect } from 'react';
import {
  Subject,
  DifficultyLevel,
  StudentProgress,
  ConceptItem,
  DetectiveCase,
  MistakeCategory,
  MistakeRecord,
} from './types/science';
import { CONCEPTS_DATA } from './data/conceptsData';
import { DETECTIVE_CASES } from './data/detectiveCasesData';

import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ConceptLibraryView } from './components/concepts/ConceptLibraryView';
import { ConceptVisualizerView } from './components/concepts/ConceptVisualizerView';
import { DetectiveDirectoryView } from './components/detective/DetectiveDirectoryView';
import { DetectiveInvestigationView } from './components/detective/DetectiveInvestigationView';
import { PracticalLabView } from './components/practicals/PracticalLabView';
import { MyProgressView } from './components/progress/MyProgressView';
import { MistakesInsightsView } from './components/mistakes/MistakesInsightsView';
import { SettingsView } from './components/settings/SettingsView';
import { AITutorPanel } from './components/tutor/AITutorPanel';
import { MathGraphingView } from './components/calculator/MathGraphingView';
import { AuthModal } from './components/auth/AuthModal';
import { ConfirmResetModal } from './components/common/ConfirmResetModal';
import { UndoToast } from './components/common/UndoToast';
import { CreditRewardToast } from './components/common/CreditRewardToast';
import { ReviewModal } from './components/common/ReviewModal';
import { AdminReviewsView } from './components/admin/AdminReviewsView';
import { UserProfile, GradeLevel } from './types/auth';

import {
  Compass,
  Search,
  ShieldAlert,
  Award,
  Brain,
  Sliders,
  Bot,
  Menu,
  X,
  Sparkles,
  Flame,
  LineChart,
  User,
  Coins,
  FlaskConical,
  MessageSquare,
} from 'lucide-react';

type NavTab = 'home' | 'concepts' | 'practicals' | 'detective' | 'calculator' | 'progress' | 'mistakes' | 'settings';

const LOCAL_STORAGE_KEY = 'sciencelab_explorer_progress_v1';
const USER_PROFILE_KEY = 'sciencelab_user_profile_v1';
const ACCOUNT_CHOICE_KEY = 'sciencelab_account_selected_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedPracticalId, setSelectedPracticalId] = useState<string | null>(null);
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [tutorInitialQuestion, setTutorInitialQuestion] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Private Admin Route Handler (/admin/reviews)
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/reviews')
  );

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin/reviews'));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Creator secret shortcut: Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.history.pushState({}, '', '/admin/reviews');
        setIsAdminRoute(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenPractical = (practicalId: string) => {
    setSelectedPracticalId(practicalId);
    setActiveTab('practicals');
  };

  // Authentication & User Profile State: Prompts for login or guest account upon opening
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      return !localStorage.getItem(ACCOUNT_CHOICE_KEY);
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'guest-1',
      name: 'Guest Scientist',
      avatar: '🔬',
      grade: 'Class 11',
      roleTitle: 'Guest Explorer',
      isGuest: true,
      joinedDate: new Date().toISOString().split('T')[0],
    };
  });

  // Save user profile changes
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      localStorage.setItem(ACCOUNT_CHOICE_KEY, updated.isGuest ? 'guest' : 'verified');
    } catch {}

    // When upgrading to a verified profile from a clean 0-balance state, provide starter welcome kit
    if (!updated.isGuest && progress.scienceCredits === 0) {
      setProgress((prev) => ({
        ...prev,
        scienceCredits: 150,
        streakDays: Math.max(1, prev.streakDays),
      }));
      setRewardToastAmount(150);
      setRewardToastReason(`Welcome ${updated.name}! +150 Science Credits awarded!`);
    }
  };

  // Continue as Guest: Resets all default data to zero for an authentic clean experimental slate
  const handleContinueAsGuest = () => {
    const zeroProgress: StudentProgress = {
      exploredConceptIds: [],
      masteredConceptIds: [],
      completedInvestigations: [],
      mistakesHistory: [],
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      difficulty: 'explorer',
      scienceCredits: 0,
    };
    setProgress(zeroProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(zeroProgress));
      localStorage.setItem(ACCOUNT_CHOICE_KEY, 'guest');
    } catch {}
    setRewardToastAmount(null);
    setRewardToastReason('Guest Session: Default data reset to 0 for a clean lab notebook.');
  };

  // Confirmation & 10s Undo States
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
  const [isUndoToastOpen, setIsUndoToastOpen] = useState(false);
  const [deletedBackupProgress, setDeletedBackupProgress] = useState<StudentProgress | null>(null);

  const [rewardToastAmount, setRewardToastAmount] = useState<number | null>(null);
  const [rewardToastReason, setRewardToastReason] = useState<string>('');

  // Practicals availability check: Available to Class 11 & Class 12, hidden for Class 9 & Class 10
  const isPracticalsAvailable =
    currentUser.grade !== 'Class 9' && currentUser.grade !== 'Class 10';

  // If user grade is Class 9 or Class 10, redirect away from practicals tab if currently active
  useEffect(() => {
    if (!isPracticalsAvailable && activeTab === 'practicals') {
      setActiveTab('concepts');
    }
  }, [isPracticalsAvailable, activeTab]);

  const navTabs = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'concepts', label: 'Explore Concepts', icon: Search },
    ...(isPracticalsAvailable
      ? [{ id: 'practicals', label: 'Practicals Lab', icon: FlaskConical }]
      : []),
    { id: 'detective', label: 'Science Detective', icon: ShieldAlert },
    { id: 'calculator', label: 'Math & Graphing', icon: LineChart },
    { id: 'progress', label: 'My Progress', icon: Award },
    { id: 'mistakes', label: 'Mistakes & Insights', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  // Persistent user progress state - Resets to zero by default for guest accounts
  const [progress, setProgress] = useState<StudentProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          scienceCredits: parsed.scienceCredits ?? 0,
        };
      }
    } catch {}
    // Clean zero-default slate for guest / fresh session
    return {
      exploredConceptIds: [],
      masteredConceptIds: [],
      completedInvestigations: [],
      mistakesHistory: [],
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      difficulty: 'explorer',
      scienceCredits: 0,
    };
  });

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const handleSelectConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setActiveTab('concepts');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mark as explored
    if (!progress.exploredConceptIds.includes(conceptId)) {
      setProgress((prev) => ({
        ...prev,
        exploredConceptIds: [...prev.exploredConceptIds, conceptId],
      }));
    }
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('detective');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteInvestigation = (summary: {
    caseId: string;
    caseTitle: string;
    hypothesis: string;
    independentVar: string;
    dependentVar: string;
    measurementsCount: number;
    conclusion: string;
    hintsUsed: number;
    understandingScore: number;
    mistakes: MistakeCategory[];
  }) => {
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      ...summary,
      date: new Date().toISOString().split('T')[0],
    };

    // Add new mistake records if any detected
    const newMistakeRecords: MistakeRecord[] = summary.mistakes.map((cat) => ({
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      caseOrConceptId: summary.caseId,
      caseOrConceptTitle: summary.caseTitle,
      category: cat,
      description: `Observed difficulty in ${cat.replace(/_/g, ' ')} during experimental run.`,
      correctiveInsight: 'Ensure only one variable is altered at a time and sufficient measurement trials are collected.',
    }));

    // Safety check: Mandate that answers are non-empty and valid before awarding credits
    if (
      !summary.hypothesis ||
      summary.hypothesis.trim().length < 15 ||
      !summary.conclusion ||
      summary.conclusion.trim().length < 15 ||
      summary.measurementsCount < 3
    ) {
      console.warn('Investigation completion rejected: answers were left blank or incomplete.');
      return;
    }

    // Check if this case was already completed previously and award credits strictly ONCE ever
    let earnedThisTime = 0;

    setProgress((prev) => {
      const isAlreadyCompleted = (prev.completedInvestigations || []).some((x) => x.caseId === summary.caseId);
      if (isAlreadyCompleted) {
        // Repeated investigation completion: strictly award 0 credits
        earnedThisTime = 0;
        return {
          ...prev,
          completedInvestigations: [newRecord, ...prev.completedInvestigations.filter((x) => x.caseId !== summary.caseId)],
          mistakesHistory: [...newMistakeRecords, ...prev.mistakesHistory],
        };
      }

      // First-time completion only: base 100 + score bonus up to 50
      const baseCredits = 100;
      const bonusCredits = Math.round((summary.understandingScore / 100) * 50);
      earnedThisTime = baseCredits + bonusCredits;

      return {
        ...prev,
        scienceCredits: (prev.scienceCredits || 0) + earnedThisTime,
        completedInvestigations: [newRecord, ...prev.completedInvestigations],
        mistakesHistory: [...newMistakeRecords, ...prev.mistakesHistory],
      };
    });

    if (earnedThisTime > 0) {
      setRewardToastAmount(earnedThisTime);
      setRewardToastReason(`Completed "${summary.caseTitle}" with ${summary.understandingScore}% accuracy! (One-Time Investigation Credit Awarded)`);
    } else {
      setRewardToastAmount(null);
    }

    setSelectedCaseId(null);
  };

  const handleResolveMistake = (mistakeId: string, earnedCredits: number) => {
    setProgress((prev) => ({
      ...prev,
      scienceCredits: (prev.scienceCredits || 0) + earnedCredits,
      mistakesHistory: prev.mistakesHistory.map((m) =>
        m.id === mistakeId
          ? { ...m, isResolved: true, resolvedDate: new Date().toISOString().split('T')[0] }
          : m
      ),
    }));
    setRewardToastAmount(earnedCredits);
    setRewardToastReason('Misconception successfully solved and resolved!');
  };

  const handleMasterConcept = (conceptId: string) => {
    setProgress((prev) => {
      const alreadyMastered = prev.masteredConceptIds || [];
      if (alreadyMastered.includes(conceptId)) return prev;
      return {
        ...prev,
        masteredConceptIds: [...alreadyMastered, conceptId],
      };
    });
  };

  const handleEarnCredits = (amount: number, reason: string) => {
    setProgress((prev) => ({
      ...prev,
      scienceCredits: (prev.scienceCredits || 0) + amount,
    }));
    setRewardToastAmount(amount);
    setRewardToastReason(reason);
  };

  const handleDeductCredits = (amount: number, reason: string): boolean => {
    if ((progress.scienceCredits || 0) < amount) {
      return false;
    }
    setProgress((prev) => ({
      ...prev,
      scienceCredits: Math.max(0, (prev.scienceCredits || 0) - amount),
    }));
    return true;
  };

  const handleUpdateGrade = (newGrade: GradeLevel) => {
    handleUpdateUser({
      ...currentUser,
      grade: newGrade,
    });
  };

  const handleRequestResetProgress = () => {
    setIsConfirmResetOpen(true);
  };

  const handleExecuteResetProgress = () => {
    // Backup for 10 seconds undo
    setDeletedBackupProgress({ ...progress });
    const fresh: StudentProgress = {
      exploredConceptIds: [],
      masteredConceptIds: [],
      completedInvestigations: [],
      mistakesHistory: [],
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      difficulty: 'explorer',
      scienceCredits: 150,
    };
    setProgress(fresh);
    setIsUndoToastOpen(true);
  };

  const handleUndoResetProgress = () => {
    if (deletedBackupProgress) {
      setProgress(deletedBackupProgress);
      setDeletedBackupProgress(null);
    }
    setIsUndoToastOpen(false);
  };

  const selectedConcept = CONCEPTS_DATA.find((c) => c.id === selectedConceptId);
  const selectedCase = DETECTIVE_CASES.find((c) => c.id === selectedCaseId);

  // If visitor navigated to private admin route, render private AdminReviewsView
  if (isAdminRoute) {
    return (
      <AdminReviewsView
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans lab-grid">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              setSelectedConceptId(null);
              setSelectedCaseId(null);
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-1">
                <span>ScienceLab</span>
                <span className="text-cyan-400">Explorer</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-0.5">
                Class 9–12 Scientific Sandbox
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as NavTab);
                    if (tab.id === 'concepts' && !selectedConceptId) {
                      setSelectedConceptId(null);
                    }
                    if (tab.id === 'detective' && !selectedCaseId) {
                      setSelectedCaseId(null);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Profile, Science Credits, Dr. Nova AI Mentor & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* User Scientist Profile / Guest Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition shadow-sm"
              title={currentUser.isGuest ? 'Continue as Guest or Sign In' : `Signed in as ${currentUser.name}`}
            >
              <span className="text-sm">{currentUser.avatar || '🔬'}</span>
              <span className="hidden sm:inline font-semibold max-w-[100px] truncate text-slate-100">
                {currentUser.name}
              </span>
              {currentUser.isGuest ? (
                <span className="hidden lg:inline px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Guest
                </span>
              ) : (
                <span className="hidden lg:inline px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentUser.grade}
                </span>
              )}
            </button>

            {/* Science Credits Balance Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-300 shadow-sm"
              title="Science Credits Balance (Earned through rigorous scientific inquiries and experiments)"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{(progress.scienceCredits || 0).toLocaleString()} ⚛️</span>
              <span className="hidden xl:inline text-[10px] text-amber-400/80 font-sans font-normal border-l border-amber-500/30 pl-1.5">
                Credits
              </span>
            </div>

            <button
              onClick={() => setIsAITutorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition shadow-sm"
              title="Open Dr. Nova Gemini STEM Mentor"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Dr. Nova AI</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e1729] border-b border-slate-800 p-4 space-y-2 animate-fade-in">
            {/* User Profile in Mobile Menu */}
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentUser.avatar || '🔬'}</span>
                <div className="text-left">
                  <div className="font-bold text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.roleTitle}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
                {currentUser.isGuest ? 'Guest Mode' : currentUser.grade}
              </span>
            </button>

            {/* Science Credits Balance in Mobile Menu */}
            <div
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-xs text-amber-200 mb-2 font-mono font-bold"
            >
              <div className="flex items-center gap-2 font-sans">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Science Credits</span>
              </div>
              <span className="text-amber-300">{(progress.scienceCredits || 0).toLocaleString()} ⚛️</span>
            </div>
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as NavTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: HOME DASHBOARD */}
        {activeTab === 'home' && (
          <HomeDashboard
            progress={progress}
            onNavigateTab={setActiveTab}
            onSelectConcept={handleSelectConcept}
            onSelectCase={handleSelectCase}
            isPracticalsAvailable={isPracticalsAvailable}
            userGrade={currentUser.grade}
          />
        )}

        {/* TAB 2: EXPLORE CONCEPTS */}
        {activeTab === 'concepts' && (
          <>
            {selectedConceptId && selectedConcept ? (
              <ConceptVisualizerView
                concept={selectedConcept}
                onSelectConcept={handleSelectConcept}
                onBack={() => setSelectedConceptId(null)}
                scienceCredits={progress.scienceCredits || 0}
                onEarnCredits={handleEarnCredits}
                onMasterConcept={handleMasterConcept}
                onOpenDetectiveCase={(caseId) => {
                  setSelectedCaseId(caseId);
                  setActiveTab('detective');
                }}
                onOpenPractical={handleOpenPractical}
                onOpenAITutor={(question) => {
                  if (question) setTutorInitialQuestion(question);
                  setIsAITutorOpen(true);
                }}
              />
            ) : (
              <ConceptLibraryView
                onSelectConcept={handleSelectConcept}
                onOpenDetectiveCase={handleSelectCase}
                userGrade={currentUser.grade}
                onUpdateGrade={handleUpdateGrade}
              />
            )}
          </>
        )}

        {/* TAB: SENIOR SECONDARY PRACTICAL LAB BENCH (Classes 11 & 12) */}
        {activeTab === 'practicals' && (
          <PracticalLabView
            initialExperimentId={selectedPracticalId || undefined}
            onOpenTutorWithQuestion={(question) => {
              setTutorInitialQuestion(question);
              setIsAITutorOpen(true);
            }}
            scienceCredits={progress.scienceCredits || 0}
            onEarnCredits={handleEarnCredits}
            userGrade={currentUser.grade}
            onUpgradeGrade={(newGrade) => {
              handleUpdateUser({
                ...currentUser,
                grade: newGrade,
              });
            }}
          />
        )}

        {/* TAB 3: SCIENCE DETECTIVE */}
        {activeTab === 'detective' && (
          <>
            {selectedCaseId && selectedCase ? (
              <DetectiveInvestigationView
                detectiveCase={selectedCase}
                onBack={() => setSelectedCaseId(null)}
                onCompleteInvestigation={handleCompleteInvestigation}
                scienceCredits={progress.scienceCredits || 0}
                onDeductCredits={handleDeductCredits}
              />
            ) : (
              <DetectiveDirectoryView
                onOpenCase={handleSelectCase}
                completedCaseIds={progress.completedInvestigations.map((c) => c.caseId)}
                userGrade={currentUser.grade}
              />
            )}
          </>
        )}

        {/* TAB 4: MATHEMATICS & GRAPHING LAB */}
        {activeTab === 'calculator' && <MathGraphingView />}

        {/* TAB 5: MY PROGRESS */}
        {activeTab === 'progress' && (
          <MyProgressView
            progress={progress}
            onReopenCase={handleSelectCase}
            onExploreConcepts={() => {
              setSelectedConceptId(null);
              setActiveTab('concepts');
            }}
            onStartInvestigation={() => {
              setSelectedCaseId(null);
              setActiveTab('detective');
            }}
          />
        )}

        {/* TAB 5: MISTAKES & INSIGHTS */}
        {activeTab === 'mistakes' && (
          <MistakesInsightsView
            mistakesHistory={progress.mistakesHistory}
            onResolveMisconception={handleResolveMistake}
            onEarnCredits={handleEarnCredits}
          />
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            difficulty={progress.difficulty}
            onChangeDifficulty={(diff) =>
              setProgress((prev) => ({ ...prev, difficulty: diff }))
            }
            onResetProgress={handleRequestResetProgress}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenReviewModal={() => setIsReviewModalOpen(true)}
          />
        )}
      </main>

      {/* Socratic AI Tutor Modal Drawer */}
      <AITutorPanel
        isOpen={isAITutorOpen}
        onClose={() => {
          setIsAITutorOpen(false);
          setTutorInitialQuestion('');
        }}
        activeContext={
          selectedCase ? selectedCase.title : selectedConcept ? selectedConcept.title : 'General Science'
        }
        initialQuestion={tutorInitialQuestion}
      />

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onContinueAsGuest={handleContinueAsGuest}
      />

      {/* Confirmation Modal for Resetting All Data */}
      <ConfirmResetModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleExecuteResetProgress}
        experimentsCount={progress.completedInvestigations.length}
        mistakesCount={progress.mistakesHistory.length}
        streakDays={progress.streakDays}
      />

      {/* 10-Second Undo Toast */}
      <UndoToast
        isOpen={isUndoToastOpen}
        onUndo={handleUndoResetProgress}
        onDismiss={() => {
          setIsUndoToastOpen(false);
          setDeletedBackupProgress(null);
        }}
        durationSeconds={10}
      />

      {/* Credit Reward Celebration Toast */}
      <CreditRewardToast
        amount={rewardToastAmount}
        reason={rewardToastReason}
        onDismiss={() => setRewardToastAmount(null)}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1120] text-slate-500 text-xs py-6 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-400 font-medium">ScienceLab Explorer</span>
            <span>• Class 9–12 Physics, Chemistry, Biology</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-emerald-500/15 hover:from-purple-500/25 hover:to-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition flex items-center gap-2 shadow-sm"
              title="Email Creator for Suggestions & Queries (Privacy Protected)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Review &amp; Suggestions</span>
            </button>
            <div className="italic text-slate-400 hidden md:block">
              "Don't tell students what happens. Let them make it happen."
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Quick Review Button (Accessible Across All Views) */}
      <button
        onClick={() => setIsReviewModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold p-3 sm:px-4 sm:py-2.5 rounded-full shadow-2xl shadow-cyan-500/30 border border-cyan-400/40 flex items-center gap-2 transition transform hover:scale-105 active:scale-95 group"
        title="Email Creator: Share Suggestions, Queries & Reviews (Privacy Protected)"
      >
        <MessageSquare className="w-4 h-4 text-cyan-200 group-hover:animate-pulse" />
        <span className="hidden sm:inline text-xs tracking-wide">Review &amp; Queries</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      </button>

      {/* Creator Review & Suggestion Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        defaultUserName={currentUser.isGuest ? '' : currentUser.name}
        activeContext={
          selectedCase
            ? `Detective Case: ${selectedCase.title}`
            : selectedConcept
            ? `Concept: ${selectedConcept.title} (${selectedConcept.gradeLevel})`
            : activeTab === 'practicals'
            ? 'Senior Secondary Practical Bench'
            : activeTab === 'calculator'
            ? 'Math & Graphing Lab'
            : activeTab === 'mistakes'
            ? 'Mistakes & Misconceptions Lab'
            : 'General ScienceLab'
        }
      />
    </div>
  );
}
