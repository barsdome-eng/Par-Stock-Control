import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for frequent ResizeObserver loop errors in modern browsers
if (typeof window !== 'undefined') {
  const isResizeObserverError = (msg: string | any) => {
    if (!msg) return false;
    const message = typeof msg === 'string' ? msg : (msg.message || String(msg));
    return (
      message.includes('ResizeObserver') ||
      message.includes('loop limit exceeded') ||
      message.includes('undelivered notifications')
    );
  };

  // Handle standard errors
  window.addEventListener('error', (e) => {
    if (isResizeObserverError(e.message) || (e.error && isResizeObserverError(e.error.message))) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && isResizeObserverError(e.reason.message)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  // Also suppress via console.error for browsers that log it directly
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const isError = args.some(arg => {
      const msg = typeof arg === 'string' ? arg : (arg?.message || '');
      return typeof msg === 'string' && isResizeObserverError(msg);
    });
    
    if (isError) return;
    originalConsoleError.apply(console, args);
  };

  // Some browsers might log it as a warning
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const isError = args.some(arg => {
      const msg = typeof arg === 'string' ? arg : (arg?.message || '');
      return typeof msg === 'string' && isResizeObserverError(msg);
    });
    
    if (isError) return;
    originalConsoleWarn.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
