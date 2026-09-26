import { defineConfig, devices } from '@playwright/test';

// Screenshots only match inside the pinned image (fonts, rendering), so refuse to run elsewhere.
if (!process.env.PW_DOCKER) {
    throw new Error('Run the visual suite with `npm run test:visual`, which runs it in the pinned Playwright image.');
}

export default defineConfig({
    testDir: '.',
    testMatch: '*.spec.mjs',
    outputDir: '../../reports/visual/results',
    snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
    fullyParallel: true,
    // Updating the axe baseline rewrites one file, so run serially then.
    workers: process.env.AXE_UPDATE ? 1 : undefined,
    retries: 0,
    reporter: [
        ['list'],
        ['junit', { outputFile: '../../reports/visual/junit.xml' }],
        ['json', { outputFile: '../../reports/visual/results.json' }],
        ['html', { outputFolder: '../../reports/visual/html', open: 'never' }]
    ],
    use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1,
        locale: 'en-US',
        timezoneId: 'UTC',
        colorScheme: 'light'
    },
    expect: {
        toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css' }
    },
    webServer: {
        command: 'node tests/visual/serve.mjs reports/visual/site 4173',
        cwd: '../..',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: false
    }
});
