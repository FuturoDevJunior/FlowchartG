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
    // Use os parâmetros de largura e altura se fornecidos, caso contrário use valores padrão
    const canvasWidth = width || 800;
    const canvasHeight = height || 500;
    
    // Criar canvas de forma simplificada
    this.canvas = new fabric.Canvas(canvasId, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#f5f5f5',
      selection: true,
      preserveObjectStacking: true,
    });
    
    // Definir tamanho
    this.canvas.setDimensions({
      width: canvasWidth,
      height: canvasHeight
    });

    // Inicializar dados
    this.flowchartData = initialData || {
      id: nanoid(),
      name: 'Untitled Flowchart',
      nodes: [],
      connectors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Callback para mudanças
    this.onChangeCallback = onChange || (() => {});

    // Configurar event listeners
    this.setupEventListeners();
    
    // Carregar dados iniciais
    if (initialData) {
      this.loadFromData(initialData);
    }

    // Adicionar event listener para redimensionamento
    window.addEventListener('resize', this.handleWindowResize);
    
    // Marcar canvas como inicializado
    this.isInitialized = true;
    
    // Forçar uma renderização inicial
    setTimeout(() => {
      this.canvas.renderAll();
    }, 100);
  }

  // Método para lidar com redimensionamento
  private handleWindowResize = (): void => {
    this.handleResize();
  };

  // Método público para redimensionamento
  public handleResize = (width?: number, height?: number): void => {
    if (width && height) {
      this.canvas.setWidth(width);
      this.canvas.setHeight(height);
    } else {
      const parent = this.canvas.getElement().parentElement;
      if (parent) {
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        
        this.canvas.setWidth(parentWidth);
        this.canvas.setHeight(parentHeight);
      } else {
        this.canvas.setWidth(800);
        this.canvas.setHeight(500);
      }
    }
    
    // Renderizar com atraso
    setTimeout(() => {
      this.canvas.renderAll();
    }, 50);
  };

  private setupEventListeners(): void {
    this.canvas.on('object:moving', this.handleObjectMoving);
    this.canvas.on('object:modified', this.handleObjectModified);
  }

  // Método para verificar se o canvas está inicializado
  public isCanvasReady(): boolean {
    return this.isInitialized && !!this.canvas;
  }

  // Método para adicionar um nó ao canvas
  public addNode(type: 'rectangle' | 'circle' | 'diamond', x: number, y: number): string {
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

    // Default dimensions
    let width = 120;
    let height = 60;
    
    // Criar forma baseada no tipo
    if (type === 'rectangle') {
      obj = new fabric.Rect({
        ...commonOptions,
        width: width,
        height: height,
        left: x - width/2,
        top: y - height/2,
        rx: 5,
        ry: 5
      });
    } else if (type === 'circle') {
      const radius = 40;
      width = radius * 2;
      height = radius * 2;
      obj = new fabric.Circle({
        ...commonOptions,
        radius: radius,
        left: x - radius,
        top: y - radius
      });
    } else if (type === 'diamond') {
      // Criar um losango usando um polígono
      const points = [
        { x: 0, y: -40 },  // topo
        { x: 60, y: 0 },   // direita
        { x: 0, y: 40 },   // base
        { x: -60, y: 0 }   // esquerda
      ];
      width = 120;
      height = 80;
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
      x: x,
      y: y,
      width: width,
      height: height,
      text: 'Texto',
      fill: '#ffffff',
      stroke: '#000000'
    };
    
    // Atualizar flowchartData
    this.flowchartData.nodes.push(nodeData);
    
    // Salvar estado
    this.saveState();
    this.canvas.renderAll();
    
    return nodeId;
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
      console.error(`Error exporting as ${format}:`, error);
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
    window.removeEventListener('resize', this.handleWindowResize);
    this.canvas.dispose();
    this.isInitialized = false;
  }

  public deleteSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();
    
    if (activeObjects.length === 0) {
      return;
    }
    
    // Remove os objetos selecionados
    activeObjects.forEach((obj: fabric.Object) => {
      // Se for um nó, remover também os conectores associados
      if (obj.data?.type === 'node') {
        const nodeId = obj.data.id;
        
        // Encontrar e remover conectores associados a este nó
        this.flowchartData.connectors = this.flowchartData.connectors.filter(
          (connector) => connector.from !== nodeId && connector.to !== nodeId
        );
        
        // Remover conectores do canvas
        this.connectors.forEach((connector, id) => {
          if (connector.data?.from === nodeId || connector.data?.to === nodeId) {
            this.canvas.remove(connector);
            this.connectors.delete(id);
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
  }

  private updateFlowchartData(): void {
    // Atualizar nós
    const updatedNodes: FlowchartNode[] = [];
    this.nodes.forEach((obj, id) => {
      if (obj && obj.data) {
        // Encontrar o texto dentro do grupo
        let text = 'Texto';
        if (obj instanceof fabric.Group) {
          const textObj = obj.getObjects().find(
            (o: fabric.Object) => o instanceof fabric.IText || o instanceof fabric.Text
          );
          if (textObj) {
            text = (textObj as fabric.IText).text || 'Texto';
          }
        }
        
        // Determine width and height based on object type
        let width = 120; // default
        let height = 60; // default
        
        if (obj.width && obj.height) {
          width = obj.width;
          height = obj.height;
        }
        
        updatedNodes.push({
          id: id,
          type: obj.data.nodeType || 'rectangle',
          x: obj.left || 0,
          y: obj.top || 0,
          width: width,
          height: height,
          text: text,
          fill: obj.fill as string || '#ffffff',
          stroke: obj.stroke as string || '#000000'
        });
      }
    });
    
    // Atualizar flowchartData
    this.flowchartData.nodes = updatedNodes;
    
    // Salvar estado
    this.saveState();
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