const { test, expect } = require('@playwright/test');

test('TC04 - completar checkout con multiples productos', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Log in' }).click();

  await page.locator('#loginusername').fill('grupo6qa2026');
  await page.locator('#loginpassword').fill('grupo6qa2026');

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.locator('#nameofuser')).toBeVisible();

  const productos = ['Samsung galaxy s6', 'Nokia lumia 1520', 'Sony vaio i5'];

  for (const producto of productos) {
    await page.goto('/');

    await page
      .getByRole('link', {
        name: producto,
        exact: true,
      })
      .click();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page
      .getByRole('link', {
        name: 'Add to cart',
      })
      .click();

    await page.waitForTimeout(1500);
  }

  await page.locator('#cartur').click();

  await expect(page.locator('#tbodyid tr')).toHaveCount(3);

  await page
    .getByRole('button', {
      name: 'Place Order',
    })
    .click();

  await page.locator('#name').fill('Maximiliano Giordani');
  await page.locator('#country').fill('Argentina');
  await page.locator('#city').fill('Tucuman');
  await page.locator('#card').fill('123456789');
  await page.locator('#month').fill('08');
  await page.locator('#year').fill('2025');

  await page
    .getByRole('button', {
      name: 'Purchase',
    })
    .click();

  await expect(
    page.getByRole('heading', {
      name: 'Thank you for your purchase!',
    }),
  ).toBeVisible();

  await expect(page.locator('.sweet-alert')).toContainText('Id');

  await expect(page.locator('.sweet-alert')).toContainText('Amount');

  await page
    .getByRole('button', {
      name: 'OK',
    })
    .click();
});
