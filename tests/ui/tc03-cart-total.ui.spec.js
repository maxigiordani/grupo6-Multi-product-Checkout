const { test, expect } = require('@playwright/test');

test('TC03 - validar que el total es la suma correcta', async ({ page }) => {
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

  // Ir al carrito
  await page.getByRole('link', { name: 'Cart', exact: true }).click();

  // Verificar que estamos en el carrito
  await expect(page.locator('#tbodyid')).toBeVisible();
  // Obtener todos los precios del carrito
  const precios = await page
    .locator('#tbodyid tr td:nth-child(3)')
    .allTextContents();

  console.log('Precios encontrados:', precios);
  // Convertir precios a números
  const sumaPrecios = precios
    .map((precio) => Number(precio))
    .reduce((acumulador, precio) => acumulador + precio, 0);

  console.log('Suma calculada:', sumaPrecios);
  // Obtener total mostrado por la aplicación
  const totalMostrado = Number(await page.locator('#totalp').textContent());

  console.log('Total mostrado:', totalMostrado);

  // Validar que el total sea correcto
  expect(totalMostrado).toBe(sumaPrecios);
});
