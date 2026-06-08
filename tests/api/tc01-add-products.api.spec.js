const { test, expect } = require('@playwright/test');
const { API, generarUsuario } = require('../helpers');

const PRODUCTOS = [1, 2, 3];

test('TC02 | API - Agregar 3 productos distintos al carrito', async ({ request }) => {
  // 1. Login
  const usuario = generarUsuario();
  await request.post(`${API}/signup`, { data: usuario });

  const loginRes = await request.post(`${API}/login`, { data: usuario });
  const texto = await loginRes.text();
  const token = texto.match(/Auth_token:\s*(\S+)/)[1].replace(/"/g, '');

  // 2. Agregar los 3 productos
  for (const prodId of PRODUCTOS) {
    const res = await request.post(`${API}/addtocart`, {
      data: {
        id:      String(Date.now()),
        cookie:  token,
        prod_id: prodId,
        flag:    true,
      },
    });

    expect(res.status()).toBe(200);
    console.log(`Producto ${prodId} agregado correctamente`);
  }

  // 3. Ver qué devuelve el carrito
  const cartRes = await request.post(`${API}/viewcart`, {
    data: { cookie: token, flag: true },
  });

  expect(cartRes.status()).toBe(200);

  const cartData = await cartRes.json();
  console.log('Respuesta del carrito:', JSON.stringify(cartData, null, 2)); // <-- ver estructura real

  // Puede venir como Items o como array directo
  const items = cartData.Items ?? cartData;

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toBeGreaterThanOrEqual(3);

  const idsEnCarrito = items.map((i) => Number(i.prod_id));
  console.log('IDs en carrito:', idsEnCarrito);

  expect(idsEnCarrito).toContain(1);
  expect(idsEnCarrito).toContain(2);
  expect(idsEnCarrito).toContain(3);
});