// Import the test runner and assertion library from Playwright.
// "test" is the function we use to define each test case.
// "expect" is the function we use to make assertions (check expected vs actual).
import { test, expect } from '@playwright/test';

// Import the LoginPage page object so we can interact with the login page
// through its methods instead of writing raw selectors directly in the test.
import { LoginPage } from '../pages/LoginPage';

// --- TEST SUITE ---
// "test.describe" groups related tests together under a shared label.
// This is useful for organisation — in the Playwright report, all tests
// inside this block will appear grouped under the "Login" heading.
test.describe('Login', () => {

  // --- TC-UI-001 ---
  // Verifies that a valid login navigates the user to the products page.
  // This is the "happy path" — the most important flow to get right.
  // "async ({ page })" means Playwright provides a fresh browser tab
  // automatically for each test — we never need to open the browser ourselves.
  test('TC-UI-001 — Valid login navigates to products page', async ({ page }) => {

    // Create an instance of LoginPage, passing in the browser tab.
    // From this point on we interact with the page through loginPage methods,
    // not through raw Playwright calls — this is the POM pattern in action.
    const loginPage = new LoginPage(page);

    // Navigate the browser to https://www.saucedemo.com.
    await loginPage.goto();

    // Fill in the username and password fields and click the Login button.
    // We pass valid credentials here — this should result in a successful login.
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert that the browser has navigated to the inventory page.
    // .toHaveURL() checks the current URL against the expected value.
    // If the URL does not match, the test fails here with a clear error message.
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // --- TC-UI-002 ---
  // Verifies that an invalid password shows an error message to the user.
  // This is a "negative test" — we deliberately provide wrong credentials
  // to confirm the application handles the failure case correctly.
  test('TC-UI-002 — Invalid password shows error message', async ({ page }) => {

    // Create a fresh instance of LoginPage for this test.
    // Even though both tests use LoginPage, each test gets its own instance
    // because each test gets its own fresh browser tab from Playwright.
    const loginPage = new LoginPage(page);

    // Navigate to the login page.
    await loginPage.goto();

    // Attempt to log in with a valid username but a wrong password.
    // The application should reject this and display an error message.
    await loginPage.login('standard_user', 'wrong_password');

    // Assert that the error message element is visible on the page.
    // We do not check the exact text here — just that the error appeared.
    // .toBeVisible() fails the test if the element is hidden or not in the DOM.
    await expect(loginPage.errorMessage).toBeVisible();
  });
});