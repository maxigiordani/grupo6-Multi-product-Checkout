const { test, expect } = require('@playwright/test');
test.setTimeout(60000);
test('TC04 - completar checkout con multiples productos', async ({ page }) => {
  const usuario = 'grupo6qa2026';
  const password = 'grupo6qa2026';

  await page.goto('/');

  await page.getByRole('link', { name: 'Log in' }).click();

  await page.locator('#loginusername').fill(usuario);
  await page.locator('#loginpassword').fill(password);

  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForTimeout(2000);

  await expect(page.locator('#nameofuser')).toContainText(`Welcome ${usuario}`);

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

    await page.waitForTimeout(2000);
  }

  await page.locator('#cartur').click();

  await page.waitForTimeout(3000);

  await expect(page.locator('#tbodyid')).toContainText('Samsung galaxy s6');

  await expect(page.locator('#tbodyid')).toContainText('Nokia lumia 1520');

  await expect(page.locator('#tbodyid')).toContainText('Sony vaio i5');

  await page
    .getByRole('button', {
      name: 'Place Order',
    })
    .click();

  await page.waitForTimeout(1500);

  await page
    .locator('#name')
    .pressSequentially('Maximiliano Giordani', { delay: 100 });

  await page.waitForTimeout(800);

  await page.locator('#country').pressSequentially('Argentina', { delay: 100 });

  await page.waitForTimeout(800);

  await page.locator('#city').pressSequentially('Tucuman', { delay: 100 });

  await page.waitForTimeout(800);

  await page.locator('#card').pressSequentially('123456789', { delay: 120 });

  await page.waitForTimeout(800);

  await page.locator('#month').pressSequentially('08', { delay: 200 });

  await page.waitForTimeout(800);

  await page.locator('#year').pressSequentially('2025', { delay: 150 });

  await page.waitForTimeout(2000);

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

  await page.waitForTimeout(5000);

  await page
    .getByRole('button', {
      name: 'OK',
    })
    .click();
});
