import { test, expect } from '@playwright/test';
import { config } from '../../utilities/env';

test.describe('Cart / Checkout API', () => {
  let token: string;

  test.beforeEach(async ({ request }) => {
    const loginResponse = await request.post(`${config.apiUrl}/users/login`, {
      data: {
        email: config.userEmail,
        password: config.userPassword
      }
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    token = loginBody.access_token;
    expect(token).toBeTruthy();
  });

  test('GET /products provides product data required for cart flow', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/products`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const firstProduct = body.data[0];

    expect(firstProduct.id).toBeTruthy();
    expect(firstProduct.name).toBeTruthy();
    expect(firstProduct.price).toBeGreaterThan(0);
    expect(firstProduct.in_stock).toBeDefined();
  });

  test('Authenticated user can access their invoices/orders endpoint', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/invoices`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect([200, 204]).toContain(response.status());
  });

  test('Unauthenticated request to invoices/orders endpoint is rejected', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/invoices`);

    expect([401, 403]).toContain(response.status());
  });
});