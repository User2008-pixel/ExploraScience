import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) return null;

  const handleManualInstall = () => {
    setShowGuide(true);
  };

  return (
    <>
      <button
        onClick={isInstallable ? install : handleManualInstall}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 border border-emerald-400/30"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#131E36] border border-slate-700 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              Install ScienceLab
            </h3>
            
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              {isInIframe ? (
                <>
                  <p className="text-amber-400 font-bold">⚠️ Inside Preview Mode</p>
                  <p>Installation is blocked inside the preview window. To install:</p>
                  <p>1. Click the <span className="text-white font-bold">"Open in New Tab"</span> button (top-right of your screen).</p>
                  <p>2. Once the app opens in a full tab, click this <span className="text-white font-bold">Install App</span> button again.</p>
                </>
              ) : isIOS ? (
                <>
                  <p>1. Tap the <span className="text-white font-bold">Share</span> icon in the Safari toolbar.</p>
                  <p>2. Scroll down and tap <span className="text-white font-bold">Add to Home Screen</span>.</p>
                </>
              ) : (
                <>
                  <p>1. Open your browser's menu (usually three dots <span className="text-white font-bold">⋮</span> or lines <span className="text-white font-bold">≡</span>).</p>
                  <p>2. Look for <span className="text-white font-bold">"Install App"</span> or <span className="text-white font-bold">"Add to Home Screen"</span>.</p>
                  <p className="text-xs text-slate-400 italic mt-2">Note: For the best experience, use Google Chrome or Microsoft Edge.</p>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white hover:bg-slate-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
