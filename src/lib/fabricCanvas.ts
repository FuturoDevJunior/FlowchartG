// @ts-ignore
import { fabric } from 'fabric';
import { FlowchartNode, FlowchartConnector, FlowchartData } from '../types';
// @ts-ignore
import { nanoid } from 'nanoid';

export class FlowchartCanvas {
  private canvas: fabric.Canvas;
  private nodes: Map<string, fabric.Object> = new Map();
  private connectors: Map<string, fabric.Line> = new Map();
  private flowchartData: FlowchartData;
  private onChangeCallback: (data: FlowchartData) => void;
  private isInitialized: boolean = false;

  constructor(
    canvasId: string, 
    initialData?: FlowchartData, 
    onChange?: (data: FlowchartData) => void,
    width?: number,
    height?: number
  ) {
    console.log(`🏗️ Construindo FlowchartCanvas para #${canvasId} com dimensões ${width}x${height}`);
    
    // Use os parâmetros de largura e altura se fornecidos, caso contrário use valores padrão
    const canvasWidth = width || 800;
    const canvasHeight = height || 500;
    
    // Tentar criar o canvas com máxima compatibilidade
    try {
      this.canvas = new fabric.Canvas(canvasId, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#f5f5f5',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        stopContextMenu: true,
      });
      
      console.log("✅ Fabric Canvas criado com sucesso");
      
      // Adicionar debug para erros de fabric.js
      fabric.Object.prototype.objectCaching = true;
      
      this.canvas.setDimensions({
        width: canvasWidth,
        height: canvasHeight
      });
      
      // Verificar se o canvas foi criado corretamente
      if (!this.canvas.getContext()) {
        throw new Error("Canvas não foi inicializado corretamente");
      }
    } catch (error) {
      console.error("❌ Erro durante a criação do canvas:", error);
      // Tentar novamente como fallback
      this.canvas = new fabric.Canvas(canvasId);
      this.canvas.setDimensions({
        width: canvasWidth,
        height: canvasHeight
      });
      console.log("⚠️ Canvas criado em modo fallback");
    }

    this.flowchartData = initialData || {
      id: nanoid(),
      name: 'Untitled Flowchart',
      nodes: [],
      connectors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.onChangeCallback = onChange || (() => {});

    console.log("🔄 Configurando event listeners...");
    this.setupEventListeners();
    
    if (initialData) {
      console.log("🔄 Carregando dados iniciais...");
      try {
        this.loadFromData(initialData);
        console.log("✅ Dados iniciais carregados com sucesso");
      } catch (error) {
        console.error("❌ Erro ao carregar dados iniciais:", error);
      }
    }

    // Handle window resize
    console.log("🔄 Adicionando event listener para redimensionamento...");
    window.addEventListener('resize', this.handleWindowResize);
    
    // Marca canvas como inicializado
    this.isInitialized = true;
    console.log("✅ FlowchartCanvas totalmente inicializado");
    
    // Forçar uma renderização para garantir que tudo seja exibido corretamente
    setTimeout(() => {
      this.canvas.renderAll();
      console.log("🔄 Renderização inicial forçada");
    }, 100);
  }

  // Método para lidar com eventos de redimensionamento de janela
  private handleWindowResize = (): void => {
    // Usar o método principal de redimensionamento sem parâmetros
    this.handleResize();
  };

  // Método público para redimensionamento manual ou automático
  public handleResize = (width?: number, height?: number): void => {
    console.log(`🔄 Redimensionando canvas para ${width}x${height || 'auto'}`);
    // Se width e height forem fornecidos, use-os, caso contrário, use a lógica padrão
    if (width && height) {
      this.canvas.setWidth(width);
      this.canvas.setHeight(height);
    } else {
      const parent = this.canvas.getElement().parentElement;
      if (parent) {
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        
        console.log(`Dimensões do pai: ${parentWidth}x${parentHeight}`);
        
        this.canvas.setWidth(parentWidth);
        this.canvas.setHeight(parentHeight);
      } else {
        console.log("⚠️ Pai do canvas não encontrado, usando valores padrão");
        this.canvas.setWidth(800);
        this.canvas.setHeight(500);
      }
    }
    
    // Renderizar com atraso para garantir que os tamanhos foram aplicados
    setTimeout(() => {
      this.canvas.renderAll();
      console.log("✅ Canvas redimensionado e renderizado");
    }, 50);
  };

