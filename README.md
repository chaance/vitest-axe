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
> There is currently a [bug in `happy-dom`](https://github.com/capricorn86/happy-dom/issues/978) related to its implementation of `Node.prototype.isConnected`. [This causes compatibility issues with Axe,](https://github.com/dequelabs/axe-core/issues/4087) which means that this library will not work if your [Vitest environment](https://vitest.dev/guide/environment.html#test-environment) is set to `happy-dom`.

## Installation

This module should be installed as one of your project's `devDependencies`:

```shell
# with npm
npm install --save-dev vitest-axe
# yarn
yarn add --dev vitest-axe
# pnpm
pnpm add -D vitest-axe
```

## Usage

Import the matchers from `vitest-axe/matchers` once (perferably in your [tests
setup file][]), then pass them to Vitest's `expect.extend` method:

[tests setup file]: https://vitest.dev/config/#setupfiles

```javascript
// vitest-setup.js
import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";
expect.extend(matchers);

// vitest.config.js
export default defineConfig({
	test: {
		setupFiles: ["vitest-setup.js"],
	},
});
```

### With TypeScript

If you're using TypeScript, make sure your test setup file is in TypeScript. In
the file, importing from `vitest-axe/extend-expect` will add the matchers to
Vitest's `expect` types.

```typescript
// vitest-setup.ts
import "vitest-axe/extend-expect";
```

You may also need to include your setup file in your `tsconfig.json` if it isn't
already matched by your `include` glob:

```diff
// In tsconfig.json
{
	"include": [
		"./src/**/*",
+		"./vitest-setup.ts"
	]
}
```

<!-- prettier-ignore-start -->
[vitest]: https://vitest.dev/
[version-badge]:
 https://img.shields.io/npm/v/vitest-axe.svg?style=flat-square
[package]: https://www.npmjs.com/package/vitest-axe
[license-badge]: 
  https://img.shields.io/npm/l/vitest-axe.svg?style=flat-square
[license]: https://github.com/chaance/vitest-axe/blob/main/LICENSE
[github-watch-badge]:
  https://img.shields.io/github/watchers/chaance/vitest-axe.svg?style=social
[github-watch]: https://github.com/chaance/vitest-axe/watchers
<!-- prettier-ignore-end -->
