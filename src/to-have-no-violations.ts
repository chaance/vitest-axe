import type { AxeCore } from "./core"
import { matcherHint } from "./utils"
import type { NoViolationsMatcherResult } from "./types"
import { LINE_BREAK } from "./consts"
import { reporter } from "./reporter"

/**
 * A custom matcher that can check aXe results for violations.
 *
 * @param results requires an instance of aXe's
 * [results object](https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @returns Vitest matcher object
 */
export function toHaveNoViolations(
  results: AxeCore.AxeResults,
): NoViolationsMatcherResult {
  if (typeof results.violations === "undefined") {
    throw new Error(
      "Unexpected aXe results object. No violations property found.\nDid you change the `reporter` in your aXe configuration?",
    )
  }

  const violations = filterViolations(
    results.violations,
    // `impactLevels` is not a valid toolOption but one we add to the config
    // when calling `run`. axe just happens to pass this along. Might be a safer
    // way to do this since it's not documented API.
    // @ts-expect-error
    results.toolOptions?.impactLevels ?? [],
  )

  const formattedViolations = reporter(violations)
  const pass = formattedViolations.length === 0

  function message(): string {
    if (pass) {
      // @ts-expect-error
      return
    }
    return (
      // eslint-disable-next-line no-useless-concat
      matcherHint(".toHaveNoViolations") + LINE_BREAK + `${formattedViolations}`
    )
  }

  return { actual: violations, message, pass }
}

/**
 * Filters all violations by user impact
 * @param violations result of the accessibility check by axe
 * @param impactLevels defines which impact level should be considered (e.g ['critical'])
 * The level of impact can be "minor", "moderate", "serious", or "critical".
 * @returns violations filtered by impact level
 */
const filterViolations = (violations: AxeCore.Result[], impactLevels: AxeCore.ImpactValue[]): AxeCore.Result[] => {
  if (impactLevels?.length > 0) {
    return violations.filter((v) => impactLevels.includes(v.impact!))
  }

  return violations
}
