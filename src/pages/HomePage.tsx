import React, { useEffect, useState, lazy, Suspense } from 'react';
import Layout from '../components/templates/Layout';
// import FlowchartEditor from '../components/organisms/FlowchartEditor';
import { FlowchartData } from '../types';
import { loadFromLocalStorage, loadFromShareableLink } from '../lib/storage';

// Carregamento lazy do componente que utiliza canvas
const FlowchartEditor = lazy(() => import('../components/organisms/FlowchartEditor'));

// Loading component to show while FlowchartEditor is loading
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-800 flex items-center justify-center">
    <div className="loading-spinner" data-cy="loading-spinner" />
    <p className="text-white ml-3">Carregando editor...</p>
  </div>
);

/**
 * HomePage Component - Main flowchart editing page
 * Handles loading data from local storage or shared links
 */
function HomePage() {
  const [initialData, setInitialData] = useState<FlowchartData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load initial data on component mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Check for shared data first (from URL hash)
        const sharedData = loadFromShareableLink();
        
        if (sharedData) {
          console.log("📋 Dados carregados do link compartilhado");
          setInitialData(sharedData);
        } else {
          // If no shared data, try to load from localStorage
          const localData = loadFromLocalStorage();
          if (localData) {
            console.log("📋 Dados carregados do armazenamento local");
            setInitialData(localData);
          } else {
            console.log("📋 Iniciando com fluxograma vazio");
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        setLoadError("Ocorreu um erro ao carregar os dados. Iniciando com um novo fluxograma.");
      } finally {
        setLoading(false);
      }
    }
    
    loadInitialData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="loading-spinner" data-cy="loading-spinner" />
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4" data-cy="error-title">Erro ao Carregar</div>
        <div className="text-gray-300 max-w-md text-center mb-6" data-cy="error-message">{loadError}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          data-cy="retry-button"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Main application render - local storage only version
  return (
    <Layout>
      <div className="bg-green-700 text-white px-4 py-2 text-center text-sm mb-2" data-cy="local-mode-banner">
        Modo local: Seus diagramas são salvos automaticamente no seu navegador
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <FlowchartEditor
          initialData={initialData}
        />
      </Suspense>
    </Layout>
  );
}

export default HomePage; 