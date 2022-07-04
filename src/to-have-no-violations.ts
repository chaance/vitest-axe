import chalk from "chalk";
import type AxeCore from "axe-core";
import { printReceived, matcherHint } from "./utils";

/**
 * A custom matcher that can check aXe results for violations.
 *
 * @param results requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @returns Vitest matcher object
 */
export function toHaveNoViolations(
  results: AxeCore.AxeResults
): NoViolationsMatcherResult {
  if (typeof results.violations === "undefined") {
    throw new Error("No violations found in aXe results object");
  }

  let violations = filterViolations(
    results.violations,
    // TODO: Check on this error, can't find a reference to impactLevels in
    // axe-core
    results.toolOptions ? (results as any).toolOptions.impactLevels : []
  );

  function reporter(violations: AxeCore.Result[]) {
    if (violations.length === 0) {
      return [];
    }

    let lineBreak = "\n\n";
    let horizontalLine = "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500";

    return violations
      .map((violation) => {
        let errorBody = violation.nodes
          .map((node) => {
            let selector = node.target.join(", ");
            let expectedText =
              `Expected the HTML found at $('${selector}') to have no violations:` +
              lineBreak;
            return (
              expectedText +
              chalk.grey(node.html) +
              lineBreak +
              `Received:` +
              lineBreak +
              printReceived(`${violation.help} (${violation.id})`) +
              lineBreak +
              chalk.yellow(node.failureSummary) +
              lineBreak +
              (violation.helpUrl
                ? `You can find more information on this issue here: \n${chalk.blue(
                    violation.helpUrl
                  )}`
                : "")
            );
          })
          .join(lineBreak);
        return errorBody;
      })
      .join(lineBreak + horizontalLine + lineBreak);
  }

  let formatedViolations = reporter(violations);
  let pass = formatedViolations.length === 0;

  function message(): string {
    if (pass) {
      // @ts-expect-error
      return;
    }
    return (
      // eslint-disable-next-line no-useless-concat
      matcherHint(".toHaveNoViolations") + "\n\n" + `${formatedViolations}`
    );
  }

  return { actual: violations, message, pass };
}

/**
 * Filters all violations by user impact
 * @param violations result of the accessibilty check by axe
 * @param impactLevels defines which impact level should be considered (e.g ['critical'])
 * The level of impact can be "minor", "moderate", "serious", or "critical".
 * @returns violations filtered by impact level
 */
function filterViolations(
  violations: AxeCore.Result[],
  impactLevels: Array<AxeCore.ImpactValue>
) {
  if (impactLevels && impactLevels.length > 0) {
    return violations.filter((v) => impactLevels.includes(v.impact!));
  }
  return violations;
}

interface MatcherResult {
  message(): string;
  pass: boolean;
}

export interface NoViolationsMatcherResult extends MatcherResult {
  actual: AxeCore.Result[];
}

export interface AxeMatchers {
  /**
   * A custom matcher that can check aXe results for violations.
   */
  toHaveNoViolations(): NoViolationsMatcherResult;
}
