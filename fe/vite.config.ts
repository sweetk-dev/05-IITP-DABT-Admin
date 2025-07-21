import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      'packages/common': path.resolve(__dirname, '../packages/common'),
    },
  },
})
