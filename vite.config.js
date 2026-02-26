import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Uses built-in esbuild to drop consoles (no extra install needed)
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "framer-motion": ["framer-motion"],
          "lucide-react": ["lucide-react"],
        },
      },
    },
    // Use default 'esbuild' instead of 'terser' to fix the build error
    minify: "esbuild",
    chunkSizeWarningLimit: 500,
  },
  server: {
    hmr: true,
  },
});
