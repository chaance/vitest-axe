import { AxeResults } from "axe-core"
import { configureAxe, axe } from "../src/index"

describe("axe", () => {
  const failingHtmlExample = `
     <html>
       <body>
         <a href="#"></a>
       </body>
     </html>
    `

  const failingExtendedHtmlExample = `
     <html>
       <body>
         <a href="#"></a>
         <img src="#"/>
       </body>
     </html>
    `

  const goodHtmlExample = `
     <html>
       <body>
        <main>
         <a href="http://gov.uk">Visit GOV.UK</a>
        </main>
       </body>
     </html>
    `

  const linkNameAxe = configureAxe({
    rules: {
      "link-name": { enabled: false },
    },
  })

  test("can be configured for global configs", async () => {
    const results = await linkNameAxe(failingHtmlExample)
    expect(results.violations).toStrictEqual([])
  })

  test("can pass in merged configurations to configured axe", async () => {
    const results = await linkNameAxe(failingExtendedHtmlExample, {
      rules: {
        "image-alt": { enabled: false },
        region: { enabled: false },
      },
    })
    expect(results.violations).toStrictEqual([])
  })

  test("returns an axe results object", async () => {
    const results = await axe(failingHtmlExample)
    expectTypeOf(results).toMatchTypeOf<AxeResults>()
  })

  test("should not mutate the content of document.body permanently", async () => {
    const el = document.body.appendChild(document.createElement("div"))
    await axe(goodHtmlExample)
    expect(document.body.childElementCount).toBe(1)
    expect(document.body.firstChild).toStrictEqual(el)
  })

  test("returns violations for failing html example", async () => {
    const results = await axe(failingHtmlExample)
    const violation = results.violations[0]
    expect(violation.id).toBe("link-name")
    expect(violation.description).toBe("Ensure links have discernible text")
  })

  test("can ignore allowed failures", async () => {
    const results = await axe(failingHtmlExample, {
      rules: {
        "link-name": { enabled: false },
      },
    })
    expect(results.violations).toStrictEqual([])
  })

  test("returns no violations for a good html example", async () => {
    const results = await axe(goodHtmlExample)
    expect(results.violations).toStrictEqual([])
  })

  test("throws if input is not a string, vue element, react element, or react testing library render", () => {
    expect(() => {
      // @ts-expect-error
      axe({})
    }).toThrow("html parameter should be an HTML string or an HTML element")
  })

  test("throws with non-html input", () => {
    expect(() => {
      axe("Hello, World")
    }).toThrow('html parameter ("Hello, World") has no elements')
  })

  test("should not mutate previous options", async () => {
    let results = await axe(failingHtmlExample, {
      rules: {
        "link-name": { enabled: false },
      },
    })
    expect(results.violations).toStrictEqual([])

    const configuredAxe = configureAxe({
      rules: {
        "link-name": { enabled: false },
      },
    })

    results = await configuredAxe(failingHtmlExample, {
      rules: {
        "link-name": { enabled: false },
      },
    })
    expect(results.violations).toStrictEqual([])

    results = await axe(failingHtmlExample)
    const violation = results.violations[0]
    expect(violation.id).toBe("link-name")
    expect(violation.description).toBe("Ensure links have discernible text")
  })
})
