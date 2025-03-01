export interface FlowchartNode {
  id: string;
  type: 'rectangle' | 'circle' | 'diamond';
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
}

export interface FlowchartConnector {
  id: string;
  from: string;
  to: string;
  points?: number[];
  stroke: string;
  strokeWidth: number;
  arrow?: boolean;
}

export interface FlowchartData {
  id: string;
  name: string;
  nodes: FlowchartNode[];
  connectors: FlowchartConnector[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}