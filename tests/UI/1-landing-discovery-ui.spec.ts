import { test, expect } from '@playwright/test';
import { homePage } from '../../pages/homePage';

test.describe('Landing Discovery UI', () => {
  let home: homePage;

  test.beforeEach(async ({ page }) => {
    home = new homePage(page);

    // Use your existing baseURL config
    await page.goto('/');

    // Wait for products to load
    await expect(home.firstProductCard()).toBeVisible();
  });

  // =====================================================
  // USER STORY 1
  // Product Listing / Navigation / Pagination
  // =====================================================
  test('View Product List', async ({ page }) => {
    const productCount = await home.products().count();
    expect(productCount).toBeGreaterThan(0);

    await expect(home.firstProductTitle()).toBeVisible();
    await expect(home.firstProductImage()).toBeVisible();
    await expect(home.firstProductPrice()).toBeVisible();

    // Open first product
    const firstTitle = await home.firstProductTitle().textContent();

    await home.firstProductTitle().click();

    await expect(page).toHaveURL(/\/product\//);

    // Return home
    await home.navHome.click();

    // Validate home navigation before testing pagination
    await expect(home.firstProductCard(),'Home navigation should return to product listing page').toBeVisible();

    // Scroll to footer
    await page.locator('app-footer').scrollIntoViewIfNeeded();

    // Pagination next
    await expect(home.clickNext()).toBeVisible();

    await home.clickNext().click();

    await expect(home.firstProductTitle()).not.toHaveText(firstTitle!);

    // Pagination previous
    await home.clickPrevious().click();

    await expect(home.firstProductTitle()).toHaveText(firstTitle!);
  });

  // =====================================================
  // USER STORY 3
  // Search
  // =====================================================
  test('Search Functionality', async () => {
    // Positive search
    await home.searchBar().fill('Thor Hammer');
    await home.searchButton().click();

    await expect(
      home.products().locator('.card-title', { hasText: 'Thor Hammer' }).first()
    ).toBeVisible();

    // Clear search
    await home.searchBar().fill('');
    await home.searchButton().click();

    // Negative search
    await home.searchBar().fill('NonExistentProduct123');
    await home.searchButton().click();

    await expect(home.noResultsMessage()).toBeVisible();
  });

  // =====================================================
  // USER STORY 4
  // Filter by Category
  // =====================================================
  test('Filter Products by Category', async ({ page }) => {
    const handToolsCheckbox = page.getByLabel('Hand Tools');

    await handToolsCheckbox.check();

    await expect(handToolsCheckbox).toBeChecked();

    const lastPage = page.locator('.pagination a[aria-label^="Page-"]').last();

    await expect(lastPage).toHaveText('3');

    // Reset filters
    await home.clearSearchFilter().click();

    await expect(lastPage).toHaveText('5');

    // Negative path
    const grinderCheckbox = page.getByLabel('Grinder');

    await grinderCheckbox.check();

    await expect(home.noResultsMessage()).toBeVisible();
  });

  // =====================================================
  // USER STORY 10
  // Filter Persistence Bug Capture
  // =====================================================
  test('Category Filtering and Reset', async ({ page }) => {
    const handToolsCheckbox = page.getByLabel('Hand Tools');

    await handToolsCheckbox.check();

    const lastPage = page.locator('.pagination a[aria-label^="Page-"]').last();

    await expect(lastPage).toHaveText('3');

    // Refresh page
    await page.reload();

    // Known bug intentionally captured
    await expect(
      handToolsCheckbox,
      'Filter should persist after refresh'
    ).toBeChecked();

    // Reset
    await home.clearSearchFilter().click();

    await expect(handToolsCheckbox).not.toBeChecked();

    await expect(lastPage).toHaveText('5');
  });
});