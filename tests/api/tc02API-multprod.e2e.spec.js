const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://api.demoblaze.com';

const PRODUCTOS_A_AGREGAR = [1, 2];

test('Flujo E2E Refactorizado: Crear usuario, loguear y validar carrito', async ({
  request,
}) => {
  const username = `user_${Date.now()}`;
  const password = 'bootcamp123';

  console.log(`Registrando usuario: ${username}`);

  const signupResponse = await request.post(`${BASE_URL}/signup`, {
    data: { username, password },
  });
  expect(signupResponse.status()).toBe(200);

  const loginResponse = await request.post(`${BASE_URL}/login`, {
    data: { username, password },
  });
  expect(loginResponse.status()).toBe(200);

  const loginText = await loginResponse.text();
  const tokenLimpio = loginText
    .replace('Auth_token: ', '')
    .replace(/"/g, '')
    .trim();
  console.log('Token obtenido:', tokenLimpio);

  const initialCartResponse = await request.post(`${BASE_URL}/viewcart`, {
    data: { cookie: tokenLimpio, flag: true },
  });
  expect(initialCartResponse.status()).toBe(200);

  const carritoInicial = await initialCartResponse.json();
  console.log('Contenido del carrito inicial:', carritoInicial);

  for (const prodId of PRODUCTOS_A_AGREGAR) {
    const addProdResponse = await request.post(`${BASE_URL}/addtocart`, {
      data: {
        id: Date.now().toString(),
        cookie: tokenLimpio,
        prod_id: prodId,
        flag: true,
      },
    });
    expect(addProdResponse.status()).toBe(200);
    console.log(`Producto ${prodId} agregado correctamente al carrito.`);
  }

  const finalCartResponse = await request.post(`${BASE_URL}/viewcart`, {
    data: { cookie: tokenLimpio, flag: true },
  });
  expect(finalCartResponse.status()).toBe(200);

  const carritoFinal = await finalCartResponse.json();

  const items = carritoFinal.Items ?? carritoFinal;

  expect(Array.isArray(items)).toBe(true);

  const idsEnCarrito = items.map((item) => Number(item.prod_id));
  console.log('IDs detectados en el carrito final:', idsEnCarrito);

  for (const prodId of PRODUCTOS_A_AGREGAR) {
    expect(idsEnCarrito).toContain(prodId);
  }
});
