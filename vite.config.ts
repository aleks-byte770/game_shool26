import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': join(__dirname, './src/components'),
      '@pages': join(__dirname, './src/pages'),
      '@hooks': join(__dirname, './src/hooks'),
      '@store': join(__dirname, './src/store'),
      '@api': join(__dirname, './src/api'),
      '@types': join(__dirname, './src/types'),
      '@styles': join(__dirname, './src/styles'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
})
