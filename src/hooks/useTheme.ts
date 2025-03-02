import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface UseThemeResult {
  /**
   * Tema atual (light, dark ou system)
   */
  theme: Theme;
  
  /**
   * Tema efetivo aplicado (light ou dark)
   * Se o tema for "system", retorna o tema do sistema operacional
   */
  effectiveTheme: 'light' | 'dark';
  
  /**
   * Alterna entre tema claro e escuro
   */
  toggleTheme: () => void;
  
  /**
   * Define um tema específico
   */
  setTheme: (theme: Theme) => void;
}

/**
 * Hook para gerenciar o tema da aplicação (claro/escuro)
 */
export function useTheme(): UseThemeResult {
  // Estado para armazenar o tema selecionado pelo usuário
  const [theme, setThemeState] = useState<Theme>(() => {
    // Recuperar tema do localStorage ou usar padrão
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'system';
  });
  
  // Estado para armazenar o tema do sistema (claro/escuro)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    // Verificar preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Efeito para atualizar o tema quando a preferência do sistema mudar
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Adicionar listener para mudanças na preferência do sistema
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup: remover listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Efeito para aplicar o tema ao documento
  useEffect(() => {
    // Determinar o tema efetivo (real)
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    // Aplicar classe para alternar entre temas
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Adicionar classe após pequeno delay para permitir transição suave
    setTimeout(() => {
      document.documentElement.classList.add('theme-transition-ready');
    }, 100);
  }, [theme, systemTheme]);
  
  // Função para alternar entre temas (claro/escuro)
  const toggleTheme = useCallback(() => {
    const currentEffectiveTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = currentEffectiveTheme === 'light' ? 'dark' : 'light';
    
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme, systemTheme]);
  
  // Função para definir um tema específico
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);
  
  return {
    theme,
    effectiveTheme: theme === 'system' ? systemTheme : theme,
    toggleTheme,
    setTheme,
  };
} 