# Defect Tracking Report

## Overview

This document contains defects identified during automated and exploratory testing of the Practice Software Testing application across both the main and intentionally buggy environments.

The defects below were discovered while validating product discovery, authentication, cart management, checkout and filtering functionality through Playwright UI automation and API testing.

Each defect includes:

* Environment impacted
* Related functional area
* Reproduction steps
* Expected behaviour
* Actual behaviour
* Technical observations
* Business impact

## Bug 1: Home navigation routes to Contact page

Environment: Buggy site
Related User Story: User Story 1 – View Product List

### Steps to Reproduce

1. Open the product listing homepage.
2. Open a product detail page.
3. Click the "Home" navigation link.

### Expected Behaviour

The user should be returned to the homepage/product listing page.

### Actual Behaviour

The user is redirected to the Contact page instead.

### Technical Observation

The "Home" navigation link points to `#/contact` on the buggy environment.

### Impact

Users cannot reliably return to the product listing page, preventing access to pagination and browsing functionality.


## Bug 2: No-results message missing after invalid product search

Environment: Buggy site
Related User Story: User Story 3 – Search for a Product

### Steps to Reproduce

1. Open the product listing page.
2. Search for a non-existent product, e.g. `NonExistentProduct123`.
3. Submit the search.

### Expected Behaviour

A clear no-results message should be displayed to the user.

### Actual Behaviour

No no-results message is rendered after the invalid search.

### Technical Observation

The expected locator:

```text
[data-test="no-results"]
```

is not present on the page after the search completes.

### Impact

Users receive no clear feedback indicating that the search returned zero matching products.

## Bug 3: Hand Tools category filter is missing

Environment: Buggy site
Related User Story: User Story 4 – Filter Products by Category

### Steps to Reproduce

1. Open the product listing page.
2. Locate the category filter section.
3. Attempt to select the `Hand Tools` category filter.

### Expected Behaviour

The `Hand Tools` category filter should be displayed and selectable so users can filter the product list by category.

### Actual Behaviour

The `Hand Tools` checkbox/filter option is not present on the buggy environment.

### Impact

Users cannot filter products by the `Hand Tools` category, which breaks the category filtering acceptance criteria.

## Bug 4: Logged-in user's name is not displayed in navigation

Environment: Buggy site
Related User Story: User Story 5 – Login

### Steps to Reproduce

1. Navigate to the login page.
2. Log in with valid customer credentials.
3. Observe the account page and navigation menu.

### Expected Behaviour

After a successful login, the user's name should be displayed in the navigation menu, confirming the active authenticated session.

### Actual Behaviour

The user is redirected to the account page, but the navigation menu displays `User Data not found` instead of the logged-in user's name.

### Impact

The application does not clearly identify the logged-in user, which breaks the login acceptance criteria and may confuse users about whether their session has loaded correctly.

## Bug 5: Removing an item from the cart does not update the cart

Environment: Buggy site
Related User Story: User Story 7 – Update or Remove from Cart

### Steps to Reproduce

1. Log in as a registered user.
2. Add a product to the cart.
3. Navigate to the cart/checkout page.
4. Update the product quantity.
5. Click the remove button for the cart item.

### Expected Behaviour

The selected cart item should be removed from the cart. The cart should show the empty-cart message and the cart counter should update accordingly.

### Actual Behaviour

Clicking the remove button does not remove the item. The product remains visible in the cart and the empty-cart message is not displayed.

### Technical Observation

The test expects the empty cart message:

```text
The cart is empty. Nothing to display.
```

but the cart table still displays the product row after the remove action.

### Impact

Users cannot remove unwanted items from the cart, preventing them from managing their purchase before checkout.

## Bug 6: Country field is rendered as a text input instead of a dropdown during checkout

Environment: Buggy site
Related User Story: User Story 8 – Complete Checkout

### Steps to Reproduce

1. Log in as a registered user.
2. Add a product to the cart.
3. Navigate through the checkout flow to the billing address step.
4. Observe the country field.

### Expected Behaviour

The country field should be rendered as a selectable dropdown so the user can choose a valid country during checkout.

### Actual Behaviour

The country field is rendered as a text input instead of a `<select>` dropdown. Attempting to select a country option fails because the element is not a dropdown.

### Technical Observation

The locator `[data-test="country"]` resolves to an `<input>` element rather than a `<select>` element.

Observed failure:

```text
locator.selectOption: Element is not a <select> element
```

### Impact

The checkout flow cannot be completed as expected, preventing users from progressing through address/payment details and completing an order.


## Bug 7: Category filter state does not persist after page refresh

Environment: Main site and Buggy site
Related User Story: User Story 10 – Category Filtering and Reset

### Steps to Reproduce

1. Open the product listing page.
2. Select the `Hand Tools` category filter.
3. Confirm the product list updates.
4. Refresh the page.
5. Observe the selected filter state.

### Expected Behaviour

The selected category filter should persist after refreshing the page, as required by the User Story 10 acceptance criteria.

### Actual Behaviour

After refreshing the page, the `Hand Tools` checkbox is no longer selected.

### Technical Observation

The checkbox locator resolves successfully, but its state changes from checked to unchecked after refresh.

Observed failure:

```text
Filter should persist after refresh
expect(locator).toBeChecked() failed
Expected: checked
Received: unchecked
```

### Impact

Users lose their selected filter state after refreshing the page, which breaks the expected browsing/filtering experience.
