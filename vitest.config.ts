import { defineConfig, configDefaults } from "vitest/config"

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["test/setupTests.ts"],
		watch: false,
		coverage: {
			include: ["**/*.test.{ts,js}"],
			exclude: [...configDefaults.exclude],
		},
	},
})
