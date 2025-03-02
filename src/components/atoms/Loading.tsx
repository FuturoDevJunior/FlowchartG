import React from 'react';

/**
 * Loading component that displays while App is loading
 * Used as a Suspense fallback
 */
export const Loading: React.FC = () => (
  <div className="app-loading-container">
    <div className="app-loading-spinner" />
    <p className="app-loading-text">Carregando FlowchartG...</p>
  </div>
);

export default Loading; 