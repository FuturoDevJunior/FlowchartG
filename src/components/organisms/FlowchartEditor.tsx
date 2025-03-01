import React, { useEffect, useRef, useState } from 'react';
import { FlowchartCanvas } from '../../lib/fabricCanvas';
import { FlowchartData } from '../../types';
import Toolbar from '../molecules/Toolbar';
import ShareModal from '../molecules/ShareModal';
import { saveToLocalStorage, generateShareableLink } from '../../lib/storage';
import { saveFlowchart } from '../../lib/supabase';
import Watermark from '../atoms/Watermark';

interface FlowchartEditorProps {
  initialData?: FlowchartData;
  isAuthenticated: boolean;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  initialData,
  isAuthenticated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FlowchartCanvas | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | undefined>(initialData);

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

  const handleFlowchartChange = (data: FlowchartData) => {
    setFlowchartData(data);
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
      
      // TODO: Implement node selection logic
      // For now, we'll just show a message
      alert('Select the first node to connect');
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
    
    // Always save to localStorage
    saveToLocalStorage(flowchartData);
    
    // If authenticated, also save to Supabase
    if (isAuthenticated) {
      try {
        const { error } = await saveFlowchart(flowchartData);
        if (error) {
          alert(`Error saving flowchart: ${error.message}`);
        } else {
          alert('Flowchart saved successfully!');
        }
      } catch (error) {
        alert('An error occurred while saving the flowchart.');
      }
    } else {
      alert('Flowchart saved to local storage. Sign in to save to the cloud.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
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