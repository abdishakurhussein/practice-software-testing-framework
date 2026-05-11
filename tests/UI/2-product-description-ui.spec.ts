import { test, expect } from '@playwright/test';
import { homePage } from '../../pages/homePage';
import { productPage } from '../../pages/productPage';

//User Story 2: View Product Details
//Goal: As a visitor, I want to click on a product from the listing and be taken to a details page that displays the correct information about the product, so that I can learn more about it before making a purchase decision.
test.describe('User Story 2: View Product Details', () => {
    //// HAPPY PATH \\\\
    test('Positive: Display correct product information', async ({ page }) => {
        const home = new homePage(page);
        const product = new productPage(page);

        // 2a. Go to home and click the first product
        await home.goto();
        const expectedTitle = await home.firstProductTitle().textContent();
        await home.firstProductCard().click();

        // 2b. Assertions on the details page
        await expect(page).toHaveURL(/product/);
        await expect(product.productName).toHaveText(expectedTitle || '');
        await expect(product.productDescription).not.toBeEmpty();
        await expect(product.productPrice).toBeVisible();
        await expect(product.productImage).toBeVisible();
        
        // 2c. Assert "Add to Cart" button is visible and enabled
        await expect(product.addToCartBtn).toBeVisible();
        await expect(product.addToCartBtn).toBeEnabled();
    });
    
    test('User Story 2: View Product Details - Negative: Visitor cannot add product to favorites as a visitor', async ({ page }) => {
        //// ERROR PATH \\\\
        const product = new productPage(page);
        const home = new homePage(page);

        // 2d. Go to a product as a guest
        await home.goto();
        await home.firstProductCard().click();

        // 2e. Try to add to favorites
        await page.locator('[data-test="add-to-favorites"]').click();

        // 2f. Assert the red toast error message appears using the reusable component
        await product.verifyErrorToast('Unauthorized, can not add product to your favorite list.');
    });
});