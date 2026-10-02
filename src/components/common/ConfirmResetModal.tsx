import React from 'react';
import { AlertTriangle, X, RotateCcw, ShieldAlert } from 'lucide-react';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  experimentsCount: number;
  mistakesCount: number;
  streakDays: number;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  experimentsCount,
  mistakesCount,
  streakDays,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#111A30] border border-rose-500/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-rose-950/40 border-b border-rose-900/50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md shadow-rose-500/10">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Reset All Laboratory Data?
              </h3>
              <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider">
                Permanent Action Confirmation
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Are you sure you want to erase all your progress? The following laboratory records will be reset:
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span>Completed Detective Cases:</span>
              <span className="text-rose-400 font-bold">{experimentsCount} experiments</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Logged Mistake Insights:</span>
              <span className="text-rose-400 font-bold">{mistakesCount} records</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Active Investigation Streak:</span>
              <span className="text-rose-400 font-bold">{streakDays} days</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Don't worry: If you delete by accident, an <strong>Undo button</strong> will appear on screen for <strong>10 seconds</strong> to instantly restore your data!
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yes, Reset All Data</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
