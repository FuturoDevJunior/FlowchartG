import React, { useEffect, useState } from 'react';
import Layout from './components/templates/Layout';
import FlowchartEditor from './components/organisms/FlowchartEditor';
import { FlowchartData, User } from './types';
import { loadFromLocalStorage, loadFromShareableLink } from './lib/storage';
import { getCurrentUser, checkSupabaseConnection } from './lib/supabase';

// Adicionando um fallback global para o módulo LucidModeButton
if (typeof window !== 'undefined') {
  window.LucidModeButton = window.LucidModeButton || {};
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialData, setInitialData] = useState<FlowchartData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("🔄 Iniciando carregamento da aplicação...");
        
        // Verificar conexão com o Supabase usando try/catch para capturar todos os erros
        try {
          const isConnected = await checkSupabaseConnection();
          
          if (!isConnected) {
            console.error("❌ Erro de conexão com o Supabase. Verificando se podemos continuar com funcionalidade reduzida.");
            // Não bloqueamos a aplicação, apenas marcamos o estado de erro
            setConnectionError(true);
          } else {
            console.log("✅ Conexão com Supabase estabelecida.");
          }
        } catch (supabaseError) {
          console.error("❌ Erro ao verificar conexão Supabase:", supabaseError);
          setConnectionError(true);
          // Continue com o carregamento local
        }
        
        // Sempre tentamos carregar dados locais, mesmo com erro de conexão
        try {
          // Check if there's data in the URL hash
          const sharedData = loadFromShareableLink();
          
          if (sharedData) {
            console.log("📋 Dados carregados do link compartilhado.");
            setInitialData(sharedData);
          } else {
            // Otherwise, load from localStorage
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
        
        // Tentar autenticar o usuário, mas não bloquear se falhar
        try {
          if (!connectionError) {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              console.log("👤 Usuário autenticado:", currentUser.email);
            } else {
              console.log("👤 Usuário não autenticado. Usando modo anônimo.");
            }
            setUser(currentUser);
          }
        } catch (authError) {
          console.error("❌ Erro ao verificar autenticação:", authError);
          // Continue sem autenticação
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

  const handleAuthChange = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

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

  // Continuamos mesmo com connectionError, permitindo funcionalidade offline
  return (
    <Layout user={user} onAuthChange={handleAuthChange}>
      {connectionError && (
        <div className="bg-yellow-700 text-white px-4 py-2 text-center text-sm">
          Modo offline ativo - Salvamento na nuvem indisponível. Seus dados serão salvos localmente.
        </div>
      )}
      <FlowchartEditor
        initialData={initialData}
        isAuthenticated={!connectionError && !!user}
      />
    </Layout>
  );
}

export default App;