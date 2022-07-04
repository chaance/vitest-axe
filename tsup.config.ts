import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/index.ts", "./src/matchers.ts", "./src/extend-expect.ts"],
    dts: true,
    format: "esm",
    outDir: "dist",
  },
]);
