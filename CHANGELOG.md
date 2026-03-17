# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-03-17

### Breaking Changes

- **Node.js version requirement**: Minimum Node.js version is now `>=18`
- **Removed dependencies**: `core-js` and `js-cool` are no longer required
- **Build output**: ESM output changed from `.mjs` to `.js`, CJS output is `.cjs`

### Features

- **Cache mechanism**: Added caching support with `clearCache()` function
- **Path validation**: New `validate` option to check if directory exists
- **Extended platform support**: Now supports `freebsd` and `sunos`
- **Async API**: Added `userdirAsync()` function
- **TypeScript types**: Enhanced type definitions with `UserdirOptions` interface

### Improvements

- **Build tool**: Migrated from Rollup to tsdown (powered by Rolldown)
- **Test framework**: Migrated from Jest to Vitest
- **ESLint**: Upgraded to ESLint v9 with flat config
- **Test coverage**: 100% statements, 95% branches, comprehensive test suite (67 test cases)
- **Platform simulation**: Added cross-platform testing with mocked `process.platform`

### Dependencies

- Added: `tsdown`, `vitest`, `@vitest/coverage-v8`
- Removed: `core-js`, `js-cool`, `rollup`, `babel`, `@microsoft/api-extractor`, `jest`, `typedoc`, `prettier`
- Upgraded: `eslint@9`, `typescript@5.9`

### CI/CD

- Unified CI workflow with lint, typecheck, build, test
- Updated to GitHub Actions v4
- Added provenance support for npm publish

## [1.0.0] - 2023-02-27

### Added

- Initial release
- Cross-platform user home directory detection
- Support for Windows, macOS, Linux
- ESM and CJS exports
