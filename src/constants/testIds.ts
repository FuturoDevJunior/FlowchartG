/**
 * Constantes para seletores de teste
 * Centraliza IDs para uso nos testes do Cypress e nos componentes
 */

export const DATA_TEST_IDS = {
  // Layout elements
  HEADER: 'flowchart-header',
  FOOTER: 'flowchart-footer',
  SIDEBAR: 'flowchart-sidebar',
  MAIN: 'flowchart-main',
  CANVAS_CONTAINER: 'flowchart-canvas-container',
  
  // Toolbar elements
  TOOLBAR: 'flowchart-toolbar',
  TOOL_BUTTON: (type: string) => `tool-${type}`,
  NODE_BUTTON: (type: string) => `node-${type}`,
  
  // Canvas elements
  CANVAS: 'flowchart-canvas',
  CANVAS_WRAPPER: 'flowchart-canvas-wrapper',
  CANVAS_LOADING: 'canvas-loading',
  
  // Controls
  ZOOM_CONTROLS: 'zoom-controls',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out',
  ZOOM_RESET: 'zoom-reset',
  
  // Export controls
  EXPORT_BUTTON: 'export-button',
  EXPORT_MENU: 'export-menu',
  EXPORT_OPTION: (type: string) => `export-${type}`,
  
  // Theme toggle
  THEME_TOGGLE: 'theme-toggle',
  THEME_TOGGLE_BUTTON: 'theme-toggle-button',
  THEME_DROPDOWN_BUTTON: 'theme-dropdown-button',
  THEME_OPTION: (theme: string) => `theme-option-${theme}`,
  
  // Node elements
  NODE: (id: string) => `node-${id}`,
  CONNECTION: (id: string) => `connection-${id}`,
  
  // Form elements
  FORM: (name: string) => `form-${name}`,
  INPUT: (name: string) => `input-${name}`,
  BUTTON: (name: string) => `button-${name}`,
}; 