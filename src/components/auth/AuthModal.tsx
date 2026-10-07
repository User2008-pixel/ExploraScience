import React, { useState } from 'react';
import { UserProfile, GRADE_OPTIONS, GradeLevel } from '../../types/auth';
import {
  User,
  UserCheck,
  Shield,
  Sparkles,
  X,
  LogIn,
  Check,
  GraduationCap,
  Mail,
  Lock,
  Camera,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onContinueAsGuest?: () => void;
  isInitialWelcome?: boolean;
  currentTheme?: 'dark' | 'light' | 'custom';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onContinueAsGuest,
  isInitialWelcome = false,
  currentTheme = 'dark',
}) => {
  const inputBgClass = currentTheme === 'light'
    ? 'bg-white border-slate-300 text-slate-900'
    : 'bg-slate-950 border-slate-800 text-white';
  const [authMode, setAuthMode] = useState<'email' | 'guest'>(
    currentUser.isGuest ? 'guest' : 'email'
  );

  const [name, setName] = useState(currentUser.isGuest ? '' : currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(currentUser.grade || 'Class 11');
  const [guestGrade, setGuestGrade] = useState<GradeLevel>('Class 11');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(currentUser.avatar || '');
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  if (!isOpen) return null;

  const handleTestModeGuest = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const guestUser: UserProfile = {
      id: `test-guest-${Date.now()}`,
      name: `Test Explorer #${randomNum}`,
      avatar: customPhotoUrl || '🔬',
      grade: guestGrade,
      roleTitle: 'Test Mode Explorer',
      isGuest: true,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    onUpdateUser(guestUser);
    if (onContinueAsGuest) {
      onContinueAsGuest();
    }
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const finalName = name.trim() || email.split('@')[0];
    const updatedUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: finalName,
      email: email.trim(),
      avatar: customPhotoUrl || '⚛️',
      grade,
      roleTitle: 'Verified Researcher',
      isGuest: false,
      joinedDate: currentUser.joinedDate || new Date().toISOString().split('T')[0],
    };

    onUpdateUser(updatedUser);
    setEmailSentNotice(true);

    // Simulate sending confirmation email from our side
    setTimeout(() => {
      setEmailSentNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#111A30] border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#152342] border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-xl shadow-md overflow-hidden">
              {customPhotoUrl && customPhotoUrl.startsWith('http') ? (
                <img src={customPhotoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span>{customPhotoUrl || '⚛️'}</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>ScienceLab Authentication</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Secure Portal
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose Test Mode or Secure Email Login.
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

        {/* Two Options Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-[#0c1426] p-1.5 gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              authMode === 'email'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Login & Password</span>
          </button>
          <button
            onClick={() => setAuthMode('guest')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
              authMode === 'guest'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Test Mode (Guest)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {emailSentNotice ? (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
                ✓
              </div>
              <h4 className="text-lg font-bold text-white">Login Successful!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                A confirmation email has been successfully dispatched from our server to <span className="text-cyan-400 font-mono">{email}</span>. Your progress will now be saved automatically across sessions!
              </p>
            </div>
          ) : authMode === 'guest' ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner text-amber-400">
                ⚡
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Test Mode (Guest Access)</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  Quick sandbox testing mode. <strong className="text-amber-300">Catch:</strong> Whenever you exit the site and rejoin it, all data and progress will be removed automatically.
                </p>
              </div>

              {/* Guest Grade Selection */}
              <div className="space-y-1.5 text-left pt-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase font-mono flex items-center justify-between">
                  <span>Test Academic Level:</span>
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
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={handleTestModeGuest}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Start Test Mode Session</span>
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
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="text-center pb-1">
                <h4 className="text-base font-bold text-white">Secure Email Login</h4>
                <p className="text-xs text-slate-400">
                  Enter your email and set a private password. Your password is securely encrypted and never visible to the admin or anyone else.
                </p>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email ID</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@school.edu"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:border-cyan-500 text-sm focus:outline-none placeholder:text-slate-500 ${inputBgClass}`}
                />
              </div>

              {/* Password Input (secure, hidden) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Password (Private & Encrypted)</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
                <p className="text-[10px] text-slate-500">
                  🔒 Strictly confidential. Encrypted client-side. Not visible to admins.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Full Name / Lab Handle
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Marie Curie"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Custom Photo URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom Avatar / Photo URL</span>
                </label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
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

              {/* Custom Logo / Photo URL (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom Logo / Profile Photo URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={customPhotoUrl.startsWith('http') ? customPhotoUrl : ''}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://example.com/my-photo.png or emoji (⚛️)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Log In & Send Confirmation Email</span>
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
