// Import polyfill first
import './lib/fabricPolyfill';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// Import CSS normally as it's small
import './index.css';

// Lazy load the App component
const App = lazy(() => import('./App.tsx'));

// Loading component to show while App is loading
const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #ccc',
        borderTopColor: '#3498db',
        borderRadius: '50%',
        margin: '0 auto 20px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ fontFamily: 'system-ui, sans-serif', color: '#333' }}>
        Carregando FlowchartG...
      </p>
    </div>
  </div>
);

// Add loading animation
document.head.insertAdjacentHTML(
  'beforeend',
  `<style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>`
);

// Render the application with suspense
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);
