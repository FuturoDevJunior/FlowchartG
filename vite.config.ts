import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for use in config
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      // Add bundle analyzer when in analyze mode
      isAnalyze && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
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
      chunkSizeWarningLimit: 600,
      
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
              return 'vendor';
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
      } : undefined
    },
    
    // Development server settings
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      cors: true,
    },
  };
});
