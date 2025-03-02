// Import polyfills first for cross-browser compatibility
import './lib/fabricPolyfill';

// Core React imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Environment validation
import { checkRequiredEnvVars } from './lib/envCheck';

// Component imports
import App from './App.tsx';
import EnvironmentError from './components/atoms/EnvironmentError';

// Styles - loaded eagerly as they're small and critical
import './index.css';

// Check if environment is properly configured
const isConfigValid = checkRequiredEnvVars();

// Import das funções de compatibilidade
import { applyBrowserFixes, detectFeatures } from './utils/browserCompatibility';

// Aplicar correções para diferentes navegadores
applyBrowserFixes();

// Detectar recursos do navegador
const features = detectFeatures();

// Adicionar informações de features ao window para uso em componentes
window.browserFeatures = features;

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root')!);

if (isConfigValid) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<EnvironmentError />);
}

// Remover o loader inicial após o carregamento
window.addEventListener('load', () => {
  const loader = document.getElementById('initial-loader');
  if (loader && loader.parentNode) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 500);
  }
});
