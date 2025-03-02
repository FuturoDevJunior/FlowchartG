/**
 * Declarações de tipos para fabric.js
 * Para complementar a tipagem onde há lacunas
 */

declare module 'fabric' {
  export class Canvas {
    constructor(element: HTMLCanvasElement | string, options?: Record<string, unknown>);
    add(...objects: Object[]): Canvas;
    remove(...objects: Object[]): Canvas;
    clear(): Canvas;
    renderAll(): Canvas;
    dispose(): void;
    setWidth(width: number): Canvas;
    setHeight(height: number): Canvas;
    getWidth(): number;
    getHeight(): number;
    setBackgroundColor(color: string, callback?: () => void): Canvas;
    getObjects(): Object[];
    item(index: number): Object;
    on(event: string, handler: (e: unknown) => void): Canvas;
    off(event: string, handler: (e: unknown) => void): Canvas;
    getElement(): HTMLCanvasElement;
    getCenter(): { top: number; left: number };
    setViewportTransform(transform: number[]): Canvas;
    zoomToPoint(point: { x: number; y: number }, value: number): Canvas;
  }

  export class Object {
    id?: string;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    selectable?: boolean;
    hasControls?: boolean;
    lockMovementX?: boolean;
    lockMovementY?: boolean;
    set(options: Record<string, unknown>): Object;
    get(property: string): unknown;
  }

  export class Rect extends Object {
    constructor(options?: Record<string, unknown>);
  }

  export class Textbox extends Object {
    constructor(text: string, options?: Record<string, unknown>);
    text: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: string;
    originX?: string;
    originY?: string;
    fill?: string;
  }

  export class Group extends Object {
    constructor(objects: Object[], options?: Record<string, unknown>);
    addWithUpdate(object: Object): Group;
    removeWithUpdate(object: Object): Group;
    containsPoint(point: { x: number; y: number }): boolean;
  }
} 