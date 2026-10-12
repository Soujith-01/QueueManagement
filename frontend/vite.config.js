import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://queuemanagement-1-ub5l.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'https://queuemanagement-1-ub5l.onrender.com',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
