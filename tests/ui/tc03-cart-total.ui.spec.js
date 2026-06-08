import { test, expect } from '@playwright/test';

test('TC03 - validar que el total es la suma correcta', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');
});
