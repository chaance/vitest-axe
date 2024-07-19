/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import chalk from "chalk"
import {
	format as prettyFormat,
	plugins as prettyFormatPlugins,
} from "pretty-format"

const {
	AsymmetricMatcher,
	DOMCollection,
	DOMElement,
	Immutable,
	ReactElement,
	ReactTestComponent,
} = prettyFormatPlugins

const PLUGINS = [
	ReactTestComponent,
	ReactElement,
	DOMElement,
	DOMCollection,
	Immutable,
	AsymmetricMatcher,
]

type MatcherHintColor = (arg: string) => string // subset of Chalk type

const DIM_COLOR = chalk.dim

export type MatcherHintOptions = {
	comment?: string
	expectedColor?: MatcherHintColor
	isDirectExpectCall?: boolean
	isNot?: boolean
	promise?: string
	receivedColor?: MatcherHintColor
	secondArgument?: string
	secondArgumentColor?: MatcherHintColor
}

const EXPECTED_COLOR = chalk.green
const RECEIVED_COLOR = chalk.red
const SPACE_SYMBOL = "\u{00B7}" // middle dot

function stringify(object: unknown, maxDepth = 10, maxWidth = 10): string {
	let MAX_LENGTH = 10000
	let result

	try {
		result = prettyFormat(object, {
			maxDepth,
			maxWidth,
			min: true,
			plugins: PLUGINS,
		})
	} catch {
		result = prettyFormat(object, {
			callToJSON: false,
			maxDepth,
			maxWidth,
			min: true,
			plugins: PLUGINS,
		})
	}

	if (result.length >= MAX_LENGTH && maxDepth > 1) {
		return stringify(object, Math.floor(maxDepth / 2), maxWidth)
	}
	if (result.length >= MAX_LENGTH && maxWidth > 1) {
		return stringify(object, maxDepth, Math.floor(maxWidth / 2))
	}
	return result
}

// Instead of inverse highlight which now implies a change,
// replace common spaces with middle dot at the end of any line.
function replaceTrailingSpaces(text: string): string {
	return text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length))
}

export function printReceived(object: unknown): string {
	return RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)))
}

export function printExpected(value: unknown): string {
	return EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)))
}

// Display assertion for the report when a test fails.
// New format: rejects/resolves, not, and matcher name have black color
// Old format: matcher name has dim color
export function matcherHint(
	matcherName: string,
	received = "received",
	expected = "expected",
	options: MatcherHintOptions = {},
): string {
	const {
		comment = "",
		expectedColor = EXPECTED_COLOR,
		isDirectExpectCall = false, // seems redundant with received === ''
		isNot = false,
		promise = "",
		receivedColor = RECEIVED_COLOR,
		secondArgument = "",
		secondArgumentColor = EXPECTED_COLOR,
	} = options
	let hint = ""
	let dimString = "expect" // concatenate adjacent dim substrings

	if (!isDirectExpectCall && received !== "") {
		hint += DIM_COLOR(`${dimString}(`) + receivedColor(received)
		dimString = ")"
	}

	if (promise !== "") {
		hint += DIM_COLOR(`${dimString}.`) + promise
		dimString = ""
	}

	if (isNot) {
		hint += `${DIM_COLOR(`${dimString}.`)}not`
		dimString = ""
	}

	if (matcherName.includes(".")) {
		// Old format: for backward compatibility,
		// especially without promise or isNot options
		dimString += matcherName
	} else {
		// New format: omit period from matcherName arg
		hint += DIM_COLOR(`${dimString}.`) + matcherName
		dimString = ""
	}

	if (expected === "") {
		dimString += "()"
	} else {
		hint += DIM_COLOR(`${dimString}(`) + expectedColor(expected)
		if (secondArgument) {
			hint += DIM_COLOR(", ") + secondArgumentColor(secondArgument)
		}
		dimString = ")"
	}

	if (comment !== "") {
		dimString += ` // ${comment}`
	}

	if (dimString !== "") {
		hint += DIM_COLOR(dimString)
	}

	return hint
}

/**
 * Checks that the HTML parameter provided is a string that contains HTML.
 * @param html a HTML element or a HTML string
 */
export function isHTMLString(html: any): html is string {
	return typeof html === "string" && /(<([^>]+)>)/i.test(html)
}

/**
 * Checks if the HTML parameter provided is a HTML element.
 * @param html a HTML element or a HTML string
 */
export function isHTMLElement(html: any): html is HTMLElement {
	return !!html && typeof html === "object" && typeof html.tagName === "string"
}
