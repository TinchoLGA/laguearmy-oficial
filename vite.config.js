import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuración compatible con Render (ESM correcta)
export default defineConfig({
  plugins: [react()],
  base: "",
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
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
});
