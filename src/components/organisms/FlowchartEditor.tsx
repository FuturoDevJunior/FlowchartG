import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FlowchartData } from '../../types';
import Toolbar from '../molecules/Toolbar';
import ShareModal from '../molecules/ShareModal';
import { saveToLocalStorage, generateShareableLink } from '../../lib/storage';
import Watermark from '../atoms/Watermark';
import { Plus, Minus, Maximize2 } from 'lucide-react';

// Type for the dynamically imported FlowchartCanvas
type FlowchartCanvasType = import('../../lib/fabricCanvas').FlowchartCanvas;

interface FlowchartEditorProps {
  initialData?: FlowchartData;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  initialData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FlowchartCanvasType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef<number>(0);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(initialData);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (window.innerWidth <= 768);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Simplified - Initialize canvas with retries
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    
    const initCanvas = async () => {
      if (canvasRef.current && containerRef.current && !fabricCanvasRef.current) {
        try {
          // Get container dimensions
          const containerWidth = containerRef.current.clientWidth || 800;
          const containerHeight = containerRef.current.clientHeight || 500;
          
          // Set canvas size with slight padding
          const canvasWidth = containerWidth - (isMobile ? 10 : 20);
          const canvasHeight = containerHeight - (isMobile ? 10 : 20);
          
          // Set visual dimensions of canvas element
          if (canvasRef.current) {
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasHeight;
            canvasRef.current.style.width = `${canvasWidth}px`;
            canvasRef.current.style.height = `${canvasHeight}px`;
          }
          
          try {
            // Dynamically import the FlowchartCanvas
            const { FlowchartCanvas } = await import('../../lib/fabricCanvas');
            
            // Initialize FlowchartCanvas
            fabricCanvasRef.current = new FlowchartCanvas(
              'flowchart-canvas',
              initialData,
              handleFlowchartChange,
              canvasWidth,
              canvasHeight
            );
            
            // Hook up resize handler
            window.addEventListener('resize', handleResize);
            
            // Center view if there are elements
            if (initialData?.nodes?.length) {
              setTimeout(() => {
                centerView();
              }, 300);
            }
            
            setIsLoading(false);
          } catch (error) {
            console.error("Error loading canvas:", error);
            
            // Try up to 3 times with increasing delay
            if (retryCountRef.current < 3) {
              retryCountRef.current++;
              const delay = retryCountRef.current * 500;
              console.log(`Retrying canvas initialization in ${delay}ms (attempt ${retryCountRef.current}/3)`);
              
              setTimeout(initCanvas, delay);
            } else {
              setIsError(true);
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error("Container error:", error);
          setIsError(true);
          setIsLoading(false);
        }
      }
    };
    
    // More delay for mobile devices which can be slower to initialize
    const timeoutDelay = isMobile ? 500 : 200;
    const timeoutId = setTimeout(initCanvas, timeoutDelay);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.destroy();
        } catch (e) {
          console.error("Error destroying canvas:", e);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, [initialData, isMobile]);

  // Handle zoom operations
  const handleZoomIn = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    try {
      const newZoom = Math.min(zoomLevel + 0.1, 3);
      setZoomLevel(newZoom);
      fabricCanvasRef.current.setZoom(newZoom);
    } catch (error) {
      console.error("Error zooming in:", error);
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    try {
      const newZoom = Math.max(zoomLevel - 0.1, 0.3);
      setZoomLevel(newZoom);
      fabricCanvasRef.current.setZoom(newZoom);
    } catch (error) {
      console.error("Error zooming out:", error);
    }
  }, [zoomLevel]);

