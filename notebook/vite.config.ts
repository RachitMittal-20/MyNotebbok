import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Bind to all network interfaces so the dev server is reachable on the LAN.
    host: "0.0.0.0",
    port: 5173,
    // Do not automatically open a browser on the host machine when starting.
    open: false,
  },
  // Removed the lovable-tagger plugin usage to avoid referencing that package here.
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
