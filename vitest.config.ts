import { defineConfig, configDefaults } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["tests/setup-tests.ts"],
    watch: false,
    coverage: {
      include: ["tests/**/*.test.{ts,js}"],
      exclude: [...configDefaults.exclude],
    },
  },
})
