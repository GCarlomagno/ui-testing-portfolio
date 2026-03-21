// Import the Page and Locator types from the Playwright test library.
// Page represents the browser tab we are controlling.
// Locator is the type Playwright uses to reference a specific element on the page.
import { Locator, Page } from '@playwright/test';

// We define a class called CartPage.
// A class is a blueprint — it groups together all the elements and actions
// that belong to the cart page in one reusable place.
// "export" means other files (like our test files) can import and use this class.
export class CartPage {
  
  // We declare a property called "page" of type Page.
  // This will hold a reference to the browser tab so our methods can interact with it.
  // "readonly" means this property can only be assigned once (in the constructor below)
  // and cannot be changed afterwards — this prevents accidental overwrites.
    readonly page: Page;

  // --- LOCATORS ---
  // Each locator below is a reference to a specific element on the cart page.
  // Think of locators as "bookmarks" to elements — Playwright won't actually
  // search for them in the DOM until you call an action like .click() or .innerText().

  // Matches every cart row (one row per item in the cart).
  // Useful when you want to count how many items are in the cart.
    readonly cartItems: Locator;

  // Matches the name text inside each cart row (e.g. "Sauce Labs Backpack").
  // Useful when you want to read or assert what item is in the cart.
    readonly cartItemNames: Locator;

  // Matches the quantity number inside each cart row (e.g. "1").
  // Useful if you ever want to assert the quantity of a specific item.
    readonly cartItemQuantities: Locator;

  // Matches the "Continue Shopping" button at the bottom of the cart page.
  // Clicking it navigates back to the inventory page.
    readonly continueShoppingButton: Locator;

  // Matches the "Checkout" button at the bottom of the cart page.
  // Clicking it starts the checkout flow.
    readonly checkoutButton: Locator;
    

  // --- CONSTRUCTOR ---
  // The constructor is a special method that runs automatically when you create
  // a new instance of this class (e.g. "new CartPage(page)" in a test file).
  // It receives the "page" object from the test and uses it to:
  //   1. Store the page reference for later use
  //   2. Assign every locator to its matching element on the page
    constructor(page: Page) {

    // Store the page reference so our methods below can use it.
    this.page = page;

    // page.locator() tells Playwright "find the element(s) matching this selector".
    // We use data-test attributes because they are stable — they won't change
    // if the CSS class or element tag changes. This makes tests more resilient.

    // Finds all elements with data-test="cart-item" (one per cart row).
    this.cartItems = page.locator('[data-test="inventory-item"]');

    // Finds all elements with data-test="inventory-item-name" inside the cart.
    // Note: this same attribute is also used on the inventory page — context matters.
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');

    // Finds all elements with data-test="item-quantity" (the "1" next to each item).
    this.cartItemQuantities = page.locator('[data-test="item-quantity"]');

    // Finds the "Continue Shopping" button by its data-test attribute.
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
       
    // Finds the "Checkout" button by its data-test attribute.
    this.checkoutButton = page.locator('[data-test="checkout"]');
    }

   // --- METHODS ---
   // Methods are the actions this page can perform.
   // Each method is "async" because Playwright actions interact with a real browser
   // and take time — "async/await" lets us wait for each action to finish
   // before moving to the next line.

   // Returns the number of items currently in the cart.
   // .count() returns a Promise<number> — a number that will be ready in the future.
   // We use "await" to pause and wait for that number before returning it.
   async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
   }

   // Returns the name of a cart item at a given position.
   // "index" is a number: 0 = first item, 1 = second item, etc.
   // .nth(index) picks the item at that position from the list of matching elements.
   // .innerText() reads the visible text content of that element.
   // Promise<string> means this method will eventually return a string.
   async getItemNameByIndex(index: number): Promise<string> {
    return await this.cartItemNames.nth(index).innerText();
   }

   // Clicks the "Continue Shopping" button.
   // This navigates the browser back to the inventory page.
   async continueShopping() {
    await this.continueShoppingButton.click();
   }

   // Clicks the "Checkout" button.
   // This starts the checkout flow (not used in today's tests, but ready for future use).
   async goToCheckout() {
    await this.checkoutButton.click();
   }
}