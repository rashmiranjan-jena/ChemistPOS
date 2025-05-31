import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Places assets inside "dist/assets"
  },
  plugins: [react()],
  server: {
    host: true, 
    port: 5174, 
    watch: {
      usePolling: true, 
    },
  },
});
