/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      // Listen on all network interfaces so teammates can open it via your IP
      host: true,
      port: 5173,
      // The browser calls /api/... on this dev server, which forwards it to the API.
      // That avoids CORS, and also works for teammates opening the app via your IP.
      // /api is stripped, for APIs whose routes start at the root. If your API's
      // routes already start with /api, remove the rewrite
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test-setup.ts'],
    },
  };
});
