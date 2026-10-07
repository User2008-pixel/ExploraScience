import React, { useState } from 'react';
import { DifficultyLevel } from '../../types/science';
import { UserProfile } from '../../types/auth';
import { Sliders, RotateCcw, Shield, CheckCircle, Info, User, LogIn, Sparkles, MessageSquare, Lock, Inbox, Coins, Compass, Palette, BookOpen, Camera } from 'lucide-react';

interface SettingsViewProps {
  difficulty: DifficultyLevel;
  onChangeDifficulty: (diff: DifficultyLevel) => void;
  onResetProgress: () => void;
  currentUser?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenReviewModal?: (initialView?: 'form' | 'inbox') => void;
  scienceCredits?: number;
  onUpdateUser?: (updated: UserProfile) => void;
  currentTheme?: 'dark' | 'light' | 'custom';
  onThemeChange?: (theme: 'dark' | 'light' | 'custom') => void;
  onOpenTutorial?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  difficulty,
  onChangeDifficulty,
  onResetProgress,
  currentUser,
  onOpenAuthModal,
  onOpenReviewModal,
  scienceCredits = 0,
  onUpdateUser,
  currentTheme = 'dark',
  onThemeChange,
  onOpenTutorial,
}) => {
  const [customPhotoInput, setCustomPhotoInput] = useState(currentUser?.avatar || '');

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        avatar: customPhotoInput || '⚛️',
      });
    }
  };

  const handleToggleGuest = () => {
    if (currentUser && onUpdateUser) {
      const nextIsGuest = !currentUser.isGuest;
      onUpdateUser({
        ...currentUser,
        isGuest: nextIsGuest,
        name: nextIsGuest ? 'Test Mode User' : 'Verified Researcher',
        roleTitle: nextIsGuest ? 'Test Mode Explorer' : 'Senior Lab Scientist',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Credits at Top */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Lab Preferences</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure difficulty tiers, theme backgrounds, login mode, custom profile photo, and science credits balance.
          </p>
        </div>

        {/* Science Credits at Top of Settings */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm shadow-md">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{scienceCredits.toLocaleString()} ⚛️ Science Credits</span>
        </div>
      </div>

      {/* Tutorial & Onboarding Access */}
      <div className="bg-gradient-to-r from-cyan-950/50 via-[#131E36] to-emerald-950/50 rounded-2xl border border-cyan-800/40 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Interactive Tutorial & Guide</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Re-open the walkthrough guide anytime to learn how to operate simulations and lab tools.
            </p>
          </div>
        </div>
        {onOpenTutorial && (
          <button
            onClick={onOpenTutorial}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-2 shrink-0"
          >
            <span>Open Tutorial Walkthrough</span>
          </button>
        )}
      </div>


      {/* User Profile & Custom Photo / Logo */}
      {currentUser && (
        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/20 shrink-0 overflow-hidden">
                {currentUser.avatar && currentUser.avatar.startsWith('http') ? (
                  <img src={currentUser.avatar} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.avatar || '⚛️'}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">{currentUser.name}</h3>
                  {currentUser.isGuest ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Test Mode (Guest)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {currentUser.grade} • Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentUser.email ? `Email: ${currentUser.email}` : 'Anonymous Test Session'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Switch / Login</span>
              </button>
            </div>
          </div>

          {/* Custom Logo / Photo URL Input */}
          <form onSubmit={handleUpdatePhoto} className="pt-4 border-t border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload / Enter Custom Profile Photo or Logo URL:</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customPhotoInput}
                onChange={(e) => setCustomPhotoInput(e.target.value)}
                placeholder="https://example.com/logo.png or emoji"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                Update Logo
              </button>
            </div>
          </form>
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

      {/* Reset Progress Section */}
      <div className="bg-[#131E36] rounded-2xl border border-rose-900/40 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Reset Laboratory Notebook</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear all explored concepts, solved misconceptions, and investigation history.
          </p>
        </div>
        <button
          onClick={onResetProgress}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Notebook</span>
        </button>
      </div>
    </div>
  );
};
