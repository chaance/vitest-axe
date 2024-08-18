import { toHaveNoViolations } from "../src/matchers"
import { axe } from "../src/index"
import type { AxeCore } from "../src/index"

const PASSING_AXE_RESULTS: AxeCore.AxeResults = {
  testEngine: {
    name: "",
    version: "",
  },
  testRunner: {
    name: "",
  },
  testEnvironment: {
    userAgent: "",
    windowWidth: 0,
    windowHeight: 0,
  },
  url: "",
  timestamp: "",
  toolOptions: {},
  passes: [],
  violations: [],
  incomplete: [],
  inapplicable: [],
}
const FAILING_AXE_RESULTS: AxeCore.AxeResults = {
  ...PASSING_AXE_RESULTS,
  violations: [
    {
      id: "image-alt",
      impact: "critical",
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a",
      ],
      description:
        "Ensures <img> elements have alternate text or a role of none or presentation",
      help: "Images must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/2.6/image-alt?application=axeAPI",
      nodes: [
        {
          any: [
            {
              id: "has-alt",
              data: null,
              relatedNodes: [],
              impact: "critical",
              message: "Element does not have an alt attribute",
            },
            {
              id: "aria-label",
              data: null,
              relatedNodes: [],
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
            },
            {
              id: "aria-labelledby",
              data: null,
              relatedNodes: [],
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible",
            },
            {
              id: "non-empty-title",
              data: null,
              relatedNodes: [],
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
            },
            {
              id: "role-presentation",
              data: null,
              relatedNodes: [],
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="presentation"',
            },
            {
              id: "role-none",
              data: null,
              relatedNodes: [],
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="none"',
            },
          ],
          all: [],
          none: [],
          impact: "critical",
          html: '<img src="">',
          target: ["body > img"],
          failureSummary:
            'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"',
        },
      ],
    },
  ],
}

describe("toHaveNoViolations", () => {
  test("returns a matcher function", () => {
    expect(toHaveNoViolations).toBeDefined()
    expectTypeOf(toHaveNoViolations).toBeFunction()
  })

  test("throws error if non axe results object is passed", () => {
    expect(() => {
      // @ts-expect-error
      toHaveNoViolations({})
    }).toThrow(
      "Unexpected aXe results object. No violations property found.\nDid you change the `reporter` in your aXe configuration?",
    )
  })

  test("returns pass as true when no violations are present", () => {
    const matcherOutput = toHaveNoViolations(PASSING_AXE_RESULTS)
    expect(matcherOutput.pass).toBeTruthy()
  })

  test("returns same violations that are passed in the results object", () => {
    const matcherOutput = toHaveNoViolations(FAILING_AXE_RESULTS)
    expect(matcherOutput.actual).toBe(FAILING_AXE_RESULTS.violations)
  })

  test("returns correctly formatted message when violations are present", () => {
    const matcherOutput = toHaveNoViolations(FAILING_AXE_RESULTS)
    expectTypeOf(matcherOutput.message).toBeFunction()
    expect(matcherOutput.message()).toMatchSnapshot()
  })

  test("returns pass as false when violations are present", () => {
    const matcherOutput = toHaveNoViolations(FAILING_AXE_RESULTS)
    expect(matcherOutput.pass).toBeFalsy()
  })

  test("returns properly formatted text with more complex example", async () => {
    const complexHtmlExample = `
        <html>
          <body>
            <a href="#link-name"></a>
            <a href="#link-name-2"></a>
            <img src="http://example.com"/>
            <img src="http://example.com/2"/>
            <input type="text"/>
          </body>
        </html>
      `
    const results = await axe(complexHtmlExample)
    const matcherOutput = toHaveNoViolations(results)
    expect(matcherOutput.message()).toMatchSnapshot()
  })
})
