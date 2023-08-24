/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AxeMatchers } from "./matchers";

declare module "vitest" {
	interface Assertion<T = any> extends AxeMatchers {}
	interface AsymmetricMatchersContaining extends AxeMatchers {}
}
