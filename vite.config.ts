import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for use in config
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isAnalyze = mode === 'analyze';
  
  // Get base path from environment or use repository name for GitHub Pages
  // For GitHub Pages, change this to '/seu-repositorio/' ou use VITE_BASE_PATH env
  const basePath = env.VITE_BASE_PATH || '/';

  return {
    // Base path for deployment - modify if deploying to a subdirectory
    base: basePath,

    plugins: [
      // React plugin with babel options
      react({
        babel: {
          plugins: [],
        }
      }),
      
      // Bundle analyzer when in analyze mode
      isAnalyze && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html',
      }),
    ],
    
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'fabric'],
      exclude: ['lucide-react'], // This had issues in the past
    },
    
    // Build options
    build: {
      // Increase warning limit for larger chunks
      chunkSizeWarningLimit: 800,
      
      // Target modern browsers
      target: 'es2020',
      
      // Properly split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Group fabric.js which is the largest dependency
            if (id.includes('fabric')) {
              return 'fabric';
            }
            // Group React core libraries
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Group UI components
            if (id.includes('lucide')) {
              return 'vendor-ui';
            }
            // Default chunk behavior
            return undefined;
          }
        }
      },
      
      // Optimize production build
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined,
      
      // Report on bundle size
      reportCompressedSize: true,
    },
    
    // Development server settings
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      cors: true,
      hmr: {
        overlay: true,
      },
    },
    
    // Preview server config
    preview: {
      port: 4173,
      strictPort: false,
      open: true,
    },
    
    // Make process.env available in client code via import.meta.env
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
    },
  };
});