  const centerView = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    try {
      fabricCanvasRef.current.centerView();
      setZoomLevel(1); // Reset zoom to 1 when centering view
    } catch (error) {
      console.error("Error centering view:", error);
    }
  }, []);

  // Handle window resizing
  const handleResize = useCallback(() => {
    if (!containerRef.current || !fabricCanvasRef.current || !canvasRef.current) return;
    
    try {
      const containerWidth = containerRef.current.clientWidth || 800;
      const containerHeight = containerRef.current.clientHeight || 500;
      
      const canvasWidth = containerWidth - (isMobile ? 10 : 20);
      const canvasHeight = containerHeight - (isMobile ? 10 : 20);
      
      // Update canvas element dimensions
      canvasRef.current.width = canvasWidth;
      canvasRef.current.height = canvasHeight;
      canvasRef.current.style.width = `${canvasWidth}px`;
      canvasRef.current.style.height = `${canvasHeight}px`;
      
      // Update fabric canvas
      fabricCanvasRef.current.handleResize(canvasWidth, canvasHeight);
    } catch (error) {
      console.error("Error resizing canvas:", error);
    }
  }, [isMobile]);

  // Tutorial that disappears
  useEffect(() => {
    if (showTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(false);
        localStorage.setItem('tutorialSeen', 'true');
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [showTutorial]);

  const handleFlowchartChange = useCallback((data: FlowchartData) => {
    setFlowchartData(data);
    // Save automatically
    try {
      saveToLocalStorage(data);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // Silent fail - don't bother user
    }
  }, []);

  const handleAddNode = useCallback((type: 'rectangle' | 'circle' | 'diamond') => {
    if (!fabricCanvasRef.current || !canvasRef.current) return;
    
    try {
      // Add in center of canvas
      const x = canvasRef.current.width / 2;
      const y = canvasRef.current.height / 2;
      
      fabricCanvasRef.current.addNode(type, x, y);
    } catch (error) {
      console.error("Error adding node:", error);
      alert("Erro ao adicionar forma. Tente novamente.");
    }
  }, []);

  const handleAddConnector = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    if (isConnecting) {
      // Cancel connecting mode
      setIsConnecting(false);
    } else {
      // Start connecting mode
      setIsConnecting(true);
      
      // Show different message for mobile vs desktop
      if (isMobile) {
        alert('Toque no primeiro nó e depois no segundo nó para conectá-los');
      } else {
        alert('Clique no primeiro nó e depois no segundo nó para conectá-los');
      }
    }
  }, [isConnecting, isMobile]);

  const handleDelete = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    try {
      fabricCanvasRef.current.deleteSelectedObjects();
    } catch (error) {
      console.error("Error deleting objects:", error);
    }
  }, []);

  const handleExport = useCallback((format: 'png' | 'svg') => {
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
  }, []);

  const handleShare = useCallback(() => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    try {
      const link = generateShareableLink(flowchartData);
      setShareableLink(link);
      setShareModalOpen(true);
    } catch (error) {
      console.error("Error generating shareable link:", error);
      alert("Erro ao gerar link compartilhável. Tente novamente.");
    }
  }, [flowchartData]);

  const handleSave = useCallback(async () => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    try {
      saveToLocalStorage(flowchartData);
      alert('Fluxograma salvo localmente com sucesso!');
    } catch (error) {
      console.error("Error saving:", error);
      alert("Erro ao salvar. Tente novamente.");
    }
  }, [flowchartData]);

  const handleRetry = useCallback(() => {
    retryCountRef.current = 0;
    setIsError(false);
    setIsLoading(true);
    
    // Force re-initialization
    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.destroy();
      } catch (e) {
        // Ignore errors
      }
      fabricCanvasRef.current = null;
    }
    
    // Trigger re-render which will reinitialize
    setTimeout(() => {
      const init = async () => {
        try {
          // Dynamically import the FlowchartCanvas
          const { FlowchartCanvas } = await import('../../lib/fabricCanvas');
          
          // Get container dimensions
          const containerWidth = containerRef.current?.clientWidth || 800;
          const containerHeight = containerRef.current?.clientHeight || 500;
          
          // Set canvas size with slight padding
          const canvasWidth = containerWidth - (isMobile ? 10 : 20);
          const canvasHeight = containerHeight - (isMobile ? 10 : 20);
          
          if (canvasRef.current) {
            fabricCanvasRef.current = new FlowchartCanvas(
              'flowchart-canvas',
              initialData,
              handleFlowchartChange,
              canvasWidth,
              canvasHeight
            );
            
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error during retry:", error);
          setIsError(true);
          setIsLoading(false);
        }
      };
      
      init();
    }, 500);
  }, [handleFlowchartChange, initialData, isMobile]);

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
        disabled={isLoading || isError}
        isMobile={isMobile}
      />
      
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 bg-gray-100 overflow-hidden relative"
        style={{ 
          minHeight: isMobile ? '60vh' : '70vh',
          height: isMobile ? 'calc(var(--vh, 1vh) * 80)' : 'auto'
        }}
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

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-30 bg-white rounded-lg shadow-md p-2 flex items-center space-x-1">
            <button 
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Diminuir zoom"
            >
              <Minus size={18} />
            </button>
            <span className="text-xs font-mono px-2">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Aumentar zoom"
            >
              <Plus size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <button 
              onClick={centerView}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Centralizar diagrama"
            >
              <Maximize2 size={18} />
            </button>
          </div>
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
              <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
                <div className="text-xl text-gray-700">Carregando editor...</div>
              </div>
            </div>
          )}
          
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
              <div className="text-center max-w-md p-6">
                <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-xl text-gray-700 mb-4">Não foi possível carregar o editor</div>
                <p className="text-gray-600 mb-4">
                  {isMobile 
                    ? "Alguns dispositivos móveis podem ter limitações com o canvas. Tente utilizar um dispositivo com mais memória ou um computador." 
                    : "Ocorreu um erro ao inicializar o canvas. Isso pode ser devido a recursos limitados do navegador."}
                </p>
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
        
        {showTutorial && !isLoading && !isError && (
          <div className={`absolute ${isMobile ? 'bottom-20 left-4 right-4' : 'top-24 right-8'} bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg z-30 max-w-md`}>
            <h3 className="font-bold mb-2">Como usar:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Clique em "Retângulo", "Círculo" ou "Losango" para adicionar um nó</li>
              <li>Clique duas vezes em um nó para editar o texto</li>
              <li>Use "Conectar" para criar linhas entre os nós</li>
              <li>Use os controles de zoom para ajustar a visualização</li>
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