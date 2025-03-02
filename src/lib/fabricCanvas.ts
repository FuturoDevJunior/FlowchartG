// @ts-expect-error Fabric.js types are not fully compatible with TypeScript
import { fabric } from 'fabric';
import { FlowchartNode, FlowchartConnector, FlowchartData } from '../types';
import { nanoid } from 'nanoid';

// Extended canvas interface with custom properties and preserved fabric.Canvas methods
interface ExtendedCanvas extends fabric.Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
  // All the needed fabric.Canvas methods
  getCenter(): { left: number; top: number };
  setZoom(value: number): fabric.Canvas;
  zoomToPoint(point: fabric.Point, value: number): fabric.Canvas;
  getZoom(): number;
  setDimensions(dimensions: {width: number; height: number}): fabric.Canvas;
  renderAll(): fabric.Canvas;
  relativePan(point: fabric.Point): fabric.Canvas;
  requestRenderAll(): void;
  getElement(): HTMLCanvasElement;
  setWidth(value: number): fabric.Canvas;
  setHeight(value: number): fabric.Canvas;
  on(event: string, handler: (options: MouseEventOptions) => void): fabric.Canvas;
  width: number;
  height: number;
  viewportTransform?: number[];
  add(...objects: fabric.Object[]): fabric.Canvas;
  remove(...objects: fabric.Object[]): fabric.Canvas;
  clear(): fabric.Canvas;
  getActiveObjects(): fabric.Object[];
  discardActiveObject(): fabric.Canvas;
  dispose(): void;
  toDataURL(options?: {
    format?: string;
    quality?: number;
    multiplier?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  }): string;
  toSVG(options?: {
    suppressPreamble?: boolean;
    viewBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    encoding?: string;
    width?: number;
    height?: number;
  }): string;
}

// Helper type for mouse events that works with both mouse and touch events
interface ExtendedMouseEvent extends Partial<MouseEvent> {
  clientX: number;
  clientY: number;
  offsetX?: number;
  offsetY?: number;
}

interface ExtendedTouchEvent extends TouchEvent {
  clientX: number;
  clientY: number;
}

// Extended event options
interface MouseEventOptions {
  e: ExtendedMouseEvent | ExtendedTouchEvent;
  target?: fabric.Object;
  pointer?: fabric.Point;
  absolutePointer?: fabric.Point;
  button?: number;
  isClick?: boolean;
  subTargets?: fabric.Object[];
  transform?: {
    action: string;
    corner: string;
    original: fabric.Object;
    originX: string;
    originY: string;
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    target: fabric.Object;
  };
}

