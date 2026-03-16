import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command, mode }) => ({
  plugins: [react(), tailwindcss()],
  build:
    command === "build" && mode !== "demo"
      ? {
          emptyOutDir: false,
          lib: {
            entry: resolve(__dirname, "src/lib.ts"),
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
            formats: ["es", "cjs"],
            name: "OverflowGroup",
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
          },
        }
      : {
          outDir: "demo-dist",
        },
}));
