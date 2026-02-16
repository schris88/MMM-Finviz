import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://finviz.com/map.ashx?st=w1');
  await page.getByRole('button', { name: 'Read more to accept' }).click();
  await page.getByRole('button', { name: 'Accept all' }).click();
  await page.getByRole('button', { name: 'Share Map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download' }).click();
  const download = await downloadPromise;
  await download.saveAs('map.png');
});