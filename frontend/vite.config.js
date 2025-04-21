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
      '@frontend': path.resolve(__dirname, '../frontend'),
      '@utils': path.resolve(__dirname, '/src/shared/utils'),
      '@services': path.resolve(__dirname, '/src/shared/services'),
      '@components': path.resolve(__dirname, '/src/shared/components'),
      '@hooks': path.resolve(__dirname, '/src/shared/hooks'),
      '@pages': path.resolve(__dirname, '/src/shared/pages'),
      '@layouts': path.resolve(__dirname, '/src/shared/layouts'),
      '@routes': path.resolve(__dirname, '/src/shared/routes'),
      '@assets': path.resolve(__dirname, '/src/shared/assets'),
    }
  }
})
