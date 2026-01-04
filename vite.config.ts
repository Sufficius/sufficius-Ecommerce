// vite.config.ts - ATUALIZADO
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    fs: {
      strict: false,
    },
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["primereact"],
    exclude: ["quill"], // Adicione quill aqui
    force: true
  },
  build: {
    outDir:'dist',
    sourcemap:true,
    rollupOptions: {
      external: ['quill'], // Externalizar quill no build
    },
  },
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "quill": path.resolve(__dirname, "node_modules/quill/dist/quill.js") // Alias para quill
    },
  }
})