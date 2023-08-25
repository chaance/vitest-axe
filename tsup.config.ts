import { defineConfig } from "tsup";

const entry = ["./src/index.ts", "./src/matchers.ts", "./src/extend-expect.ts"];

export default defineConfig([
	{
		entry,
		format: "esm",
		sourcemap: true,
		dts: {
			entry: entry.filter((e) => !e.includes("extend-expect")),
		},
		outDir: "dist",
	},
]);
