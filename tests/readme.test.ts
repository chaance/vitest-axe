import { describe, expect, it } from "vitest"
import { configureAxe, axe } from "../src/index"
import type { AxeCore } from "../src/index"

// See https://github.com/nickcolley/jest-axe#readme
describe("readme", () => {
  describe("first readme example", () => {
    it("should demonstrate this matcher`s usage", async () => {
      let render = () => '<img src="#"/>'

      // pass anything that outputs html to axe
      let html = render()
      let results = await axe(html)
      expect(() => {
        expect(results).toHaveNoViolations()
      }).toThrowErrorMatchingSnapshot()
    })
  })

  describe("readme axe config example", () => {
    it("should demonstrate this matcher`s usage with a custom config", async () => {
      const render = () => `
          <div>
            <img src="#"/>
          </div>
        `

      // pass anything that outputs html to axe
      const html = render()

      const results = await axe(html, {
        rules: {
          // for demonstration only, don't disable rules that need fixing.
          "image-alt": { enabled: false },
          region: { enabled: false },
        },
      })

      expect(results).toHaveNoViolations()
    })
  })

  describe("readme axe global config example", () => {
    // Global helper file (axe-helper.js)

    const configuredAxe = configureAxe({
      rules: {
        // for demonstration only, don't disable rules that need fixing.
        "image-alt": { enabled: false },
        region: { enabled: false },
      },
    })

    const exportedAxe = configuredAxe

    // Individual test file (test.js)
    const axe = exportedAxe // require('./axe-helper.js')

    it("should demonstrate this matcher`s usage with a default config", async () => {
      const render = () => `
          <div>
            <img src="#"/>
          </div>
        `

      // pass anything that outputs html to axe
      const html = render()

      expect(await axe(html)).toHaveNoViolations()
    })
  })

  describe("configure custom rule", () => {
    it("should report custom rules", async () => {
      const check: any = {
        id: "demo-has-data",
        evaluate(node: Element) {
          return node.hasAttribute("data-demo-rule")
        },
        metadata: {
          impact: "serious",
          messages: {
            fail: "Error!",
          },
        },
      }
      const rule: AxeCore.Rule = {
        id: "demo-rule",
        selector: ".demo",
        enabled: false,
        tags: ["demo-rules"],
        any: ["demo-has-data"],
        metadata: {
          description: "Demo check",
          help: "Demo check",
          helpUrl: "https://example.com",
        },
      }

      const configuredAxe = configureAxe({
        globalOptions: {
          rules: [rule],
          checks: [check],
        },
        rules: {
          "demo-rule": { enabled: true },
        },
      })

      const html = `
        <html>
          <body>
            <main>
              <div class="demo">
            </main>
          </body>
        </html>
        `

      const results = await configuredAxe(html)
      expect(results.violations[0].id).toBe("demo-rule")
    })
  })

  describe("custom configuration for user impact", () => {
    const axe = configureAxe({
      // How serious the violation is. Can be one of "minor", "moderate", "serious", or "critical".
      impactLevels: ["critical"],
    })

    it("should pass the test, because only critical violations are noted.", async () => {
      // 1 x moderate violation -> https://dequeuniversity.com/rules/axe/4.0/region?application=axeAPI
      const render = () => `
          <div>
            <div>
              <span> some content</span>
            </div>
          </div>
        `

      // pass anything that outputs html to axe
      const html = render()

      expect(await axe(html)).toHaveNoViolations()
    })
  })
})
