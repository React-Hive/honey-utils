# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

`@react-hive/honey-utils` — framework-free TypeScript helpers: type guards, arrays, async control
flow, strings, math and geometry, base64 and JSON, `localStorage`, DOM, files, focus management and
flattened trees. It has **no runtime dependencies**, and every other `@react-hive` package depends
on it — honey-hooks, honey-style, honey-css, honey-layout, honey-form — as do the apps built on them
(vextrix3d, portalui). Each pins an exact version, so a release reaches them only as they are bumped,
and a behaviour change reaches all of them at once when they are: keep helpers small, pure where
they can be, and safe to import anywhere.

## Commands

```bash
pnpm test              # vitest, single run (watch is disabled in vitest.config.ts)
pnpm build             # webpack -> dist/ (ESM + CJS + dev CJS + .d.ts)
pnpm clean             # rm -rf dist coverage
```

Run one file or one test: `pnpm test src/array/__tests__/to-map-by.spec.ts` / `pnpm test -t "name"`.
Type-check the library with `tsc --noEmit -p tsconfig.build.json` (it leaves the specs out); `tsc
--noEmit -p tsconfig.json` checks the specs too, which is the only thing that checks a spec's
`@ts-expect-error` lines - vitest does not type-check.

`pnpm exec` and `pnpm <script>` first run `pnpm install` when `package.json` or the lockfile has
changed, so prefer `./node_modules/.bin/<tool>` (vitest, tsc, eslint, prettier) while either has
edits in progress.

There is an `eslint.config.mjs` (`@eslint/js` recommended + typescript-eslint `strict`) but **no lint
script** — run `./node_modules/.bin/eslint src`. `src` has six errors as it stands (`any` in
`function.ts` and `guards.ts`, an unused `_` in `tree/flatten-tree.ts`), so lint the files you
change. Prettier (`.prettierrc`): `printWidth: 100`, single
quotes, semicolons, `arrowParens: avoid`. `README.md` is not Prettier-clean as it stands; format the
lines you add, not the whole file.

pnpm only. Files whose names start with `~` (`~functions.ts`) are gitignored scratch.

TypeScript stays on 6.x: TypeScript 7 is the native port, whose package no longer exposes the
compiler API that ts-loader builds with, and typescript-eslint supports `<6.1`. Move to 7 when
both do.

## Module map (`src/`)

`src/index.ts` re-exports every area below, and is the entire public surface.

| Area | Where | Exports |
| --- | --- | --- |
| Guards | `guards.ts` | `assert`, `isNil` / `isNull` / `isUndefined` / `isDefined`, `isNumber` / `isFiniteNumber` / `isInteger` / `isDecimal`, `isBool`, `isObject` / `isEmptyObject`, `isDate` / `isValidDate`, `isBlob`, `isError`, `isRegExp`, `isMap`, `isSet`, `isSymbol`, `isEnumValue` |
| Arrays | `array/` | `isArray`, `isEmptyArray`, `compact`, `unique`, `chunk`, `difference`, `intersection`, `toggleArrayItem`, `getAdjacentItems`, `toMapBy`, `pipe`, `compose` |
| Async | `async/` | `delay`, `timeout`, `retry`, `isPromise`, `runParallel` / `runSequential`, `filterParallel` / `filterSequential`, `someAsync`, `everyAsync`, `reduceAsync`, `findAsync` |
| Functions | `function/` | `noop`, `not`, `once`, `isFunction`, `invokeIfFunction` |
| Strings | `string/` | `isString`, `isNilOrEmptyString`, `toKebabCase`, `camelToDashCase`, `camelToWords`, `splitStringIntoWords`, `getWordsInitials`, `splitMapJoin`, `findCharIndices`, `forEachChar`, `parseFileName` |
| Math | `math/` | `clamp`, `hashString`, `calculateEuclideanDistance`, `calculateMovingSpeed`, `calculatePercentage` |
| Geometry | `geometry/` | `applyInertiaStep`, `resolveBoundedDelta`, `calculateCenterOffset`, `clampOffsetToOverflow` |
| Intersection | `intersection/` | `getDOMRectIntersectionRatio`, `resolveAxisDelta` |
| Encoding | `encoding/` | `encodeBase64` / `decodeBase64`, `encodeBase64Json` / `decodeBase64Json` (UTF-8 safe; `Uint8Array.toBase64` → `Buffer` → `btoa` fallbacks) |
| JSON | `json/` | `parseJson` |
| Env | `env/storage/` | `isLocalStorageReadable`, `getLocalStorageCapabilities`, `readLocalStorageJson`, `writeLocalStorageJson` |
| DOM | `dom/` | `replaceHistorySearchParams`, `downloadFile`, `cloneBlob`, `getElementOffsetRect`, `isAnchorHtmlElement`, `isContentEditableHtmlElement`, `setDataTransferJson` / `getDataTransferJson`, overflow (`hasXOverflow`, `getXOverflowWidth`, `hasYOverflow`, `getYOverflowHeight`), `centerElementInContainer`, `parse2DMatrix` |
| Files | `file.ts` | `isFile`, `fileListToFiles`, `blobToFile`, `readFilesFromDataTransfer`, `traverseFileSystemDirectory` |
| A11y | `a11y/focus/` | `getFocusableHtmlElements`, `isHtmlElementFocusable`, `moveFocusWithinContainer` |
| Trees | `tree/` | `flattenTree`, `getTreeChildren`, `searchTree`, `HoneyTreeFlatNode` |
| Colour | `color/` | `hexWithAlpha`, `HexColor` |
| Ids | `id/` | `generateEphemeralId` |
| Objects | `object.ts` | `definedProps` |
| Types | `types.ts` | `Nullable`, `TimeoutId`, `KeysWithStringValues`, `KeysWithArrayValues`, `KeysWithNonArrayValues` |

