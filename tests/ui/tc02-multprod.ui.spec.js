const { test, expect } = require('@playwright/test');

test('Flujo E2E UI: Crear usuario, loguear y validar carrito', async ({
  page,
}) => {
  const username = `user_${Date.now()}`;
  const password = 'bootcamp123';

  page.on('dialog', async (dialog) => {
    console.log(`Alerta interceptada: ${dialog.message()}`);
    await dialog.accept();
  });

  console.log('Navegando a DemoBlaze...');
  await page.goto('https://www.demoblaze.com/');

  console.log(`Registrando usuario por UI: ${username}`);
  await page.click('#signin2');
  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);
  await page.click('button[onclick="register()"]');

  await page.waitForTimeout(2000);

  console.log('Iniciando sesión por UI...');
  await page.click('#login2');
  await page.fill('#loginusername', username);
  await page.fill('#loginpassword', password);
  await page.click('button[onclick="logIn()"]');

  await expect(page.locator('#nameofuser')).toContainText(
    `Welcome ${username}`,
  );

  console.log('Agregando Producto 1...');
  await page.click('text=Samsung galaxy s6');

  const promesaAlerta1 = page.waitForEvent('dialog');
  await page.click('text=Add to cart');
  await promesaAlerta1;

  await page.goto('https://www.demoblaze.com/');
  console.log('Agregando Producto 2...');
  await page.click('text=Nokia lumia 1520');

  const promesaAlerta2 = page.waitForEvent('dialog');
  await page.click('text=Add to cart');
  await promesaAlerta2;

  console.log('Yendo al carrito a validar...');
  await page.click('#cartur');

  const filasCarrito = page.locator('tbody tr.success');
  await expect(filasCarrito).toHaveCount(2);

  console.log('¡Flujo visual completado con éxito!');


});
