/**
 * Application Configuration
 * Centralizes all configuration values and environment variables
 */

export const APP_CONFIG = {
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  storage: {
    localStorageKey: import.meta.env.VITE_LOCAL_STORAGE_KEY || 'flowchart_g_data',
  },
  
  canvas: {
    defaultNodeColor: '#ffffff',
    defaultNodeBorderColor: '#333333',
    defaultLineColor: '#666666',
    connectionArrowColor: '#333333',
    
    // Default sizes for each node type
    nodeSize: {
      rectangle: { width: 160, height: 80 },
      circle: { radius: 50 },
      diamond: { width: 120, height: 120 },
    },
    
    // Zoom constraints
    zoom: {
      min: 0.3,
      max: 3.0,
      default: 1.0,
      step: 0.1
    }
  },
  
  // Feature flags for conditional feature enabling
  features: {
    enableSharing: true,
    enableExport: true,
    enableLocalStorage: true,
    enableTutorial: true,
    enableMobileOptimizations: true,
  },
  
  performance: {
    // Throttle/debounce timeouts in ms
    autoSaveDebounce: 1000,
    resizeDebounce: 250,
    
    // Performance optimizations
    maxUndoHistory: 50,
    maxCanvasObjects: 500,
  }
};

export default APP_CONFIG; 