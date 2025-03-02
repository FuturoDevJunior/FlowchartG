import React, { lazy, Suspense } from 'react';

// Lazy load do componente Canvas que utiliza Fabric.js
const FlowchartCanvas = lazy(() => import('./FlowchartCanvas'));

// Componente de loading enquanto o canvas carrega
const CanvasLoadingPlaceholder: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-canvas-bg" data-cy="canvas-loading">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-16 h-16 border-4 border-highlight rounded-full border-t-transparent animate-spin"></div>
      <p className="text-text-primary font-medium">Carregando canvas...</p>
      <p className="text-text-secondary text-sm">Preparando ambiente de desenho</p>
    </div>
  </div>
);

export interface CanvasProps {
  /**
   * Largura do canvas em pixels ou porcentagem
   */
  width?: string | number;
  
  /**
   * Altura do canvas em pixels ou porcentagem
   */
  height?: string | number;
  
  /**
   * Callback chamado quando um nó é selecionado
   */
  onNodeSelect?: (nodeId: string) => void;
  
  /**
   * Callback chamado quando um nó é criado
   */
  onNodeCreate?: (node: unknown) => void;
  
  /**
   * Callback chamado quando um nó é movido
   */
  onNodeMove?: (nodeId: string, x: number, y: number) => void;
  
  /**
   * Callback chamado quando uma conexão é criada
   */
  onConnectionCreate?: (connection: unknown) => void;
  
  /**
   * Callback chamado quando o canvas é limpo
   */
  onCanvasClear?: () => void;
  
  /**
   * Se o canvas está em modo de edição
   * @default true
   */
  isEditable?: boolean;
  
  /**
   * Dados iniciais do fluxograma
   */
  initialData?: unknown;
  
  /**
   * Classe CSS adicional
   */
  className?: string;
}

/**
 * Componente wrapper para o FlowchartCanvas que implementa lazy loading
 */
const Canvas: React.FC<CanvasProps> = (props) => {
  return (
    <div 
      className={`canvas-container relative ${props.className || ''}`}
      style={{ 
        width: props.width || '100%', 
        height: props.height || '100%' 
      }}
      data-cy="flowchart-canvas-container"
    >
      <Suspense fallback={<CanvasLoadingPlaceholder />}>
        <FlowchartCanvas {...props} />
      </Suspense>
    </div>
  );
};

export default Canvas; 