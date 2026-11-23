import { test, expect } from '@playwright/test';
import { loginPage } from '../../pages/loginPage';
import { homePage } from '../../pages/homePage';
import { checkoutPage } from '../../pages/checkoutPage';
import { config } from '../../utilities/env';

test.describe('User Stories 6: Cart Management', () => {
    
        test.beforeEach(async ({ page }) => {
        const login = new loginPage(page);
        
        
        await login.goto();
        await expect(page).toHaveURL(/auth\/login/); 
        await login.login(config.userEmail, config.userPassword);
        // If the account is locked, it stays on /login, and this line will catch the bug!
        await expect(page).toHaveURL(/account/);
    });


    test('Add, Update, and Remove items from Cart', async ({ page }) => {
        const home = new homePage(page);
        const checkout = new checkoutPage(page);

        // --- Story 6: Add Product to Cart ---
        await page.goto('/');

        await expect(home.firstProductCard()).toBeVisible();
        const productName = config.purchaseProduct;
        
        await home.openProduct(productName);
        const addToCartBtn = page.locator('[data-test="add-to-cart"]');
        await addToCartBtn.click();
        await expect(checkout.cartIcon).toContainText('1');

        // --- Story 7: Update or Remove from Cart ---
        await checkout.goto();

        await expect(checkout.cartItemName).toContainText(productName);

        await expect(checkout.cartTotal).toHaveText(/\d/);
        const initialTotal = (await checkout.cartTotal.innerText()).trim();
        await checkout.cartItemQuantity.fill('2');
        await checkout.cartItemQuantity.press('Tab');

        await expect(checkout.cartItemQuantity).toHaveValue('2');
        await expect(checkout.cartTotal).not.toHaveText(initialTotal);
        await page.reload();
        await expect(checkout.cartItemQuantity).toHaveValue('2');

        await checkout.cartRemoveButton.click();

        await expect(page.getByText('The cart is empty. Nothing to display.')).toBeVisible();

        await expect(checkout.cartIcon).toBeHidden();

    });

        test('Purchase appears in order history @purchase', async ({ page }) => {
        const home = new homePage(page);
        const checkout = new checkoutPage(page);
        

        // 1. Story 8: Complete Checkout
        await page.goto('/');
        await home.openProduct(config.purchaseProduct);
        await page.locator('[data-test="add-to-cart"]').click();
        await expect(checkout.cartIcon).toContainText('1');
        
        await checkout.goto();
        await checkout.completeFullCheckoutFlow();
        const reference = await checkout.invoiceReference();

        // 2. Story 9: Order History
        // Click the user dropdown and select "My Orders"
        await page.locator('[data-test="nav-menu"]').click();
        await page.locator('[data-test="nav-my-account"]').click();

        await expect(page).toHaveURL(/account/);
        await page.locator('[data-test="nav-invoices"]').click();
        await expect(page).toHaveURL(/invoices/);


        // An older invoice on the shared demo account cannot satisfy this assertion.
        await expect(page.locator('tbody').getByRole('cell', { name: reference, exact: true })).toBeVisible();
    });

});
