/**
 * Polyfills simples para garantir compatibilidade do fabric.js em diferentes navegadores
 */

// Garantir que os objetos globais necessários existam
if (typeof window !== 'undefined') {
  // Adicionar polyfill para setLineDash se necessário
  if (typeof HTMLCanvasElement !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx && !ctx.setLineDash) {
      // @ts-ignore
      ctx.setLineDash = function() {};
    }
  }
  
  // Verificar se o requestAnimationFrame existe (necessário para o fabric.js)
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }
  
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
  
  // Função simples para preparar o ambiente
  window.ensureCanvasReady = function() {
    // Ajuste de viewport para melhor experiência em dispositivos móveis
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    return true;
  };
}

// Exportar para que este arquivo seja tratado como um módulo
export {}; 