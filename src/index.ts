import { toHaveNoViolations } from "./to-have-no-violations"
import type { AxeMatchers, NoViolationsMatcherResult } from "./matchers"
import { configureAxe, axe } from "./axe"
import type { AxeCore } from "./core"

export { axe, configureAxe, toHaveNoViolations }
export type { AxeCore, AxeMatchers, NoViolationsMatcherResult }
