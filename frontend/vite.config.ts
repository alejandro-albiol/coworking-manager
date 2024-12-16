import { defineConfig } from 'vite'
import path from 'path'
import type { ConfigEnv } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}) as ConfigEnv
