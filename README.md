<div align="center">
<h1>vitest-axe</h1>

<p>Custom Vitest matcher for testing accessibility with aXe</p>

</div>

---

<!-- prettier-ignore-start -->
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

[![Watch on GitHub][github-watch-badge]][github-watch]
<!-- prettier-ignore-end -->

This library is a fork of [`jest-axe`](https://github.com/nickcolley/jest-axe).
It shares that library's implementation and API. It is intended to make it
easier to include its matchers without clashes between [Vitest][vitest] and
Jest's environment or types.

See the [`README` for the original package](https://github.com/nickcolley/jest-axe/blob/main/README.md) for usage details.

> [!IMPORTANT]
> There is currently a [bug in Happy DOM](https://github.com/capricorn86/happy-dom/issues/978) related to its implementation of `Node.prototype.isConnected`. [This causes compatibility issues with axe,](https://github.com/dequelabs/axe-core/issues/4087) which means that this library will not work if your [Vitest environment](https://vitest.dev/guide/environment.html#test-environment) is set to `happy-dom`.

## Installation

This module should be installed as one of your project's `devDependencies`:

```shell
# with npm
npm install --save-dev @koralle/vitest-axe
# yarn
yarn add --dev @koralle/vitest-axe
# pnpm
pnpm add -D @koralle/vitest-axe
```

## Setup

### Extend in test setup file

You can import the matcher from `@koralle/vitest-axe` then pass them to
Vitest's `expect.extend` method yourself:

```js
// vitest-setup.js
import { toHaveNoViolations } from "@koralle/vitest-axe"
import { expect } from "vitest"

expect.extend({ toHaveNoViolations })
```

### Extend in individual tests

```ts
import { axe, toHaveNoViolations } from "@koralle/vitest-axe"

expect.extend({ toHaveNoViolations })

it("should have no axe violations", async () => {
  const html = "<html><!-- accessible markup! --></html>"
  expect(await axe(html)).toHaveNoViolations()
})
```

### With TypeScript

You will need to augment Vitest's `Assertion` and `AsymmetricMatchersContaining` interfaces.

```ts
import "vitest"
import type { AxeMatchers } from "@koralle/vitest-axe"

declare module "vitest" {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
```

Further reading:

- [Extending matchers in Vitest](https://vitest.dev/guide/extending-matchers.html)
- [Module augmentation in TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)

## Usage

```ts
import { axe } from "@koralle/vitest-axe"

it("should demonstrate this matcher's usage", async () => {
  const render = () => '<img src="#"/>'
  // pass anything that outputs html to axe
  const html = render()
  expect(await axe(html)).toHaveNoViolations()
})
```

<!-- prettier-ignore-start -->
[vitest]: https://vitest.dev/
[test setup file]: https://vitest.dev/config/#setupfiles
[version-badge]: https://img.shields.io/npm/v/vitest-axe.svg?style=flat-square
[package]: https://www.npmjs.com/package/vitest-axe
[license-badge]: https://img.shields.io/npm/l/vitest-axe.svg?style=flat-square
[license]: https://github.com/koralle/vitest-axe/blob/main/LICENSE
[github-watch-badge]: https://img.shields.io/github/watchers/koralle/vitest-axe.svg?style=social
[github-watch]: https://github.com/koralle/vitest-axe/watchers
<!-- prettier-ignore-end -->
