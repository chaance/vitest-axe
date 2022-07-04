import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    setupFiles: ["test/setupTests.ts"],
    watch: false,
    coverage: {
      include: ["**/__tests__/**/*.{ts,js}"],
      exclude: [...configDefaults.exclude, "**/__tests__/helpers/"],
    },
  },
});
