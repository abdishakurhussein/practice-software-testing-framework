# Practice Software Testing Automation Framework - By Abdishakur Hussein

## Overview

This project is a Playwright and TypeScript automation framework for the Practice Software Testing demo shop, covering catalogue discovery, authentication, cart management, checkout, and invoice history through UI and API tests.

The framework validates functionality across two environments:

### Main Site

https://practicesoftwaretesting.com/

### Buggy Site

https://with-bugs.practicesoftwaretesting.com/

This framework aims to:

* Automate the provided user stories
* Validate both happy-path and negative scenarios
* Identify intentional defects in the buggy environment
* Produce a maintainable and scalable Playwright framework using TypeScript

---

# Environment Setup

Create two local environment files based on `.env.example`:

- `.env.main`
- `.env.buggy`

The files should contain the same variable names, with `BASE_URL` changed depending on the environment.

Example for `.env.main`:

```env
BASE_URL=https://practicesoftwaretesting.com
API_URL=https://api.practicesoftwaretesting.com
USER_EMAIL=<demo-account-email>
USER_PASSWORD=<demo-account-password>
```

Example for `.env.buggy`:

```env
BASE_URL=https://with-bugs.practicesoftwaretesting.com
API_URL=https://api.practicesoftwaretesting.com
USER_EMAIL=<demo-account-email>
USER_PASSWORD=<demo-account-password>
```

---

# Test Strategy & Approach

The framework was designed to prioritise:

- Maintainability through Page Object Model structure
- Readable and reusable locators
- Stable Playwright assertions
- Environment separation between stable and buggy systems
- Validation of both positive and negative user journeys
- Allowing genuine application defects to fail naturally

Where possible:

- Shared components were abstracted into base pages
- Assertions were written against user-visible behaviour
- Tests avoided unnecessary hardcoded waits
- Locators were based on stable `data-test` attributes

The user stories were grouped by functional area so that related journeys sit together in the test explorer.

## UI Test Grouping

- `tests/UI/1-landing-discovery-ui.spec.ts`
  - Covers Story 1: View Product List
  - Covers Story 3: Search for a Product
  - Covers Story 4: Filter Products by Category
  - Covers Story 10: Category Filtering and Reset

- `tests/UI/2-product-description-ui.spec.ts`
  - Covers Story 2: View Product Details

- `tests/UI/3-login-ui.spec.ts`
  - Covers Story 5: Login

- `tests/UI/4-cart-checkout-ui.spec.ts`
  - Covers Story 6: Add Product to Cart
  - Covers Story 7: Update or Remove from Cart
  - Covers Story 8: Complete Checkout
  - Covers Story 9: View Order History

## API Test Grouping

- `tests/API/1-product-discovery-api.spec.ts`
  - Supports product listing, product details, and product filtering/search-related coverage

- `tests/API/2-login-api.spec.ts`
  - Supports authentication coverage for valid and invalid login scenarios

- `tests/API/3-invoice-access-api.spec.ts`
  - Checks authenticated invoice listing and rejection of unauthenticated requests

The buggy environment intentionally exposes application defects.  
Where genuine defects were identified, tests were allowed to fail naturally and the issues were documented rather than bypassed through automation workarounds.

The main run still exercises the documented filter-persistence defect as an expected failure.

---

# Tech Stack

* Playwright
* TypeScript
* Node.js
* dotenv
* Playwright HTML Reporter

---

# Framework Design

The framework was designed using:

* Page Object Model (POM)
* Reusable base page abstractions
* Environment-based configuration
* Shared locators and utilities
* Separation of UI and API tests
* User-story-based test grouping

---

# Project Structure

```text
pages/
tests/
  ├── UI/
  └── API/
utilities/
```

---

# Installation

Install dependencies:

```bash
npm ci
npx playwright install chromium
```

---

# Quick Start

Run these commands from the repository root with Node.js 22. Use only
demo credentials and synthetic checkout data. Do not commit `.env.main`
or `.env.buggy`; only `.env.example` belongs in Git.

## Run Main Environment Tests

```bash
npm run test:main
```

For a run that does not create a demo order:

```bash
npm run test:main -- --grep-invert @purchase
```

## Run Buggy Environment Tests

```bash
npm run test:buggy
```

---

# Additional Commands

## Run Tests in Headed Mode

```bash
npm run test:main -- --headed
npm run test:buggy -- --headed
```

## Run a Specific Test File

```bash
npm run test:main -- tests/API/1-product-discovery-api.spec.ts
```

## Open Playwright HTML Report

```bash
npm run report
```

---

# API Coverage

The API suite validates backend functionality supporting the UI journeys, including:

* Product discovery endpoints
* Product detail retrieval
* Login authentication
* Authenticated invoice/order access
* Unauthenticated access rejection

---

# Known defects discovered during execution against the buggy environment are documented in:

```text
BUGS.md
```

---

# Notes

* The main environment treats the reproduced filter persistence issue (BUG-7) as an expected failure. If it starts passing, Playwright flags the unexpected pass so the annotation can be removed.
* The buggy environment intentionally contains defects and is expected to produce failing UI scenarios.
* API coverage was designed to complement UI coverage rather than duplicate every browser workflow.
* Checkout earns a browser journey because it crosses the cart, sign-in, payment and order history. The test matches the invoice generated in that run rather than accepting an existing invoice.
* Catalogue and authentication get focused API checks so failures can be isolated without repeating the whole UI journey.
* The buggy environment is used for defect demonstrations. See [BUGS.md](BUGS.md) for exploratory findings and user impact.
* CI runs a read-only catalogue API smoke check on the main demo environment. It does not submit purchases or run intentional defect scenarios. The public demo is an external dependency; CI uploads diagnostics when the smoke check fails.
