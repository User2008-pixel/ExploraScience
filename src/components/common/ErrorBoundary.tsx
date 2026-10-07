import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      this.setState({ hasError: false, error: null });
    } catch {}
    window.location.href = '/';
  };

  private handleClearCorruptCacheAndReload = () => {
    try {
      localStorage.removeItem('sciencelab_explorer_progress_v1');
      localStorage.removeItem('sciencelab_user_profile_v1');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 text-slate-100">
          <div className="max-w-md w-full bg-[#131E36] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                The laboratory encountered an unexpected rendering error. This can happen due to corrupted local data or a temporary glitch.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left overflow-hidden">
                <p className="text-[10px] font-mono text-rose-300 truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Laboratory
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </button>

              <button
                onClick={this.handleClearCorruptCacheAndReload}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30 transition flex items-center justify-center gap-2"
              >
                <span>Reset Corrupted Local Data & Restart</span>
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 italic">
              If the problem persists, try clearing your browser cache or opening the app in a new tab.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
