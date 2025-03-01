import { createClient } from '@supabase/supabase-js';
import { FlowchartData, User } from '../types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check Supabase connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('flowcharts').select('count').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
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