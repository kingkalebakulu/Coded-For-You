import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "framer-motion": ["framer-motion"],
          "lucide-react": ["lucide-react"],
        },
      },
    },
    // Compress assets
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,   // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Warn if any chunk is over 500kb
    chunkSizeWarningLimit: 500,
  },
  // Faster dev server
  server: {
    hmr: true,
  },
});
