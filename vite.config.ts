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
    include: ["primereact", "primeicons", "primereact/chartjs", "chart.js"],
    exclude: [],
    force: true
  },
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "primereact/chart": "primereact/chartjs"
    },
  }
})
