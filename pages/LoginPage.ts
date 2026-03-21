// Import the Page and Locator types from the Playwright test library.
// Page represents the browser tab we are controlling.
// Locator is the type Playwright uses to reference a specific element on the page.
import { Page, Locator } from '@playwright/test';

// We define a class called LoginPage.
// A class is a blueprint — it groups together all the elements and actions
// that belong to the login page in one reusable place.
// "export" means other files (like our test files) can import and use this class.
export class LoginPage {

  // We declare a property called "page" of type Page.
  // This will hold a reference to the browser tab so our methods can interact with it.
  // "readonly" means this property can only be assigned once (in the constructor below)
  // and cannot be changed afterwards — this prevents accidental overwrites.
  readonly page: Page;

  // --- LOCATORS ---
  // Each locator below is a reference to a specific element on the login page.
  // Think of locators as "bookmarks" to elements — Playwright won't actually
  // search for them in the DOM until you call an action like .click() or .fill().

  // Matches the username input field.
  readonly usernameInput: Locator;

  // Matches the password input field.
  readonly passwordInput: Locator;

  // Matches the Login button.
  readonly loginButton: Locator;

  // Matches the error message container that appears on failed login attempts.
  readonly errorMessage: Locator;

  // --- CONSTRUCTOR ---
  // The constructor is a special method that runs automatically when you create
  // a new instance of this class (e.g. "new LoginPage(page)" in a test file).
  // It receives the "page" object from the test and uses it to:
  //   1. Store the page reference for later use
  //   2. Assign every locator to its matching element on the page
  constructor(page: Page) {

    // Store the page reference so our methods below can use it.
    this.page = page;

    // page.locator() tells Playwright "find the element(s) matching this selector".
    // We use data-test attributes because they are stable — they won't change
    // if the CSS class or element tag changes. This makes tests more resilient.

    // Finds the username input field by its data-test attribute.
    this.usernameInput = page.locator('[data-test="username"]');

    // Finds the password input field by its data-test attribute.
    this.passwordInput = page.locator('[data-test="password"]');

    // Finds the Login button by its data-test attribute.
    this.loginButton = page.locator('[data-test="login-button"]');

    // Finds the error message container by its data-test attribute.
    // This element is hidden by default and only appears on a failed login.
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // --- METHODS ---
  // Methods are the actions this page can perform.
  // Each method is "async" because Playwright actions interact with a real browser
  // and take time — "async/await" lets us wait for each action to finish
  // before moving to the next line.

  // Navigates the browser to the Sauce Demo login page.
  // We call this at the start of every login test to ensure we are on the right URL.
  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  // Fills in the username and password fields, then clicks the Login button.
  // "username" and "password" are parameters — we pass the actual values in from the test.
  // This means the same method works for valid logins, invalid logins, locked users, etc.
  // .fill() clears the field first and then types the given value into it.
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Returns the text content of the error message element.
  // Called in negative tests (e.g. TC-UI-002) to assert what error message appeared.
  // Promise<string> means this method will eventually return a string value.
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.innerText();
  }
}