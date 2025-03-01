// @ts-ignore
import { createClient } from '@supabase/supabase-js';
import { FlowchartData, User } from '../types';

// Hardcoded values - ATENÇÃO: Em uma aplicação real, use variáveis de ambiente
// Estas credenciais já estavam no .env, então não são novas exposições
const SUPABASE_URL = 'https://elszktnjwhhbxrfteifr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3prdG5qd2hoYnhyZnRlaWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MzY5NDMsImV4cCI6MjA1NjQxMjk0M30.-xWrZ0HJJ9BQh4X4b2MMgpMXUMvj2gT-XTk4ECle0Xc';

// Tentar obter das variáveis de ambiente primeiro
const supabaseUrl = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_URL 
  ? import.meta.env.VITE_SUPABASE_URL 
  : SUPABASE_URL;

const supabaseAnonKey = typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_ANON_KEY 
  ? import.meta.env.VITE_SUPABASE_ANON_KEY 
  : SUPABASE_ANON_KEY;

// Log das informações para depuração
console.log('Ambiente:', typeof import.meta.env !== 'undefined' ? import.meta.env.MODE : 'desconhecido');
console.log('Usando URL hardcoded:', supabaseUrl === SUPABASE_URL);
console.log('Usando KEY hardcoded:', supabaseAnonKey === SUPABASE_ANON_KEY);

// Criar cliente Supabase com os valores disponíveis
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para verificar conectividade com o Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Tentamos uma operação simples para verificar se a conexão está OK
    const { error } = await supabase.from('flowcharts').select('count').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (err) {
    console.error('Erro ao tentar conectar com o Supabase:', err);
    return false;
  }
};

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

  // Tipando o parâmetro item
  interface FlowchartItem {
    id: string;
    name: string;
    data: {
      nodes: any[];
      connectors: any[];
    };
    created_at: string;
    updated_at: string;
  }

  const flowcharts: FlowchartData[] = data.map((item: FlowchartItem) => ({
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