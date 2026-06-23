# CLAUDE.md — `moongoose`

Operating guide for agents working in `moongoose`. Keep this short. Deep,
accreting knowledge lives in `.claude/docs/` (loaded on demand, not at
startup) — this file is the auto-loaded contract.

## House rules (non-negotiable)
- **No git writes.** `status`/`log`/`diff`/`blame`/`show` are fine; no
  `commit`, `push`, `add`, `branch`, `checkout`, `merge`, `rebase`, or
  `stash`. Never leave a `.git/index.lock` behind. (Enforced by
  `.claude/settings.json`.)
- **Show code before applying.** Propose edits and wait for approval; don't
  write unprompted.
- **Plan before coding.** Major changes get a plan first.
- **Verify, don't guess.** Re-read the source to confirm files, exports, and
  build behavior before asserting. Flag any guess out loud.
- American English throughout.

## What this is
`@thechoppergroup/moongoose` — the in-house **SVG icon library** (Vue). Source
SVGs live in `src/icons/`; the build normalizes and bundles them into a JS
module. It is the **bottom of the dependency chain** — `moonscape` and every app
(`web`, `moonshine`, `wsmobile`, `ws_desktop`) consume it. Published to the
private npm registry.

**Build tooling is branch-dependent** (`git branch --show-current`): on
`main`/`master` it's Webpack; on **`vue3` it's Vite 8** (Rolldown). On `vue3` the
lib build emits BOTH `dist/moongoose.js` (UMD, `main`) and `dist/moongoose.mjs`
(clean ESM, `module`/`exports`) — the ESM imports named symbols from `vue`
(no `require`), which is what lets moonscape consume it without CJS interop hacks.
CSS is inlined into the JS (no separate `.css`). The lib entry is `src/index.js`
(default export only — a named export alongside it trips Rollup `MIXED_EXPORTS`).

## Commands (vue3 / Vite 8)
- `npm run build` — `clean` → `scripts/svg-to-module.js` (bundle SVGs) →
  `vite build --config vite.lib.config.mjs`. Output to `dist/`.
- `npm run serve` / `npm run watch` — svg-to-module → Vite docs dev server.
- `npm run build-docs` — svg-to-module → Vite build of the docs site
  (`vite.docs.config.mjs`).
- `npm run release` — `build` + `npm version patch` + `npm publish`. **Publishes
  to the registry — never run this; the maintainer cuts releases.**

## Adding / changing an icon (see README.md)
1. Drop the SVG into `src/icons/`.
2. Add it to `src/docs/meta.json` (search terms / similar names) for the docs.
3. `npm run build`. Helpers: `scripts/resize-svg.js` normalizes SVGs;
   `scripts/svg-to-module.js` bundles them.
4. Consumers pick it up only after a **published release** + reinstall.

## Conventions
- Generated artifacts (`dist/`, `src/icons_all.js`, `src/icons_list.js`) come
  from the build — edit the SVG sources and the build pipeline, not the output.
- Keep SVGs clean/normalized (run through `resize-svg.js`); consistency matters
  because every app renders them.

## Deeper docs (`.claude/docs/`, on demand)
- `gotchas.md` — landmines (publish/version flow, generated files).
- `cross-repo-state.md` — where moongoose sits in the dependency chain.
- `lessons/` — one dated file per painful lesson.
