import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for React + environment variable injection
export default defineConfig(({ mode }) => {
  // Load variables from .env files.
  // On Vercel (and locally) you should define GEMINI_API_KEY.
  const env = loadEnv(mode, '.', '');

  const apiKey = env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Every occurrence of process.env.API_KEY in your code
      // will be replaced with this string literal at build time.
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});
