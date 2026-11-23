import { Page } from '@playwright/test'; // 1. Must import the Page type
import { basePage } from "./basePage";
import { config } from '../utilities/env';

export class homePage extends basePage {

    constructor(page: Page) {
        super(page); 
    }

    async goto() {
        await this.page.goto(config.baseUrl || '/');
    }

    products() {
        
        return this.page.locator('.card:not(.skeleton)');
    }
    clickNext() {
        return this.page.getByRole('button', { name: 'Next', exact: true })
            .or(this.page.getByRole('link', { name: 'Next', exact: true }));
    }
        clickPrevious() {
        return this.page.getByRole('button', { name: 'Previous', exact: true })
            .or(this.page.getByRole('link', { name: 'Previous', exact: true }));
        }

    

    searchBar() {
        return this.page.locator('[data-test="search-query"]');
    }

    searchButton() {
        return this.page.locator('[data-test="search-submit"]');
    }

    clearSearchFilter() {
        return this.page.locator('[data-test="search-reset"]');
    }

    noResultsMessage() {
        return this.page.locator('[data-test="no-results"]');
    }

    searchResultCount() {
        return this.page.locator('[data-test="search-result-count"]');
    }

    firstProductCard() {
    return this.products().first();
    }

    async openProduct(name: string) {
        await this.goto();
        await this.searchBar().fill(name);
        await this.searchButton().click();
        await this.products().filter({
            has: this.page.getByText(name, { exact: true })
        }).click();
    }

    // These methods "reach inside" the first card
    firstProductTitle() {
        return this.firstProductCard().locator('.card-title');
    }

    firstProductImage() {
        return this.firstProductCard().locator('.card-img-top');
    }

    firstProductPrice() {
        return this.firstProductCard().locator('[data-test="product-price"]');
    }
    
}
