const { test, expect } = require('@playwright/test');

test('TC04 - completar checkout con multiples productos', async ({ page }) => {
  const productos = [
    'Samsung galaxy s6',
    'Nokia lumia 1520',
    'Sony vaio i5',
  ];

  // Agregar productos
  for (const producto of productos) {
    await page.goto('/');

    await page.getByRole('link', {
      name: producto,
      exact: true,
    }).click();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole('link', {
      name: 'Add to cart',
    }).click();

    await page.waitForTimeout(1500);
  }

  // Ir al carrito
  await page.locator('#cartur').click();

  // Validar que existen los productos
  await expect(page.locator('#tbodyid tr')).toHaveCount(3);

  // Abrir checkout
  await page.getByRole('button', {
    name: 'Place Order',
  }).click();

  // Completar formulario
  await page.locator('#name').fill('Maximiliano Giordani');
  await page.locator('#country').fill('Argentina');
  await page.locator('#city').fill('Tucuman');
  await page.locator('#card').fill('123456789');
  await page.locator('#month').fill('08');
  await page.locator('#year').fill('2025');

  // Comprar
  await page.getByRole('button', {
    name: 'Purchase',
  }).click();

  // Validar compra exitosa
  await expect(
    page.getByRole('heading', {
      name: 'Thank you for your purchase!',
    })
  ).toBeVisible();

  // Validar que exista información de la orden
  await expect(
    page.locator('.sweet-alert')
  ).toContainText('Id');

  await expect(
    page.locator('.sweet-alert')
  ).toContainText('Amount');

  // Cerrar mensaje
  await page.getByRole('button', {
    name: 'OK',
  }).click();
});