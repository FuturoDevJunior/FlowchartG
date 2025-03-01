// Import polyfills first for cross-browser compatibility
import './lib/fabricPolyfill';

// Core React imports
import React, { lazy, Suspense, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Environment validation
import { checkRequiredEnvVars } from './lib/envCheck';

// Styles - loaded eagerly as they're small and critical
import './index.css';

// Lazy-loaded component for better performance
const App = lazy(() => import('./App'));

// Loading component that displays while App is loading
const Loading = () => (
  <div className="app-loading-container">
    <div className="app-loading-spinner" />
    <p className="app-loading-text">Carregando FlowchartG...</p>
  </div>
);

// Error component for environment configuration issues
const EnvironmentError = () => (
  <div className="app-error-container">
    <div className="app-error-content">
      <h2 className="app-error-title">Erro de Configuração</h2>
      <p className="app-error-message">
        O aplicativo não pôde iniciar devido a um problema de configuração.
        Verifique se todas as variáveis de ambiente estão configuradas corretamente.
      </p>
      <p className="app-error-details">
        Se você é o administrador do sistema, verifique o console para mais detalhes.
      </p>
    </div>
  </div>
);

// Check if environment is properly configured
const isConfigValid = checkRequiredEnvVars();

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root')!);

if (isConfigValid) {
  root.render(
    <StrictMode>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </StrictMode>
  );
} else {
  root.render(<EnvironmentError />);
}
