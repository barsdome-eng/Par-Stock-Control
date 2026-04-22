import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for frequent ResizeObserver loop errors in modern browsers
if (typeof window !== 'undefined') {
  const isResizeObserverError = (msg: string) => 
    msg === 'ResizeObserver loop completed with undelivered notifications' || 
    msg === 'ResizeObserver loop limit exceeded' ||
    msg.includes('ResizeObserver loop completed');

  window.addEventListener('error', (e) => {
    if (isResizeObserverError(e.message)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && isResizeObserverError(e.reason.message)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
