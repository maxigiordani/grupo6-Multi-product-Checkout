const { test, expect } = require('@playwright/test');

test('TC03 - validar que el total es la suma correcta', async ({ page }) => {
  await page.goto('/');

  // Agregar primer producto
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('link', { name: 'Add to cart' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Home' }).click();

  // Agregar segundo producto
  await page.getByRole('link', { name: 'Sony xperia z5' }).click();

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('link', { name: 'Add to cart' }).click();
  await page.waitForTimeout(2000);

  // Navegar al carrito
  await page.getByRole('link', { name: 'Cart', exact: true }).click();

  // Obtener precios de los productos
  await expect(page.locator('#tbodyid')).toBeVisible();

  const precios = await page
    .locator('#tbodyid tr td:nth-child(3)')
    .allTextContents();

  console.log('Precios encontrados:', precios);

  // Calcular suma de precios
  const sumaPrecios = precios
    .map((precio) => Number(precio))
    .reduce((acumulador, precio) => acumulador + precio, 0);

  console.log('Suma calculada:', sumaPrecios);

  // Obtener total mostrado
  const totalMostrado = Number(await page.locator('#totalp').textContent());

  console.log('Total mostrado:', totalMostrado);

  // Validar total
  expect(totalMostrado).toBe(sumaPrecios);
});
