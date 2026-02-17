const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        // Mimic standard desktop browser to avoid bot detection/mobile layouts
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 },
            locale: 'en-US',
            deviceScaleFactor: 1
        });
        const page = await context.newPage();

        console.log('Navigating to Finviz...');
        // Wait for network idle to ensure page is fully loaded, but don't fail if some background requests linger
        try {
            await page.goto('https://finviz.com/map.ashx?st=w1', { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (e) {
            console.log('Navigation warning:', e.message);
        }

        // Handle possible cookie/terms popups based on test logic
        try {
            console.log('Checking for "Read more to accept"...');
            await page.getByRole('button', { name: 'Read more to accept' }).click({ timeout: 5000 });
            console.log('  Clicked "Read more to accept".');
        } catch (e) {
            console.log('  "Read more to accept" skipped (not found or not needed).');
        }

        try {
            console.log('Checking for "Accept all"...');
            await page.getByRole('button', { name: 'Accept all' }).click({ timeout: 5000 });
            console.log('  Clicked "Accept all".');
        } catch (e) {
            console.log('  "Accept all" skipped (not found or not needed).');
        }

        console.log('Clicking "Share Map"...');
        // 'Share Map' might be dynamic.
        await page.getByRole('button', { name: 'Share Map' }).click();

        console.log('Waiting for download event...');
        const downloadPromise = page.waitForEvent('download');

        console.log('Clicking "Download" link...');
        await page.getByRole('link', { name: 'Download' }).click();

        const download = await downloadPromise;

        const savePath = path.join(__dirname, 'map.png');
        await download.saveAs(savePath);

        console.log(`Map successfully saved to: ${savePath}`);

    } catch (error) {
        console.error('Error fetching map:', error);
        if (browser) {
            try {
                const pages = browser.contexts()[0].pages();
                if (pages.length > 0) {
                    await pages[0].screenshot({ path: 'finviz_error.png', fullPage: true });
                    console.log('Saved finviz_error.png for debugging.');
                }
            } catch (scrErr) {
                console.error('Failed to take screenshot:', scrErr);
            }
        }
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
