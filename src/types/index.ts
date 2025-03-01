/**
 * Core types for the FlowchartG application
 * Local storage version - no authentication
 */

// Flowchart Node definition
export interface FlowchartNode {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fill: string;
  stroke: string;
  strokeWidth?: number;
  metadata?: Record<string, unknown>;
}

// Flowchart Connector definition
export interface FlowchartConnector {
  id: string;
  from: string;
  to: string;
  stroke: string;
  strokeWidth: number;
  arrow: boolean;
  dashArray?: number[];
  metadata?: Record<string, unknown>;
}

// Complete Flowchart Data structure
export interface FlowchartData {
  id: string;
  name: string;
  nodes: FlowchartNode[];
  connectors: FlowchartConnector[];
  createdAt: string;
  updatedAt: string;
  version?: string;
}