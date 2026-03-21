// Import the test runner and assertion library from Playwright.
// "test" is the function we use to define each test case.
// "expect" is the function we use to make assertions (check expected vs actual).
import { test, expect } from '@playwright/test';

// Import all three page objects we need for these tests.
// LoginPage is needed because every test starts from the login screen.
// ProductsPage and CartPage cover the actions and assertions for today's test cases.
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

// --- SHARED SETUP ---
// "test.beforeEach" runs automatically before every test in this file.
// This avoids repeating the login steps inside each individual test.
// "page" is provided automatically by Playwright — it's a fresh browser tab.
test.beforeEach(async ({ page }) => {

  // Create an instance of LoginPage, passing in the browser tab.
  const loginPage = new LoginPage(page);

  // Navigate to the Sauce Demo login page.
  await loginPage.goto();

  // Fill in credentials and click Login.
  // After this line, the browser is on the inventory page ready for each test.
  await loginPage.login('standard_user', 'secret_sauce');
});

// --- TC-UI-003 ---
// Verifies that the inventory page loads correctly after login.
test('TC-UI-003: Products page loads after login', async ({ page }) => {

  // Create an instance of ProductsPage to interact with the inventory.
  const productsPage = new ProductsPage(page);

  // Assert that the inventory list container is visible on the page.
  // .toBeVisible() will fail the test if the element is not rendered.
  await expect(productsPage.inventoryList).toBeVisible();

  // Assert that exactly 6 products are shown (the default Sauce Demo inventory).
  // .toBe(6) will fail the test if the count is anything other than 6.
  const itemCount = await productsPage.getInventoryItemCount();
  expect(itemCount).toBe(6);
});

// --- TC-UI-004 ---
// Verifies that adding an item to the cart updates the cart badge to "1".
test('TC-UI-004: Add item to cart updates cart badge', async ({ page }) => {

  // Create an instance of ProductsPage to interact with the inventory.
  const productsPage = new ProductsPage(page);

  // Click the "Add to cart" button for the Sauce Labs Backpack.
  await productsPage.addItemToCart();

  // Assert that the cart badge is now visible.
  // Before adding an item the badge is hidden — after adding it should appear.
  await expect(productsPage.cartBadge).toBeVisible();

  // Assert that the badge shows exactly "1".
  // We compare against the string "1" because the DOM value is text, not a number.
  const badgeCount = await productsPage.getCartBadgeCount();
  expect(badgeCount).toBe('1');
});

// --- TC-UI-005 ---
// Verifies that navigating to the cart shows the item we just added.
test('TC-UI-005: Navigate to cart after adding item', async ({ page }) => {

  // Create instances of both page objects we need for this test.
  // This test spans two pages — products and cart — so we need both.
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // Add the Sauce Labs Backpack to the cart.
  await productsPage.addItemToCart();

  // Click the cart icon to navigate to /cart.html.
  await productsPage.goToCart();

  // Assert that the URL has changed to the cart page.
  // We use a regex (/.*cart.html/) instead of an exact URL string —
  // this is more resilient to minor URL changes like different base domains.
  await expect(page).toHaveURL(/.*cart.html/);

  // Assert that there is exactly 1 item in the cart.
  // toBe(1) compares against a number here because .count() returns a number.
  const cartItemCount = await cartPage.getCartItemCount();
  expect(cartItemCount).toBe(1);

  // Assert that the item in the cart is the backpack we added.
  // getItemNameByIndex(0) reads the name of the first (and only) cart row.
  // Index 0 means the first item — arrays and lists always start at 0.
  const itemName = await cartPage.getItemNameByIndex(0);
  expect(itemName).toBe('Sauce Labs Backpack');
});