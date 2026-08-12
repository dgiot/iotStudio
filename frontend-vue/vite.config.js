import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 15173,
    host: '0.0.0.0',
    strictPort: false,
    allowedHosts: ['dev.dgiotcloud.cn', '.dgiotcloud.cn', 'localhost', '127.0.0.1', '10.255.6.205'],
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
