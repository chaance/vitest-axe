import path from "node:path";
import fsp from "node:fs/promises";
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
		async onSuccess() {
			console.log("SUCCESS");
			await Promise.all([
				fsp.copyFile(
					path.join(__dirname, "src/extend-expect.d.ts"),
					path.join(__dirname, "extend-expect.d.ts"),
				),
			]);
		},
	},
]);
