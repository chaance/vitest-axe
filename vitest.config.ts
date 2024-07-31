import { defineConfig, configDefaults } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["tests/setupTests.ts"],
    watch: false,
    coverage: {
      include: ["tests/**/*.test.{ts,js}"],
      exclude: [...configDefaults.exclude],
    },
  },
})
