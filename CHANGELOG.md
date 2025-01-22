# Changelog

## v0.1.0

- Initial (pre)release

## v1.0.0 (WIP)

- Vitest peer dependency bumped to at least >=1
- Importing the `vitest-axe/extend-expect` module will now augment Vitest's `Assertion` and `AsymmetricMatchersContaining` types and extend `expect` as a side effect. Pre-release users who used it for extending types can remove `extend.expect(matchers)`.
- Fixed checks related to color contrast
