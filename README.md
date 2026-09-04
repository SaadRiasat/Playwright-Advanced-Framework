# 🎭 SauceDemo Playwright QA Automation Framework

A professional, production-ready end-to-end QA automation framework built with **Playwright** and **JavaScript (ES Modules)** targeting [SauceDemo](https://www.saucedemo.com) — a reference e-commerce application used for QA training.

---

## 🌟 Key Features

| Feature | Details |
|---------|---------|
| **Page Object Model** | Clean separation between test logic and page interactions |
| **Data-Driven Testing** | All users and test data centralised in `utils/userData.js` |
| **Dynamic Multi-User Testing** | Single loop tests all 6 SauceDemo users |
| **PDF Download + Validation** | Automates order PDF download and validates content with `pdf-parse` |
| **Sorting Verification** | A→Z, Z→A, Price Low→High, High→Low with real array assertions |
| **Negative Test Coverage** | Invalid logins, empty checkout fields with exact error assertions |
| **Known Defect Documentation** | `problem_user` / `error_user` defects documented as expected failures |
| **Playwright HTML Report** | Rich report with screenshots, videos, traces, and PDF attachments |

---

## 🛠️ Technology Stack

- **Automation Tool:** [Playwright](https://playwright.dev) v1.62+
- **Language:** JavaScript ES Modules (Node.js)
- **PDF Parser:** [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
- **Target App:** [SauceDemo](https://www.saucedemo.com)

---

## 📁 Project Structure

```
PlayerighAutomation/
│
├── pages/                        # Page Object Model classes
│   ├── LoginPage.js              # Login form interactions
│   ├── InventoryPage.js          # Product listing, sorting, cart badge
│   ├── CartPage.js               # Cart page interactions
│   ├── CheckoutPage.js           # Checkout step one + overview
│   ├── ThankYouPage.js           # Order confirmation + PDF download
│   └── NavigationPage.js         # Burger menu, logout, reset
│
├── tests/                        # Test specifications
│   ├── Login.spec.js             # All 6 users + invalid credentials
│   ├── inventory.spec.js         # Products, sorting, images
│   ├── cart.spec.js              # Add/remove, cart validation
│   ├── checkout.spec.js          # Negative + positive checkout
│   ├── e2e-pom.spec.js           # Full E2E flow with logout
│   ├── multiUserTesting.spec.js  # User-specific behaviour
│   └── checkoutPdf.spec.js       # PDF download + content validation
│
├── utils/                        # Utilities and test data
│   ├── userData.js               # User profiles, checkout data, scenarios
│   └── pdfHelper.js              # PDF parsing utility
│
├── downloads/                    # Downloaded PDF receipts (gitignored)
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone https://github.com/SaadRiasat/Playwright-Advanced-Framework.git
cd Playwright-Advanced-Framework

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ▶️ Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless, parallel) |
| `npm run test:headed` | Run all tests with visible browser |
| `npm run test:single` | Run all tests with 1 worker (sequential) |
| `npm run test:debug` | Run in Playwright Inspector (debug mode) |
| `npm run test:ui` | Run in Playwright UI mode (time-travel) |
| `npm run test:report` | Open the last HTML report |

### Run a specific test file

```bash
npx playwright test tests/Login.spec.js
npx playwright test tests/e2e-pom.spec.js --headed
npx playwright test tests/checkoutPdf.spec.js --workers=1
```

### Run a specific test by title

```bash
npx playwright test -g "standard_user"
npx playwright test -g "locked_out_user"
```

### View the HTML Report

```bash
npx playwright show-report
```

---

## 👤 SauceDemo User Accounts

| Username | Password | Expected Behaviour |
|----------|----------|--------------------|
| `standard_user` | `secret_sauce` | ✅ Login succeeds, normal behaviour |
| `locked_out_user` | `secret_sauce` | ❌ Login rejected — **expected negative test (PASS)** |
| `problem_user` | `secret_sauce` | ✅ Login succeeds — **broken images + checkout defects** |
| `performance_glitch_user` | `secret_sauce` | ✅ Login succeeds — **intentional login/load delay** |
| `error_user` | `secret_sauce` | ✅ Login succeeds — **cannot complete checkout** |
| `visual_user` | `secret_sauce` | ✅ Login succeeds — **visual/layout anomalies** |

---

## 📋 Test Scenarios

### Login Tests (`Login.spec.js`)
- Dynamic login test for all 6 users in a single loop
- `locked_out_user` → asserts exact error message (PASS)
- Invalid username / invalid password / empty fields / both empty

### Inventory Tests (`inventory.spec.js`)
- Products title, count (6), names, prices, images, add-to-cart buttons
- Sort A→Z, Z→A, Price Low→High, Price High→Low (with order verification)
- Image validation for `standard_user`, `problem_user`, `visual_user`

### Cart Tests (`cart.spec.js`)
- Add 1 product, multiple products, all 6 products
- Verify cart badge count
- Verify product names and prices in cart
- Remove item — badge updates
- Remove all items — badge disappears
- Continue Shopping returns to inventory

### Checkout Tests (`checkout.spec.js`)
- ❌ Empty first name → exact error assertion
- ❌ Empty last name → exact error assertion
- ❌ Empty postal code → exact error assertion
- ❌ All empty → exact error assertion
- ✅ Valid data (Saad / Riasat / 74800) → overview → product/price/tax/total
- ✅ Finish → Thank You page

### E2E Flow (`e2e-pom.spec.js`)
Login → Sort → Add Products → Verify Cart → Checkout → Overview → Finish → Thank You → **Logout**

### Multi-User Testing (`multiUserTesting.spec.js`)
- All 6 users tested for their specific known behaviour
- `problem_user` defects documented with screenshots
- `error_user` defect annotated
- `performance_glitch_user` with 30s timeout
- `visual_user` with screenshot evidence

### PDF Testing (`checkoutPdf.spec.js`)
Complete order flow + PDF download → validates:
- `Swag Labs` · `Order Receipt`
- `Saad Riasat` · `74800`
- `Sauce Labs Backpack` · `$29.99` · `$32.39`
- PDF attached to Playwright report

---

## 🐛 Known SauceDemo Application Defects

| User | Defect |
|------|--------|
| `locked_out_user` | Login intentionally blocked — correct behaviour |
| `problem_user` | All product images replaced with `sl-404.jpg` |
| `problem_user` | Last name field does not accept typed input → checkout blocked |
| `error_user` | Cannot complete checkout — SauceDemo JS error triggered |
| `visual_user` | Layout misalignment and image rendering anomalies |
| `performance_glitch_user` | Intentional ~5s login delay |

---

## 📤 Git Commands

```bash
# Initial setup
git init
git remote add origin https://github.com/SaadRiasat/Playwright-Advanced-Framework.git

# Stage and commit
git add .
git commit -m "feat: complete QA automation framework with POM, DDT, and PDF validation"

# Push
git push -u origin main
```

---

## 📊 Playwright Configuration

Key settings in `playwright.config.js`:

| Setting | Value |
|---------|-------|
| `baseURL` | `https://www.saucedemo.com/` |
| `headless` | `true` (use `--headed` to override) |
| `retries` | `0` local, `2` on CI |
| `workers` | `2` local, `1` on CI |
| `screenshot` | `only-on-failure` |
| `video` | `retain-on-failure` |
| `trace` | `on-first-retry` |
| `reporter` | `list` + `html` + `allure-playwright` |

---

## 📊 Allure Reporting

This framework is integrated with **Allure Report** to deliver rich, interactive, and visually stunning test execution reports.

### 1. Run Tests & Generate Allure Report
```bash
# Run tests and generate report in one command:
npm run test:allure

# Or step-by-step:
npx playwright test
npm run allure:generate
```

### 2. View Allure Report
```bash
# Serve / open the generated report in your default browser:
npm run allure:open

# Or serve directly from raw results:
npm run allure:serve
```

---

## 🌐 REST API Testing (Playwright Request API)

Playwright includes built-in API testing via its `request` context fixture. This framework includes a dedicated REST API test suite under `tests/api.spec.js`.

### Run API Tests
```bash
npm run test:api
```

### API Test Coverage:
- `GET /posts`: Fetch multiple resources, validate schema & status `200`
- `GET /posts/1`: Fetch single resource by ID, assert data integrity
- `POST /posts`: Create new resource, attach JSON payload & verify status `201`
- `PUT /posts/1`: Update existing resource and verify updated payload
- `DELETE /posts/1`: Remove resource and assert status `200`
- `GET /posts/999999`: Negative verification for non-existent resource `404`
- All requests & responses are attached as JSON artifacts in Allure reports via `test.info().attach()`.

---

## 🐳 Docker Deployment & Containerization

Run the entire test suite in an isolated Docker container with pre-installed browser binaries and system dependencies.

### Option 1: Using Docker CLI
```bash
# 1. Build the Docker Image
npm run docker:build
# Or: docker build -t playwright-tests .

# 2. Run the Container
npm run docker:run
# Or: docker run --rm playwright-tests
```

### Option 2: Using Docker Compose
```bash
# Run tests and map allure-results / reports to host machine:
docker compose up --build
```

---

## 🏗️ Jenkins CI/CD Pipeline-as-Code

This project comes with a production-ready [`Jenkinsfile`](file:///c:/Users/SR/Desktop/PlayerighAutomation/Jenkinsfile) to run automated builds and test executions in Jenkins using Docker.

### Pipeline Stages:
1. **Install Dependencies**: Runs `npm install` inside the official Playwright Docker image.
2. **Run Playwright Tests**: Executes all UI and API tests in headless mode.
3. **Generate Allure Report**: Automatically builds the interactive Allure report.
4. **Post Build Actions**:
   - Publishes JUnit XML test results (`test-results/results.xml`).
   - Publishes Allure Reports.
   - Archives HTML reports and test artifacts.

### Setting up Jenkins:
1. Create a **Pipeline** job in Jenkins.
2. Under **Pipeline Definition**, select **Pipeline script from SCM** (Git).
3. Provide the repository URL: `https://github.com/SaadRiasat/Playwright-Advanced-Framework.git`.
4. Ensure Docker is installed on your Jenkins agent/slave host.
5. Click **Build Now** to execute the pipeline.

---

## 🎥 Playwright Codegen (Test Recording)

Playwright Codegen lets you record interactions in a browser window and automatically generates JavaScript test code.

### Start Codegen
```bash
# Record tests for SauceDemo:
npm run codegen

# Or record tests for Adactin Hotel:
npm run codegen:hotel

# Or record against custom URL:
npx playwright codegen https://www.saucedemo.com/
```

