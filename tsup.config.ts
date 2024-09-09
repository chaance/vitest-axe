import { defineConfig } from "tsup"

const entry = ["./src/index.ts"]

export default defineConfig({
  entry,
  format: "esm",
  sourcemap: true,
  dts: true,
  outDir: "dist",
})
