import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// ✅ SAFE BASE PATH HANDLING
// For GitHub Pages: uses './' (relative)
// Falls back to env var only if explicitly set
const getBasePath = () => {
  // Check if BASE_PATH env var is set and not empty
  const envBasePath = process.env.BASE_PATH;
  
  if (envBasePath && envBasePath.trim() !== '') {
    console.log('Using BASE_PATH from environment:', envBasePath);
    return envBasePath;
  }
  
  // Default to relative path for GitHub Pages
  return './';
};

const basePath = getBasePath();

// Port handling with fallback
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  // ✅ CRITICAL: Use safe base path (relative for GitHub Pages)
  base: basePath,
  
  plugins: [
    react(),
    tailwindcss(),
    // ❌ REMOVED: runtimeErrorOverlay() (not needed in production)
    // ❌ REMOVED: cartographer & devBanner (Replit-only, breaks GitHub Pages)
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // Keep your @assets alias if needed
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  
  root: path.resolve(import.meta.dirname),
  
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    
    // ✅ Ensure assets are referenced correctly
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
