import { test, expect } from '@playwright/test';
import { loginPage } from '../../pages/loginPage';
import { config } from '../../utilities/env';


//User Story 5: Login
//Goal: As a user, I want to be able to log in to my account so that I can access my personalized features and information.
test.describe('User Story 5: Login', () => {
        //// HAPPY PATH \\\\
        test('Positive: Valid credentials allow successful login', async ({ page }) => {
        const login = new loginPage(page);

        await login.goto();
        await login.login(config.userEmail, config.userPassword);

        await expect(page.getByText('Jack Howe')).toBeVisible();
        await expect(page.getByRole('heading', { name: /my account/i })).toBeVisible();
    });

    //// NEGATIVE PATH \\\\
    test('Negative: Invalid credentials display error message', async ({ page }) => {
        const login = new loginPage(page);
        await login.goto();

        // 5d: Invalid credentials show appropriate error
        await login.login('fake@user.com', 'wrongpassword');
        // 5e: Assert error message is visible and contains expected text
        await expect(login.errorMessage).toBeVisible();
        // 5f: Assert the error message text is correct
        await expect(login.errorMessage).toContainText('Invalid email or password');
    });
    //// PERSISTENCE PATH \\\\
    test('Persistence: Login persists during navigation', async ({ page }) => {
        const login = new loginPage(page);

        await login.goto();
        await login.login(config.userEmail, config.userPassword);

        await expect(page.getByRole('heading', { name: /my account/i })).toBeVisible();

        await page.getByRole('link', { name: /contact|contakt/i }).click();

        await page.getByText(/user data not found|jack howe/i).click();
        await page.getByRole('link', { name: /^My account$/i }).click();

        await expect(page.getByRole('heading', { name: /my account/i })).toBeVisible();
        await expect(page).not.toHaveURL(/auth\/login/);
    });
});
