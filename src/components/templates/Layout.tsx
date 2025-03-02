import React from 'react';
import { Download, Share, Github, Moon, Sun } from 'lucide-react';
import Button from '../atoms/Button';
import useTheme from '../../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Usando o hook de tema
  const { toggleTheme, isDark } = useTheme();

  // Função para exportar o diagrama
  const handleExport = () => {
    // Esta função será implementada posteriormente
    alert('Função de exportação será implementada em breve!');
  };

  // Função para compartilhar
  const handleShare = () => {
    // Esta função será implementada posteriormente
    const shareableUrl = window.location.href;
    navigator.clipboard.writeText(shareableUrl);
    alert('Link copiado para a área de transferência! Compartilhe com quem quiser.');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-[#2A2A2A] text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} p-4 flex items-center justify-between border-b`}>
        <div className="flex items-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
              stroke="#00FF88"
              strokeWidth="2"
            />
            <path
              d="M8 12H16M16 12L12 8M16 12L12 16"
              stroke="#00FF88"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold">FlowchartG</h1>
          <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Crie fluxogramas facilmente</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleExport}
            className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
          >
            <Download size={18} className="mr-1" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleShare}
            className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
          >
            <Share size={18} className="mr-1" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          
          <a 
            href="https://github.com/FuturoDevJunior/FlowchartG" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center px-3 py-1.5 text-sm ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'} rounded-md transition-colors`}
          >
            <Github size={18} className="mr-1" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <footer className={`${isDark ? 'bg-[#1A1A1A] text-gray-400' : 'bg-gray-100 text-gray-600'} text-xs p-2 text-center`}>
        FlowchartG - Ferramenta simples para criação de fluxogramas. Dados salvos apenas localmente.
      </footer>
    </div>
  );
};

export default Layout;