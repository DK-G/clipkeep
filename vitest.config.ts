import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for framework-free logic (middleware routing, ad-event payloads).
// Node environment: no DOM is needed because the testable logic is extracted
// away from the React components into pure modules.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", ".open-next", "workers"],
  },
});
