import { test, expect } from '@playwright/test';

test('TC02: Validar multiples productos en carrito', async ({
  request,
  page,
}) => {
  const username = `qa_user_${Date.now()}`;
  const password = 'bootcamp123';

  await request.post('https://api.demoblaze.com/signup', {
    data: { username, password },
  });

  const loginResponse = await request.post('https://api.demoblaze.com/login', {
    data: { username, password },
  });
  const tokenText = await loginResponse.text();
  const token = tokenText.replace('Auth_token: ', '').trim();

  await page.goto('https://www.demoblaze.com/');
  await page.evaluate(
    ({ tokenuser }) => {
      localStorage.setItem('tokenuser', tokenuser);
    },
    { tokenuser: token },
  );
  await page.reload();

  page.on('dialog', (dialog) => dialog.accept());

  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  const addPromise1 = page.waitForResponse((response) =>
    response.url().includes('/addtocart'),
  );
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await addPromise1;

  await page.goto('https://www.demoblaze.com/');
  await page.getByRole('link', { name: 'Nokia lumia 1520' }).click();

  const addPromise2 = page.waitForResponse((response) =>
    response.url().includes('/addtocart'),
  );
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await addPromise2;

  const cartResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/viewcart') && response.status() === 200,
  );

  await page.getByRole('link', { name: 'Cart', exact: true }).click();

  const cartResponse = await cartResponsePromise;
  const cartData = await cartResponse.json();
  expect(cartData.Items.length).toBe(2);

  const productosEnTabla = page.locator('#tbodyid tr');
  await expect(productosEnTabla).toHaveCount(2);

});
