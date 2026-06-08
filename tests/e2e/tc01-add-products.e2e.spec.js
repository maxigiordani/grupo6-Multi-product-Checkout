const { test, expect } = require('@playwright/test');
const { API } = require('../helpers');

test('TC01 - Agregar 3 productos distintos al carrito (API + UI)', async ({
  request,
  page,
}) => {
  
  const cookie = `user-${Date.now()}`;

  const productos = [1, 2, 8];

  for (const prod_id of productos) {
    const response = await request.post(`${API}/addtocart`, {
      data: {
        id: crypto.randomUUID(),
        cookie,
        prod_id,
        flag: false,
      },
    });

    expect(response.status()).toBe(200);
  }


  const carritoResponse = await request.post(`${API}/viewcart`, {
    data: {
      cookie,
      flag: false,
    },
  });

  expect(carritoResponse.status()).toBe(200);

  const carrito = await carritoResponse.json();

  expect(carrito.Items.length).toBe(3);

  expect(
    carrito.Items.map(item => item.prod_id)
  ).toEqual(
    expect.arrayContaining([1, 2, 8])
  );

 

  await page.goto('/');

  await expect(page).toHaveTitle(/STORE/);

  const productosUI = page.locator('.card-title');
  await expect(productosUI.first()).toBeVisible();
});