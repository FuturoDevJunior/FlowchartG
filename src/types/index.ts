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
 * Flowchart node
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
 * Complete flowchart data structure
 */
export interface FlowchartData {
  nodes: Node[];
  connections: Connection[];
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    createdAt?: number;
    updatedAt?: number;
    version?: string;
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