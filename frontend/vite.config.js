import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      '@utils': path.resolve(__dirname, '/src/shared/utils'),
      '@components': path.resolve(__dirname, '/src/shared/components'),
      '@auth': path.resolve(__dirname, '/src/Auth'),
    }
  }
})
