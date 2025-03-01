// @ts-nocheck
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkRequiredEnvVars } from './lib/envCheck';

// Verificar variáveis de ambiente
if (import.meta.env.DEV) {
  checkRequiredEnvVars();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
