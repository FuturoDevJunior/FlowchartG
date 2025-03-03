import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { detectBrowser } from '../../utils/browserCompatibility';
import type { CanvasProps } from './index';

// Interface corrigida para objetos do Fabric
interface FabricObject extends fabric.Object {
  id?: string;
}

// Corrigindo a tipagem do evento para evitar erros de compatibilidade
type FabricObjectEventData = fabric.IEvent<Event> & {
  target?: FabricObject;
};

/**
 * Componente de Canvas que utiliza Fabric.js para renderizar e manipular o fluxograma
 * Este é o componente carregado de forma lazy para melhorar a performance inicial
 */
const FlowchartCanvas: React.FC<CanvasProps> = ({
  width = '100%',
  height = '100%',
  onNodeSelect,
  onNodeMove,
  isEditable = true,
  initialData,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Função para carregar dados no canvas
  const loadData = useCallback((canvas: fabric.Canvas, data: unknown) => {
    if (typeof data === 'string') {
      try {
        canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
      } catch (error) {
        console.error('Erro ao carregar dados no canvas:', error);
      }
    } else if (data && typeof data === 'object') {
      try {
        canvas.loadFromJSON(JSON.stringify(data), canvas.renderAll.bind(canvas));
      } catch (error) {
        console.error('Erro ao carregar dados no canvas:', error);
      }
    }
  }, []);
  
  // Função para configurar o canvas
  const setupCanvas = useCallback((canvas: fabric.Canvas) => {
    // Configurar eventos do canvas
    canvas.on('object:selected', (e: FabricObjectEventData) => {
      const obj = e.target;
      if (obj && obj.id && onNodeSelect) {
        onNodeSelect(obj.id);
      }
    });
    
    canvas.on('object:moved', (e: FabricObjectEventData) => {
      const obj = e.target;
      if (obj && obj.id && onNodeMove && obj.left !== undefined && obj.top !== undefined) {
        onNodeMove(obj.id, obj.left, obj.top);
      }
    });
    
    // Configurar redimensionamento responsivo do canvas
    const resizeCanvas = () => {
      if (!canvasRef.current || !canvas) return;
      
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      
      const newWidth = parent.clientWidth;
      const newHeight = parent.clientHeight;
      
      if (canvas.getWidth() !== newWidth || canvas.getHeight() !== newHeight) {
        canvas.setWidth(newWidth);
        canvas.setHeight(newHeight);
        canvas.renderAll();
      }
    };
    
    // Configurar observer para redimensionamento
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(resizeCanvas);
      if (canvasRef.current && canvasRef.current.parentElement) {
        observer.observe(canvasRef.current.parentElement);
      }
      
      // Retornar função de limpeza
      return () => {
        if (canvasRef.current && canvasRef.current.parentElement) {
          observer.unobserve(canvasRef.current.parentElement);
        }
      };
    } else {
      // Fallback para navegadores antigos
      window.addEventListener('resize', resizeCanvas);
      
      // Retornar função de limpeza
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [onNodeSelect, onNodeMove]);
  
  // Inicialização do canvas
  useEffect(() => {
    // Verificar se o elemento canvas está disponível
    if (!canvasRef.current) return;
    
    // Aplicar medidas específicas para navegadores
    const browser = detectBrowser();
    const useDPR = browser !== 'firefox'; // Firefox tem problemas com DPR
    
    // Criar instância do canvas Fabric
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: typeof width === 'number' ? width : canvasRef.current.clientWidth,
      height: typeof height === 'number' ? height : canvasRef.current.clientHeight,
      selection: isEditable, // Permitir seleção múltipla apenas no modo de edição
      preserveObjectStacking: true,
      enableRetinaScaling: useDPR,
      fireRightClick: true,
      stopContextMenu: true,
      backgroundColor: 'var(--canvas-bg)',
    });
    
    fabricCanvasRef.current = canvas;
    
    // Configurações adicionais do canvas
    const cleanupFn = setupCanvas(canvas);
    
    // Carregar dados iniciais se existirem
    if (initialData) {
      loadData(canvas, initialData);
    }
    
    setIsLoaded(true);
    
    // Limpar canvas na desmontagem do componente
    return () => {
      if (cleanupFn) cleanupFn();
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, isEditable, initialData, setupCanvas, loadData]);
  
  return (
    <div className={`flowchart-canvas-wrapper ${className || ''}`} data-cy="flowchart-canvas-wrapper">
      <canvas 
        ref={canvasRef} 
        className="flowchart-canvas" 
        data-cy="flowchart-canvas"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-text-secondary">Inicializando canvas...</span>
        </div>
      )}
    </div>
  );
};

export default FlowchartCanvas;