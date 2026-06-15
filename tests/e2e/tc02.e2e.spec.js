import { test, expect } from '@playwright/test';

test('TC02: Validar multiples productos en carrito', async ({
  request,
  page,
}) => {
  // =======================================================
  // FASE 1: SETUP (Preparación de datos sin pisarse)
  // =======================================================
  const username = `qa_user_${Date.now()}`;
  const password = 'bootcamp123';

  // Registrar usuario
  await request.post('https://api.demoblaze.com/signup', {
    data: { username, password },
  });

  // Login y extracción del token
  const loginResponse = await request.post('https://api.demoblaze.com/login', {
    data: { username, password },
  });
  const tokenText = await loginResponse.text();
  const token = tokenText.replace('Auth_token: ', '').trim();

  // Inyectar sesión en la UI
  await page.goto('https://www.demoblaze.com/');
  await page.evaluate(
    ({ tokenuser }) => {
      localStorage.setItem('tokenuser', tokenuser);
    },
    { tokenuser: token },
  );
  await page.reload();

  // =======================================================
  // FASE 2: TEST (Interactuar como un usuario real)
  // =======================================================
  page.on('dialog', (dialog) => dialog.accept());

  // --- Producto 1 ---
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  // SOLUCIÓN 2: Esperamos la confirmación del backend antes de avanzar
  const addPromise1 = page.waitForResponse((response) =>
    response.url().includes('/addtocart'),
  );
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await addPromise1; // Playwright se detiene aquí hasta que la API responda

  // --- Producto 2 ---
  await page.goto('https://www.demoblaze.com/');
  await page.getByRole('link', { name: 'Nokia lumia 1520' }).click();

  // Aplicamos la misma espera para el segundo producto
  const addPromise2 = page.waitForResponse((response) =>
    response.url().includes('/addtocart'),
  );
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await addPromise2;

  // =======================================================
  // FASE 3: VERIFY (Confirmar en API + UI)
  // =======================================================

  // Preparamos la intercepción de la API
  const cartResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/viewcart') && response.status() === 200,
  );

  // Navegamos al carrito (UI)
  await page.getByRole('link', { name: 'Cart', exact: true }).click();

  // Verificación API
  const cartResponse = await cartResponsePromise;
  const cartData = await cartResponse.json();
  expect(cartData.Items.length).toBe(2);

  // Verificación UI (Le damos un momento extra para que la tabla termine de renderizar)
  const productosEnTabla = page.locator('#tbodyid tr');
  await expect(productosEnTabla).toHaveCount(2);

  await page.pause();
});
