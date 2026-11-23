import { Page, Locator, expect } from '@playwright/test';
import { basePage } from './basePage';
import { billingAddress } from '../utilities/testData';

export class checkoutPage extends basePage {

  readonly cartItemRows: Locator;
  readonly cartItemName: Locator;
  readonly cartItemQuantity: Locator;
  readonly cartRemoveButton: Locator;
  readonly cartTotal: Locator;

  readonly proceedToSignIn: Locator;
  readonly proceedToAddress: Locator;
  readonly proceedToCheckout: Locator;

  readonly countryDropdown: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;

  readonly paymentMethod: Locator;
  readonly bankNameInput: Locator;
  readonly accountNameInput: Locator;
  readonly accountNumberInput: Locator;
  readonly checkPaymentOrderButton: Locator;
  readonly confirmOrderButton: Locator;

  readonly successBanner: Locator;
  readonly orderConfirmationText: Locator;

  constructor(page: Page) {
    super(page);
    
    this.cartItemRows = page.locator('.product');
    this.cartItemName = page.locator('[data-test="product-title"]');
    this.cartItemQuantity = page.locator('[data-test="product-quantity"]');
    this.cartRemoveButton = page.locator('a.btn.btn-danger');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    
    this.proceedToSignIn = page.locator('[data-test="proceed-1"]');
    this.proceedToAddress = page.locator('[data-test="proceed-2"]');
    this.proceedToCheckout = page.locator('[data-test="proceed-3"]');

    this.countryDropdown = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    
    this.paymentMethod = page.locator('[data-test="payment-method"]');
    this.bankNameInput = page.locator('[data-test="bank_name"]');
    this.accountNameInput = page.locator('[data-test="account_name"]');
    this.accountNumberInput = page.locator('[data-test="account_number"]');
    this.checkPaymentOrderButton = page.getByRole('button', { name: 'Check payment' });
    this.confirmOrderButton = page.getByRole('button', { name: 'Confirm' });

    this.successBanner = page.getByText('Payment was successful', { exact: true });
    this.orderConfirmationText = page.getByText(/Thanks for your order/i);
  }

  async goto() {
    await this.cartIcon.click();
    await expect(this.cartItemName.first()).toBeVisible();
}

  
  async proceedFromCart() {
    await expect(this.proceedToSignIn).toBeVisible();
    await this.proceedToSignIn.click();
  }

  
  async proceedFromLogin() {
    await expect(this.proceedToAddress).toBeVisible();
    await this.proceedToAddress.click();
  }

  async fillBillingAddress() {
  const { countryCode, postalCode, houseNumber, street, city, state } =
    billingAddress;

  await this.countryDropdown.selectOption({ value: countryCode });
  await this.postalCodeInput.fill(postalCode);
  await this.houseNumberInput.fill(houseNumber);
  await this.houseNumberInput.press('Tab');

  await expect(this.streetInput).toHaveValue(street);
  await expect(this.cityInput).toHaveValue(city);

  await this.stateInput.fill(state);
  await this.stateInput.press('Tab');
  await expect(this.stateInput).toHaveValue(state);
}

  async completeCheckout() {
    await expect(this.proceedToCheckout).toBeEnabled();
    await this.proceedToCheckout.click();
  }

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

  async checkPaymentOrder() {
    await expect(this.checkPaymentOrderButton).toBeEnabled();
    await this.checkPaymentOrderButton.click();
  }
  
  async confirmOrder(): Promise<void> {
  const [response] = await Promise.all([
    this.page.waitForResponse(
      (r) =>
        r.request().method() === 'POST' &&
        new URL(r.url()).pathname.endsWith('/invoices'),
    ),
    this.confirmOrderButton.click(),
  ]);

    if (!response.ok()) {
      throw new Error(
        `Order submission failed (${response.status()}): ${await response.text()}`,
      );
    }
  }

  async completeFullCheckoutFlow() {
    await this.proceedFromCart();
    await this.proceedFromLogin();

    await this.fillBillingAddress();
    await this.completeCheckout();

    await this.fillPaymentDetails();
    await this.checkPaymentOrder();
    await this.confirmOrder();
  }

  async invoiceReference(): Promise<string> {
  await expect(this.orderConfirmationText).toContainText(/INV-[\w-]+/i);

  const reference = (await this.orderConfirmationText.innerText())
    .match(/INV-[\w-]+/i)?.[0];

  if (!reference) {
    throw new Error('Order confirmation did not contain an invoice reference.');
  }

  return reference;
}

  async verifyCartHasItems() {
    await expect(this.cartItemRows.first()).toBeVisible();
  }

  async removeFirstCartItem() {
    await this.cartRemoveButton.first().click();
  }
}
