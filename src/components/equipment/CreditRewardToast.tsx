import React, { useEffect } from 'react';
import { Coins, X } from 'lucide-react';

interface CreditRewardToastProps {
  amount: number | null;
  reason: string;
  onDismiss: () => void;
}

export const CreditRewardToast: React.FC<CreditRewardToastProps> = ({
  amount,
  reason,
  onDismiss,
}) => {
  useEffect(() => {
    if (!amount) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [amount, onDismiss]);

  if (!amount) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in slide-in-from-top-4 duration-200 max-w-sm w-full">
      <div className="bg-[#111A30]/95 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-4 backdrop-blur-md flex items-center justify-between gap-3 ring-4 ring-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/30 shrink-0 animate-bounce">
            ⚛️
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-amber-300">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>+{amount} Science Credits!</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-tight mt-0.5">{reason}</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
