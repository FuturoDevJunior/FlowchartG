import React from 'react';

/**
 * Error component for environment configuration issues
 * Displayed when required environment variables are missing
 */
export const EnvironmentError: React.FC = () => (
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

export default EnvironmentError; 