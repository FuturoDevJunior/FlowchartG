import React from 'react';

interface FallbackCanvasProps {
  error?: string;
  onRetry: () => void;
}

/**
 * Um componente de fallback que é mostrado quando o canvas principal não carrega
 */
const FallbackCanvas: React.FC<FallbackCanvasProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg border-2 border-gray-300 p-8 m-4 shadow-lg w-full max-w-lg mx-auto text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="80" 
        height="80" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#ff4d4d" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="mb-4"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Não foi possível carregar o editor de fluxogramas
      </h2>
      
      {error && (
        <p className="text-gray-600 mb-4 bg-red-50 p-3 rounded border border-red-100">
          {error}
        </p>
      )}
      
      <p className="text-gray-600 mb-6">
        Isso pode ocorrer por vários motivos:
      </p>
      
      <ul className="text-left text-gray-700 mb-6 list-disc pl-6">
        <li className="mb-1">Seu navegador pode estar bloqueando scripts</li>
        <li className="mb-1">A conexão com a internet pode estar instável</li>
        <li className="mb-1">A biblioteca fabric.js pode não ser compatível com seu navegador</li>
        <li className="mb-1">O navegador pode ter restrições de memória</li>
      </ul>
      
      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Recarregar página
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        Também sugerimos tentar em outro navegador, como Chrome ou Firefox.
      </div>
    </div>
  );
};

export default FallbackCanvas; 