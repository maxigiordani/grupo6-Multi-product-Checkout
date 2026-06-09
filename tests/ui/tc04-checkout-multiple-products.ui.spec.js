const { test, expect } = require('@playwright/test');
test.setTimeout(60000);
test('TC04 - completar checkout con multiples productos', async ({ page }) => {

  // ========================================
  // LOGIN
  // ========================================

  const usuario = 'grupo6qa2026';
  const password = 'grupo6qa2026';

  await page.goto('/');

  await page.getByRole('link', { name: 'Log in' }).click();

  await page.locator('#loginusername').fill(usuario);
  await page.locator('#loginpassword').fill(password);

  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForTimeout(2000);

  await expect(page.locator('#nameofuser'))
    .toContainText(`Welcome ${usuario}`);

  // ========================================
  // AGREGAR PRODUCTOS
  // ========================================

  const productos = [
    'Samsung galaxy s6',
    'Nokia lumia 1520',
    'Sony vaio i5',
  ];

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

    console.log(`Producto agregado: ${producto}`);

    await page.waitForTimeout(2000);
  }

  // ========================================
  // VALIDAR CARRITO
  // ========================================

  await page.locator('#cartur').click();

  await page.waitForTimeout(3000);

  await expect(page.locator('#tbodyid'))
    .toContainText('Samsung galaxy s6');

  await expect(page.locator('#tbodyid'))
    .toContainText('Nokia lumia 1520');

  await expect(page.locator('#tbodyid'))
    .toContainText('Sony vaio i5');

  // ========================================
  // CHECKOUT
  // ========================================

  await page.getByRole('button', {
    name: 'Place Order',
  }).click();

  await page.waitForTimeout(1500);

  // Nombre
  await page.locator('#name').pressSequentially(
    'Maximiliano Giordani',
    { delay: 100 }
  );

  await page.waitForTimeout(800);

  // País
  await page.locator('#country').pressSequentially(
    'Argentina',
    { delay: 100 }
  );

  await page.waitForTimeout(800);

  // Ciudad
  await page.locator('#city').pressSequentially(
    'Tucuman',
    { delay: 100 }
  );

  await page.waitForTimeout(800);

  // Tarjeta
  await page.locator('#card').pressSequentially(
    '123456789',
    { delay: 120 }
  );

  await page.waitForTimeout(800);

  // Mes
  await page.locator('#month').pressSequentially(
    '08',
    { delay: 200 }
  );

  await page.waitForTimeout(800);

  // Año
  await page.locator('#year').pressSequentially(
    '2025',
    { delay: 150 }
  );

  await page.waitForTimeout(2000);

  // Comprar
  await page.getByRole('button', {
    name: 'Purchase',
  }).click();

  // ========================================
  // VALIDAR COMPRA
  // ========================================

  await expect(
    page.getByRole('heading', {
      name: 'Thank you for your purchase!',
    })
  ).toBeVisible();

  await expect(page.locator('.sweet-alert'))
    .toContainText('Id');

  await expect(page.locator('.sweet-alert'))
    .toContainText('Amount');

  console.log('Compra realizada correctamente');

  // Mostrar comprobante unos segundos
  await page.waitForTimeout(5000);

  await page.getByRole('button', {
    name: 'OK',
  }).click();

});