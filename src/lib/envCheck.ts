/**
 * Environment variables validation utility
 * This module checks that all required environment variables are properly set
 */

export function checkRequiredEnvVars(): boolean {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(
    varName => typeof import.meta.env[varName] === 'undefined' || 
               import.meta.env[varName] === ''
  );

  if (missingVars.length > 0) {
    // Only log detailed errors in development mode
    if (import.meta.env.DEV) {
      console.error('❌ Required environment variables missing:');
      missingVars.forEach(varName => {
        console.error(`   - ${varName}`);
      });
      console.error('Please check your .env file or environment configuration');
    } else {
      console.error('Environment configuration error. Contact administrator if this persists.');
    }
    return false;
  }
  
  // Only log successful config in development
  if (import.meta.env.DEV) {
    console.log('✅ Environment variables validated successfully');
  }
  
  return true;
} 