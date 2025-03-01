import React, { useEffect, useState } from 'react';
import Layout from './components/templates/Layout';
import FlowchartEditor from './components/organisms/FlowchartEditor';
import { FlowchartData } from './types';
import { loadFromLocalStorage, loadFromShareableLink } from './lib/storage';

/**
 * Main FlowchartG Application Component
 * Handles data loading and initialization
 */
function App() {
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
        <div className="loading-spinner" />
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4">Erro ao Carregar</div>
        <div className="text-gray-300 max-w-md text-center mb-6">{loadError}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Main application render
  return (
    <Layout>
      <div className="bg-green-700 text-white px-4 py-2 text-center text-sm mb-2">
        Modo local: Seus diagramas são salvos automaticamente no seu navegador
      </div>
      <FlowchartEditor
        initialData={initialData}
        isAuthenticated={false}
      />
    </Layout>
  );
}

export default App;