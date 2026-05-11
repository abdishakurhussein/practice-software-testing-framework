import { test, expect } from '@playwright/test';
import { config } from '../../utilities/env';

test.describe('Login API', () => {
  test('POST /users/login returns access token for valid credentials', async ({ request }) => {
    const response = await request.post(`${config.apiUrl}/users/login`, {
      data: {
        email: config.userEmail,
        password: config.userPassword
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.access_token).toBeTruthy();
  });

  test('POST /users/login rejects invalid credentials', async ({ request }) => {
    const response = await request.post(`${config.apiUrl}/users/login`, {
      data: {
        email: 'fake@user.com',
        password: 'wrongpassword'
      }
    });

    expect([401, 422]).toContain(response.status());
  });
});