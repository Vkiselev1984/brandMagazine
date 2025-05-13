import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Проксируем все API-запросы на backend
      '/api': 'http://localhost:3000'
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
