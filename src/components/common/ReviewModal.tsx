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
  Lock,
  Mail,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserName?: string;
  activeContext?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  defaultUserName = '',
  activeContext = 'General ScienceLab',
}) => {
  const [name, setName] = useState(defaultUserName || '');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Suggestion' | 'Query' | 'Review' | 'Simulation Idea' | 'Bug Report'>('Suggestion');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (defaultUserName && !name) {
      setName(defaultUserName);
    }
  }, [defaultUserName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 3) {
      setErrorMessage('Please enter your suggestion or query (at least 3 characters).');
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMessage('Please enter a valid email format, or leave the email field empty.');
        return;
      }
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim() || 'Student Explorer',
        email: email.trim() || undefined,
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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send query. Please try again.');
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
    setEmail('');
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
        {/* Header Glow Accent */}
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
                  Send Review &amp; Queries
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                  Direct Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Share questions, simulation suggestions, or feedback directly with the creator.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {submitSuccess ? (
            /* SUBMIT SUCCESS SCREEN */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Review &amp; Query Dispatched!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your message has been securely forwarded to the creator.
                  {email ? ' The creator can reply directly to your email address.' : ''}
                </p>
              </div>

              {/* Privacy Reminder */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Privacy Safeguard Active</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>Your query was encrypted and forwarded to the creator&apos;s private inbox.</li>
                  {email ? (
                    <li>Your email was attached only for creator reply purposes. It is never displayed publicly.</li>
                  ) : (
                    <li>Submitted completely anonymously without personal contact data.</li>
                  )}
                  <li>The creator&apos;s email address remains securely protected by server proxy.</li>
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
            /* PUBLIC FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-white font-semibold">Protected Dispatch:</strong> Your message is sent directly to the creator&apos;s inbox via secure server proxy. Communications remain completely confidential.
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Your Name</span>
                  <span className="text-[10px] font-mono text-slate-400 font-normal">
                    (How you wish to be addressed)
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

              {/* Optional Email Field (for Creator Replies) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Your Email Address</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-normal">
                    (Optional — so the creator can reply)
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@school.edu (optional)"
                  maxLength={120}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-white text-xs placeholder:text-slate-500 outline-none transition"
                />
                <p className="text-[10.5px] text-slate-400 leading-normal">
                  If provided, the creator can hit &quot;Reply&quot; to answer your question. Your email is never public.
                </p>
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
                  Spam protected • Private dispatch
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
                        <span>Send Query</span>
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
