import React, { lazy, Suspense } from 'react';
import Loading from '../atoms/Loading';

// Lazy-loaded component for better performance
const App = lazy(() => import('../../App'));

/**
 * Application container component
 * Handles lazy loading and Suspense fallback
 */
export const AppContainer: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  );
};

export default AppContainer; 