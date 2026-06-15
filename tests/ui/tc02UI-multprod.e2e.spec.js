const { test, expect } = require('@playwright/test');

/**
 * Flujo Completo E2E por UI: Registro, Login y Verificación de Carrito
 */
test('Flujo E2E UI: Crear usuario, loguear y validar carrito', async ({
  page,
}) => {
  // Generamos credenciales únicas
  const username = `user_${Date.now()}`;
  const password = 'bootcamp123';

  // Configurar un "listener" genérico para aceptar automáticamente todas las alertas (ej. "Sign up successful", "Product added")
  page.on('dialog', async (dialog) => {
    console.log(`Alerta interceptada: ${dialog.message()}`);
    await dialog.accept();
  });

  // --- PASO 0: NAVEGAR A LA PÁGINA ---
  console.log('Navegando a DemoBlaze...');
  await page.goto('https://www.demoblaze.com/');

  // --- PASO 1: CREAR USUARIO NUEVO ---
  console.log(`Registrando usuario por UI: ${username}`);
  await page.click('#signin2'); // Clic en "Sign up" del menú
  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);
  await page.click('button[onclick="register()"]');

  // Pequeña espera para asegurar que el registro impacte (DemoBlaze es a veces lento)
  await page.waitForTimeout(2000);

  // --- PASO 2: LOGIN ---
  console.log('Iniciando sesión por UI...');
  await page.click('#login2'); // Clic en "Log in"
  await page.fill('#loginusername', username);
  await page.fill('#loginpassword', password);
  await page.click('button[onclick="logIn()"]');

  // Validamos que el login fue exitoso viendo que aparece el texto "Welcome user_xxx"
  await expect(page.locator('#nameofuser')).toContainText(
    `Welcome ${username}`,
  );

  // --- PASO 3: AGREGAR PRODUCTOS ---
  console.log('Agregando Producto 1...');
  await page.click('text=Samsung galaxy s6');

  // Preparamos a Playwright para esperar la alerta ANTES de hacer el clic
  const promesaAlerta1 = page.waitForEvent('dialog');
  await page.click('text=Add to cart');
  await promesaAlerta1; // Esperamos que la alerta se dispare y se acepte automáticamente

  await page.goto('https://www.demoblaze.com/'); // Ahora sí es seguro volver a la home

  console.log('Agregando Producto 2...');
  await page.click('text=Nokia lumia 1520');

  const promesaAlerta2 = page.waitForEvent('dialog');
  await page.click('text=Add to cart');
  await promesaAlerta2; // Esperamos que el segundo producto se confirme

  // --- PASO 4: REVISAR EL CARRITO ---
  console.log('Yendo al carrito a validar...');
  await page.click('#cartur'); // Clic en "Cart" en el menú superior

  // Validamos que la tabla del carrito tenga exactamente 2 filas (2 productos)
  // DemoBlaze usa la clase .success para las filas de productos en el carrito
  const filasCarrito = page.locator('tbody tr.success');
  await expect(filasCarrito).toHaveCount(2);

  console.log('¡Flujo visual completado con éxito!');

  // Pausamos para que puedas ver el resultado en la UI
  await page.pause();
});
