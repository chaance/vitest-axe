import { expect } from "vitest"
import * as matchers from "./matchers"
import type { AxeMatchers } from "./matchers"

expect.extend(matchers)

declare module "vitest" {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
