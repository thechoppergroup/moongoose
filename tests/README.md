# moongoose tests

Vitest 5 + jsdom + @vue/test-utils. No browser, no dev server; the suite runs in a few seconds.

## Running

```bash
npm test                            # full suite, one pass
npm run test:watch                  # watch mode
npx vitest run tests/icons.test.js  # one file
```

Node 22.12+ is required (`.nvmrc`).

## What is covered

- **`icons.test.js`** — the generated `src/icons_all.js` / `src/icons_list.js` match the SVGs in
  `src/icons/` (a failure here usually means `npm run build` wasn't run after adding an icon);
  every SVG is well-formed, script-free (the component renders with `v-html`) and free of single
  quotes (the generator doesn't escape them); `src/docs/meta.json` only names real icons.
- **`moongoose.test.js`** — the `<moongoose>` component renders and swaps icons, is `aria-hidden`
  unless given a `label` (then `role="img"` + `aria-label`), and the lib entry and plugin export
  what consumers import.

## Baselines

`tests/fixtures/meta-missing.json` (icons with no docs metadata) and
`tests/fixtures/meta-unknown-similar.json` (`similar` entries naming icons that don't exist) pin
known gaps. A new gap fails the suite. Fixing a gap also fails until you delete that entry from the
fixture — so the lists only shrink.

## Visual and accessibility checks

`tests/visual/` holds a Playwright suite that screenshots the icon browser in four views
(default, search, a selected icon, 64px previews) and runs axe (WCAG 2.1 A/AA) on each, plus
behavior checks for search and the size slider. It runs inside the pinned
`mcr.microsoft.com/playwright` image, whose tag follows the installed `@playwright/test` version,
so screenshots match on every machine. Docker must be running.

```bash
npm run test:visual                    # build the site, then check every view
npm run test:visual -- -g search       # matching tests only
npm run test:visual:update             # accept intended visual changes (rewrites __screenshots__/)
AXE_UPDATE=1 npm run test:visual       # rewrite axe-baseline.json after fixing or accepting violations
```

The site is built on the host into `reports/visual/site` (not `docs/`, which is the published
site and tracked in git) and served from the container by `serve.mjs`. CSS animations are
disabled and every request off the local server is blocked. A page that logs a console error
fails.

`axe-baseline.json` pins the violations that already exist, per view. It only shrinks: a new
violation fails, and so does one that is fixed but still listed. Results, diffs and an HTML report
go to `reports/visual/` (gitignored).

## Conventions

Tests live in `tests/`, not beside the code, and import through the `Moongoose` alias
(`Moongoose/moongoose.vue`), never `../src/...`. `vitest.config.mjs` also writes JUnit and JSON
results to `reports/` (gitignored) for CI.
