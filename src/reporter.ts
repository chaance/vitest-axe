import chalk from "chalk"
import type { AxeCore } from "./core"
import { LINE_BREAK, HORIZONTAL_LINE } from "./consts"
import { printReceived } from "./utils"

const violationResolveHelpText = (violation: Pick<AxeCore.Result, "helpUrl">) => {
  return `You can find more information on this issue here: \n${chalk.blue(violation.helpUrl)}`
}

const expectedText = (node: AxeCore.NodeResult) => {
  const selector = node.target.join(", ")
  return `Expected the HTML found at $('${selector}') to have no violations:${LINE_BREAK}`
}

const reporter = (violations: AxeCore.Result[]) => {
  if (violations.length === 0) {
    return []
  }

  const delimiter = LINE_BREAK + HORIZONTAL_LINE + LINE_BREAK

  return violations
    .map((violation) => {
      const errorBody = violation.nodes
        .map((node) => {
          return (
            expectedText(node) +
            chalk.grey(node.html) +
            LINE_BREAK +
            `Received:` +
            LINE_BREAK +
            printReceived(`${violation.help} (${violation.id})`) +
            LINE_BREAK +
            chalk.yellow(node.failureSummary) +
            LINE_BREAK +
            (violation.helpUrl ? violationResolveHelpText(violation) : "")
          )
        })
        .join(LINE_BREAK)
      return errorBody
    })
    .join(delimiter)
}

export { reporter }
