// @ts-expect-error Fabric.js types are not fully compatible with TypeScript
import { fabric } from 'fabric';

// Text editing animation states
export interface TextEditAnimationState {
  isEditing: boolean;
  originalFill?: string;
  originalBackgroundColor?: string;
  originalStrokeWidth?: number;
  animationInterval?: NodeJS.Timeout;
}

// Keep track of text objects currently being edited
const editingStates = new Map<string, TextEditAnimationState>();

/**
 * Apply a subtle pulse animation to text objects while editing
 */
export function applyTextEditAnimation(textObject: fabric.IText, canvas: fabric.Canvas): void {
  if (!textObject || !canvas) return;
  
  const objectId = (textObject as fabric.Object & { data?: { id?: string } }).data?.id || 
                   Math.random().toString(36);
  
  // Store original state
  const state: TextEditAnimationState = {
    isEditing: true,
    originalFill: textObject.fill as string,
    originalBackgroundColor: textObject.backgroundColor as string,
    originalStrokeWidth: textObject.strokeWidth || 0
  };
  
  editingStates.set(objectId, state);
  
  // Apply initial edit style
  textObject.set({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    stroke: '#00AAFF',
    strokeWidth: 1,
    shadow: new fabric.Shadow({ 
      color: 'rgba(0, 170, 255, 0.5)', 
      blur: 8, 
      offsetX: 0, 
      offsetY: 0 
    })
  });
  
  canvas.requestRenderAll();
  
  // Add pulsing cursor animation
  let glowAmount = 0;
  let increasing = true;
  const animInterval = setInterval(() => {
    if (increasing) {
      glowAmount += 0.1;
      if (glowAmount >= 1) increasing = false;
    } else {
      glowAmount -= 0.1;
      if (glowAmount <= 0) increasing = true;
    }
    
    textObject.set({
      shadow: new fabric.Shadow({ 
        color: `rgba(0, 170, 255, ${0.3 + (glowAmount * 0.3)})`, 
        blur: 8 + (glowAmount * 4), 
        offsetX: 0, 
        offsetY: 0 
      })
    });
    
    canvas.requestRenderAll();
  }, 50);
  
  // Store animation interval for cleanup
  state.animationInterval = animInterval;
  editingStates.set(objectId, state);
}

/**
 * Remove animations and restore original appearance
 */
export function removeTextEditAnimation(textObject: fabric.IText, canvas: fabric.Canvas): void {
  if (!textObject || !canvas) return;
  
  const objectId = (textObject as fabric.Object & { data?: { id?: string } }).data?.id || 
                   '';
  const state = editingStates.get(objectId);
  
  if (state) {
    // Clear animation interval
    if (state.animationInterval) {
      clearInterval(state.animationInterval);
    }
    
    // Restore original appearance
    textObject.set({
      fill: state.originalFill,
      backgroundColor: state.originalBackgroundColor,
      strokeWidth: state.originalStrokeWidth,
      stroke: undefined,
      shadow: null
    });
    
    canvas.requestRenderAll();
    editingStates.delete(objectId);
  }
}

/**
 * Update cursor style for text objects
 */
export function updateCursorForTextObject(textObject: fabric.IText): void {
  if (!textObject) return;
  
  textObject.set({
    cursorColor: '#00AAFF',
    cursorWidth: 3,
    cursorDuration: 600,
    selectionColor: 'rgba(0, 170, 255, 0.3)',
  });
} 