export class FlowchartCanvas {
  private canvas: ExtendedCanvas;
  private nodes: Map<string, fabric.Object> = new Map();
  private connections: Map<string, fabric.Object> = new Map();
  private flowchartData: FlowchartData;
  private onChangeCallback: (data: FlowchartData) => void;
  private isInitialized: boolean = false;
  private zoomLevel: number = 1;

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
      // Set default cursor to move 
      defaultCursor: 'move',
      // Improved options for better mobile experience
      stopContextMenu: true,
      fireRightClick: true,
      enableRetinaScaling: true,
    }) as ExtendedCanvas;
    
    // Initialize canvas extensions
    this.extendCanvas();
    
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
      connections: [],
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

  // Set zoom level with center point
  public setZoom(zoomLevel: number): void {
    if (!this.isCanvasReady()) return;
    
    // Limit zoom between 0.3 and 3
    this.zoomLevel = Math.min(Math.max(zoomLevel, 0.3), 3);
    
    try {
      // Get canvas center point
      const center = this.canvas.getCenter();
      
      // Set zoom with center point
      this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), this.zoomLevel);
      
      // Render changes
      this.canvas.renderAll();
    } catch (error) {
      console.error("Error setting zoom:", error);
    }
  }

  // Center view on all objects or fit all objects into view
  public centerView(): void {
    if (!this.isCanvasReady()) return;
    
    try {
      // Get all objects - incluir tanto nós quanto conectores
      const allObjects = [
        ...Array.from(this.nodes.values()),
        ...Array.from(this.connections.values())
      ];
      
      if (allObjects.length === 0) return;
      
      // Calculate bounds
      const bounds = this.getObjectsBounds(allObjects);
      
      // If we have valid bounds
      if (bounds.width > 0 && bounds.height > 0) {
        // Calculate center of objects
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        
        // Calculate center of canvas
        const canvasCenter = this.canvas.getCenter();
        
        // Calculate new viewport to center objects
        const deltaX = canvasCenter.left - centerX;
        const deltaY = canvasCenter.top - centerY;
        
        // Move all objects to center
        this.canvas.relativePan(new fabric.Point(deltaX, deltaY));
        
        // Set zoom to fit all objects with some padding
        const padding = 80; // Aumentado para dar mais espaço
        const scaleX = this.canvas.width / (bounds.width + padding * 2);
        const scaleY = this.canvas.height / (bounds.height + padding * 2);
        
        // Use the smaller scale to ensure everything fits
        // Limitamos a um zoom máximo de 1.0 e mínimo de 0.5
        const newZoom = Math.min(Math.max(0.5, Math.min(scaleX, scaleY)), 1);
        
        // Apply zoom if it's different enough
        if (Math.abs(this.zoomLevel - newZoom) > 0.05) {
          this.setZoom(newZoom);
        }
        
        // Force render all immediately
        setTimeout(() => {
          this.canvas.requestRenderAll();
        }, 50);
      } else {
        // Se não temos objetos ou bounds válidos, apenas resetamos o zoom
        this.setZoom(1.0);
        
        if (this.canvas.viewportTransform) {
          this.canvas.viewportTransform[4] = 0;
          this.canvas.viewportTransform[5] = 0;
          this.canvas.requestRenderAll();
        }
      }
    } catch (error) {
      console.error("Error centering view:", error);
      
      // Em caso de erro, tentar uma abordagem mais simples
      if (this.canvas.viewportTransform) {
        this.canvas.viewportTransform[4] = 0;
        this.canvas.viewportTransform[5] = 0;
        this.setZoom(1.0);
        this.canvas.requestRenderAll();
      }
    }
  }

  // Calculate bounds for a collection of objects
  private getObjectsBounds(objects: fabric.Object[]): { left: number, top: number, width: number, height: number } {
    if (!objects.length) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }
    
    // Initialize bounds with first object
    const bounds = {
      left: objects[0].left || 0,
      top: objects[0].top || 0,
      right: (objects[0].left || 0) + (objects[0].width || 0),
      bottom: (objects[0].top || 0) + (objects[0].height || 0)
    };
    
    // Update bounds with remaining objects
    objects.forEach(obj => {
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objRight = objLeft + (obj.width || 0) * (obj.scaleX || 1);
      const objBottom = objTop + (obj.height || 0) * (obj.scaleY || 1);
      
      bounds.left = Math.min(bounds.left, objLeft);
      bounds.top = Math.min(bounds.top, objTop);
      bounds.right = Math.max(bounds.right, objRight);
      bounds.bottom = Math.max(bounds.bottom, objBottom);
    });
    
    return {
      left: bounds.left,
      top: bounds.top,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
    };
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
    
    // Enable panning with mouse drag when not on an object
    this.canvas.on('mouse:down', (options: MouseEventOptions) => {
      if (!options.target) {
        this.canvas.isDragging = true;
        this.canvas.lastPosX = options.e.clientX;
        this.canvas.lastPosY = options.e.clientY;
      }
    });
    
    this.canvas.on('mouse:move', (options: MouseEventOptions) => {
      if (this.canvas.isDragging) {
        const e = options.e;
        const vpt = this.canvas.viewportTransform;
        if (!vpt) return;
        
        vpt[4] += e.clientX - (this.canvas.lastPosX || 0);
        vpt[5] += e.clientY - (this.canvas.lastPosY || 0);
        this.canvas.requestRenderAll();
        
        this.canvas.lastPosX = e.clientX;
        this.canvas.lastPosY = e.clientY;
      }
    });
    
    this.canvas.on('mouse:up', () => {
      this.canvas.isDragging = false;
    });
    
    // Enable mouse wheel zoom
    this.canvas.on('mouse:wheel', (options: MouseEventOptions) => {
      const wheelEvent = options.e as unknown as WheelEvent;
      const delta = wheelEvent.deltaY;
      // Reverse direction (like most graphic applications)
      const zoom = this.canvas.getZoom() * (delta > 0 ? 0.95 : 1.05);
      
      // Limit zoom level
      const newZoom = Math.min(Math.max(zoom, 0.3), 3);
      this.zoomLevel = newZoom;
      
      const offsetX = wheelEvent.offsetX || wheelEvent.clientX;
      const offsetY = wheelEvent.offsetY || wheelEvent.clientY;
      
      const point = new fabric.Point(offsetX, offsetY);
      this.canvas.zoomToPoint(point, newZoom);
      
      wheelEvent.preventDefault();
      wheelEvent.stopPropagation();
    });
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

  public addConnection(fromId: string, toId: string): string {
    const id = nanoid();
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);

    if (!fromNode || !toNode) {
      throw new Error('Nodes not found');
    }

    // Get connection points
    const fromCenter = fromNode.getCenterPoint();
    const toCenter = toNode.getCenterPoint();
    
    // Create connection path
    // We use a path instead of a line for better control over the curve
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    
    // Calculate control points for a quadratic curve
    // Use a proportion of the distance for curve control
    const controlPointFactor = 0.3;  // Aumentar o fator para curvas mais pronunciadas (era 0.2)
    const midX = fromCenter.x + dx * 0.5;
    const midY = fromCenter.y + dy * 0.5;
    
    // Offset from midpoint to create curved path
    const perpX = -dy * controlPointFactor;
    const perpY = dx * controlPointFactor;
    
    // Control point coordinates
    const cpX = midX + perpX;
    const cpY = midY + perpY;
    
    // Create a curved path (quadratic bezier)
    const path = new fabric.Path(`M ${fromCenter.x} ${fromCenter.y} Q ${cpX} ${cpY} ${toCenter.x} ${toCenter.y}`, {
      fill: '',
      stroke: '#1E88E5', // Azul mais brilhante (era #2A2A2A)
      strokeWidth: 3,    // Linha mais grossa (era 2)
      objectCaching: false,
      selectable: true,
      evented: true,
      strokeLineCap: 'round', // Extremidades arredondadas
      strokeLineJoin: 'round', // Junções arredondadas
      hoverCursor: 'pointer',
      shadow: new fabric.Shadow({ 
        color: 'rgba(0,0,0,0.2)', 
        blur: 4, 
        offsetX: 2, 
        offsetY: 2 
      }),
      data: { 
        id, 
        fromId, 
        toId, 
        type: 'connection' 
      }
    });
    
    // Add arrow
    const angle = Math.atan2(toCenter.y - cpY, toCenter.x - cpX);
    const headLength = 16; // Seta maior (era 15)
    
    const arrowHead = new fabric.Triangle({
      width: headLength,
      height: headLength,
      left: toCenter.x,
      top: toCenter.y,
      angle: (angle * 180) / Math.PI + 90,
      fill: '#1E88E5', // Mesma cor da linha (era #2A2A2A)
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      shadow: new fabric.Shadow({ 
        color: 'rgba(0,0,0,0.2)', 
        blur: 3, 
        offsetX: 1, 
        offsetY: 1 
      }),
    });
    
    // Create connection group
    const connection = new fabric.Group([path, arrowHead], {
      hasControls: false,
      hasBorders: false,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: 'pointer',
      selectable: true, // Garantir que é selecionável
      data: { 
        id, 
        fromId, 
        toId, 
        type: 'connection' 
      }
    });

    // Add to canvas
    this.canvas.add(connection);
    this.connections.set(id, connection);
    
    // Garante que o connection aparece acima (bringToFront)
    connection.bringToFront();
    
    // Atualiza o connection uma vez para garantir posição correta
    this.updateConnection(connection);

    // Add to flowchart data
    const connectionData: FlowchartConnector = {
      id,
      from: fromId,
      to: toId,
      stroke: '#1E88E5', // Atualiza a cor da linha no dados também
      strokeWidth: 3,    // Atualiza a espessura da linha nos dados
      arrow: true,
    };

    this.flowchartData.connections.push(connectionData);
    this.saveState();

    // Renderiza o canvas após adicionar o connection
    this.canvas.renderAll();

    return id;
  }

  private updateConnection(connection: fabric.Object): void {
    if (!connection.data) return;
    
    const { fromId, toId } = connection.data;
    
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    
    if (!fromNode || !toNode) return;
    
    const fromCenter = fromNode.getCenterPoint();
    const toCenter = toNode.getCenterPoint();
    
    // Calculate new path and arrow
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    
    const controlPointFactor = 0.3;
    const midX = fromCenter.x + dx * 0.5;
    const midY = fromCenter.y + dy * 0.5;
    
    const perpX = -dy * controlPointFactor;
    const perpY = dx * controlPointFactor;
    
    const cpX = midX + perpX;
    const cpY = midY + perpY;
    
    if (connection instanceof fabric.Group) {
      // Get path and arrow from group
      const items = connection.getObjects();
      const path = items[0] as fabric.Path;
      const arrow = items[1] as fabric.Triangle;
      
      if (path instanceof fabric.Path) {
        // Update path
        path.path = [
          ['M', fromCenter.x, fromCenter.y],
          ['Q', cpX, cpY, toCenter.x, toCenter.y]
        ];
        
        // Manter as mesmas propriedades de estilo
        path.set({
          stroke: '#1E88E5',
          strokeWidth: 3,
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
        });
      }
      
      if (arrow instanceof fabric.Triangle) {
        // Update arrow position and angle
        const angle = Math.atan2(toCenter.y - cpY, toCenter.x - cpX);
        arrow.set({
          left: toCenter.x,
          top: toCenter.y,
          angle: (angle * 180) / Math.PI + 90,
          fill: '#1E88E5'
        });
      }
      
      // Garantir que o connection fique visível
      connection.bringToFront();
      connection.setCoords();
    }
    
    // Atualizar estado
    this.saveState();
  }

  public removeNode(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      this.canvas.remove(node);
      this.nodes.delete(id);

      // Remove associated connections
      const connectionsToRemove = this.flowchartData.connections.filter(
        (connection) => connection.from === id || connection.to === id
      );

      connectionsToRemove.forEach((connection) => {
        this.removeConnection(connection.id);
      });

      // Update flowchart data
      this.flowchartData.nodes = this.flowchartData.nodes.filter(
        (node) => node.id !== id
      );

      this.saveState();
    }
  }

  public removeConnection(id: string): void {
    const connection = this.connections.get(id);
    if (connection) {
      this.canvas.remove(connection);
      this.connections.delete(id);

      // Update flowchart data
      this.flowchartData.connections = this.flowchartData.connections.filter(
        (connection) => connection.id !== id
      );

      this.saveState();
    }
  }

  public loadFromData(data: FlowchartData): void {
    // Clear canvas
    this.canvas.clear();
    this.nodes.clear();
    this.connections.clear();

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
      group.data = { id: nodeData.id, type: 'node', nodeType: nodeData.type };

      this.canvas.add(group);
      this.nodes.set(nodeData.id, group);
    });

    // Add connections with improved appearance
    data.connections.forEach((connectionData) => {
      const fromNode = this.nodes.get(connectionData.from);
      const toNode = this.nodes.get(connectionData.to);

      if (fromNode && toNode) {
        // Add connection by reusing the addConnection method
        this.addConnection(connectionData.from, connectionData.to);
      }
    });

    // Center the view after loading all items
    setTimeout(() => {
      this.centerView();
    }, 100);

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
      // Se for um nó, remover também os connections associados
      if (obj.data?.type === 'node') {
        const nodeId = obj.data.id;
        
        // Encontrar e remover connections associados a este nó
        this.flowchartData.connections = this.flowchartData.connections.filter(
          (connection) => connection.from !== nodeId && connection.to !== nodeId
        );
        
        // Remover connections do canvas
        this.connections.forEach((connection, id) => {
          if (connection.data?.fromId === nodeId || connection.data?.toId === nodeId) {
            this.canvas.remove(connection);
            this.connections.delete(id);
          }
        });
        
        // Remover o nó do mapa de nós
        this.nodes.delete(nodeId);
      } else if (obj.data?.type === 'connection') {
        // Remover connections diretamente
        this.connections.delete(obj.data.id);
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
    
    // Atualizar connections
    const updatedConnections: FlowchartConnector[] = [];
    this.connections.forEach((obj, id) => {
      if (obj && obj.data) {
        updatedConnections.push({
          id: id,
          from: obj.data.fromId,
          to: obj.data.toId,
          stroke: '#1E88E5', // Cor azul atualizada
          strokeWidth: 3,    // Espessura atualizada
          arrow: true
        });
      }
    });
    
    // Atualizar flowchartData
    this.flowchartData.nodes = updatedNodes;
    this.flowchartData.connections = updatedConnections;
    
    // Salvar estado
    this.saveState();
  }

  private handleObjectMoving = (e: fabric.IEvent): void => {
    this.updateConnectionsPositions(e.target);
  };
  
  private handleObjectModified = (): void => {
    this.updateFlowchartData();
  };
  
  // Método para atualizar as posições dos connections quando um nó é movido
  private updateConnectionsPositions(target?: fabric.Object | null): void {
    if (!target || !target.data || target.data.type !== 'node') return;
    
    const nodeId = target.data.id;
    
    this.connections.forEach((connection) => {
      if (!connection.data) return;
      
      const fromId = connection.data.fromId;
      const toId = connection.data.toId;
      
      if (fromId === nodeId || toId === nodeId) {
        this.updateConnection(connection);
      }
    });
    
    this.canvas.requestRenderAll();
  }

  // Custom extension of the canvas
  private extendCanvas(): void {
    this.canvas.isDragging = false;
    this.canvas.lastPosX = 0;
    this.canvas.lastPosY = 0;
  }

  // Método para identificar um nó a partir de um evento
  public getNodeFromEvent(event: MouseEvent | TouchEvent): { id: string; type: string } | null {
    try {
      // Não precisamos converter o evento para coordenadas do canvas para isso
      
      // Encontrar o objeto sob o ponteiro
      // Como findTarget não está na interface ExtendedCanvas, fazemos um cast para um tipo mais específico
      interface CanvasWithFindTarget extends fabric.Canvas {
        findTarget(e: Event, skipGroup: boolean): fabric.Object | undefined;
      }
      
      const fabricCanvas = this.canvas as unknown as CanvasWithFindTarget;
      if (!fabricCanvas.findTarget) return null;
      
      const object = fabricCanvas.findTarget(event, false);
      
      if (object && object.data && object.data.type === 'node') {
        return {
          id: object.data.id,
          type: object.data.nodeType || 'unknown'
        };
      }
      
      // Se o objeto for um grupo, verifique seus filhos
      if (object instanceof fabric.Group) {
        const objects = object.getObjects();
        for (const obj of objects) {
          if (obj.data && obj.data.type === 'node') {
            return {
              id: obj.data.id,
              type: obj.data.nodeType || 'unknown'
            };
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error getting node from event:", error);
      return null;
    }
  }

  /**
   * Clears all nodes and connections from the canvas
   */
  public clearAll(): void {
    try {
      // Remove all connections
      const connectionIds = Array.from(this.connections.keys());
      connectionIds.forEach(id => {
        this.removeConnection(id);
      });
      
      // Remove all nodes
      const nodeIds = Array.from(this.nodes.keys());
      nodeIds.forEach(id => {
        this.removeNode(id);
      });
      
      // Reset zoom and pan
      if (this.canvas.viewportTransform) {
        this.setZoom(1.0);
        this.canvas.viewportTransform[4] = 0;
        this.canvas.viewportTransform[5] = 0;
      }
      
      // Trigger change callback with empty data
      if (this.onChangeCallback) {
        const emptyData: FlowchartData = {
          id: nanoid(),
          name: 'Novo Fluxograma',
          nodes: [],
          connections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.onChangeCallback(emptyData);
      }
      
      // Render
      this.canvas.requestRenderAll();
    } catch (error) {
      console.error("Error clearing canvas:", error);
      throw error;
    }
  }
  
  /**
   * Highlights a node (visual feedback for connection mode)
   * @param nodeId The ID of the node to highlight
   * @param highlight Whether to highlight or unhighlight
   */
  public highlightNode(nodeId: string, highlight: boolean): void {
    try {
      const node = this.nodes.get(nodeId);
      if (!node) return;
      
      if (highlight) {
        // Store original properties if not already stored
        if (!node.data.originalStroke) {
          node.data.originalStroke = node.stroke || '#000000';
          node.data.originalStrokeWidth = node.strokeWidth || 2;
        }
        
        // Apply highlight effect with animation
        node.set({
          stroke: '#FF3D00', // Bright orange
          strokeWidth: 4
        });
        
        // Animate a pulse effect
        let pulseCount = 0;
        const maxPulses = 3;
        
        const pulseAnimation = () => {
          if (pulseCount >= maxPulses) {
            // Reset to normal highlighted state
            node.set({ strokeWidth: 4 });
            this.canvas.requestRenderAll();
            return;
          }
          
          // Pulse out
          node.set({ strokeWidth: 6 });
          this.canvas.requestRenderAll();
          
          setTimeout(() => {
            // Pulse in
            node.set({ strokeWidth: 4 });
            this.canvas.requestRenderAll();
            
            pulseCount++;
            setTimeout(pulseAnimation, 300);
          }, 300);
        };
        
        // Start pulse animation
        pulseAnimation();
      } else {
        // Restore original properties
        if (node.data.originalStroke) {
          node.set({
            stroke: node.data.originalStroke,
            strokeWidth: node.data.originalStrokeWidth
          });
          
          // Clean up stored properties
          delete node.data.originalStroke;
          delete node.data.originalStrokeWidth;
        }
      }
      
      this.canvas.requestRenderAll();
    } catch (error) {
      console.error("Error highlighting node:", error);
    }
  }
}