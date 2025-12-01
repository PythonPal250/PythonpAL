import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Simple Vite config.
// We don't inject env vars here anymore; geminiService.ts
// reads from import.meta.env instead.
export default defineConfig({
  plugins: [react()],
});
