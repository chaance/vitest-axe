import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: ["./src/index.ts", "./src/matchers.ts", "./src/extend-expect.ts"],
		format: "esm",
		sourcemap: true,
		dts: true,
		outDir: "dist",
	},
]);
