#!/bin/sh
# Screenshot + accessibility checks of the icon docs site, run in the pinned Playwright image so
# screenshots match on every machine. Extra arguments go to `playwright test`, e.g.
#   npm run test:visual -- --update-snapshots
set -e
cd "$(dirname "$0")/../.."

PW_VERSION=$(node -p "require('@playwright/test/package.json').version")
IMAGE="mcr.microsoft.com/playwright:v$PW_VERSION-noble"

# Built on the host (the container can't run the host's native Vite/Rolldown binaries), and into
# reports/ rather than docs/, which is the published site and tracked in git.
node scripts/svg-to-module.js > /dev/null
npx vite build --config vite.docs.config.mjs --outDir reports/visual/site --emptyOutDir --logLevel error

docker run --rm --init --ipc=host \
    --user "$(id -u):$(id -g)" -e HOME=/tmp \
    -e PW_DOCKER=1 -e AXE_UPDATE -e CI \
    -v "$PWD":/work -w /work \
    "$IMAGE" npx playwright test -c tests/visual/playwright.config.mjs "$@"
