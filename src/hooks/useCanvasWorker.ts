import { useState, useEffect, useRef, useCallback } from 'react';

type WorkerStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCanvasWorkerOptions {
  /**
   * Se verdadeiro, o worker será inicializado automaticamente
   * @default true
   */
  autoInit?: boolean;
}

interface WorkerResult<T> {
  /**
   * Dados retornados pelo worker
   */
  data: T | null;
  
  /**
   * Status atual da operação
   */
  status: WorkerStatus;
  
  /**
   * Mensagem de erro (se houver)
   */
  error: Error | null;
}

/**
 * Hook para gerenciar Web Workers para operações pesadas do canvas
 */
export function useCanvasWorker(options: UseCanvasWorkerOptions = {}) {
  const { autoInit = true } = options;
  
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Estado para calcular layout
  const [layoutResult, setLayoutResult] = useState<WorkerResult<{ positions: Array<{ id: string; x: number; y: number }> }>>({
    data: null,
    status: 'idle',
    error: null
  });
  
  // Estado para exportar SVG
  const [svgResult, setSvgResult] = useState<WorkerResult<string>>({
    data: null,
    status: 'idle',
    error: null
  });
  
  // Estado para calcular estatísticas
  const [statsResult, setStatsResult] = useState<WorkerResult<Record<string, unknown>>>({
    data: null,
    status: 'idle',
    error: null
  });
  
  // Inicialização do worker
  useEffect(() => {
    if (!autoInit) return;
    
    // Verificar se o navegador suporta Web Workers
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers não são suportados neste navegador. Operações pesadas serão executadas na thread principal.');
      return;
    }
    
    try {
      // Criar o worker
      workerRef.current = new Worker(new URL('../workers/canvasWorker.ts', import.meta.url), {
        type: 'module'
      });
      
      // Configurar handler de mensagens do worker
      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'WORKER_READY':
            setIsReady(true);
            break;
            
          case 'LAYOUT_RESULT':
            setLayoutResult({
              data,
              status: 'success',
              error: null
            });
            break;
            
          case 'SVG_RESULT':
            setSvgResult({
              data,
              status: 'success',
              error: null
            });
            break;
            
          case 'STATISTICS_RESULT':
            setStatsResult({
              data,
              status: 'success',
              error: null
            });
            break;
            
          case 'ERROR':
            // Determinar qual resultado deve ser atualizado com base no contexto
            console.error('Worker error:', data);
            break;
        }
      };
      
      // Configurar handler de erros
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error);
      };
    } catch (error) {
      console.error('Erro ao inicializar o worker:', error);
    }
    
    // Cleanup na desmontagem
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [autoInit]);
  
  /**
   * Calcula o layout ótimo para um fluxograma
   */
  const calculateLayout = useCallback((data: {
    nodes: Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    connections: Array<{
      from: string;
      to: string;
    }>;
  }) => {
    if (!workerRef.current) {
      setLayoutResult({
        data: null,
        status: 'error',
        error: new Error('Worker não está disponível')
      });
      return;
    }
    
    setLayoutResult({
      data: null,
      status: 'loading',
      error: null
    });
    
    workerRef.current.postMessage({
      type: 'CALCULATE_LAYOUT',
      data
    });
  }, []);
  
  /**
   * Exporta o fluxograma como SVG
   */
  const exportAsSvg = useCallback((data: Record<string, unknown>) => {
    if (!workerRef.current) {
      setSvgResult({
        data: null,
        status: 'error',
        error: new Error('Worker não está disponível')
      });
      return;
    }
    
    setSvgResult({
      data: null,
      status: 'loading',
      error: null
    });
    
    workerRef.current.postMessage({
      type: 'EXPORT_SVG',
      data
    });
  }, []);
  
  /**
   * Calcula estatísticas do fluxograma
   */
  const calculateStatistics = useCallback((data: Record<string, unknown>) => {
    if (!workerRef.current) {
      setStatsResult({
        data: null,
        status: 'error',
        error: new Error('Worker não está disponível')
      });
      return;
    }
    
    setStatsResult({
      data: null,
      status: 'loading',
      error: null
    });
    
    workerRef.current.postMessage({
      type: 'CALCULATE_STATISTICS',
      data
    });
  }, []);
  
  /**
   * Inicializa o worker manualmente (se autoInit for false)
   */
  const initWorker = useCallback(() => {
    if (workerRef.current) return;
    
    // Verificar se o navegador suporta Web Workers
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers não são suportados neste navegador.');
      return;
    }
    
    try {
      workerRef.current = new Worker(new URL('../workers/canvasWorker.ts', import.meta.url), {
        type: 'module'
      });
      
      // Configurações do worker...
    } catch (error) {
      console.error('Erro ao inicializar o worker:', error);
    }
  }, []);
  
  return {
    isReady,
    calculateLayout,
    layoutResult,
    exportAsSvg,
    svgResult,
    calculateStatistics,
    statsResult,
    initWorker
  };
} 