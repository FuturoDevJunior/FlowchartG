// @ts-nocheck
import './lib/fabricPolyfill'; // Importar polyfill antes de tudo
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkRequiredEnvVars } from './lib/envCheck';

// Verificar variáveis de ambiente
if (import.meta.env.DEV) {
  checkRequiredEnvVars();
}

// Verificar compatibilidade do navegador antes de renderizar
let canRender = true;

if (typeof window !== 'undefined' && window.ensureCanvasReady) {
  canRender = window.ensureCanvasReady();
}

// Renderizar a aplicação apenas se o navegador for compatível
if (canRender) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  // Mostrar uma mensagem de erro amigável
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #e53e3e; margin-bottom: 20px;">Navegador não compatível</h1>
        <p style="margin-bottom: 15px; line-height: 1.5;">
          Parece que seu navegador não suporta todas as tecnologias necessárias para executar o editor de fluxogramas.
        </p>
        <p style="margin-bottom: 15px; line-height: 1.5;">
          Por favor, tente usar uma versão recente de um dos seguintes navegadores:
        </p>
        <ul style="margin-bottom: 20px; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Google Chrome</li>
          <li style="margin-bottom: 8px;">Mozilla Firefox</li>
          <li style="margin-bottom: 8px;">Microsoft Edge</li>
          <li style="margin-bottom: 8px;">Safari (macOS)</li>
        </ul>
        <button onclick="window.location.reload()" style="background: #3182ce; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
          Tentar novamente
        </button>
      </div>
    `;
  }
}
