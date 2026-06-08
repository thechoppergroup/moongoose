# Gotchas — earned by pain

Durable home for the landmines. The root `CLAUDE.md` carries a short pointer;
this is the full version. Add an entry whenever something costs real time.

## Generated files are not hand-edited
`dist/`, `src/icons_all.js`, and `src/icons_list.js` are produced by
`npm run build` (`scripts/svg-to-module.js`). Editing them directly gets
overwritten on the next build — change the SVG sources in `src/icons/` and the
build pipeline instead.

## Changes don't reach consumers until a published release
`moongoose` is consumed via the private npm registry, not by path. A new/edited
icon only shows up in `moonscape`/`moonshine`/etc. after `npm run release`
(build + version patch + publish) **and** the consumer reinstalls. Don't expect
a local edit here to appear downstream without that round-trip.

<!-- Add new landmines below as you hit them. -->
