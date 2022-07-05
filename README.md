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

## Installation

This module should be installed as one of your project's `devDependencies`:

```shell
# with npm
npm install --save-dev vitest-axe
# yarn
yarn add --dev vitest-axe
# pnpm
pnpm add --dev vitest-axe
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

If you're using TypeScript, make sure your setup file is a `.ts` and not a `.js`
to include the necessary types. Importing from `vitest-axe/extend-expect` will
add the matchers to Vitest's `expect` types.

```typescript
// vitest-setup.ts
import "vitest-axe/extend-expect";
```

You will also need to include your setup file in your `tsconfig.json` if you
haven't already:

```json5
  // In tsconfig.json
  "include": [
    // ...
    "./vitest-setup.ts"
  ],
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
