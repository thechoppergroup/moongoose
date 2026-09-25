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
- **`moongoose.test.js`** — the `<moongoose>` component renders and swaps icons, and the lib entry
  and plugin export what consumers import.

## Baselines

`tests/fixtures/meta-missing.json` (icons with no docs metadata) and
`tests/fixtures/meta-unknown-similar.json` (`similar` entries naming icons that don't exist) pin
known gaps. A new gap fails the suite. Fixing a gap also fails until you delete that entry from the
fixture — so the lists only shrink.

## Conventions

Tests live in `tests/`, not beside the code, and import through the `Moongoose` alias
(`Moongoose/moongoose.vue`), never `../src/...`. `vitest.config.mjs` also writes JUnit and JSON
results to `reports/` (gitignored) for CI.
