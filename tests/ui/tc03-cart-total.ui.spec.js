const { test, expect } = require('@playwright/test');

test('TC03 - agregar dos productos al carrito', async ({ page }) => {
  await page.goto('/');

  // Samsung Galaxy S6
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('link', { name: 'Add to cart' }).click();

  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Home' }).click();

  // Sony Xperia Z5
  await page.getByRole('link', { name: 'Sony xperia z5' }).click();

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('link', { name: 'Add to cart' }).click();

  await page.waitForTimeout(2000);

  await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();
});
