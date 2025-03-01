// Declarações de tipos globais para nossa aplicação

// Estendendo o Window para incluir objetos globais necessários
interface Window {
  LucidModeButton: any;
  VideoToolbar?: {
    BUTTONS: any;
  };
  ensureCanvasReady?: () => void;
}

// Tipos para auxiliar na criação de flowcharts
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

// Tipagem para fabric.js
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
    data?: any;
  }
} 