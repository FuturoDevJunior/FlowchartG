/**
 * Web Worker para processamento de operações pesadas relacionadas ao canvas
 * Este worker permite executar operações que seriam bloqueantes na thread principal
 */

// Tipos para comunicação com o worker
interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
}

interface Connection {
  from: string;
  to: string;
}

interface WorkerMessage {
  type: string;
  data: unknown;
}

// Configuração do self para TypeScript
// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as unknown as Worker;

// Processador principal de mensagens
ctx.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'CALCULATE_LAYOUT':
      try {
        const result = calculateOptimalLayout(data as { nodes: LayoutNode[], connections: Connection[] });
        ctx.postMessage({ type: 'LAYOUT_RESULT', data: result });
      } catch (error) {
        ctx.postMessage({ type: 'ERROR', data: { message: 'Erro ao calcular layout', originalError: error } });
      }
      break;
      
    case 'EXPORT_SVG':
      try {
        const svg = processSvgData(data as Record<string, unknown>);
        ctx.postMessage({ type: 'SVG_RESULT', data: svg });
      } catch (error) {
        ctx.postMessage({ type: 'ERROR', data: { message: 'Erro ao processar SVG', originalError: error } });
      }
      break;
      
    case 'CALCULATE_STATISTICS':
      try {
        const stats = calculateDiagramStatistics(data as Record<string, unknown>);
        ctx.postMessage({ type: 'STATISTICS_RESULT', data: stats });
      } catch (error) {
        ctx.postMessage({ type: 'ERROR', data: { message: 'Erro ao calcular estatísticas', originalError: error } });
      }
      break;
      
    default:
      ctx.postMessage({ 
        type: 'ERROR', 
        data: { message: `Operação não suportada: ${type}` } 
      });
  }
});

/**
 * Calcula o posicionamento ideal dos nós em um diagrama
 * Implementa um algoritmo de layout baseado em força
 */
function calculateOptimalLayout(data: { nodes: LayoutNode[], connections: Connection[] }) {
  console.time('layoutCalculation');
  
  // Implementação simplificada de um algoritmo de layout baseado em força
  const { nodes, connections } = data;
  const iterations = 100;
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node }]));
  
  // Configurar lista de conexões para cada nó
  nodes.forEach(node => {
    node.connections = [];
  });
  
  connections.forEach(conn => {
    const fromNode = nodeMap.get(conn.from);
    const toNode = nodeMap.get(conn.to);
    
    if (fromNode && toNode) {
      fromNode.connections.push(conn.to);
      toNode.connections.push(conn.from);
    }
  });
  
  // Algoritmo simples para distribuir nós
  // Em um projeto real, você implementaria um algoritmo mais sofisticado
  for (let i = 0; i < iterations; i++) {
    // Aplicar forças repulsivas entre todos os nós
    for (let j = 0; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        applyRepulsiveForce(nodes[j], nodes[k], 200);
      }
    }
    
    // Aplicar forças atrativas para nós conectados
    for (const conn of connections) {
      const fromNode = nodeMap.get(conn.from);
      const toNode = nodeMap.get(conn.to);
      
      if (fromNode && toNode) {
        applyAttractiveForce(fromNode, toNode, 100);
      }
    }
  }
  
  console.timeEnd('layoutCalculation');
  
  return { positions: nodes.map(node => ({ id: node.id, x: node.x, y: node.y })) };
}

/**
 * Aplica força repulsiva entre dois nós
 */
function applyRepulsiveForce(node1: LayoutNode, node2: LayoutNode, strength: number) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  
  // Evitar divisão por zero e forças excessivas para nós muito próximos
  if (distance < 1) return;
  
  // Força inversamente proporcional à distância
  const force = strength / (distance * distance);
  
  // Calcular deslocamento
  const displacementX = (dx / distance) * force;
  const displacementY = (dy / distance) * force;
  
  // Aplicar deslocamento (com limitação)
  node1.x -= displacementX;
  node1.y -= displacementY;
  node2.x += displacementX;
  node2.y += displacementY;
}

/**
 * Aplica força atrativa entre dois nós conectados
 */
function applyAttractiveForce(node1: LayoutNode, node2: LayoutNode, strength: number) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;
  
  // Força proporcional à distância
  const force = (distance * distance) / strength;
  
  // Calcular deslocamento
  const displacementX = (dx / distance) * force;
  const displacementY = (dy / distance) * force;
  
  // Aplicar deslocamento (com limitação)
  node1.x += displacementX;
  node1.y += displacementY;
  node2.x -= displacementX;
  node2.y -= displacementY;
}

/**
 * Processa dados SVG
 * @param _data Dados para processamento (não utilizado na simulação)
 */
function processSvgData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>
) {
  // Simulação de processamento pesado
  const startTime = Date.now();
  while (Date.now() - startTime < 100) {
    // Simulação de operação CPU-intensiva
  }
  
  // Em um caso real, aqui seria implementada a lógica de geração do SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
    <!-- SVG gerado pelo worker -->
    <rect x="10" y="10" width="100" height="80" fill="#ffffff" stroke="#000000" />
    <text x="60" y="50" text-anchor="middle">Exemplo</text>
  </svg>`;
}

/**
 * Calcula estatísticas do diagrama
 * @param _data Dados para análise (não utilizado na simulação)
 */
function calculateDiagramStatistics(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown>
) {
  // Simulação de análise de dados
  const startTime = Date.now();
  while (Date.now() - startTime < 50) {
    // Simulação de operação CPU-intensiva
  }
  
  // Em um caso real, aqui seria implementada a lógica de análise do diagrama
  return {
    nodeCount: 10,
    connectionCount: 15,
    averageConnectionsPerNode: 1.5,
    isolatedNodes: 2,
    maxDepth: 3,
    processingTime: Date.now() - startTime
  };
}

// Notificar que o worker está pronto
ctx.postMessage({ type: 'WORKER_READY', data: { timestamp: Date.now() } }); 