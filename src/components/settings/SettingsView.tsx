import React from 'react';
import { DifficultyLevel } from '../../types/science';
import { UserProfile } from '../../types/auth';
import { Sliders, RotateCcw, Shield, CheckCircle, Info, User, LogIn, Sparkles, MessageSquare, Lock, Inbox } from 'lucide-react';

interface SettingsViewProps {
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onResetProgress: () => void;
  currentUser?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenReviewModal?: (initialView?: 'form' | 'inbox') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  difficulty,
  onChangeDifficulty,
  onResetProgress,
  currentUser,
  onOpenAuthModal,
  onOpenReviewModal,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Lab Preferences</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure difficulty levels, user profile credentials, and local data persistence.
          </p>
        </div>
      </div>

      {/* User Scientist Profile Section */}
      {currentUser && (
        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20 shrink-0">
              {currentUser.avatar || '⚛️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{currentUser.name}</h3>
                {currentUser.isGuest ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Guest Mode
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {currentUser.grade}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.roleTitle} • Joined {currentUser.joinedDate || 'Recently'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuthModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition shadow-sm"
          >
            <User className="w-4 h-4" />
            <span>{currentUser.isGuest ? 'Sign In / Setup Profile' : 'Edit Scientist Profile'}</span>
          </button>
        </div>
      )}

      {/* Adaptive Difficulty Selection */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Adaptive Investigation Tier
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The system dynamically adjusts guidance based on your tier. Higher tiers provide less upfront scaffolding and require deeper independent experimental design.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              tier: 'explorer',
              title: 'Explorer',
              desc: 'Highly guided. Explicit variable prompts, structured experimental setup, and continuous feedback.',
            },
            {
              tier: 'investigator',
              title: 'Investigator',
              desc: 'Moderate guidance. Independent variable identification with progressive hints when stuck.',
            },
            {
              tier: 'scientist',
              title: 'Scientist',
              desc: 'Minimal guidance. Full scientific autonomy with open-ended hypothesis testing and unprompted data synthesis.',
            },
          ].map((t) => {
            const isSelected = difficulty === t.tier;
            return (
              <button
                key={t.tier}
                onClick={() => onChangeDifficulty(t.tier as DifficultyLevel)}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-bold capitalize ${
                        isSelected ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {t.title}
                    </span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Central Philosophy Box */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 border border-cyan-800/40 rounded-2xl p-6 text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          Core Educational Philosophy
        </span>
        <blockquote className="text-lg font-semibold text-white italic">
          "Don't tell students what happens. Let them make it happen."
        </blockquote>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Scientific understanding is achieved when learners manipulate variables, confront misconceptions, collect empirical data, and construct explanations grounded in verified models.
        </p>
      </div>

      {/* Creator Feedback, Suggestions & Review */}
      {onOpenReviewModal && (
        <div className="bg-gradient-to-r from-purple-950/30 via-[#131E36] to-cyan-950/30 rounded-2xl border border-cyan-500/30 p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <h4 className="text-sm font-bold text-white">Suggestions, Queries &amp; Creator Review</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                Private &amp; Direct
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Email the developer directly to suggest new simulation models, report issues, or ask questions. The developer&apos;s email address is kept private, and only your name is shown.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReviewModal('form')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Submit Review</span>
            </button>
            <button
              onClick={() => onOpenReviewModal('inbox')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
            >
              <Inbox className="w-4 h-4 text-cyan-200" />
              <span>Creator Inbox</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Progress */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Reset Local Laboratory Data</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear all logged experiments, mistake records, and reset streak to day 1.
          </p>
        </div>
        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Progress</span>
        </button>
      </div>
    </div>
  );
};
