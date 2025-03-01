import React, { useEffect, useState } from 'react';
import Layout from './components/templates/Layout';
import FlowchartEditor from './components/organisms/FlowchartEditor';
import { FlowchartData, User } from './types';
import { loadFromLocalStorage, loadFromShareableLink } from './lib/storage';
import { getCurrentUser } from './lib/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initialData, setInitialData] = useState<FlowchartData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
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
      
      setLoading(false);
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
        <div className="text-white text-xl">Loading...</div>
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