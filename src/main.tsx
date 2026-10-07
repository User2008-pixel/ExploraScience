import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Diagnostic initialization logger
const logInit = (stage: string, detail?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[INIT_DIAGNOSTIC] ${timestamp} - ${stage}`, detail || '');
};

logInit('Script Execution Started');

// Register service worker for offline support and installability
if ('serviceWorker' in navigator) {
  logInit('SW Support Detected, registering...');
  registerSW({
    immediate: true,
    onNeedRefresh() {
      logInit('SW: Update available, throttling reload to avoid loops...');
      try {
        const lastReload = sessionStorage.getItem('sw_last_reload');
        const now = Date.now();
        if (!lastReload || now - Number(lastReload) > 8000) {
          sessionStorage.setItem('sw_last_reload', String(now));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    },
    onOfflineReady() {
      logInit('SW: Ready for offline use');
    },
    onRegistered(r) {
      logInit('SW: Successfully registered', {
        scope: r?.scope,
        active: !!r?.active,
        installing: !!r?.installing,
        waiting: !!r?.waiting
      });
    },
    onRegisterError(error) {
      logInit('SW: Registration FAILED', error);
    }
  });
} else {
  logInit('SW: Not supported in this browser');
}

logInit('ReactDOM: Starting Root Creation');
const rootElement = document.getElementById('root');

if (!rootElement) {
  logInit('ReactDOM: FAILED - Root element not found');
} else {
  logInit('ReactDOM: Root element found, rendering...');
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  logInit('ReactDOM: Initial Render triggered');
}
