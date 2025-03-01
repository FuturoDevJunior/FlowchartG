import React, { useEffect, useState } from 'react';
import Layout from './components/templates/Layout';
import FlowchartEditor from './components/organisms/FlowchartEditor';
import { FlowchartData } from './types';
import { loadFromLocalStorage, loadFromShareableLink } from './lib/storage';

// Adicionando um fallback global para o módulo LucidModeButton
if (typeof window !== 'undefined') {
  window.LucidModeButton = window.LucidModeButton || {};
}

function App() {
  const [initialData, setInitialData] = useState<FlowchartData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Função simples para carregar dados apenas localmente
    const loadInitialData = async () => {
      try {
        console.log("🔄 Iniciando carregamento da aplicação...");
        
        // Carregar dados do URL ou localStorage
        try {
          // Verificar se tem dados compartilhados via URL
          const sharedData = loadFromShareableLink();
          
          if (sharedData) {
            console.log("📋 Dados carregados do link compartilhado.");
            setInitialData(sharedData);
          } else {
            // Carregar do localStorage
            const localData = loadFromLocalStorage();
            if (localData) {
              console.log("📋 Dados carregados do armazenamento local.");
              setInitialData(localData);
            } else {
              console.log("📋 Nenhum dado inicial encontrado. Iniciando com fluxograma vazio.");
            }
          }
        } catch (storageError) {
          console.error("❌ Erro ao carregar dados armazenados:", storageError);
          setLoadError("Erro ao carregar dados armazenados. Iniciando com um novo fluxograma.");
        }
        
      } catch (error) {
        console.error("❌ Erro geral ao carregar aplicação:", error);
        setLoadError("Ocorreu um erro ao inicializar a aplicação. Por favor, tente novamente.");
      } finally {
        setLoading(false);
        console.log("✅ Carregamento inicial concluído.");
      }
    };
    
    loadInitialData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4">Erro ao Carregar</div>
        <div className="text-gray-300 max-w-md text-center">
          {loadError}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Interface simples sem login, sempre no modo "local"
  return (
    <Layout>
      <div className="bg-green-700 text-white px-4 py-2 text-center text-sm mb-2">
        Modo local: Seus diagramas são salvos automaticamente no seu navegador
      </div>
      <FlowchartEditor
        initialData={initialData}
        isAuthenticated={false}  // Sempre modo anônimo
      />
    </Layout>
  );
}

export default App;