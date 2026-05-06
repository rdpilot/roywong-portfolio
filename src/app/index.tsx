import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../styles/index.css';

// Comprehensive error suppression for Figma's iframe infrastructure errors
// These errors come from Figma Make's own iframe environment, not from user code

// 1. Suppress window errors
window.addEventListener('error', (event) => {
  const errorMessage = event.message || event.error?.message || '';
  if (
    errorMessage.includes('IframeMessageAbortError') ||
    errorMessage.includes('Message aborted') ||
    errorMessage.includes('message port was destroyed')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}, true); // Use capture phase to catch early

// 2. Suppress unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || '';
  if (
    errorMessage.includes('IframeMessageAbortError') ||
    errorMessage.includes('Message aborted') ||
    errorMessage.includes('message port was destroyed')
  ) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

// 3. Suppress console errors
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorMessage = args.map(arg => 
    typeof arg === 'string' ? arg : arg?.message || arg?.toString() || ''
  ).join(' ');
  
  if (
    errorMessage.includes('IframeMessageAbortError') ||
    errorMessage.includes('Message aborted') ||
    errorMessage.includes('message port was destroyed')
  ) {
    return; // Silent ignore
  }
  
  originalConsoleError.apply(console, args);
};

// 4. Suppress console warnings
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  const warnMessage = args.map(arg => 
    typeof arg === 'string' ? arg : arg?.message || arg?.toString() || ''
  ).join(' ');
  
  if (
    warnMessage.includes('IframeMessageAbortError') ||
    warnMessage.includes('Message aborted') ||
    warnMessage.includes('message port was destroyed')
  ) {
    return; // Silent ignore
  }
  
  originalConsoleWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);