import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex items-center gap-3 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/30 animate-in slide-in-from-left-4">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Working Offline — Progress will sync when online.</span>
    </div>
  );
};
