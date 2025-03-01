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

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new FlowchartCanvas(
        'flowchart-canvas',
        initialData,
        handleFlowchartChange
      );
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.destroy();
        fabricCanvasRef.current = null;
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
    setFlowchartData(data);
    // Salvar automaticamente a cada mudança
    saveToLocalStorage(data);
  };

  const handleAddNode = (type: 'rectangle' | 'circle' | 'diamond') => {
    if (!fabricCanvasRef.current) return;
    
    // Add node to the center of the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    
    fabricCanvasRef.current.addNode(type, x, y);
  };

  const handleAddConnector = () => {
    if (!fabricCanvasRef.current) return;
    
    if (isConnecting) {
      // Cancel connecting mode
      setIsConnecting(false);
      setConnectingNodeId(null);
    } else {
      // Start connecting mode
      setIsConnecting(true);
      
      // Instrução mais clara
      alert('Clique no primeiro nó e depois no segundo nó para conectá-los');
    }
  };

  const handleDelete = () => {
    if (!fabricCanvasRef.current) return;
    
    // Implementar a exclusão dos objetos selecionados
    fabricCanvasRef.current.deleteSelectedObjects();
  };

  const handleExport = (format: 'png' | 'svg') => {
    if (!fabricCanvasRef.current) return;
    
    const dataUrl = fabricCanvasRef.current.exportAsImage(format);
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `flowchart.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    const link = generateShareableLink(flowchartData);
    setShareableLink(link);
    setShareModalOpen(true);
  };

  const handleSave = async () => {
    if (!fabricCanvasRef.current || !flowchartData) return;
    
    // Salvar apenas localmente
    saveToLocalStorage(flowchartData);
    alert('Fluxograma salvo localmente com sucesso!');
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
      />
      
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          id="flowchart-canvas"
          className="absolute inset-0"
        />
        
        {showTutorial && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white p-4 rounded-lg shadow-lg z-10 max-w-md">
            <h3 className="font-bold mb-2">Como usar:</h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Clique em "Retângulo", "Círculo" ou "Diamante" para adicionar um nó</li>
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