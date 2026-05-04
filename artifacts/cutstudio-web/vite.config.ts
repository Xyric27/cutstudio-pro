import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ✅ CRITICAL: Use relative base for GitHub Pages
  base: './',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // ✅ CRITICAL: Asset handling for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    
    // Ensure assets are referenced correctly
    assetsInlineLimit: 4096,
  },
  
  // Server config (for local dev)
  server: {
    port: 3000,
    host: true,
  },
});
