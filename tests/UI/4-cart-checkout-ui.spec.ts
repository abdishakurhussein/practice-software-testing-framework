import { test, expect } from '@playwright/test';
import { loginPage } from '../../pages/loginPage';
import { homePage } from '../../pages/homePage';
import { checkoutPage } from '../../pages/checkoutPage';
import { config } from '../../utilities/env';

test.describe('User Stories 6: Cart Management', () => {
    
        test.beforeEach(async ({ page }) => {
        const login = new loginPage(page);
        
        // 1. Go to login page
        await login.goto();
        // (Optional) Verify we are at login BEFORE we type
        await expect(page).toHaveURL(/auth\/login/); 

        // 2. Perform the login action
        await login.login(config.userEmail, config.userPassword);

        // 3. Verify SUCCESS - we should be redirected AWAY from login
        // If the account is locked, it stays on /login, and this line will catch the bug!
        await expect(page).toHaveURL(/account/);
    });


    test('Add, Update, and Remove items from Cart', async ({ page }) => {
        const home = new homePage(page);
        const checkout = new checkoutPage(page);

        // --- Story 6: Add Product to Cart ---
        await page.goto('/');
        
        // Wait for products and grab the title of the first item
        await expect(home.firstProductCard()).toBeVisible();
        const productName = await home.firstProductTitle().textContent() || 'Unknown Product';
        
        // Click into the product and add to cart
        await home.firstProductCard().click();
        const addToCartBtn = page.locator('[data-test="add-to-cart"]');
        await addToCartBtn.click();
        
        // AC: Cart counter in navbar updates
        // Note: cartBadge should be defined in your basePage or checkoutPage
        await expect(checkout.cartIcon).toContainText('1');

        // --- Story 7: Update or Remove from Cart ---
        await checkout.goto();

        // AC: Product appears in the checkout summary
        await expect(checkout.cartItemName).toContainText(productName);

        // AC: Increase quantity by filling the input field
        // We use fill('2') to simulate a user typing a higher number
        await checkout.cartItemQuantity.fill('2');

        // AC: Verify the value updated in the input field
        await expect(checkout.cartItemQuantity).toHaveValue('2');

        // AC: Remove item from cart
        await checkout.cartRemoveButton.click();

        // AC: Verify "Empty Cart" state
        // Using the exact text found in your HTML snippet
        await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();

        // Assert that the cart icon/badge is hidden or removed from the navbar
        // Since the snapshot shows it's missing from the menubar, we check for hidden state
        await expect(checkout.cartIcon).toBeHidden();

    });

        test('User Stories 8 & 9: Full Purchase Journey', async ({ page }) => {
        const home = new homePage(page);
        const checkout = new checkoutPage(page);
        

        // 1. Story 8: Complete Checkout
        await page.goto('/');
        await home.firstProductCard().click();
        await page.locator('[data-test="add-to-cart"]').click();
        await expect(checkout.cartIcon).toContainText('1');
        
        await checkout.goto();
        await checkout.completeFullCheckoutFlow();
        await checkout.verifyOrderSuccess();

        // 2. Story 9: Order History
        // Click the user dropdown and select "My Orders"
        await page.locator('[data-test="nav-menu"]').click();
        await page.locator('[data-test="nav-my-account"]').click();

        // ASSERT: Verify URL contains 'my-orders'
        await expect(page).toHaveURL(/account/);

        //Click on Invoices tab to view past orders
        await page.locator('[data-test="nav-invoices"]').click();
        await expect(page).toHaveURL(/invoices/);


        // ASSERT: Verify the order table has at least one row
        // The site uses data-test="order-number" or similar for cells
        const firstInvoiceRow = page.locator('table tbody tr').filter({ hasText: 'INV-' }).first();
        await expect(firstInvoiceRow).toBeVisible();
    });

});
