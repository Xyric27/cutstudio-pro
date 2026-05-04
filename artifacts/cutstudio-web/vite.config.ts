import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Safe base path handler
const getBasePath = () => {
  const envBasePath = process.env.BASE_PATH;
  
  // If BASE_PATH is set and not empty, use it
  if (envBasePath && envBasePath.trim() !== '') {
    return envBasePath;
  }
  
  // Default fallback for GitHub Pages: relative paths
  return './';
};

const basePath = getBasePath();

// Port handling
const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

if (rawPort && (Number.isNaN(port) || port <= 0)) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineConfig({
  // Use safe base path
  base: basePath,
  
  plugins: [
    react(),
    tailwindcss(),
    // ❌ NO Replit plugins here!
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  
  root: path.resolve(import.meta.dirname),
  
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
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
