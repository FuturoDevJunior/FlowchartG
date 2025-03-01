import React, { useEffect, useRef, useState } from 'react';
import { FlowchartCanvas } from '../../lib/fabricCanvas';
import { FlowchartData } from '../../types';
import Toolbar from '../molecules/Toolbar';
import ShareModal from '../molecules/ShareModal';
import { saveToLocalStorage, generateShareableLink } from '../../lib/storage';
import Watermark from '../atoms/Watermark';
import FallbackCanvas from '../atoms/FallbackCanvas';

interface FlowchartEditorProps {
  initialData?: FlowchartData;
  isAuthenticated: boolean; // Mantido por compatibilidade, mas não será usado
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  initialData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FlowchartCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(initialData);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Initialize canvas com garantia de visibilidade
  useEffect(() => {
    console.log("🔄 Inicializando canvas no FlowchartEditor...");
    setIsLoading(true);
    
    const initCanvas = () => {
      try {
        if (canvasRef.current && containerRef.current && !fabricCanvasRef.current) {
          console.log("✅ Elemento canvas encontrado, criando instância FlowchartCanvas");
          
          // Garantir que o global LucidModeButton existe
          if (typeof window.LucidModeButton === 'undefined') {
            window.LucidModeButton = {};
            console.log("⚠️ LucidModeButton não encontrado, criando um objeto vazio");
          }
          
          // Garantir que o canvas esteja limpo antes da inicialização
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          
          // Definir dimensões explícitas para o canvas e container
          const containerWidth = Math.min(window.innerWidth, containerRef.current.clientWidth || 800);
          const containerHeight = Math.min(window.innerHeight - 200, containerRef.current.clientHeight || 500);
          
          // Configuração absoluta de tamanho
          const canvasWidth = containerWidth - 40; // margem para segurança
          const canvasHeight = containerHeight - 40; // margem para segurança
          
          console.log(`Dimensões do container: ${containerWidth}x${containerHeight}`);
          console.log(`Dimensões do canvas: ${canvasWidth}x${canvasHeight}`);
          
          // Garantir que o DOM esteja atualizado
          if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasHeight;
            canvasRef.current.style.width = `${canvasWidth}px`;
            canvasRef.current.style.height = `${canvasHeight}px`;
            canvasRef.current.style.border = "1px solid #ccc";
            canvasRef.current.style.display = "block";
            canvasRef.current.style.backgroundColor = "#f8f8f8";
          }
          
          // Criar o canvas com dimensões explícitas
          fabricCanvasRef.current = new FlowchartCanvas(
            'flowchart-canvas',
            initialData,
            handleFlowchartChange,
            canvasWidth,
            canvasHeight
          );
          
          console.log("✅ Canvas inicializado com sucesso");
          setCanvasReady(true);
          setIsLoading(false);
          setFailedAttempts(0);
          
          // Configurar redimensionamento
          const handleWindowResize = () => {
            if (containerRef.current && canvasRef.current && fabricCanvasRef.current) {
              console.log("🔄 Redimensionando canvas...");
              
              // Redimensionar com valores seguros
              const newContainerWidth = Math.min(window.innerWidth, containerRef.current.clientWidth || 800);
              const newContainerHeight = Math.min(window.innerHeight - 200, containerRef.current.clientHeight || 500);
              
              const newWidth = newContainerWidth - 40;
              const newHeight = newContainerHeight - 40;
              
              console.log(`Novas dimensões do canvas: ${newWidth}x${newHeight}`);
              
              // Atualizar tamanho visual
              canvasRef.current.width = newWidth;
              canvasRef.current.height = newHeight;
              canvasRef.current.style.width = `${newWidth}px`;
              canvasRef.current.style.height = `${newHeight}px`;
              
              // Atualizar canvas fabric.js
              fabricCanvasRef.current.handleResize(newWidth, newHeight);
            }
          };
          
          window.addEventListener('resize', handleWindowResize);
          
          // Chamar o redimensionamento uma vez para garantir
          setTimeout(handleWindowResize, 300);
          
          return () => {
            window.removeEventListener('resize', handleWindowResize);
          };
        } else {
          console.warn("⚠️ Canvas já inicializado ou elemento não encontrado");
          if (!canvasRef.current) console.error("Canvas ref não encontrado");
          if (!containerRef.current) console.error("Container ref não encontrado");
          setIsLoading(false);
          
          if (!fabricCanvasRef.current) {
            setFailedAttempts(prev => prev + 1);
            throw new Error("Fabric Canvas não pôde ser inicializado");
          }
        }
      } catch (error) {
        console.error("❌ Erro ao inicializar canvas:", error);
        setCanvasError(`Erro ao inicializar a área de desenho: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        setIsLoading(false);
        setFailedAttempts(prev => prev + 1);
      }
    };
    
    // Dar um tempo para o DOM estar pronto
    const timeoutId = setTimeout(initCanvas, 500);
    
    return () => {
      clearTimeout(timeoutId);
      if (fabricCanvasRef.current) {
        try {
          console.log("🧹 Destruindo canvas...");
          fabricCanvasRef.current.destroy();
          fabricCanvasRef.current = null;
        } catch (error) {
          console.error("❌ Erro ao destruir canvas:", error);
        }
      }
    };
  }, [initialData, failedAttempts]);

  // Tutorial que desaparece após 15 segundos
  useEffect(() => {
    if (showTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(false);
        localStorage.setItem('tutorialSeen', 'true');
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  const handleFlowchartChange = (data: FlowchartData) => {
    console.log("🔄 Canvas modificado, salvando alterações");
    setFlowchartData(data);
    // Salvar automaticamente a cada mudança
    saveToLocalStorage(data);
  };

  const handleAddNode = (type: 'rectangle' | 'circle' | 'diamond') => {
    console.log(`🔄 Adicionando nó do tipo: ${type}`);
    if (!fabricCanvasRef.current) {
      console.error("❌ Canvas não inicializado");
      alert("Erro: Canvas não inicializado. Tente recarregar a página.");
      return;
    }
    
    // Obter o centro do canvas visível
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Elemento canvas não encontrado");
      return;
    }
    
    try {
      // Adicionar no centro do canvas
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      
      console.log(`Tentando adicionar em: ${x}x${y}`);
      fabricCanvasRef.current.addNode(type, x, y);
      console.log(`✅ Nó ${type} adicionado com sucesso em x:${x}, y:${y}`);
    } catch (error) {
      console.error("❌ Erro ao adicionar nó:", error);
      alert("Erro ao adicionar forma. Tente novamente.");
    }
  };

  const handleAddConnector = () => {
    console.log("🔄 Ativando/desativando modo de conexão");
    if (!fabricCanvasRef.current) {
      console.error("❌ Canvas não inicializado");
      alert("Erro: Canvas não inicializado. Tente recarregar a página.");
      return;
    }
    
    if (isConnecting) {
      // Cancel connecting mode
      setIsConnecting(false);
      setConnectingNodeId(null);
      console.log("✅ Modo de conexão desativado");
    } else {
      // Start connecting mode
      setIsConnecting(true);
      console.log("✅ Modo de conexão ativado");
      
      // Instrução mais clara
      alert('Clique no primeiro nó e depois no segundo nó para conectá-los');
    }
  };

  const handleDelete = () => {
    console.log("🔄 Excluindo objetos selecionados");
    if (!fabricCanvasRef.current) {
      console.error("❌ Canvas não inicializado");
      return;
    }
    
    try {
      // Implementar a exclusão dos objetos selecionados
      fabricCanvasRef.current.deleteSelectedObjects();
      console.log("✅ Objetos excluídos com sucesso");
    } catch (error) {
      console.error("❌ Erro ao excluir objetos:", error);
    }
  };

  const handleExport = (format: 'png' | 'svg') => {
    console.log(`🔄 Exportando fluxograma como ${format}`);
    if (!fabricCanvasRef.current) {
      console.error("❌ Canvas não inicializado");
      return;
    }
    
    try {
      const dataUrl = fabricCanvasRef.current.exportAsImage(format);
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `flowchart.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`✅ Fluxograma exportado como ${format}`);
    } catch (error) {
      console.error(`❌ Erro ao exportar como ${format}:`, error);
      alert(`Erro ao exportar como ${format}. Tente novamente.`);
    }
  };

  const handleShare = () => {
    console.log("🔄 Gerando link compartilhável");
    if (!fabricCanvasRef.current || !flowchartData) {
      console.error("❌ Canvas não inicializado ou dados não disponíveis");
      return;
    }
    
    try {
      const link = generateShareableLink(flowchartData);
      setShareableLink(link);
      setShareModalOpen(true);
      console.log("✅ Link compartilhável gerado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao gerar link compartilhável:", error);
      alert("Erro ao gerar link compartilhável. Tente novamente.");
    }
  };

  const handleSave = async () => {
    console.log("🔄 Salvando fluxograma localmente");
    if (!fabricCanvasRef.current || !flowchartData) {
      console.error("❌ Canvas não inicializado ou dados não disponíveis");
      return;
    }
    
    try {
      // Salvar apenas localmente
      saveToLocalStorage(flowchartData);
      console.log("✅ Fluxograma salvo localmente com sucesso");
      alert('Fluxograma salvo localmente com sucesso!');
    } catch (error) {
      console.error("❌ Erro ao salvar localmente:", error);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

  const handleRetryCanvas = () => {
    setCanvasError(null);
    setIsLoading(true);
    setFailedAttempts(prev => prev + 1);
    
    // Limpar referências
    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.destroy();
      } catch (e) {
        console.error("Erro ao destruir canvas:", e);
      }
      fabricCanvasRef.current = null;
    }
  };

  // Se houver muitas tentativas falhas, mostrar o fallback
  if (failedAttempts >= 3) {
    return (
      <div className="flex flex-col h-full">
        <Toolbar
          onAddNode={handleAddNode}
          onAddConnector={handleAddConnector}
          onDelete={handleDelete}
          onExport={handleExport}
          onShare={handleShare}
          onSave={handleSave}
          isConnecting={isConnecting}
          disabled={true}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <FallbackCanvas 
            error={canvasError || "Não foi possível inicializar o editor após várias tentativas."} 
            onRetry={handleRetryCanvas} 
          />
        </div>
        <Watermark />
      </div>
    );
  }

  // Se houver erro na inicialização do canvas
  if (canvasError && failedAttempts < 3) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="bg-red-900 text-white p-4 rounded-lg max-w-md text-center">
          <h3 className="font-bold mb-2">Erro ao carregar o editor</h3>
          <p>{canvasError}</p>
          <button 
            onClick={handleRetryCanvas}
            className="mt-3 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        onAddNode={handleAddNode}
        onAddConnector={handleAddConnector}
        onDelete={handleDelete}
        onExport={handleExport}
        onShare={handleShare}
        onSave={handleSave}
        isConnecting={isConnecting}
        disabled={!canvasReady}
      />
      
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 bg-gray-100 overflow-hidden"
        style={{ minHeight: '70vh' }}
      >
        <div className="relative border-2 border-gray-400 rounded-lg shadow-lg bg-white" 
             style={{ 
               width: '95%', 
               height: '95%', 
               maxWidth: '1600px', 
               maxHeight: '800px',
               position: 'relative',
               overflow: 'hidden'
             }}>
          <canvas
            ref={canvasRef}
            id="flowchart-canvas"
            className="absolute inset-0 z-10"
            style={{ 
              touchAction: 'none', 
              display: 'block',
              border: '1px solid #ccc',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
            }}
          />
          
          {(isLoading || !canvasReady) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
              <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-xl text-gray-700">Carregando editor...</div>
                <p className="text-sm text-gray-500 mt-2">
                  Pode demorar alguns segundos na primeira vez
                </p>
              </div>
            </div>
          )}
        </div>
        
        {showTutorial && canvasReady && (
          <div className="absolute top-24 right-8 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg z-30 max-w-md">
            <h3 className="font-bold mb-2">Como usar:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Clique em "Retângulo", "Círculo" ou "Losango" para adicionar um nó</li>
              <li>Clique duas vezes em um nó para editar o texto</li>
              <li>Use "Conectar" para criar linhas entre os nós</li>
              <li>Tudo é salvo automaticamente no seu navegador</li>
            </ol>
            <button 
              onClick={() => {
                setShowTutorial(false);
                localStorage.setItem('tutorialSeen', 'true');
              }}
              className="mt-2 px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700"
            >
              Entendi!
            </button>
          </div>
        )}
      </div>
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareableLink={shareableLink}
      />
      
      <Watermark />
    </div>
  );
};

export default FlowchartEditor;