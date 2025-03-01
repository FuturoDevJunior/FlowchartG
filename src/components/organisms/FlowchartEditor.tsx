import React, { useEffect, useRef, useState } from 'react';
import { FlowchartCanvas } from '../../lib/fabricCanvas';
import { FlowchartData } from '../../types';
import Toolbar from '../molecules/Toolbar';
import ShareModal from '../molecules/ShareModal';
import { saveToLocalStorage, generateShareableLink } from '../../lib/storage';
import Watermark from '../atoms/Watermark';

interface FlowchartEditorProps {
  initialData?: FlowchartData;
  isAuthenticated: boolean; // Mantido por compatibilidade, mas não será usado
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  initialData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FlowchartCanvas | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(initialData);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));
  const [canvasError, setCanvasError] = useState<string | null>(null);

  // Initialize canvas - com melhor tratamento de erros
  useEffect(() => {
    console.log("🔄 Inicializando canvas...");
    
    const initCanvas = () => {
      try {
        if (canvasRef.current && !fabricCanvasRef.current) {
          console.log("✅ Elemento canvas encontrado, criando instância FlowchartCanvas");
          
          // Ajuste o tamanho do canvas para o contêiner pai
          const container = canvasRef.current.parentElement;
          if (container) {
            canvasRef.current.width = container.clientWidth;
            canvasRef.current.height = container.clientHeight;
          }
          
          fabricCanvasRef.current = new FlowchartCanvas(
            'flowchart-canvas',
            initialData,
            handleFlowchartChange
          );
          
          console.log("✅ Canvas inicializado com sucesso");
          
          // Garantir que o canvas responda a eventos de redimensionamento
          window.addEventListener('resize', () => {
            if (container && canvasRef.current && fabricCanvasRef.current) {
              console.log("🔄 Redimensionando canvas...");
              canvasRef.current.width = container.clientWidth;
              canvasRef.current.height = container.clientHeight;
              fabricCanvasRef.current.handleResize();
            }
          });
        } else {
          console.warn("⚠️ Canvas já inicializado ou elemento não encontrado");
        }
      } catch (error) {
        console.error("❌ Erro ao inicializar canvas:", error);
        setCanvasError("Erro ao inicializar a área de desenho. Por favor, recarregue a página.");
      }
    };
    
    // Pequeno delay para garantir que o DOM esteja pronto
    setTimeout(initCanvas, 100);
    
    return () => {
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
  }, [initialData]);

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
    
    // Add node to the center of the canvas
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Elemento canvas não encontrado");
      return;
    }
    
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    
    try {
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

  // Se houver erro na inicialização do canvas
  if (canvasError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="bg-red-900 text-white p-4 rounded-lg max-w-md text-center">
          <h3 className="font-bold mb-2">Erro ao carregar o editor</h3>
          <p>{canvasError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-700 rounded hover:bg-red-600"
          >
            Recarregar
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
      />
      
      <div className="flex-1 relative overflow-hidden bg-gray-100">
        <canvas
          ref={canvasRef}
          id="flowchart-canvas"
          className="absolute inset-0"
          style={{ touchAction: 'none' }}  /* Importante para dispositivos touch */
        />
        
        {showTutorial && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg z-10 max-w-md">
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