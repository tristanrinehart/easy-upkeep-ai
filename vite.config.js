import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Environment-aware config; ports 6000-7000 (dev: 6600)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6600,
    strictPort: true
  },
  preview: {
    port: 6600
  }
})