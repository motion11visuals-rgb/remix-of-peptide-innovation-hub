// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  vite: {
    plugins: [{
      name: "email-server-env",
      config: (_config, { mode }) => {
        // Keep private variables server-only; never add these to Vite's define block.
        Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
      },
    }],
    resolve: {
      alias: [
        { find: "entities/lib/decode.js", replacement: resolve("node_modules/entities/lib/decode.js") },
        { find: "entities/lib/encode.js", replacement: resolve("node_modules/entities/lib/encode.js") },
        { find: /^entities$/, replacement: resolve("node_modules/entities") },
      ],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
