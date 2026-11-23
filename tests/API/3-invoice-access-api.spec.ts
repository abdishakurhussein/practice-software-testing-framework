import { test, expect } from '@playwright/test';
import { config } from '../../utilities/env';

test.describe('Invoice access API', () => {
  test('Authenticated user can list invoices', async ({ request }) => {
    const login = await request.post(`${config.apiUrl}/users/login`, {
      data: { email: config.userEmail, password: config.userPassword }
    });
    expect(login.status()).toBe(200);
    const { access_token: token } = await login.json();
    expect(token).toEqual(expect.any(String));
    expect(token).not.toBe('');

    const response = await request.get(`${config.apiUrl}/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).data).toEqual(expect.any(Array));
  });

  test('Unauthenticated requests cannot list invoices', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/invoices`);
    expect(response.status()).toBe(401);
  });
});
