import { Page, Locator } from '@playwright/test';
import { basePage } from './basePage';

export class productPage extends basePage {
    readonly productName: Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly productImage: Locator;
    readonly addToCartBtn: Locator;

    constructor(page: Page) {
        super(page);
        // Using data-test attributes as they are the most stable
        this.productName = page.locator('[data-test="product-name"]');
        this.productDescription = page.locator('[data-test="product-description"]');
        this.productPrice = page.locator('[data-test="unit-price"]');
        this.productImage = page.locator('.figure-img'); 
        this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
    }
}