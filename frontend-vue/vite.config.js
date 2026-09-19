import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Hosts the dev server will answer to beyond localhost. Deliberately not
// hardcoded: this file is published, and a site hostname or address in here
// both leaks and only works on the machine it was written for.
//   VITE_ALLOWED_HOSTS=dev.example.com,.example.com npm run dev
const extraHosts = (process.env.VITE_ALLOWED_HOSTS || '')
  .split(',').map(s => s.trim()).filter(Boolean)

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 15173,
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: ['localhost', '127.0.0.1', ...extraHosts],
    proxy: {
      '/api': 'http://localhost:8000',
      '/ws': { target: 'ws://localhost:8000', ws: true },
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
