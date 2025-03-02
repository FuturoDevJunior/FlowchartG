// Import polyfills first for cross-browser compatibility
import './lib/fabricPolyfill';

// Core React imports
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Environment validation
import { checkRequiredEnvVars } from './lib/envCheck';

// Component imports
import AppContainer from './components/templates/AppContainer';
import EnvironmentError from './components/atoms/EnvironmentError';

// Styles - loaded eagerly as they're small and critical
import './index.css';

// Check if environment is properly configured
const isConfigValid = checkRequiredEnvVars();

// Render the application
const root = ReactDOM.createRoot(document.getElementById('root')!);

if (isConfigValid) {
  root.render(
    <StrictMode>
      <AppContainer />
    </StrictMode>
  );
} else {
  root.render(<EnvironmentError />);
}
