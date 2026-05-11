import { test, expect } from '@playwright/test';
import { config } from '../../utilities/env';

test.describe('Product Discovery API', () => {
  test('GET /products returns a populated product list', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/products`);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();

    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('id');
    expect(body.data[0]).toHaveProperty('name');
    expect(body.data[0]).toHaveProperty('price');
  });

  test('GET /products supports price range filtering', async ({ request }) => {
    const response = await request.get(`${config.apiUrl}/products`, {
        params: {
        page: '1',
        between: 'price,1,100',
        is_rental: 'false'
        }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.data.length).toBeGreaterThan(0);

    for (const product of body.data) {
        expect(product.price).toBeGreaterThanOrEqual(1);
        expect(product.price).toBeLessThanOrEqual(100);
        expect(product.is_rental).toBe(false);
    }
    });



  test('GET /products/{id} returns product details', async ({ request }) => {
    const listResponse = await request.get(`${config.apiUrl}/products`);
    expect(listResponse.status()).toBe(200);

    const listBody = await listResponse.json();
    const firstProduct = listBody.data[0];

    const detailResponse = await request.get(`${config.apiUrl}/products/${firstProduct.id}`);
    expect(detailResponse.status()).toBe(200);

    const detailBody = await detailResponse.json();

    expect(detailBody.id).toBe(firstProduct.id);
    expect(detailBody.name).toBeTruthy();
    expect(detailBody.price).toBeTruthy();
  });
});