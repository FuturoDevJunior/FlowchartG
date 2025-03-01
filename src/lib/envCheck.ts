/**
 * Script para verificar se as variáveis de ambiente necessárias estão presentes
 * Este arquivo deve ser importado no ponto de entrada da aplicação (main.tsx)
 */

// @ts-nocheck
export function checkRequiredEnvVars(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(
    varName => typeof import.meta.env[varName] === 'undefined' || 
               import.meta.env[varName] === ''
  );

  if (missingVars.length > 0) {
    console.error('⚠️ Variáveis de ambiente obrigatórias não encontradas:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('Por favor, configure estas variáveis no arquivo .env ou no painel do Vercel');
    console.error('Consulte o arquivo .env.example para mais informações');
  } else {
    console.log('✅ Todas as variáveis de ambiente necessárias estão configuradas');
    
    // Mostrar informações básicas para debug (sem revelar as chaves completas)
    if (import.meta.env.DEV) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKeyStart = import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10);
      
      console.log(`🔗 Supabase URL: ${supabaseUrl}`);
      console.log(`🔑 Supabase Key: ${supabaseKeyStart}...`);
      console.log(`🔧 Ambiente: ${import.meta.env.MODE}`);
    }
  }
} 