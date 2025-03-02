import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Hook para gerenciar o tema da aplicação
 * @returns Objeto com o tema atual e funções para gerenciá-lo
 */
function useTheme() {
  // Verificar preferência salva ou usar preferência do sistema
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Se houver uma preferência salva, usar
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme as Theme;
    }
    
    // Caso contrário, verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Padrão é tema claro
    return 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Atualizar a classe no HTML quando o tema mudar
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remover classes antigas
    root.classList.remove('light', 'dark');
    
    // Adicionar nova classe
    root.classList.add(theme);
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Alternar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Definir um tema específico
  const setThemeManually = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeManually,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };
}

export default useTheme; 