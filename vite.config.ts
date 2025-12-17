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
    port: 5174,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["primereact", "primereact/chartjs", "chart.js"],
    exclude: ["quill"], // Adicione quill aqui
    force: true
  },
  build: {
    rollupOptions: {
      external: ['quill'], // Externalizar quill no build
    },
  },
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "primereact/chart": "primereact/chartjs",
      "quill": path.resolve(__dirname, "node_modules/quill/dist/quill.js") // Alias para quill
    },
  }
})