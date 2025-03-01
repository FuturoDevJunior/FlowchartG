import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
// Remove the direct import and use dynamic import later
// import { FlowchartCanvas } from '../../lib/fabricCanvas';
import { FlowchartData } from '../../types';
import Toolbar from '../molecules/Toolbar';
import ShareModal from '../molecules/ShareModal';
import { saveToLocalStorage, generateShareableLink } from '../../lib/storage';
import Watermark from '../atoms/Watermark';

// Type for the dynamically imported FlowchartCanvas
type FlowchartCanvasType = import('../../lib/fabricCanvas').FlowchartCanvas;

interface FlowchartEditorProps {
  initialData?: FlowchartData;
  isAuthenticated: boolean;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  initialData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FlowchartCanvasType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(initialData);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));
  const [isLoading, setIsLoading] = useState(true);

  // Simplificado - Initialize canvas
  useEffect(() => {
    setIsLoading(true);
    
    const initCanvas = async () => {
      if (canvasRef.current && containerRef.current && !fabricCanvasRef.current) {
        // Dimensões com base no container
        const containerWidth = containerRef.current.clientWidth || 800;
        const containerHeight = containerRef.current.clientHeight || 500;
        
        // Definir tamanho do canvas
        const canvasWidth = containerWidth - 20;
        const canvasHeight = containerHeight - 20;
        
        // Definir dimensões visuais do elemento canvas
        if (canvasRef.current) {
          canvasRef.current.width = canvasWidth;
          canvasRef.current.height = canvasHeight;
          canvasRef.current.style.width = `${canvasWidth}px`;
          canvasRef.current.style.height = `${canvasHeight}px`;
        }
        
        try {
          // Dynamically import the FlowchartCanvas
          const { FlowchartCanvas } = await import('../../lib/fabricCanvas');
          
          // Inicializar a classe FlowchartCanvas
          fabricCanvasRef.current = new FlowchartCanvas(
            'flowchart-canvas',
            initialData,
            handleFlowchartChange,
            canvasWidth,
            canvasHeight
          );
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading canvas:", error);
          setIsLoading(false);
        }
      }
    };
    
    // Dar tempo para o DOM renderizar
    const timeoutId = setTimeout(initCanvas, 200);
    
    return () => {
      clearTimeout(timeoutId);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.destroy();
        fabricCanvasRef.current = null;
      }
    };
  }, [initialData]);

  // Tutorial que desaparece
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
    setFlowchartData(data);
    // Salvar automaticamente
    saveToLocalStorage(data);
  };

  const handleAddNode = (type: 'rectangle' | 'circle' | 'diamond') => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    
    try {
      // Adicionar no centro do canvas
      const x = canvasRef.current.width / 2;
      const y = canvasRef.current.height / 2;
      
      fabricCanvasRef.current.addNode(type, x, y);
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Erro ao adicionar forma. Tente novamente.");
    }
  };

  const handleAddConnector = () => {
    if (!fabricCanvasRef.current) return;
    
    if (isConnecting) {
      // Cancel connecting mode
      setIsConnecting(false);
    } else {
      // Start connecting mode
      setIsConnecting(true);
      alert('Clique no primeiro nó e depois no segundo nó para conectá-los');
    }
  };

  const handleDelete = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.deleteSelectedObjects();
  };

  const handleExport = (format: 'png' | 'svg') => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const dataUrl = fabricCanvasRef.current.exportAsImage(format);
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `flowchart.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error exporting:`, error);
      alert(`Erro ao exportar. Tente novamente.`);
    }
  };

  const handleShare = () => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    try {
      const link = generateShareableLink(flowchartData);
      setShareableLink(link);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Error generating shareable link:", error);
      alert("Erro ao gerar link compartilhável. Tente novamente.");
    }
  };

  const handleSave = async () => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    try {
      saveToLocalStorage(flowchartData);
      alert('Fluxograma salvo localmente com sucesso!');
    } catch (error) {
      console.error("Error saving:", error);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

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
        disabled={isLoading}
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
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
              <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-xl text-gray-700">Carregando editor...</div>
              </div>
            </div>
          )}
        </div>
        
        {showTutorial && !isLoading && (
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