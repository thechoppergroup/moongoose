# Cross-repo state

`moongoose` is part of the Workstorm / Scoutahead workspace — a set of sibling
repos under `~/src`, not a true monorepo. This file notes how it relates to the
others. It's a snapshot; re-verify against the actual repos before relying on it.

## Dependency direction
```
moongoose → moonscape → (web, moonshine, wsmobile, ws_desktop)
```
`moongoose` is at the **bottom** — it depends on nothing internal and is
consumed by everything. It ships as `@thechoppergroup/moongoose` via the private
npm registry; consumers pull a published version, not a local path.

## Impact of changes here
A breaking change to an icon name or the module shape ripples up to every
consumer. Because consumers pin a published version, the ripple only happens
after a release + reinstall (see `gotchas.md`).

## No inbound dependencies
Nothing internal is imported by `moongoose`. There is no cross-repo uncommitted
work to track here as of this snapshot.
