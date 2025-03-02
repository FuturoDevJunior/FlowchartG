import React, { useState } from 'react';
import { useTheme, Theme } from '../hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { DATA_TEST_IDS } from '../constants/testIds';

interface ThemeToggleProps {
  /**
   * Classe CSS adicional
   */
  className?: string;
  
  /**
   * Se verdadeiro, mostra opção para usar tema do sistema
   * @default true
   */
  showSystemOption?: boolean;
}

/**
 * Componente para alternar entre temas claro e escuro
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showSystemOption = true
}) => {
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Alternância simples entre claro/escuro quando não mostra opção de sistema
  const handleSimpleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Seleção de tema específico via menu dropdown
  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setDropdownOpen(false);
  };
  
  // Toggle do dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`theme-toggle ${className}`} data-cy={DATA_TEST_IDS.THEME_TOGGLE}>
      {showSystemOption ? (
        // Menu dropdown com todas as opções
        <div className="relative inline-block">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Selecionar tema"
            data-cy={DATA_TEST_IDS.THEME_DROPDOWN_BUTTON}
            onClick={toggleDropdown}
          >
            {theme === 'light' && <Sun size={22} className="text-text-primary" />}
            {theme === 'dark' && <Moon size={22} className="text-text-primary" />}
            {theme === 'system' && <Monitor size={22} className="text-text-primary" />}
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-node-bg border border-node-stroke z-10"
                 data-cy={DATA_TEST_IDS.EXPORT_MENU}>
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button 
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'light' ? 'bg-highlight bg-opacity-20' : ''}`}
                  onClick={() => handleThemeSelect('light')}
                  data-cy={DATA_TEST_IDS.THEME_OPTION('light')}
                >
                  <Sun size={16} />
                  <span>Claro</span>
                </button>
                
                <button 
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-highlight bg-opacity-20' : ''}`}
                  onClick={() => handleThemeSelect('dark')}
                  data-cy={DATA_TEST_IDS.THEME_OPTION('dark')}
                >
                  <Moon size={16} />
                  <span>Escuro</span>
                </button>
                
                <button 
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'system' ? 'bg-highlight bg-opacity-20' : ''}`}
                  onClick={() => handleThemeSelect('system')}
                  data-cy={DATA_TEST_IDS.THEME_OPTION('system')}
                >
                  <Monitor size={16} />
                  <span>Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Botão simples para alternar entre claro/escuro
        <button 
          onClick={handleSimpleToggle}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
          data-cy={DATA_TEST_IDS.THEME_TOGGLE_BUTTON}
        >
          {theme === 'light' ? (
            <Moon size={22} className="text-text-primary" />
          ) : (
            <Sun size={22} className="text-text-primary" />
          )}
        </button>
      )}
    </div>
  );
};

export default ThemeToggle; 