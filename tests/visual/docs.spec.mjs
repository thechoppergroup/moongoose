import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const baselineFile = path.join(here, 'axe-baseline.json');
const readBaseline = () => JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => (new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort()));
});

// Vue reports render errors through console.error rather than throwing, so collect both.
async function open(page) {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().split('\n')[0]); });
    await page.goto('/');
    await page.locator('.icons-list-icon').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    return errors;
}

// Each view of the single-page icon browser.
const views = {
    default: async () => {},
    search: async page => {
        await page.locator('.header-headers-search').fill('arrow');
    },
    selected: async page => {
        await page.locator('.icons-list-icon .icon-button').first().click();
    },
    large: async page => {
        await page.locator('.header-headers-slider input').fill('64');
    }
};

for (const [name, setup] of Object.entries(views)) {
    test(name, async ({ page }) => {
        const errors = await open(page);
        await setup(page);
        expect(errors, 'page errors').toEqual([]);
        await expect(page).toHaveScreenshot(`${name}.png`);

        const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
        const found = [...new Set(violations.map(v => v.id))].sort();

        if (process.env.AXE_UPDATE) {
            const baseline = readBaseline();
            if (found.length) baseline[name] = found;
            else delete baseline[name];
            fs.writeFileSync(baselineFile, JSON.stringify(baseline, Object.keys(baseline).sort(), 2) + '\n');
            return;
        }

        // Shrink-only baseline: a new violation fails, and so does a fixed one that is still listed.
        const known = readBaseline()[name] || [];
        const added = violations.filter(v => !known.includes(v.id))
            .map(v => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(', ')}`);
        expect(added, 'new accessibility violations').toEqual([]);
        expect(known.filter(id => !found.includes(id)), 'fixed violations still in tests/visual/axe-baseline.json; remove them').toEqual([]);
    });
}

test('the size slider resizes the previews', async ({ page }) => {
    await open(page);
    await views.large(page);
    await expect(page.locator('.header-headers-sizedisplay')).toHaveText('64px');
    await expect(page.locator('.icons-list-icon img').first()).toHaveCSS('width', '64px');
});

test('search narrows the list', async ({ page }) => {
    await open(page);
    const all = await page.locator('.icons-list-icon').count();
    await views.search(page);
    const filtered = await page.locator('.icons-list-icon').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(all);
});
