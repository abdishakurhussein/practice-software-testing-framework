import { Page, Locator } from '@playwright/test';
import { basePage } from './basePage';

export class loginPage extends basePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        super(page); // Inherit Navbar elements like navHome and cartIcon
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginBtn = page.locator('[data-test="login-submit"]');
        this.errorMessage = page.locator('[data-test="login-error"]');
    }

    async goto() {
        await this.page.goto('/');
        await this.page.locator('[data-test="nav-sign-in"]').click();

        // Wait until login form is ready
        await this.emailInput.waitFor({ state: 'visible' });
    }


    async login(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginBtn.click();
    }
}
