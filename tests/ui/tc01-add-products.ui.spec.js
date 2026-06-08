const { test, expect } = require('@playwright/test');

test('TC01 - validar 3 productos en carrito', async ({ page }) => {
  const productos = [
    'Samsung galaxy s6',
    'Nokia lumia 1520',
    'Sony vaio i5',
  ];

  for (const producto of productos) {
  
    await page.goto('/');


    await expect(
      page.getByRole('link', { name: producto, exact: true })
    ).toBeVisible();

   
    await page.getByRole('link', { name: producto, exact: true }).click();

  
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });


    await page.getByRole('link', { name: 'Add to cart' }).click();


    await page.waitForTimeout(1500);
  }

  
  await page.locator('#cartur').click();


  await expect(page.locator('#tbodyid')).toBeVisible();

 
  await expect(page.locator('#tbodyid')).toContainText(
    'Samsung galaxy s6'
  );

  await expect(page.locator('#tbodyid')).toContainText(
    'Nokia lumia 1520'
  );

  await expect(page.locator('#tbodyid')).toContainText(
    'Sony vaio i5'
  );
});