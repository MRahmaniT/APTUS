import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.APTUS_API_PROXY || "http://127.0.0.1:3000",
        changeOrigin: true,
      },
      "/uploads": {
        target: process.env.APTUS_API_PROXY || "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
});
