import type { AxeCore } from "./core"
export interface MatcherResult {
  message(): string
  pass: boolean
}

export interface NoViolationsMatcherResult extends MatcherResult {
  actual: AxeCore.Result[]
}

export interface AxeMatchers {
  toHaveNoViolations(): NoViolationsMatcherResult
}
