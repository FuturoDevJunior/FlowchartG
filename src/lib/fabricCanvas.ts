import { fabric } from 'fabric';
import { FlowchartNode, FlowchartConnector, FlowchartData } from '../types';
import { nanoid } from 'nanoid';

export class FlowchartCanvas {
  private canvas: fabric.Canvas;
  private nodes: Map<string, fabric.Object> = new Map();
  private connectors: Map<string, fabric.Line> = new Map();
  private flowchartData: FlowchartData;
  private onChangeCallback: (data: FlowchartData) => void;

  constructor(canvasId: string, initialData?: FlowchartData, onChange?: (data: FlowchartData) => void) {
    this.canvas = new fabric.Canvas(canvasId, {
      width: window.innerWidth,
      height: window.innerHeight - 100,
      backgroundColor: '#f5f5f5',
      selection: true,
      preserveObjectStacking: true,
    });

    this.flowchartData = initialData || {
      id: nanoid(),
      name: 'Untitled Flowchart',
      nodes: [],
      connectors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.onChangeCallback = onChange || (() => {});

    this.setupEventListeners();
    
    if (initialData) {
      this.loadFromData(initialData);
    }

    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight - 100);
    this.canvas.renderAll();
  };

  private setupEventListeners(): void {
    this.canvas.on('object:moving', this.handleObjectMoving);
    this.canvas.on('object:modified', this.handleObjectModified);
  }

  private handleObjectMoving = (): void => {
    // Atualizar conectores quando um nó é movido
    const activeObject = this.canvas.getActiveObject();
    
    if (activeObject && activeObject.data?.type === 'node') {
      const nodeId = activeObject.data.id;
      
      // Atualizar conectores associados a este nó
      this.connectors.forEach((connector) => {
        if (connector.data?.from === nodeId || connector.data?.to === nodeId) {
          this.updateConnectorsPosition(nodeId);
        }
      });
      
      this.canvas.requestRenderAll();
    }
    
    // Atualizar os dados do fluxograma
    this.updateFlowchartData();
  };

  private handleObjectModified = (): void => {
    this.updateFlowchartData();
  };

  private updateConnectorsPosition(nodeId: string): void {
    this.flowchartData.connectors.forEach((connector) => {
      if (connector.from === nodeId || connector.to === nodeId) {
        const fromNode = this.nodes.get(connector.from);
        const toNode = this.nodes.get(connector.to);
        
        if (fromNode && toNode) {
          const fromPoint = this.getConnectionPoint(fromNode);
          const toPoint = this.getConnectionPoint(toNode);
          
          const line = this.connectors.get(connector.id);
          if (line) {
            line.set({
              x1: fromPoint.x,
              y1: fromPoint.y,
              x2: toPoint.x,
              y2: toPoint.y,
            });
          }
        }
      }
    });
  }

  private getConnectionPoint(obj: fabric.Object): { x: number; y: number } {
    const center = obj.getCenterPoint();
    return {
      x: center.x,
      y: center.y,
    };
  }

  public addNode(type: FlowchartNode['type'], x: number, y: number): string {
    const id = nanoid();
    const nodeDefaults = {
      rectangle: {
        width: 150,
        height: 80,
        rx: 5,
        ry: 5,
      },
      circle: {
        radius: 50,
      },
      diamond: {
        width: 120,
        height: 120,
      },
    };

    let node: fabric.Object;

    if (type === 'rectangle') {
      node = new fabric.Rect({
        left: x,
        top: y,
        ...nodeDefaults.rectangle,
        fill: '#ffffff',
        stroke: '#2A2A2A',
        strokeWidth: 2,
        hasControls: true,
        hasBorders: true,
      });
    } else if (type === 'circle') {
      node = new fabric.Circle({
        left: x,
        top: y,
        ...nodeDefaults.circle,
        fill: '#ffffff',
        stroke: '#2A2A2A',
        strokeWidth: 2,
        hasControls: true,
        hasBorders: true,
      });
    } else {
      // Diamond shape
      node = new fabric.Polygon(
        [
          { x: 0, y: -nodeDefaults.diamond.height / 2 },
          { x: nodeDefaults.diamond.width / 2, y: 0 },
          { x: 0, y: nodeDefaults.diamond.height / 2 },
          { x: -nodeDefaults.diamond.width / 2, y: 0 },
        ],
        {
          left: x,
          top: y,
          fill: '#ffffff',
          stroke: '#2A2A2A',
          strokeWidth: 2,
          hasControls: true,
          hasBorders: true,
        }
      );
    }

    // Add text
    const text = new fabric.Textbox('Text', {
      left: x,
      top: y,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#2A2A2A',
      textAlign: 'center',
      width: type === 'rectangle' ? nodeDefaults.rectangle.width - 20 : 100,
      editable: true,
    });

    // Group node and text
    const group = new fabric.Group([node, text], {
      left: x,
      top: y,
      hasControls: true,
      hasBorders: true,
      lockScalingX: false,
      lockScalingY: false,
      subTargetCheck: true,
    });

    // Add custom data
    group.data = { id, type };

    this.canvas.add(group);
    this.nodes.set(id, group);

    // Add to flowchart data
    const nodeData: FlowchartNode = {
      id,
      type,
      text: 'Text',
      x,
      y,
      width: type === 'rectangle' ? nodeDefaults.rectangle.width : 
             type === 'circle' ? nodeDefaults.circle.radius * 2 : 
             nodeDefaults.diamond.width,
      height: type === 'rectangle' ? nodeDefaults.rectangle.height : 
              type === 'circle' ? nodeDefaults.circle.radius * 2 : 
              nodeDefaults.diamond.height,
      fill: '#ffffff',
      stroke: '#2A2A2A',
    };

    this.flowchartData.nodes.push(nodeData);
    this.saveState();

    return id;
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
    if (format === 'png') {
      return this.canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
    } else {
      return this.canvas.toSVG();
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
    window.removeEventListener('resize', this.handleResize);
    this.canvas.dispose();
  }

  public deleteSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();
    
    if (activeObjects.length === 0) return;
    
    // Remove os objetos selecionados
    activeObjects.forEach((obj) => {
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
    // Atualizar os dados dos nós
    const nodes: FlowchartNode[] = [];
    this.nodes.forEach((node) => {
      if (node.data) {
        const { left, top, width, height } = node;
        nodes.push({
          id: node.data.id,
          type: node.data.type,
          text: node.data.text || '',
          x: left || 0,
          y: top || 0,
          width: width || 0,
          height: height || 0,
          fill: node.data.fill || '#ffffff',
          stroke: node.data.stroke || '#000000',
        });
      }
    });

    // Atualizar os dados dos conectores
    const connectors: FlowchartConnector[] = [];
    this.connectors.forEach((connector) => {
      if (connector.data) {
        connectors.push({
          id: connector.data.id,
          from: connector.data.from,
          to: connector.data.to,
          points: connector.data.points,
          stroke: connector.data.stroke || '#000000',
          strokeWidth: connector.data.strokeWidth || 2,
          arrow: connector.data.arrow || false,
        });
      }
    });

    // Atualizar os dados do fluxograma
    this.flowchartData = {
      ...this.flowchartData,
      nodes,
      connectors,
      updatedAt: new Date().toISOString(),
    };

    // Chamar o callback de alteração
    if (this.onChangeCallback) {
      this.onChangeCallback(this.flowchartData);
    }
  }
}