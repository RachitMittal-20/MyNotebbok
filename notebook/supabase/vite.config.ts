import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// Support ESM file paths in Node: derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode?: string }) => ({
  server: {
    // Bind to localhost (IPv4) and let the OS pick a free port (0) to avoid conflicts.
    host: "127.0.0.1",
    port: 0,
    // Automatically open the app in the default browser when the server starts.
    open: true,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
