import { expect } from "vitest";
import * as matchers from "./matchers";
import type { AxeMatchers } from "./matchers";

expect.extend(matchers);

declare module "vitest" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export interface Assertion<T = any> extends AxeMatchers {}
	export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
