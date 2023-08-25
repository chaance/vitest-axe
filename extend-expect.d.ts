import "vitest";
import type { AxeMatchers } from "./src/matchers";

declare module "vitest" {
	export interface Assertion extends AxeMatchers {}
	export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
