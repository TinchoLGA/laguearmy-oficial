import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración lista para Render
export default defineConfig({
  plugins: [react()],
  base: "./", // 👈 Esto arregla los estilos
  server: {
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "laguearmy-oficial.onrender.com",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
