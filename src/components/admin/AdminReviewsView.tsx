import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Star,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Inbox,
  User,
  MessageSquare,
  RotateCcw,
} from 'lucide-react';

interface StoredReview {
  id: string;
  name: string;
  email?: string | null;
  category: string;
  rating: number;
  topicContext?: string;
  message: string;
  createdAt: string;
}

interface AdminReviewsViewProps {
  onBackToApp: () => void;
}

const STORAGE_TOKEN_KEY = 'sciencelab_admin_token_v1';

export const AdminReviewsView: React.FC<AdminReviewsViewProps> = ({ onBackToApp }) => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Active Session Token (works inside iframes where third-party cookies are blocked)
  const [token, setToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem(STORAGE_TOKEN_KEY) || '';
    } catch {
      return '';
    }
  });

  // Setup Form State
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Password Reset Mode State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Dashboard Data State
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterWithEmailOnly, setFilterWithEmailOnly] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    try {
      sessionStorage.setItem(STORAGE_TOKEN_KEY, newToken);
    } catch {}
  };

  const clearToken = () => {
    setToken('');
    try {
      sessionStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch {}
  };

  const getActiveToken = () => {
    return token || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_TOKEN_KEY) || '' : '');
  };

  const checkAdminStatus = async () => {
    setLoadingStatus(true);
    setStatusError(null);
    try {
      const activeToken = getActiveToken();
      const res = await fetch('/api/admin/status', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      if (!res.ok) {
        throw new Error('Failed to connect to authentication service.');
      }
      const data = await res.json();
      setIsInitialized(Boolean(data.isInitialized));
      setIsAuthenticated(Boolean(data.isAuthenticated));

      if (data.isAuthenticated) {
        fetchReviews(activeToken);
      }
    } catch (err: any) {
      setStatusError(err?.message || 'Error checking server status.');
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchReviews = async (tokenOverride?: string) => {
    setLoadingReviews(true);
    try {
      const activeToken = tokenOverride || getActiveToken();
      const res = await fetch('/api/admin/reviews', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });

      if (res.status === 401) {
        clearToken();
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error('Error fetching admin reviews:', e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);

    if (!setupEmail.trim()) {
      setSetupError('Please enter a valid admin email address.');
      return;
    }
    if (setupPassword.length < 8) {
      setSetupError('Password must be at least 8 characters long.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('Passwords do not match.');
      return;
    }

    setSetupLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: setupEmail.trim(),
          password: setupPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete setup.');
      }

      if (data.token) {
        saveToken(data.token);
      }

      setIsInitialized(true);
      setIsAuthenticated(true);
      fetchReviews(data.token);
    } catch (err: any) {
      setSetupError(err?.message || 'Error during setup.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      if (data.token) {
        saveToken(data.token);
      }

      setIsAuthenticated(true);
      fetchReviews(data.token);
    } catch (err: any) {
      setLoginError(err?.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);

    if (!resetEmail.trim()) {
      setResetError('Please enter your registered admin email.');
      return;
    }
    if (resetPassword.length < 8) {
      setResetError('New password must be at least 8 characters long.');
      return;
    }
    if (resetPassword !== resetConfirm) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim(),
          newPassword: resetPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      if (data.token) {
        saveToken(data.token);
      }

      setResetSuccess('Password reset successfully! Logging you in...');
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsResetMode(false);
        fetchReviews(data.token);
      }, 700);
    } catch (err: any) {
      setResetError(err?.message || 'Reset failed.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    const activeToken = getActiveToken();
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
    } catch {}
    clearToken();
    setIsAuthenticated(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (e) {
      console.error('Error deleting review:', e);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    if (selectedCategory !== 'all' && rev.category !== selectedCategory) {
      return false;
    }
    if (filterWithEmailOnly && !rev.email) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inMsg = rev.message.toLowerCase().includes(q);
      const inName = rev.name.toLowerCase().includes(q);
      const inEmail = rev.email ? rev.email.toLowerCase().includes(q) : false;
      const inContext = rev.topicContext ? rev.topicContext.toLowerCase().includes(q) : false;
      return inMsg || inName || inEmail || inContext;
    }
    return true;
  });

  const emailCount = reviews.filter((r) => Boolean(r.email)).length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Verifying secure creator gateway...</p>
        </div>
      </div>
    );
  }

  // --- VIEW 1: ONE-TIME CREATOR SETUP (If not initialized) ---
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#070D18] text-slate-200 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to App
            </button>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
              One-Time Setup
            </span>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/40">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Creator Account Setup</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Initialize your private creator admin credentials. Once initialized, this setup screen is permanently locked and only you can log in.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Creator Admin Email</label>
              <input
                type="email"
                required
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                placeholder="your-admin-email@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none transition"
              />
              <p className="text-[10px] text-slate-500">
                Used to receive user query notifications. Never exposed publicly.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Create Admin Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={setupConfirm}
                onChange={(e) => setSetupConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none transition"
              />
            </div>

            {setupError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={setupLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {setupLoading ? 'Initializing...' : 'Initialize Creator Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 2: PASSWORD RESET MODE ---
  if (isResetMode && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D18] text-slate-200 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetError(null);
                setResetSuccess(null);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
              Password Reset
            </span>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-500/40">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Reset Creator Password</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your registered creator admin email address to establish a new password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Registered Creator Email</label>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered creator email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-white text-xs outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-white text-xs outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-500 text-white text-xs outline-none transition"
              />
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {resetLoading ? 'Resetting Password...' : 'Update Password & Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW 3: ADMIN LOGIN (If initialized but unauthenticated) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070D18] text-slate-200 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to App
            </button>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
              Private Gateway
            </span>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Creator Admin Login</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access the private query and review management dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter creator email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Admin Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setResetEmail(loginEmail);
                  }}
                  className="text-[11px] text-cyan-400 hover:underline font-mono"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white text-xs outline-none transition"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => {
                setIsResetMode(true);
                setResetEmail(loginEmail);
              }}
              className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset your admin password</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            🔒 Protected by server-side scrypt hashing &amp; Bearer authorization tokens.
          </p>
        </div>
      </div>
    );
  }

  // --- VIEW 4: AUTHENTICATED CREATOR REVIEWS DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/40">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Creator Review &amp; Query Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure Creator Session
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Private inbox containing all user inquiries, feedback, and suggestions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => fetchReviews()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-4 h-4 ${loadingReviews ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={onBackToApp}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to App
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">Total Submissions</span>
          <div className="text-2xl font-black text-white">{reviews.length}</div>
          <p className="text-[11px] text-slate-500">All user inquiries received</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">Awaiting Direct Reply</span>
          <div className="text-2xl font-black text-emerald-400">{emailCount}</div>
          <p className="text-[11px] text-slate-500">Queries with reply email provided</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase">Average Community Rating</span>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <span className="text-sm font-normal text-amber-500">/ 5.0 ★</span>
          </div>
          <p className="text-[11px] text-slate-500">Student satisfaction score</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search queries by name, email, or message keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Suggestion">Suggestions</option>
            <option value="Query">Queries</option>
            <option value="Review">Reviews</option>
            <option value="Simulation Idea">Simulation Ideas</option>
            <option value="Bug Report">Bug Reports</option>
          </select>

          <button
            onClick={() => setFilterWithEmailOnly(!filterWithEmailOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              filterWithEmailOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Has Email</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loadingReviews ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">
            Loading inquiries from secure database...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-3">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No inquiries found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {reviews.length === 0
                ? 'No visitors have submitted queries yet. New submissions will show up here.'
                : 'No queries match your current search or filter criteria.'}
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isDeleting = deleteConfirmId === rev.id;

            return (
              <div
                key={rev.id}
                className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition shadow-md space-y-4"
              >
                {/* Header of review card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center justify-center font-bold text-sm">
                      {rev.name ? rev.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {rev.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Rating */}
                    <div className="flex items-center text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Delete action */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(rev.id)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition"
                        title="Delete query"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Email reply badge & direct action */}
                {rev.email ? (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Mail className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>
                        User Email: <strong>{rev.email}</strong>
                      </span>
                    </div>

                    <a
                      href={`mailto:${rev.email}?subject=Re:%20ScienceLab%20Explorer%20Inquiry%20(${encodeURIComponent(rev.category)})`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                    <span>Anonymous submission (No reply email provided)</span>
                  </div>
                )}

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {rev.message}
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Context: {rev.topicContext || 'General ScienceLab'}</span>
                  <span>ID: {rev.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
