/**
 * Enhanced polyfills for cross-browser and mobile compatibility
 */

// Ensure global objects exist
if (typeof window !== 'undefined') {
  // Touch events polyfill for mobile devices
  if (!window.TouchEvent && 'ontouchstart' in window) {
    // @ts-ignore
    window.TouchEvent = function() {};
  }

  // Canvas polyfills
  if (typeof HTMLCanvasElement !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx && !ctx.setLineDash) {
      // @ts-ignore
      ctx.setLineDash = function() {};
    }
  }
  
  // Animation frame polyfills
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
  
  // Passive event listeners for better scrolling performance on mobile
  try {
    // Test if passive is supported
    const opts = Object.defineProperty({}, 'passive', {
      // @ts-ignore
      get: function() { return true; }
    });
    // @ts-ignore
    window.addEventListener('test', null, opts);
  } catch (e) {
    // Do nothing, just prevent error
  }
  
  // Enhanced viewport settings function
  window.ensureCanvasReady = function() {
    // Set appropriate viewport for better mobile experience
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      // Better viewport settings for mobile
      viewport.setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // Fix for iOS Safari 100vh issue
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    return true;
  };
  
  // Add resize listener for iOS Safari 100vh fix
  window.addEventListener('resize', function() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  
  // Add orientation change handler
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 200); // Small delay to ensure height is updated
  });
  
  // Fix for some mobile browser issues
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
    (document.documentElement.style as any).WebkitTapHighlightColor = 'transparent';
  }
}

// Export to make this a module
export {}; 