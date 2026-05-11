import { Page, Locator, expect } from '@playwright/test';
import { basePage } from './basePage';

export class checkoutPage extends basePage {
  // =========================
  // CART / SUMMARY
  // =========================
  readonly cartItemRows: Locator;
  readonly cartItemName: Locator;
  readonly cartItemQuantity: Locator;
  readonly cartRemoveButton: Locator;
  readonly cartTotal: Locator;

  // =========================
  // STEP BUTTONS
  // =========================
  readonly proceedToSignIn: Locator;
  readonly proceedToAddress: Locator;
  readonly proceedToCheckout: Locator;

  // =========================
  // BILLING ADDRESS
  // =========================
  readonly countryDropdown: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;

  // =========================
  // PAYMENT
  // =========================
  readonly paymentMethod: Locator;
  readonly bankNameInput: Locator;
  readonly accountNameInput: Locator;
  readonly accountNumberInput: Locator;
  readonly confirmOrderButton: Locator;

  // =========================
  // CONFIRMATION
  // =========================
  readonly successBanner: Locator;
  readonly orderConfirmationText: Locator;

  constructor(page: Page) {
    super(page);

    // =========================
    // CART
    // =========================
    this.cartItemRows = page.locator('.product');
    this.cartItemName = page.locator('[data-test="product-title"]');
    this.cartItemQuantity = page.locator('[data-test="product-quantity"]');
    this.cartRemoveButton = page.locator('a.btn.btn-danger');
    this.cartTotal = page.locator('[data-test="cart-total"]');

    // =========================
    // STEP BUTTONS
    // =========================
    this.proceedToSignIn = page.locator('[data-test="proceed-1"]');
    this.proceedToAddress = page.locator('[data-test="proceed-2"]');
    this.proceedToCheckout = page.locator('[data-test="proceed-3"]');

    // =========================
    // BILLING ADDRESS
    // =========================
    this.countryDropdown = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');

    // =========================
    // PAYMENT
    // =========================
    this.paymentMethod = page.locator('[data-test="payment-method"]');
    this.bankNameInput = page.locator('[data-test="bank_name"]');
    this.accountNameInput = page.locator('[data-test="account_name"]');
    this.accountNumberInput = page.locator('[data-test="account_number"]');
    this.confirmOrderButton = page.locator('[data-test="finish"]');

    // =========================
    // CONFIRMATION
    // =========================
    this.successBanner = page.locator('.alert-success');
    this.orderConfirmationText = page.locator('text=Thanks for your order');
  }

  async goto() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
}

  // =====================================================
  // STEP 1
  // =====================================================
  async proceedFromCart() {
    await expect(this.proceedToSignIn).toBeVisible();
    await this.proceedToSignIn.click();
  }

  // =====================================================
  // STEP 2
  // =====================================================
  async proceedFromLogin() {
    await expect(this.proceedToAddress).toBeVisible();
    await this.proceedToAddress.click();
  }

  // =====================================================
  // BILLING ADDRESS
  // =====================================================
  async fillBillingAddress() {
    await expect(this.countryDropdown).toBeVisible();

    await this.countryDropdown.selectOption('GB');
    await this.postalCodeInput.fill('SW1A1AA');
    await this.houseNumberInput.fill('10');
    await this.streetInput.fill('Downing Street');
    await this.cityInput.fill('London');
    await this.stateInput.fill('London');
  }

  // =====================================================
  // SUBMIT ADDRESS
  // =====================================================
  async completeCheckout() {
    await expect(this.proceedToCheckout).toBeEnabled();
    await this.proceedToCheckout.click();
  }

  // =====================================================
  // PAYMENT
  // =====================================================
    async fillPaymentDetails() {
    await expect(this.paymentMethod).toBeVisible();

    // Select the option (this handles the interaction)
    await this.paymentMethod.selectOption({ label: 'Bank Transfer' });

    // Ensure the specific bank fields are ready before typing
    await this.bankNameInput.waitFor({ state: 'visible' });
    
    await this.bankNameInput.fill('Barclays');
    await this.accountNameInput.fill('John Smith');
    await this.accountNumberInput.fill('12345678');
  }


  async confirmOrder() {
    await expect(this.confirmOrderButton).toBeEnabled();
    await this.confirmOrderButton.click();
  }

  // =====================================================
  // FULL FLOW
  // =====================================================
  async completeFullCheckoutFlow() {
    await this.proceedFromCart();
    await this.proceedFromLogin();

    await this.fillBillingAddress();
    await this.completeCheckout();

    await this.fillPaymentDetails();
    await this.confirmOrder();
  }

  // =====================================================
  // ASSERTIONS
  // =====================================================
  async verifyOrderSuccess() {
    await expect(
      this.successBanner.or(this.orderConfirmationText)
    ).toBeVisible();
  }

  async verifyCartHasItems() {
    await expect(this.cartItemRows.first()).toBeVisible();
  }

  async removeFirstCartItem() {
    await this.cartRemoveButton.first().click();
  }
}