## Rules the code relies on — do not break these

- **No runtime dependencies.** Every package in the family bundles this one; a dependency added here
  is added to all of them.
- **Safe to import anywhere.** Nothing reads `window`, `document`, `navigator` or `localStorage` at
  module load: a browser-only helper reaches for them inside its body. The bundle is imported by
  Node too - Cloud Functions, prerendering, vitest without jsdom.
- **A helper that can fail on its environment does not throw**, where "nothing" is an answer: it
  returns `null` (`parseJson`, `decodeBase64`, `readLocalStorageJson`) or `false`
  (`writeLocalStorageJson`). Invariants are the exception, and throw through `assert`.
- **Behaviour is the contract.** The same input giving a different result is a breaking change, and
  a major version (4.0.0 changed the base64 helpers). A new helper is a minor version, a fix a
  patch.
- **Type parameters are inferred from the arguments.** A defaulted type parameter fed only through a
  cast is inferred from whatever the result is assigned to, which lets a caller declare any type; a
  helper whose return type depends on an optional argument is overloaded instead (`toMapBy`), with a
  spec pinning the mistake with `@ts-expect-error`.
- **Specs live in `__tests__/`.** `tsconfig.build.json` and the `files` field leave out `__tests__`
  alone, so a spec beside its source would be compiled into `dist` and published.
- **The declarations import relatively.** `tsc` writes the `~/` alias into the `.d.ts` files as it
  found it in the source, which a consumer would resolve against its own `~`, or not at all - and
  under `skipLibCheck` the type then falls to `any`. `RewriteDeclarationAliasesPlugin` in
  `webpack.config.mjs` rewrites every alias in an emitted `.d.ts` to its relative path; after a build,
  `grep -rl "'~/" dist --include='*.d.ts'` finds nothing.

## Conventions

- **One helper per file**, named the kebab-case of the export (`to-map-by.ts` → `toMapBy`), in the
  folder of its area, re-exported from the area's `index.ts`. The older multi-export files
  (`guards.ts`, `async/async.ts`, `function/function.ts`, `math/math.ts`, `dom/dom.ts`, `file.ts`,
  `object.ts`) take related additions; a new area gets a folder.
- **`export const` arrow functions** with explicit parameter and return types. `function` only where
  the language needs it: `assert` for its `asserts condition` signature, and overloads.
- **Imports:** another area through its barrel with the `~` alias (`import { delay } from
  '~/async'`), the same area relatively (`'./split-string-into-words'`), types with `import type`
  (`import type { Nullable } from '~/types'`). The alias is set in `tsconfig.json`, webpack and
  vitest alike.
- **`Nullable<T>` from `~/types`** for anything that may be null.
- **JSDoc is documentation.** Every export carries a one-line summary, the detail a caller needs,
  `@template`, `@param name - …`, `@returns` and a ```` ```ts ```` `@example`; an options interface
  documents each field, with `@default` where there is one.
- **The README documents every helper twice**: an example in its area's block under "Usage" (and in
  that block's import list), and its signature with one line of description under "API
  Documentation". A new helper adds both.

## Tests

- Location: `src/<area>/__tests__/<file>.spec.ts`; specs for the root-level files go in
  `src/__tests__/`.
- Vitest in the **node** environment with globals, so every spec that does not opt out also proves
  its helper imports and runs without a browser. A spec that needs a DOM (the `dom/`, `file.ts` and
  `a11y/` helpers) starts with `// @vitest-environment jsdom`, and sets what jsdom does not lay out
  (`scrollWidth`, `getBoundingClientRect`, `getComputedStyle` transforms) or does not have
  (`DataTransfer`, File System entries, `URL.createObjectURL`) on the element or with
  `vi.stubGlobal`. A helper that only reads `window.localStorage` or `window.history` is tested in
  node against a stubbed `window` (`vi.stubGlobal('window', { … })`, released with
  `vi.unstubAllGlobals()` in `afterEach`).
- Suite naming: `describe('[helperName]: what it covers', …)`, cases as `it('should …')`.
- Every helper has a spec. A change comes with its cases, and a fixed bug with the case that
  showed it.

## Build & release

- `webpack.config.mjs` emits three bundles from `src/index.ts`, all with source maps:
  `dist/index.mjs` (ESM), `dist/index.cjs` (CJS) and `dist/index.dev.cjs` (development CJS).
  `README.md` and `LICENSE` are copied into `dist/`; the declarations come from `tsconfig.build.json`
  through ts-loader, their `~/` imports made relative on the way out.
- `prepublishOnly` runs `CI=1 pnpm clean && pnpm test && pnpm build` - a failing test blocks the
  publish.
- **Publishing is pushing `main` to the `release` branch** (`git push origin main` then `git push
  origin main:release`), which runs `.github/workflows/publish.yml`: Node 24, pnpm, and `pnpm publish
  --access public` through npm trusted publishing (OIDC, with provenance). Not tags.
- A release is one commit, `X.Y.Z - Summary` with a bullet list of what changed, the version in
  `package.json` bumped in the same commit.
- **Commit, amend and push only when asked, each time** - amending an unpushed commit included. Run
  `git ls-remote origin` before touching a commit that may have been pushed from the IDE.
- After a release, a dependent is bumped with `yarn add` / `pnpm add @react-hive/honey-utils@X.Y.Z
  --exact`. The tarball can lag the registry's version list by a couple of minutes: wait until
  `https://registry.npmjs.org/@react-hive/honey-utils/-/honey-utils-X.Y.Z.tgz` answers 200.
