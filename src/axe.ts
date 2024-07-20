import type AxeCore from "axe-core"
import { merge } from "lodash-es"
import { isHTMLElement, isHTMLString } from "./utils"
import { configure, run, getRules } from "axe-core"

const AXE_RULES_COLOR = getRules(["cat.color"])

/**
 * Converts a HTML string or HTML element to a mounted HTML element.
 * @param html HTML element or a HTML string
 * @returns HTML element and a function to restore the document
 */
function mount(html: Element | string): [HTMLElement, () => void] {
  if (isHTMLElement(html)) {
    if (document.body.contains(html)) {
      return [html, () => undefined]
    }
    html = html.outerHTML
  }

  if (isHTMLString(html)) {
    let originalHTML = document.body.innerHTML
    function restore() {
      document.body.innerHTML = originalHTML
    }

    document.body.innerHTML = html
    return [document.body, restore]
  }

  if (typeof html === "string") {
    throw new Error(`html parameter ("${html}") has no elements`)
  }

  throw new Error(`html parameter should be an HTML string or an HTML element`)
}

/**
 * Small wrapper for axe-core#run that enables promises, default options and
 * injects html to be tested
 *
 * @param options default options to use in all instances
 *   - `globalOptions`: Global axe-core configuration (See
 *     https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure)
 *   - Any other property will be passed as the runner configuration (See
 *     https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
 * @returns Instance of axe
 */
function configureAxe(
  options: AxeCore.RunOptions & {
    globalOptions?: AxeCore.Spec
    impactLevels?: Array<AxeCore.ImpactValue>
  } = {},
): (
  html: Element | string,
  additionalOptions?: AxeCore.RunOptions,
) => Promise<AxeCore.AxeResults> {
  let { globalOptions = {}, ...runnerOptions } = options

  // Set the global configuration for axe-core
  // https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
  const { rules = [], ...otherGlobalOptions } = globalOptions

  // Color contrast checking doesnt work in a jsdom environment. So we need to
  // identify them and disable them by default.
  const defaultRules = AXE_RULES_COLOR.map(({ ruleId: id }) => ({
    id,
    enabled: false,
  }))

  configure({
    rules: [...defaultRules, ...rules],
    ...otherGlobalOptions,
  })

  /**
   * Small wrapper for axe-core#run that enables promises, default options and
   * injects html to be tested
   *
   * @param html requires a html string to be injected into the body
   * @param additionalOptions aXe options to merge with default options
   * @returns Promise that will resolve with axe-core#run results object
   */
  return function axe(
    html: Element | string,
    additionalOptions: AxeCore.RunOptions = {},
  ): Promise<AxeCore.AxeResults> {
    let [element, restore] = mount(html)
    let options: AxeCore.RunOptions = merge(
      {},
      runnerOptions,
      additionalOptions,
    )

    return new Promise<AxeCore.AxeResults>((resolve) => {
      run(element, options, (err, results) => {
        restore()
        if (err) throw err
        resolve(results)
      })
    })
  }
}

const axe = configureAxe()
export { configureAxe, axe }
export type { AxeCore }
