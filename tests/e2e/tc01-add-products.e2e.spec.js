const { test, expect } = require('@playwright/test');
test.setTimeout(35000);
const { API } = require('../helpers');

test('TC01 - Agregar 3 productos distintos al carrito (API + UI)', async ({
  request,
  page,
}) => {
  const cookie = `user-${Date.now()}`;

  const productosAPI = [1, 2, 8];

  console.log('===== API =====');

  for (const prod_id of productosAPI) {
    const response = await request.post(`${API}/addtocart`, {
      data: {
        id: crypto.randomUUID(),
        cookie,
        prod_id,
        flag: false,
      },
    });

    expect(response.status()).toBe(200);

    console.log(`Producto ${prod_id} agregado por API`);
  }

  const carritoResponse = await request.post(`${API}/viewcart`, {
    data: {
      cookie,
      flag: false,
    },
  });

  expect(carritoResponse.status()).toBe(200);

  const carrito = await carritoResponse.json();

  console.log('Productos encontrados por API:', carrito.Items.length);

  expect(carrito.Items.length).toBe(3);

  console.log('===== UI =====');

  const usuario = 'grupo6qa2026';
  const password = 'grupo6qa2026';

  await page.goto('/');

  await page.getByRole('link', { name: 'Log in' }).click();

  await page.locator('#loginusername').fill(usuario);
  await page.locator('#loginpassword').fill(password);

  await page.getByRole('button', { name: 'Log in' }).click();

  await page.waitForTimeout(2000);

  await expect(page.locator('#nameofuser')).toContainText(`Welcome ${usuario}`);

  console.log(`Login exitoso como ${usuario}`);

  const productosUI = ['Samsung galaxy s6', 'Nokia lumia 1520', 'Sony vaio i5'];

  for (const producto of productosUI) {
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

    console.log(`Producto agregado por UI: ${producto}`);

    await page.waitForTimeout(2000);
  }

  await page.locator('#cartur').click();

  await page.waitForTimeout(3000);

  await expect(page.locator('#tbodyid')).toContainText('Samsung galaxy s6');

  await expect(page.locator('#tbodyid')).toContainText('Nokia lumia 1520');

  await expect(page.locator('#tbodyid')).toContainText('Sony vaio i5');

  console.log('Los 3 productos aparecen en el carrito');

  await page.waitForTimeout(10000);
});
