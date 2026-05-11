import { Page, Locator, expect } from '@playwright/test';
import { config } from '../utilities/env';



export class basePage {
    readonly page: Page;
    // Global locators that are common across all pages
    readonly navHome: Locator;
    readonly navSignIn: Locator;
    readonly navContact: Locator;
    readonly navMenu: Locator;
    readonly cartIcon: Locator;
    //Toast Locators
    readonly toastContainer: Locator;
    readonly toastMessage: Locator;

    constructor(page: Page) {
        
        this.page = page;
        // Global elements found on every page
        this.navHome = page.locator('[data-test="nav-home"]');
        this.navSignIn = page.locator('[data-test="nav-sign-in"]');
        this.navContact = page.locator('[data-test="nav-contact"]');
        this.navMenu = page.locator('[data-test="nav-menu"]');
        this.cartIcon = page.locator('[data-test="nav-cart"]');
        
        // Locators based on your HTML snippet
        this.toastContainer = page.locator('.ngx-toastr');
        this.toastMessage = page.locator('.toast-message');
    }

    async goToSignIn() {
        await this.navSignIn.click();
    }

    async clickNavHome() {
        await this.navHome.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verifies a success toast appears with specific text
     */
    async verifySuccessToast(message: string) {
        const toast = this.page.getByRole('alert');
        await expect(toast).toBeVisible();
        await expect(toast).toHaveClass(/bg-success|toast/);
        if (message) {
            await expect(toast).toContainText(message);
        }
    }

    /**
     * Verifies an error toast appears with specific text
     */
    async verifyErrorToast(message: string) {
        const toast = this.page.getByRole('alert');
        await expect(toast).toBeVisible();
        await expect(toast).toHaveClass(/bg-danger|text-light|toast/);
        if (message) {
            await expect(toast).toContainText(message);
        }
    }

    /**
     * Optional: Helper to wait for toasts to disappear if they block other elements
     */
    async waitForToastToHide() {
        await this.toastContainer.waitFor({ state: 'hidden' });
    }
}
