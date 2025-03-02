/**
 * Utilitários para detectar navegadores e aplicar correções específicas
 * para garantir compatibilidade em diferentes ambientes
 */

/**
 * Detecta qual navegador está sendo usado
 * @returns String com o nome do navegador (chrome, firefox, safari, opera, edge, ou unknown)
 */
export function detectBrowser(): string {
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
    if (userAgent.match(/edg/i)) {
      browserName = "edge";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "opera";
    }
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  }
  
  return browserName;
}

/**
 * Detecta se o dispositivo é touch
 * @returns Boolean indicando se é um dispositivo touch
 */
export function detectTouchDevice(): boolean {
  return ('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) || 
    (navigator.maxTouchPoints > 0);
}

/**
 * Detecta se está em um dispositivo móvel
 * @returns Boolean indicando se é um dispositivo móvel
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Aplica correções específicas para cada navegador
 */
export function applyBrowserFixes(): void {
  const browser = detectBrowser();
  
  // Fix para o problema do 100vh em dispositivos móveis (especialmente Safari)
  const updateVhVariable = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  updateVhVariable();
  window.addEventListener('resize', updateVhVariable);
  
  // Safari-specific fixes
  if (browser === 'safari') {
    document.documentElement.classList.add('safari');
    
    // Corrige problemas de scrolling no Safari iOS
    document.addEventListener('touchmove', (e) => {
      if (e.target === document.documentElement) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  // Firefox-specific fixes
  if (browser === 'firefox') {
    document.documentElement.classList.add('firefox');
    
    // Fix para melhor comportamento de texto em SVG no Firefox
    const style = document.createElement('style');
    style.textContent = `
      .firefox tspan {
        dominant-baseline: central;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Mobile device classes
  if (isMobileDevice()) {
    document.documentElement.classList.add('mobile-device');
  }
  
  // Touch device classes
  if (detectTouchDevice()) {
    document.documentElement.classList.add('touch-device');
  }
}

/**
 * Detecta os recursos do navegador para decidir quais polyfills carregar
 * @returns Objeto com os recursos disponíveis
 */
export function detectFeatures() {
  return {
    supportsWebWorkers: typeof Worker !== 'undefined',
    supportsResizeObserver: typeof ResizeObserver !== 'undefined',
    supportsIntersectionObserver: typeof IntersectionObserver !== 'undefined',
    supportsTouchEvents: detectTouchDevice(),
    supportWebGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    })(),
  };
} 