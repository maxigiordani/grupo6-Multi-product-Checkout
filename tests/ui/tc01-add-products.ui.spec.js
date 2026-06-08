const { test, expect } = require('@playwright/test');

test('TC01 - validar 3 productos en carrito', async ({ page }) => {
  const productos = [
    'Samsung galaxy s6',
    'Nokia lumia 1520',
    'Sony vaio i5',
  ];

  for (const producto of productos) {
    // Volver al home
    await page.goto('/');

    // Esperar que el producto sea visible
    await expect(
      page.getByRole('link', { name: producto, exact: true })
    ).toBeVisible();

    // Abrir detalle del producto
    await page.getByRole('link', { name: producto, exact: true }).click();

    // Aceptar alerta de "Product added"
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Agregar al carrito
    await page.getByRole('link', { name: 'Add to cart' }).click();

    // Esperar que termine la operación
    await page.waitForTimeout(1500);
  }

  // Ir al carrito
  await page.locator('#cartur').click();

  // Esperar que cargue la tabla
  await expect(page.locator('#tbodyid')).toBeVisible();

  // Verificar los 3 productos
  await expect(page.locator('#tbodyid')).toContainText(
    'Samsung galaxy s6'
  );

  await expect(page.locator('#tbodyid')).toContainText(
    'Nokia lumia 1520'
  );

  await expect(page.locator('#tbodyid')).toContainText(
    'Sony vaio i5'
  );
});