const { test, expect } = require('@playwright/test');

/*Flujo Completo: Registro, Login y Verificación de Carrito Vacío*/
test('Flujo E2E: Crear usuario, loguear y validar carrito vacío', async ({
  request,
  page,
}) => {
  // --- PASO 1: CREAR USUARIO NUEVO ---
  const username = `user_${Date.now()}`;
  const password = 'bootcamp123';

  console.log(`Registrando usuario: ${username}`);
  const signupResponse = await request.post(
    'https://api.demoblaze.com/signup',
    {
      data: { username: username, password: password },
    },
  );
  expect(signupResponse.status()).toBe(200);

  // --- PASO 2: LOGIN Y CAPTURA DE TOKEN ---
  const loginResponse = await request.post('https://api.demoblaze.com/login', {
    data: { username: username, password: password },
  });
  expect(loginResponse.status()).toBe(200);

  // Extraemos el texto de la respuesta y lo limpiamos para tener el token puro
  const loginText = await loginResponse.text();
  const tokenLimpio = loginText
    .replace('Auth_token: ', '')
    .replace(/"/g, '')
    .trim();
  console.log('Token obtenido tras el login:', tokenLimpio);

  // --- PASO 3: REVISAR EL CARRITO ---
  const cartResponse = await request.post(
    'https://api.demoblaze.com/viewcart',
    {
      data: {
        cookie: tokenLimpio,
        flag: true,
      },
    },
  );

  expect(cartResponse.status()).toBe(200);

  // Convertimos la respuesta del carrito a JSON para leerla en la terminal
  const carrito = await cartResponse.json();
  console.log('Contenido del carrito antes de agregar productos:', carrito);

  // Validamos que el carrito sea un arreglo vacío, o que no contenga elementos,
  const addProd1Response = await request.post(
    'https://api.demoblaze.com/addtocart',
    {
      data: {
        id: Date.now().toString(),
        cookie: tokenLimpio,
        prod_id: 1,
        flag: true,
      },
    },
  );
  expect(addProd1Response.status()).toBe(200);
  console.log('2. Producto 1 agregado al carrito.');

  const addProd2Response = await request.post(
    'https://api.demoblaze.com/addtocart',
    {
      data: {
        id: Date.now().toString(),
        cookie: tokenLimpio,
        prod_id: 2,
        flag: true,
      },
    },
  );
  expect(addProd2Response.status()).toBe(200);
  console.log('2. Producto 2 agregado al carrito.');

  const cartResponse2 = await request.post(
    'https://api.demoblaze.com/viewcart',
    {
      data: {
        cookie: tokenLimpio,
        flag: true,
      },
    },
  );

  expect(cartResponse2.status()).toBe(200);

  // Convertimos la respuesta del carrito a JSON para leerla en la terminal
  const carrito2 = await cartResponse2.json();
  console.log('Contenido del carrito después de agregar productos:', carrito2);
  await page.pause();
});
