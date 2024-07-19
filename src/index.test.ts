import { describe, expect, it } from "vitest"
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

	it("can be configured for global configs", async () => {
		const results = await linkNameAxe(failingHtmlExample)
		expect(results.violations).toEqual([])
	})

	it("can pass in merged configurations to configured axe", async () => {
		const results = await linkNameAxe(failingExtendedHtmlExample, {
			rules: {
				"image-alt": { enabled: false },
				region: { enabled: false },
			},
		})
		expect(results.violations).toEqual([])
	})

	it("returns an axe results object", async () => {
		const results = await axe(failingHtmlExample)
		expect(typeof results).toBe("object")
		expect(typeof results.violations).toBe("object")
	})

	it("should not mutate the content of document.body permanently", async () => {
		const el = document.body.appendChild(document.createElement("div"))
		await axe(goodHtmlExample)
		expect(document.body.childElementCount).toBe(1)
		expect(document.body.firstChild).toEqual(el)
	})

	it("returns violations for failing html example", async () => {
		const results = await axe(failingHtmlExample)
		const violation = results.violations[0]
		expect(violation.id).toBe("link-name")
		expect(violation.description).toBe("Ensures links have discernible text")
	})

	it("can ignore allowed failures", async () => {
		const results = await axe(failingHtmlExample, {
			rules: {
				"link-name": { enabled: false },
			},
		})
		expect(results.violations).toEqual([])
	})

	it("returns no violations for a good html example", async () => {
		const results = await axe(goodHtmlExample)
		expect(results.violations).toEqual([])
	})

	it("throws if input is not a string, vue element, react element, or react testing library render", () => {
		expect(() => {
			// @ts-expect-error
			axe({})
		}).toThrow("html parameter should be an HTML string or an HTML element")
	})

	it("throws with non-html input", () => {
		expect(() => {
			axe("Hello, World")
		}).toThrow('html parameter ("Hello, World") has no elements')
	})

	it("should not mutate previous options", async () => {
		let results = await axe(failingHtmlExample, {
			rules: {
				"link-name": { enabled: false },
			},
		})
		expect(results.violations).toEqual([])

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
		expect(results.violations).toEqual([])

		results = await axe(failingHtmlExample)
		const violation = results.violations[0]
		expect(violation.id).toBe("link-name")
		expect(violation.description).toBe("Ensures links have discernible text")
	})
})
