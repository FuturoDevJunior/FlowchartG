import React, { useEffect, useState } from 'react';
import Layout from './components/templates/Layout';
import FlowchartEditor from './components/organisms/FlowchartEditor';
import { FlowchartData, User } from './types';
import { loadFromLocalStorage, loadFromShareableLink } from './lib/storage';
import { getCurrentUser, checkSupabaseConnection } from './lib/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialData, setInitialData] = useState<FlowchartData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Verificar conexão com o Supabase
        const isConnected = await checkSupabaseConnection();
        
        if (!isConnected) {
          console.error("Erro de conexão com o Supabase. Verifique as variáveis de ambiente.");
          setConnectionError(true);
          setLoading(false);
          return;
        }
        
        // Check if there's data in the URL hash
        const sharedData = loadFromShareableLink();
        
        if (sharedData) {
          setInitialData(sharedData);
        } else {
          // Otherwise, load from localStorage
          const localData = loadFromLocalStorage();
          if (localData) {
            setInitialData(localData);
          }
        }
        
        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setConnectionError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleAuthChange = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4">Erro de conexão com o Supabase</div>
        <div className="text-gray-300 max-w-md text-center">
          Não foi possível conectar ao backend. Por favor, verifique se as variáveis 
          de ambiente estão configuradas corretamente ou tente novamente mais tarde.
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

  return (
    <Layout user={user} onAuthChange={handleAuthChange}>
      <FlowchartEditor
        initialData={initialData}
        isAuthenticated={!!user}
      />
    </Layout>
  );
}

export default App;