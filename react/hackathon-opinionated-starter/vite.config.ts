/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      // Listen on all network interfaces so teammates can open it via your IP
      host: true,
      port: 5173,
      // The browser calls /api/... on this dev server, which forwards it to the API.
      // That avoids CORS, and also works for teammates opening the app via your IP
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: 'jsdom',
      // An address that doesn't exist, so tests can never reach a real API
      environmentOptions: { jsdom: { url: 'http://app.test' } },
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
