// Import the Page and Locator types from the Playwright test library.
// Page represents the browser tab we are controlling.
// Locator is the type Playwright uses to reference a specific element on the page.
import { Page, Locator } from '@playwright/test';

// We define a class called ProductsPage.
// A class is a blueprint — it groups together all the elements and actions
// that belong to the inventory/products page in one reusable place.
// "export" means other files (like our test files) can import and use this class.
export class ProductsPage {

  // We declare a property called "page" of type Page.
  // This will hold a reference to the browser tab so our methods can interact with it.
  // "readonly" means this property can only be assigned once (in the constructor below)
  // and cannot be changed afterwards — this prevents accidental overwrites.
  readonly page: Page;

  // --- LOCATORS ---
  // Each locator below is a reference to a specific element on the products page.
  // Think of locators as "bookmarks" to elements — Playwright won't actually
  // search for them in the DOM until you call an action like .click() or .innerText().

  // --- Header / Navigation ---

  // Matches the cart icon in the top-right header.
  // Clicking it navigates to the cart page.
  readonly cartIcon: Locator;

  // Matches the orange badge that appears on the cart icon after adding an item.
  // This badge is hidden by default and only appears when the cart is not empty.
  readonly cartBadge: Locator;

  // --- Inventory ---

  // Matches the container element that wraps the entire product list.
  // Used to assert that the inventory page has loaded correctly.
  readonly inventoryList: Locator;

  // Matches every individual product card on the page.
  // Used to count how many products are displayed (should be 6 by default).
  readonly inventoryItems: Locator;

  // Matches the sort dropdown in the top-right of the inventory page.
  // Allows sorting products by name (A-Z, Z-A) or price (low-high, high-low).
  readonly sortDropdown: Locator;

  // --- First item for predictable test targeting ---
  // Rather than targeting a random item, we target the first item specifically.
  // .first() ensures we always get a single element, not the full list.
  // This makes assertions deterministic — we always know which item we are testing.

  // Matches the name text of the first product in the list.
  readonly firstItemName: Locator;

  // Matches the price text of the first product in the list.
  readonly firstItemPrice: Locator;

  // Matches the "Add to cart" button for the Sauce Labs Backpack specifically.
  // We target this item by name rather than by position because its data-test
  // attribute is unique and stable — this prevents the wrong item being added
  // if the sort order changes.
  readonly addBackpackToCart: Locator;

  // --- CONSTRUCTOR ---
  // The constructor is a special method that runs automatically when you create
  // a new instance of this class (e.g. "new ProductsPage(page)" in a test file).
  // It receives the "page" object from the test and uses it to:
  //   1. Store the page reference for later use
  //   2. Assign every locator to its matching element on the page
  constructor(page: Page) {

    // Store the page reference so our methods below can use it.
    this.page = page;

    // page.locator() tells Playwright "find the element(s) matching this selector".
    // We use data-test attributes because they are stable — they won't change
    // if the CSS class or element tag changes. This makes tests more resilient.

    // Finds the cart icon link in the header by its data-test attribute.
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');

    // Finds the cart badge by its data-test attribute.
    // This element only exists in the DOM when the cart has at least one item.
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Finds the inventory list container by its data-test attribute.
    this.inventoryList = page.locator('[data-test="inventory-list"]');

    // Finds all individual inventory item cards by their data-test attribute.
    // This returns a multi-element locator — all 6 product cards at once.
    this.inventoryItems = page.locator('[data-test="inventory-item"]');

    // Finds the sort dropdown by its data-test attribute.
    // .selectOption() will be called on this locator in the sortBy() method.
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Finds the name of the first product only.
    // .first() narrows the multi-element locator down to a single element,
    // which is required before calling .innerText().
    this.firstItemName = page.locator('[data-test="inventory-item-name"]').first();

    // Finds the price of the first product only.
    // Same reasoning as firstItemName — .first() prevents multi-element errors.
    this.firstItemPrice = page.locator('[data-test="inventory-item-price"]').first();

    // Finds the "Add to cart" button for the Sauce Labs Backpack specifically.
    // Each product has a unique data-test attribute on its button — this one
    // belongs exclusively to the backpack, making it unambiguous.
    this.addBackpackToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  }

  // --- METHODS ---
  // Methods are the actions this page can perform.
  // Each method is "async" because Playwright actions interact with a real browser
  // and take time — "async/await" lets us wait for each action to finish
  // before moving to the next line.

  // Selects a sort option from the dropdown.
  // "option" is a union type — it can only be one of these four exact string values:
  //   'az'   → Name (A to Z)
  //   'za'   → Name (Z to A)
  //   'lohi' → Price (low to high)
  //   'hilo' → Price (high to low)
  // These match the "value" attributes on the <option> elements in the dropdown,
  // not the visible display text.
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  // Clicks the "Add to cart" button for the Sauce Labs Backpack.
  // After this action, the cart badge should appear showing "1".
  async addItemToCart() {
    await this.addBackpackToCart.click();
  }

  // Clicks the cart icon to navigate to the cart page (/cart.html).
  async goToCart() {
    await this.cartIcon.click();
  }

  // Returns the current text shown on the cart badge (e.g. "1", "2").
  // Returns a string — not a number — because the DOM value is text.
  // We assert against "1" (string) in tests, not 1 (number).
  // Promise<string> means this method will eventually return a string value.
  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.innerText();
  }

  // Returns the total number of product cards currently visible on the page.
  // The default inventory has 6 items, so this should return 6 after login.
  // Promise<number> means this method will eventually return a number value.
  async getInventoryItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }
}