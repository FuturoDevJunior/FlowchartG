/**
 * Polyfills e adaptações para garantir que fabric.js funcione em diferentes navegadores
 * 
 * Este arquivo deve ser importado antes de qualquer uso do fabric.js
 */

// Garantir que os objetos globais necessários existam
if (typeof window !== 'undefined') {
  // Prevenir erros com LucidModeButton
  if (typeof window.LucidModeButton === 'undefined') {
    console.log('🔄 Inicializando LucidModeButton');
    window.LucidModeButton = {};
  }

  // Prevenir erros com VideoToolbar
  if (typeof window.VideoToolbar === 'undefined') {
    console.log('🔄 Inicializando VideoToolbar');
    window.VideoToolbar = { BUTTONS: {} };
  }

  // Garantir que os métodos de canvas existam
  if (typeof HTMLCanvasElement !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Verificar se os métodos necessários existem
    if (ctx && !ctx.setLineDash) {
      console.log('⚠️ Adicionando polyfill para setLineDash');
      // @ts-ignore
      ctx.setLineDash = function() {};
    }
  }

  // Função para verificar se o navegador suporta todas as funcionalidades necessárias
  window.ensureCanvasReady = function() {
    console.log('🔄 Verificando compatibilidade com fabric.js');
    
    // Verificar suporte a canvas
    const hasCanvas = !!document.createElement('canvas').getContext;
    if (!hasCanvas) {
      console.error('❌ Este navegador não suporta o elemento canvas');
      return false;
    }
    
    // Verificar suporte a funcionalidades do ES6 necessárias
    const hasES6 = typeof Promise !== 'undefined' && 
                  typeof Symbol !== 'undefined' && 
                  typeof Map !== 'undefined';
    if (!hasES6) {
      console.error('❌ Este navegador não suporta funcionalidades ES6 necessárias');
      return false;
    }
    
    // Verificar eventos de toque
    const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouchEvents) {
      console.log('✅ Suporte a eventos de toque detectado');
    }
    
    // Tudo certo!
    console.log('✅ Ambiente compatível com fabric.js');
    return true;
  };
  
  // Executar a verificação
  if (window.ensureCanvasReady) {
    window.ensureCanvasReady();
  }
}

// Exportar para que este arquivo seja tratado como um módulo
export {}; 