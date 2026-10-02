import React, { useEffect, useState } from 'react';
import { RotateCcw, X, ShieldAlert, Check } from 'lucide-react';

interface UndoToastProps {
  isOpen: boolean;
  onUndo: () => void;
  onDismiss: () => void;
  durationSeconds?: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  isOpen,
  onUndo,
  onDismiss,
  durationSeconds = 10,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (!isOpen) return;

    setSecondsRemaining(durationSeconds);
    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, endTime - now);
      const remainingSec = Math.ceil(remainingMs / 1000);
      setSecondsRemaining(remainingSec);

      if (remainingMs <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, durationSeconds, onDismiss]);

  if (!isOpen) return null;

  const percentRemaining = (secondsRemaining / durationSeconds) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-[#111A30] border-2 border-amber-500/70 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Animated 10s Depleting Progress Bar */}
        <div className="w-full h-1.5 bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-400 transition-all duration-100 ease-linear"
            style={{ width: `${percentRemaining}%` }}
          />
        </div>

        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 font-bold font-mono text-xs shadow-md shadow-amber-500/10">
              {secondsRemaining}s
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                Laboratory data cleared
              </p>
              <p className="text-[11px] text-amber-200/90 truncate">
                Accidental delete? You have {secondsRemaining} seconds to undo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onUndo}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
              <span>Undo ({secondsRemaining}s)</span>
            </button>
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
