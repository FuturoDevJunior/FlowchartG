import { createClient } from '@supabase/supabase-js';
import { FlowchartData, User } from '../types';

// Tipagem para o ImportMeta
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log para depuração em ambiente de desenvolvimento
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl ? 'Configurado' : 'Não configurado');
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Configurado' : 'Não configurado');
}

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não estão configuradas corretamente.');
  console.error('Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no ambiente.');
}

export const supabase = createClient(
  supabaseUrl || 'https://elszktnjwhhbxrfteifr.supabase.co',
  supabaseAnonKey || 'fallback_key_apenas_para_evitar_erros_de_inicializacao'
);

// Authentication functions
export const signInWithEmail = async (email: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { error };
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  
  if (!data.user) return null;
  
  return {
    id: data.user.id,
    email: data.user.email || '',
  };
};

// Flowchart data functions
export const saveFlowchart = async (flowchartData: FlowchartData): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('flowcharts')
    .upsert({
      id: flowchartData.id,
      name: flowchartData.name,
      data: {
        nodes: flowchartData.nodes,
        connectors: flowchartData.connectors,
      },
      created_at: flowchartData.createdAt,
      updated_at: new Date().toISOString(),
    });

  return { error };
};

export const getFlowchart = async (id: string): Promise<{ data: FlowchartData | null; error: Error | null }> => {
  const { data, error } = await supabase
    .from('flowcharts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { data: null, error: error || new Error('Flowchart not found') };
  }

  const flowchartData: FlowchartData = {
    id: data.id,
    name: data.name,
    nodes: data.data.nodes,
    connectors: data.data.connectors,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return { data: flowchartData, error: null };
};

export const getUserFlowcharts = async (): Promise<{ data: FlowchartData[] | null; error: Error | null }> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('flowcharts')
    .select('*')
    .eq('user_id', user.user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const flowcharts: FlowchartData[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    nodes: item.data.nodes,
    connectors: item.data.connectors,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  return { data: flowcharts, error: null };
};

export const deleteFlowchart = async (id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('flowcharts')
    .delete()
    .eq('id', id);

  return { error };
};