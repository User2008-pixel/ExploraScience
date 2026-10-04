import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Star,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Lightbulb,
  HelpCircle,
  FlaskConical,
  Bug,
  Inbox,
  Trash2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserName?: string;
  activeContext?: string;
  initialView?: 'form' | 'inbox';
}

interface StoredReviewItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  topicContext?: string;
  message: string;
  createdAt: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  defaultUserName = '',
  activeContext = 'General ScienceLab',
  initialView = 'form',
}) => {
  const [activeView, setActiveView] = useState<'form' | 'inbox'>(initialView);
  const [name, setName] = useState(defaultUserName || '');
  const [category, setCategory] = useState<'Suggestion' | 'Query' | 'Review' | 'Simulation Idea' | 'Bug Report'>('Suggestion');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inbox state for reading received reviews
  const [reviewsList, setReviewsList] = useState<StoredReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialView);
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (defaultUserName && !name) {
      setName(defaultUserName);
    }
  }, [defaultUserName]);

  useEffect(() => {
    if (isOpen && activeView === 'inbox') {
      fetchReviews();
    }
  }, [isOpen, activeView]);

  if (!isOpen) return null;

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data.reviews || []);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviewsList((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete review:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('Please enter your suggestion or query before sending.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim() || 'Student Explorer',
        category,
        rating,
        message: message.trim(),
        topicContext: activeContext,
      };

      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to send review. Please try again.');
      }

      setSubmitSuccess(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndNew = () => {
    setMessage('');
    setSubmitSuccess(false);
    setErrorMessage(null);
  };

  const categories = [
    { id: 'Suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { id: 'Query', label: 'Query / Question', icon: HelpCircle, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { id: 'Review', label: 'Appreciation & Review', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'Simulation Idea', label: 'Lab / Sim Idea', icon: FlaskConical, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { id: 'Bug Report', label: 'Correction / Bug', icon: Bug, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ] as const;

  const ratingDescriptions = [
    '',
    'Needs Improvement',
    'Fair & Functional',
    'Good & Helpful',
    'Superb Simulation',
    'World-Class STEM Lab! ⚛️',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative my-6">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />

        {/* Modal Top Bar */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {activeView === 'form' ? 'Send Review & Suggestions' : 'Creator Inbox (Name Only)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                  Direct Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeView === 'form'
                  ? 'Email the creator directly for queries, ideas, or feedback.'
                  : 'All reviews received by the creator with privacy safeguards active.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveView(activeView === 'form' ? 'inbox' : 'form');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition flex items-center gap-1.5"
              title={activeView === 'form' ? 'View Creator Inbox' : 'Back to Send Form'}
            >
              {activeView === 'form' ? (
                <>
                  <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Creator Inbox</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">New Review</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {activeView === 'inbox' ? (
            /* CREATOR INBOX VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400">
                  Received Reviews ({reviewsList.length})
                </div>
                <button
                  onClick={fetchReviews}
                  className="text-xs text-cyan-400 hover:underline font-mono"
                >
                  Refresh
                </button>
              </div>

              {isLoadingReviews ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  Loading suggestions &amp; reviews...
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No reviews yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Be the first to send a query, suggestion, or rating to the creator!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {rev.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {rev.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {rev.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80">
                        <span>Context: {rev.topicContext || 'General'}</span>
                        <span>{new Date(rev.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : submitSuccess ? (
            /* SUBMIT SUCCESS SCREEN */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Review &amp; Query Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your feedback and suggestions have been securely forwarded to the creator.
                </p>
              </div>

              {/* Strict Privacy Reminder */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Privacy Integrity Maintained</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>The creator can only see your name (<strong>{name || 'Student Explorer'}</strong>).</li>
                  <li>No email address, phone number, location, or credentials were captured.</li>
                  <li>The creator's private contact details remain protected on the secure server.</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetAndNew}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition"
                >
                  Send Another Query
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-white font-semibold">Zero-Data Exposure:</strong> The creator's email address is kept private and hidden on the server. In return, only your name is shared—no email, phone, or personal details are collected.
                </div>
              </div>

              {/* Name Field (Only Personal Detail Collected) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Your Name</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-normal">
                    (Only personal detail shown to creator)
                  </span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Aryan, Priya, or Student Explorer)"
                  maxLength={80}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-white text-xs placeholder:text-slate-500 outline-none transition"
                />
              </div>

              {/* Category Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const isSelected = category === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
                          isSelected
                            ? `${cat.color} shadow-sm font-bold`
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Rating
                  </label>
                  <span className="text-[11px] font-mono text-amber-400">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700 hover:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Message Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Your Suggestion or Query
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {message.length}/3000
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share ideas for new formulas, questions about experiments, or features you would like added..."
                  rows={4}
                  maxLength={3000}
                  className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-white text-xs placeholder:text-slate-500 outline-none transition resize-none leading-relaxed"
                />
              </div>

              {/* Context Tag */}
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <span className="text-slate-500">Attached Context:</span>
                <span className="text-cyan-400 truncate">{activeContext}</span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  No spam • Direct server proxy
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-slate-950" />
                        <span>Email Creator</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