  private setupEventListeners(): void {
    try {
      this.canvas.on('object:moving', this.handleObjectMoving);
      this.canvas.on('object:modified', this.handleObjectModified);
      this.canvas.on('mouse:down', (opts) => {
        console.log("Mouse down no canvas");
      });
      console.log("✅ Event listeners configurados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao configurar event listeners:", error);
    }
  }

  // Método para verificar se o canvas está inicializado
  public isCanvasReady(): boolean {
    return this.isInitialized && !!this.canvas;
  }

  // Método para adicionar um nó ao canvas - com melhor tratamento de erros
  public addNode(type: 'rectangle' | 'circle' | 'diamond', x: number, y: number): string {
    console.log(`🔄 Adicionando nó ${type} na posição (${x}, ${y})`);
    try {
      // Verificar se o canvas está pronto
      if (!this.isCanvasReady()) {
        throw new Error("Canvas não está pronto");
      }
      
      const nodeId = nanoid();
      let obj: fabric.Object;

      // Estilo comum
      const commonOptions = {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        hasControls: true,
        hasBorders: true,
        lockScalingFlip: true,
        cornerStyle: 'circle',
        cornerColor: '#5F9EA0',
        cornerSize: 8,
        transparentCorners: false,
        data: {
          id: nodeId,
          type: 'node',
          nodeType: type,
          text: ''
        }
      };

      // Criar forma baseada no tipo
      if (type === 'rectangle') {
        obj = new fabric.Rect({
          ...commonOptions,
          width: 120,
          height: 60,
          left: x - 60,
          top: y - 30,
          rx: 5,
          ry: 5
        });
      } else if (type === 'circle') {
        obj = new fabric.Circle({
          ...commonOptions,
          radius: 40,
          left: x - 40,
          top: y - 40
        });
      } else if (type === 'diamond') {
        // Criar um losango usando um polígono
        const points = [
          { x: 0, y: -40 },  // topo
          { x: 60, y: 0 },   // direita
          { x: 0, y: 40 },   // base
          { x: -60, y: 0 }   // esquerda
        ];
        obj = new fabric.Polygon(points, {
          ...commonOptions,
          left: x,
          top: y,
          originX: 'center',
          originY: 'center'
        });
      } else {
        throw new Error(`Tipo de nó desconhecido: ${type}`);
      }

      // Texto dentro da forma
      const text = new fabric.IText('Texto', {
        fontSize: 16,
        fill: '#000000',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        left: type === 'diamond' ? x : x,
        top: type === 'diamond' ? y : y,
        data: {
          nodeId: nodeId
        },
        selectable: true,
        editable: true
      });

      // Agrupar forma e texto
      const group = new fabric.Group([obj, text], {
        left: type === 'diamond' ? x - 60 : obj.left,
        top: type === 'diamond' ? y - 40 : obj.top,
        hasControls: true,
        hasBorders: true,
        data: {
          id: nodeId,
          type: 'node',
          nodeType: type
        }
      });

      // Adicionar ao canvas
      this.canvas.add(group);
      this.nodes.set(nodeId, group);
      
      // Converter para JSON para o flowchartData
      const nodeData: FlowchartNode = {
        id: nodeId,
        type: type,
        position: { x, y },
        text: 'Texto',
        style: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        }
      };
      
      // Atualizar flowchartData
      this.flowchartData.nodes.push(nodeData);
      
      // Salvar estado
      this.saveState();
      this.canvas.renderAll();
      console.log(`✅ Nó ${type} adicionado com sucesso, ID: ${nodeId}`);
      
      return nodeId;
    } catch (error) {
      console.error(`❌ Erro ao adicionar nó ${type}:`, error);
      throw error;
    }
  }

  public addConnector(fromId: string, toId: string): string {
    const id = nanoid();
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);

    if (!fromNode || !toNode) {
      throw new Error('Nodes not found');
    }

    const fromPoint = this.getConnectionPoint(fromNode);
    const toPoint = this.getConnectionPoint(toNode);

    const line = new fabric.Line(
      [fromPoint.x, fromPoint.y, toPoint.x, toPoint.y],
      {
        stroke: '#2A2A2A',
        strokeWidth: 2,
        selectable: true,
        evented: true,
      }
    );

    // Add arrow
    const dx = toPoint.x - fromPoint.x;
    const dy = toPoint.y - fromPoint.y;
    const angle = Math.atan2(dy, dx);
    
    const headLength = 15;
    const arrowHead = new fabric.Triangle({
      width: headLength,
      height: headLength,
      left: toPoint.x - headLength / 2,
      top: toPoint.y - headLength / 2,
      angle: (angle * 180) / Math.PI + 90,
      fill: '#2A2A2A',
      selectable: false,
      evented: false,
    });

    const connector = new fabric.Group([line, arrowHead], {
      hasControls: false,
      hasBorders: false,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'pointer',
    });

    connector.data = { id, fromId, toId };

    this.canvas.add(connector);
    this.connectors.set(id, line);

    // Add to flowchart data
    const connectorData: FlowchartConnector = {
      id,
      from: fromId,
      to: toId,
      stroke: '#2A2A2A',
      strokeWidth: 2,
      arrow: true,
    };

    this.flowchartData.connectors.push(connectorData);
    this.saveState();

    return id;
  }

  public removeNode(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      this.canvas.remove(node);
      this.nodes.delete(id);

      // Remove associated connectors
      const connectorsToRemove = this.flowchartData.connectors.filter(
        (connector) => connector.from === id || connector.to === id
      );

      connectorsToRemove.forEach((connector) => {
        this.removeConnector(connector.id);
      });

      // Update flowchart data
      this.flowchartData.nodes = this.flowchartData.nodes.filter(
        (node) => node.id !== id
      );

      this.saveState();
    }
  }

  public removeConnector(id: string): void {
    const connector = this.connectors.get(id);
    if (connector) {
      this.canvas.remove(connector);
      this.connectors.delete(id);

      // Update flowchart data
      this.flowchartData.connectors = this.flowchartData.connectors.filter(
        (connector) => connector.id !== id
      );

      this.saveState();
    }
  }

  public loadFromData(data: FlowchartData): void {
    // Clear canvas
    this.canvas.clear();
    this.nodes.clear();
    this.connectors.clear();

    this.flowchartData = { ...data };

    // Add nodes
    data.nodes.forEach((nodeData) => {
      let node: fabric.Object;

      if (nodeData.type === 'rectangle') {
        node = new fabric.Rect({
          left: nodeData.x,
          top: nodeData.y,
          width: nodeData.width,
          height: nodeData.height,
          rx: 5,
          ry: 5,
          fill: nodeData.fill,
          stroke: nodeData.stroke,
          strokeWidth: 2,
        });
      } else if (nodeData.type === 'circle') {
        node = new fabric.Circle({
          left: nodeData.x,
          top: nodeData.y,
          radius: nodeData.width / 2,
          fill: nodeData.fill,
          stroke: nodeData.stroke,
          strokeWidth: 2,
        });
      } else {
        // Diamond shape
        node = new fabric.Polygon(
          [
            { x: 0, y: -nodeData.height / 2 },
            { x: nodeData.width / 2, y: 0 },
            { x: 0, y: nodeData.height / 2 },
            { x: -nodeData.width / 2, y: 0 },
          ],
          {
            left: nodeData.x,
            top: nodeData.y,
            fill: nodeData.fill,
            stroke: nodeData.stroke,
            strokeWidth: 2,
          }
        );
      }

      // Add text
      const text = new fabric.Textbox(nodeData.text, {
        left: nodeData.x,
        top: nodeData.y,
        fontSize: 16,
        fontFamily: 'Arial',
        fill: '#2A2A2A',
        textAlign: 'center',
        width: nodeData.type === 'rectangle' ? nodeData.width - 20 : 100,
        editable: true,
      });

      // Group node and text
      const group = new fabric.Group([node, text], {
        left: nodeData.x,
        top: nodeData.y,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
        subTargetCheck: true,
      });

      // Add custom data
      group.data = { id: nodeData.id, type: nodeData.type };

      this.canvas.add(group);
      this.nodes.set(nodeData.id, group);
    });

    // Add connectors
    data.connectors.forEach((connectorData) => {
      const fromNode = this.nodes.get(connectorData.from);
      const toNode = this.nodes.get(connectorData.to);

      if (fromNode && toNode) {
        const fromPoint = this.getConnectionPoint(fromNode);
        const toPoint = this.getConnectionPoint(toNode);

        const line = new fabric.Line(
          [fromPoint.x, fromPoint.y, toPoint.x, toPoint.y],
          {
            stroke: connectorData.stroke,
            strokeWidth: connectorData.strokeWidth,
            selectable: true,
            evented: true,
          }
        );

        // Add arrow if needed
        if (connectorData.arrow) {
          const dx = toPoint.x - fromPoint.x;
          const dy = toPoint.y - fromPoint.y;
          const angle = Math.atan2(dy, dx);
          
          const headLength = 15;
          const arrowHead = new fabric.Triangle({
            width: headLength,
            height: headLength,
            left: toPoint.x - headLength / 2,
            top: toPoint.y - headLength / 2,
            angle: (angle * 180) / Math.PI + 90,
            fill: connectorData.stroke,
            selectable: false,
            evented: false,
          });

          const connector = new fabric.Group([line, arrowHead], {
            hasControls: false,
            hasBorders: false,
            lockScalingX: true,
            lockScalingY: true,
            hoverCursor: 'pointer',
          });

          connector.data = { 
            id: connectorData.id, 
            fromId: connectorData.from, 
            toId: connectorData.to 
          };

          this.canvas.add(connector);
        } else {
          line.data = { 
            id: connectorData.id, 
            fromId: connectorData.from, 
            toId: connectorData.to 
          };
          
          this.canvas.add(line);
        }

        this.connectors.set(connectorData.id, line);
      }
    });

    this.canvas.renderAll();
  }

  public exportAsImage(format: 'png' | 'svg' = 'png'): string {
    console.log(`🔄 Exportando fluxograma como ${format}`);
    try {
      if (format === 'png') {
        return this.canvas.toDataURL({
          format: 'png',
          quality: 1,
        });
      } else {
        return this.canvas.toSVG();
      }
    } catch (error) {
      console.error(`❌ Erro ao exportar como ${format}:`, error);
      throw error;
    }
  }

  public getData(): FlowchartData {
    return { ...this.flowchartData };
  }

  private saveState(): void {
    this.flowchartData.updatedAt = new Date().toISOString();
    this.onChangeCallback(this.flowchartData);
  }

  public destroy(): void {
    console.log("🧹 Destruindo FlowchartCanvas");
    try {
      window.removeEventListener('resize', this.handleWindowResize);
      this.canvas.dispose();
      this.isInitialized = false;
      console.log("✅ FlowchartCanvas destruído com sucesso");
    } catch (error) {
      console.error("❌ Erro ao destruir canvas:", error);
    }
  }

  public deleteSelectedObjects(): void {
    console.log("🔄 Excluindo objetos selecionados");
    try {
      const activeObjects = this.canvas.getActiveObjects();
      
      if (activeObjects.length === 0) {
        console.log("ℹ️ Nenhum objeto selecionado para excluir");
        return;
      }
      
      // Remove os objetos selecionados
      activeObjects.forEach((obj: fabric.Object) => {
        // Se for um nó, remover também os conectores associados
        if (obj.data?.type === 'node') {
          const nodeId = obj.data.id;
          console.log(`Removendo nó com ID: ${nodeId}`);
          
          // Encontrar e remover conectores associados a este nó
          this.flowchartData.connectors = this.flowchartData.connectors.filter(
            (connector) => connector.from !== nodeId && connector.to !== nodeId
          );
          
          // Remover conectores do canvas
          this.connectors.forEach((connector, id) => {
            if (connector.data?.from === nodeId || connector.data?.to === nodeId) {
              this.canvas.remove(connector);
              this.connectors.delete(id);
              console.log(`Conector ${id} removido`);
            }
          });
          
          // Remover o nó do mapa de nós
          this.nodes.delete(nodeId);
        }
        
        // Remover o objeto do canvas
        this.canvas.remove(obj);
      });
      
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
      this.updateFlowchartData();
      console.log("✅ Objetos excluídos com sucesso");
    } catch (error) {
      console.error("❌ Erro ao excluir objetos:", error);
    }
  }

  private updateFlowchartData(): void {
    console.log("🔄 Atualizando flowchartData com base no canvas");
    try {
      // Atualizar nós
      const updatedNodes: FlowchartNode[] = [];
      this.nodes.forEach((obj, id) => {
        if (obj && obj.data) {
          const position = {
            x: obj.left || 0,
            y: obj.top || 0
          };
          
          // Encontrar o texto dentro do grupo
          let text = 'Texto';
          if (obj instanceof fabric.Group) {
            const textObj = obj.getObjects().find(
              o => o instanceof fabric.IText || o instanceof fabric.Text
            );
            if (textObj) {
              text = (textObj as fabric.IText).text || 'Texto';
            }
          }
          
          updatedNodes.push({
            id: id,
            type: obj.data.nodeType || 'rectangle',
            position: position,
            text: text,
            style: {
              fill: obj.fill as string || '#ffffff',
              stroke: obj.stroke as string || '#000000',
              strokeWidth: obj.strokeWidth as number || 2
            }
          });
        }
      });
      
      // Atualizar flowchartData
      this.flowchartData.nodes = updatedNodes;
      
      // Salvar estado
      this.saveState();
      console.log("✅ flowchartData atualizado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao atualizar flowchartData:", error);
    }
  }

  private handleObjectMoving = (e: fabric.IEvent): void => {
    this.updateConnectorsPositions(e.target);
  };
  
  private handleObjectModified = (e: fabric.IEvent): void => {
    this.updateFlowchartData();
  };
  
  // Método para atualizar as posições dos conectores quando um nó é movido
  private updateConnectorsPositions(target?: fabric.Object | null): void {
    if (!target || !target.data || target.data.type !== 'node') return;
    
    const nodeId = target.data.id;
    
    this.connectors.forEach((connector) => {
      if (!connector.data) return;
      
      const fromId = connector.data.from;
      const toId = connector.data.to;
      
      if (fromId === nodeId || toId === nodeId) {
        const fromNode = this.nodes.get(fromId);
        const toNode = this.nodes.get(toId);
        
        if (fromNode && toNode) {
          const fromPoint = {
            x: fromNode.left || 0,
            y: fromNode.top || 0
          };
          
          const toPoint = {
            x: toNode.left || 0,
            y: toNode.top || 0
          };
          
          connector.set({
            x1: fromPoint.x,
            y1: fromPoint.y,
            x2: toPoint.x,
            y2: toPoint.y
          });
        }
      }
    });
    
    this.canvas.requestRenderAll();
  }

  private getConnectionPoint(obj: fabric.Object): { x: number; y: number } {
    const center = obj.getCenterPoint();
    return {
      x: center.x,
      y: center.y,
    };
  }
}