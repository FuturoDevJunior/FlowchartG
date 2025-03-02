/**
 * Core application type definitions
 * Centralizes all types used throughout the application
 */

/**
 * Node position in the canvas
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Style configuration for nodes and connections
 */
export interface Style {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity?: number;
}

/**
 * Node types supported by the application
 */
export type NodeType = 'rectangle' | 'circle' | 'diamond';

/**
 * Flowchart node (canvas representation)
 */
export interface Node {
  id: string;
  type: NodeType;
  position: Position;
  text: string;
  style: Style;
  width?: number;
  height?: number;
  radius?: number;
  // Propriedades adicionais para compatibilidade com fabricCanvas
  x?: number;
  y?: number;
  fill?: string;
  stroke?: string;
}

/**
 * Internal representation of node for fabricCanvas
 */
export interface FlowchartNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fill: string;
  stroke: string;
}

/**
 * Connection between nodes
 */
export interface Connection {
  id: string;
  from: string;
  to: string;
  style?: Style;
  label?: string;
  points?: Position[];
}

/**
 * Internal representation of connection for fabricCanvas
 */
export interface FlowchartConnector {
  id: string;
  from: string;
  to: string;
  stroke?: string;
  strokeWidth?: number;
  arrow?: boolean;
}

/**
 * Complete flowchart data structure
 */
export interface FlowchartData {
  id?: string;
  name?: string;
  nodes: Node[];
  connections: Connection[];
  selectedNodeType?: 'rectangle' | 'circle' | 'diamond';
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    createdAt?: number;
    updatedAt?: number;
    version?: string;
    [key: string]: unknown;
  };
}

/**
 * Canvas operation types
 */
export enum CanvasOperation {
  ADD_NODE = 'ADD_NODE',
  MOVE_NODE = 'MOVE_NODE',
  DELETE_NODE = 'DELETE_NODE',
  EDIT_NODE_TEXT = 'EDIT_NODE_TEXT',
  ADD_CONNECTION = 'ADD_CONNECTION',
  DELETE_CONNECTION = 'DELETE_CONNECTION',
  CLEAR_CANVAS = 'CLEAR_CANVAS',
}

/**
 * History record for undo/redo functionality
 */
export interface HistoryRecord {
  operation: CanvasOperation;
  data: unknown;
  timestamp: number;
}

/**
 * Canvas state for history management
 */
export interface CanvasState {
  flowchartData: FlowchartData;
  history: HistoryRecord[];
  historyIndex: number;
}