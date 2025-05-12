import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Прокси для API-запросов к backend (Express)
      '/products': 'http://localhost:5500',
      '/register': 'http://localhost:5500',
      '/login': 'http://localhost:5500',
      '/profile': 'http://localhost:5500',
      '/logout': 'http://localhost:5500',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
