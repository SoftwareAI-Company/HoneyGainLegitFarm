// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    port: 5173,
    host: true, // permite acesso externo, útil em Docker
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',            // diretório de saída default
    assetsDir: 'assets',       // pasta para css/js
    sourcemap: mode === 'development',
  },
  base: '',  // sem './'
}));
