/**
 * Core types for the FlowchartG application
 */

// User type for authentication
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

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
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
}

// Complete Flowchart Data structure
export interface FlowchartData {
  id: string;
  name: string;
  nodes: FlowchartNode[];
  connectors: FlowchartConnector[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic?: boolean;
  version?: string;
}

// Database tables types for Supabase
export type Tables = {
  flowcharts: {
    id: string;
    name: string;
    data: {
      nodes: FlowchartNode[];
      connectors: FlowchartConnector[];
    };
    user_id: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
    version: string;
  };
  profiles: {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    updated_at: string;
  };
};