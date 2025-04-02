import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tailwindcss from '@tailwindcss/vite'
dotenv.config();

export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  base: '/',
});
