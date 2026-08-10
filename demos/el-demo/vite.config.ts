import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/adminx-recovery/',
  define: {
    // Build timestamp for version display
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
  },
  server: {
    // Expose on network for mobile testing
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Use source files directly for HMR during development
      '@sap-ui/fx-components': path.resolve(__dirname, '../../src/index.ts'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
