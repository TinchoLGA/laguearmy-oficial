import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración lista para Vercel y Netlify
export default defineConfig({
  plugins: [react()],
  base: "", // importante para que los paths funcionen bien en Vercel
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "laguearmy-oficial.vercel.app",
      "laguearmy.netlify.app"
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
