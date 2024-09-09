import type { AxeCore } from "./core"
import type { expect } from "vitest"

type MatcherResult = Awaited<
  ReturnType<Parameters<typeof expect.extend>[0][string]>
>

export interface NoViolationsMatcherResult extends MatcherResult {
  actual: AxeCore.Result[]
}

export interface AxeMatchers {
  toHaveNoViolations(): NoViolationsMatcherResult
}
