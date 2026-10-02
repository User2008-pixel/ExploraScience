import React, { useState } from 'react';
import { UserProfile, AVATAR_OPTIONS, GRADE_OPTIONS, GradeLevel } from '../../types/auth';
import {
  User,
  UserCheck,
  Shield,
  Sparkles,
  X,
  LogIn,
  LogOut,
  Check,
  ChevronRight,
  Atom,
  GraduationCap,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onContinueAsGuest?: () => void;
  isInitialWelcome?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onContinueAsGuest,
  isInitialWelcome = false,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'guest'>(
    currentUser.isGuest ? 'guest' : 'profile'
  );

  // Form states for login / custom profile
  const [name, setName] = useState(currentUser.isGuest ? '' : currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [grade, setGrade] = useState<GradeLevel>(currentUser.grade || 'Class 11');
  const [guestGrade, setGuestGrade] = useState<GradeLevel>(
    currentUser.grade && currentUser.grade !== 'Class 10' ? currentUser.grade : 'Class 11'
  );
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || '⚛️');
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle || 'Junior Lab Researcher');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleContinueAsGuest = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      name: `Guest Scientist #${randomNum}`,
      avatar: '🔬',
      grade: guestGrade,
      roleTitle: 'Guest Explorer',
      isGuest: true,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    onUpdateUser(guestUser);
    if (onContinueAsGuest) {
      onContinueAsGuest();
    }
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Young Scientist';
    const foundAvatar = AVATAR_OPTIONS.find((a) => a.emoji === selectedAvatar);

    const updated: UserProfile = {
      id: currentUser.isGuest ? `user-${Date.now()}` : currentUser.id,
      name: finalName,
      email: email.trim() || undefined,
      avatar: selectedAvatar,
      grade,
      roleTitle: foundAvatar?.role || roleTitle,
      isGuest: false,
      joinedDate: currentUser.joinedDate || new Date().toISOString().split('T')[0],
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#111A30] border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#152342] border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-2xl shadow-md shadow-cyan-500/20">
              {currentUser.avatar || '⚛️'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{currentUser.isGuest ? 'Laboratory Sign In' : 'Scientist Profile'}</span>
                {currentUser.isGuest ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Guest Mode
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Verified
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser.isGuest
                  ? 'Sign in to save cross-device credentials or continue exploring anonymously.'
                  : `Signed in as ${currentUser.name}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#0c1426] p-1.5 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{currentUser.isGuest ? 'Sign In / Create Profile' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'guest'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'guest' ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                🔬
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Instant Anonymous Guest Access</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Explore simulations, practical labs, and Dr. Nova with a fresh sandbox. Continuing as Guest resets all default data to zero (0 credits, 0 completed cases) for a clean experimental slate.
                </p>
              </div>

              {currentUser.isGuest ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-mono text-left space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current ID:</span>
                    <span className="text-amber-300 font-bold">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Default Data:</span>
                    <span className="text-emerald-400 font-bold">Zero (Clean Slate)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage:</span>
                    <span>Local Browser Session</span>
                  </div>
                </div>
              ) : null}

              {/* Guest Grade Selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
                  <span>Guest Academic Level:</span>
                  <span className="text-cyan-400">{guestGrade}</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGuestGrade(g)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                        guestGrade === g
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {guestGrade === 'Class 9' || guestGrade === 'Class 10'
                    ? 'ℹ️ Practical Labs are hidden for Classes 9 & 10.'
                    : '✨ Senior Secondary Practical Laboratory Bench available.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Continue as Guest (Reset Data to 0)</span>
                </button>
                {!isInitialWelcome && (
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Scientist Name / Display Handle
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Isaac Newton, Marie Curie, Kirtan"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Grade / Class Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Academic Level</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GRADE_OPTIONS.map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                        grade === g
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
                  <span>Choose Lab Avatar</span>
                  <span className="text-[10px] text-cyan-400 font-normal">
                    {AVATAR_OPTIONS.find((a) => a.emoji === selectedAvatar)?.role}
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((item) => {
                    const isSelected = selectedAvatar === item.emoji;
                    return (
                      <button
                        type="button"
                        key={item.emoji}
                        onClick={() => {
                          setSelectedAvatar(item.emoji);
                          setRoleTitle(item.role);
                        }}
                        className={`p-2.5 rounded-2xl border text-xl flex flex-col items-center justify-center transition ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/30 scale-105'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                        title={item.role}
                      >
                        <span>{item.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
                  <span>Student Email (Optional)</span>
                  <span className="text-[10px] text-slate-500 font-normal">For lab certificates</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Profile Saved!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>{currentUser.isGuest ? 'Create Scientist Profile' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
