/**
 * Global type declarations for FlowchartG application
 */

// Extend Window interface with our global methods
interface Window {
  /**
   * Ensures the canvas is properly configured for the current browser environment
   * @returns {boolean} True if initialization is successful
   */
  ensureCanvasReady?: () => boolean;
}

// Namespace for all flowchart-related types
declare namespace FlowchartTypes {
  interface Position {
    x: number;
    y: number;
  }

  interface Style {
    fill: string;
    stroke: string;
    strokeWidth: number;
  }

  interface Node {
    id: string;
    type: string;
    position: Position;
    text: string;
    style: Style;
  }

  interface Connection {
    id: string;
    from: string;
    to: string;
    style?: Style;
  }
}

// Type definitions for fabric.js
declare module 'fabric' {
  export interface IEvent {
    e: Event;
    target?: fabric.Object;
    subTargets?: fabric.Object[];
    button?: number;
    isClick?: boolean;
    pointer?: fabric.Point;
    absolutePointer?: fabric.Point;
    transform?: fabric.Transform;
  }
  
  export interface Object {
    /**
     * Custom data property to store application-specific metadata
     */
    data?: {
      id?: string;
      type?: string;
      nodeType?: string;
      from?: string;
      to?: string;
      text?: string;
      [key: string]: unknown;
    };
  }
} 