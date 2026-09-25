// Integrity of the generated icon set (src/icons_all.js, src/icons_list.js) and the
// docs metadata (src/docs/meta.json) against the SVG sources in src/icons/.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import Icons from 'Moongoose/icons_all.js';
import IconList from 'Moongoose/icons_list.js';
import Meta from 'Moongoose/docs/meta.json';
import metaMissingBaseline from './fixtures/meta-missing.json';
import unknownSimilarBaseline from './fixtures/meta-unknown-similar.json';

const require = createRequire(import.meta.url);
const { icons_path, readFiles } = require('../scripts/svg-to-module.js');

const sources = readFiles(fs.readdirSync(icons_path));
const sourceNames = sources.map((f) => f.name);
const iconNames = new Set(IconList);

// Known gaps are pinned in tests/fixtures/. A new gap fails; so does a fixed one that is
// still listed, so the baseline only ever shrinks.
function expectMatchesBaseline(actual, baseline, fixture) {
    const added = actual.filter((x) => !baseline.includes(x));
    const fixed = baseline.filter((x) => !actual.includes(x));
    expect(added, `new entries — fix them rather than adding to ${fixture}`).toEqual([]);
    expect(fixed, `fixed — remove these from ${fixture}`).toEqual([]);
}

describe('generated icon files', () => {
    test('every SVG source has exactly one name', () => {
        expect(new Set(sourceNames).size).toBe(sourceNames.length);
    });

    test('icons_list.js has no duplicates', () => {
        expect(iconNames.size).toBe(IconList.length);
    });

    test('icons_list.js matches the SVG sources (run `npm run build` if stale)', () => {
        expect([...IconList].sort()).toEqual([...sourceNames].sort());
    });

    test('icons_all.js matches the SVG sources (run `npm run build` if stale)', () => {
        expect(Object.keys(Icons).sort()).toEqual([...sourceNames].sort());
        const stale = sources.filter((f) => Icons[f.name] !== f.contents.replace(/\n/g, '')).map((f) => f.name);
        expect(stale).toEqual([]);
    });
});

describe('SVG sources', () => {
    test.each(sources.map((f) => [f.filename, f.contents]))('%s is a non-empty <svg> with a viewBox', (_file, svg) => {
        expect(svg).toMatch(/<svg[\s>]/);
        expect(svg).toMatch(/<\/svg>\s*$/);
        expect(svg).toMatch(/viewBox=/);
    });

    // The component renders icons with v-html, so an SVG must never carry script.
    test.each(sources.map((f) => [f.filename, f.contents]))('%s has no script or event handlers', (_file, svg) => {
        expect(svg).not.toMatch(/<script/i);
        expect(svg).not.toMatch(/\son[a-z]+\s*=/i);
        expect(svg).not.toMatch(/javascript:/i);
    });

    // svg-to-module.js wraps each SVG in single quotes without escaping.
    test.each(sources.map((f) => [f.filename, f.contents]))('%s contains no single quotes', (_file, svg) => {
        expect(svg).not.toContain("'");
    });
});

describe('docs metadata (meta.json)', () => {
    test('every key is a real icon', () => {
        expect(Object.keys(Meta).filter((k) => !iconNames.has(k))).toEqual([]);
    });

    test('icons without metadata match the baseline', () => {
        const missing = IconList.filter((n) => !Meta[n]).sort();
        expectMatchesBaseline(missing, metaMissingBaseline, 'tests/fixtures/meta-missing.json');
    });

    test('"similar" references to unknown icons match the baseline', () => {
        const unknown = Object.entries(Meta)
            .flatMap(([name, m]) => (m.similar || []).filter((s) => !iconNames.has(s)).map((s) => `${name} -> ${s}`))
            .sort();
        expectMatchesBaseline(unknown, unknownSimilarBaseline, 'tests/fixtures/meta-unknown-similar.json');
    });
});
