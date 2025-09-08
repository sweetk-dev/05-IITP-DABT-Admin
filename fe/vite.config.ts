import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: env.VITE_BASE || '/',
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
    build: {
      outDir: 'dist',
    },
  }
})
