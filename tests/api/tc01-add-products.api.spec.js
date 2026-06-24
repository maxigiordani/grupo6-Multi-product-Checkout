const { test, expect } = require('@playwright/test');
const { API, generarUsuario } = require('../helpers');

const PRODUCTOS = [1, 2, 3];

test('TC01 | API - Agregar 3 productos distintos al carrito', async ({
  request,
}) => {
  const usuario = generarUsuario();

  usuario.password = Buffer.from(usuario.password).toString('base64');

  console.log('Usuario creado:', usuario.username);
  console.log('Password Base64:', usuario.password);

  const signupRes = await request.post(`${API}/signup`, {
    data: usuario,
  });

  expect(signupRes.status()).toBe(200);

  const loginRes = await request.post(`${API}/login`, {
    data: usuario,
  });

  expect(loginRes.status()).toBe(200);

  const texto = await loginRes.text();

  const token = texto.replace('Auth_token: ', '').replace(/"/g, '').trim();

  console.log('Token obtenido:', token);

  for (const prodId of PRODUCTOS) {
    const addCartRes = await request.post(`${API}/addtocart`, {
      data: {
        id: String(Date.now()),
        cookie: token,
        prod_id: prodId,
        flag: true,
      },
    });

    expect(addCartRes.status()).toBe(200);

    console.log(`Producto ${prodId} agregado correctamente`);
  }

  const cartRes = await request.post(`${API}/viewcart`, {
    data: {
      cookie: token,
      flag: true,
    },
  });

  expect(cartRes.status()).toBe(200);

  const cartData = await cartRes.json();

  console.log('Respuesta carrito:', JSON.stringify(cartData, null, 2));

  const items = cartData.Items ?? cartData;

  expect(Array.isArray(items)).toBe(true);

  expect(items.length).toBeGreaterThanOrEqual(3);

  const idsEnCarrito = items.map((item) => Number(item.prod_id));

  console.log('Productos encontrados:', idsEnCarrito);

  expect(idsEnCarrito).toContain(1);

  expect(idsEnCarrito).toContain(2);

  expect(idsEnCarrito).toContain(3);
});
