# .claude/docs — shared reference library

On-demand reference for agents and humans working in `moongoose`. Unlike the
root `CLAUDE.md` (auto-loaded into every session, kept lean), nothing here loads
automatically — Claude reads these files only when pointed at them. So this is
the home for durable, accreting knowledge: gotchas, lessons, cross-repo state.

## What lives here
- `gotchas.md` — the hard-won landmines. The durable home for them; the root
  `CLAUDE.md` only carries a short pointer.
- `cross-repo-state.md` — how this repo depends on / is depended on by its
  siblings.
- `lessons/` — one file per painful lesson, dated `YYYY-MM-DD-slug.md`. Write a
  new one whenever something costs more than an hour to figure out.

## Two-tier model (why this directory exists)
- **Auto-loaded contract** → root `CLAUDE.md`. Behavioral rules + pointers. Keep
  it short. Anything `@import`ed there loads at startup too, so do NOT import
  these docs into `CLAUDE.md` — reference them by path.
- **On-demand reference** → this directory. Rich and growing; loaded only when
  relevant.

## Personal vs. shared
Everything in `.claude/` here is checked into git and shared with the team
EXCEPT `.claude/settings.local.json` (gitignored). Per-developer notes go in
`CLAUDE.local.md` at the repo root (also gitignored). Claude Code's per-user
memory (`~/.claude/...`) is personal and never propagates — if a note is useful
to the team, promote it into a file here.

## Upkeep
- Date-stamp lessons. Prune what's no longer true.
- One source of truth per fact. `CLAUDE.md` points at these; it never restates
  them, so they can't drift.
