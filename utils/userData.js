// =============================================================================
// SauceDemo Test Data
// Central data file — do NOT hardcode credentials or test data in test files
// =============================================================================

export const COMMON_PASSWORD = 'secret_sauce';

// ---------------------------------------------------------------------------
// User Profiles
// ---------------------------------------------------------------------------
export const userProfiles = [
  {
    username: 'standard_user',
    password: COMMON_PASSWORD,
    type: 'standard',
    description: 'Normal working user account',
    shouldLogin: true,
    expectedResult: 'success',
    hasBrokenImages: false,
    hasCheckoutIssues: false,
  },
  {
    username: 'locked_out_user',
    password: COMMON_PASSWORD,
    type: 'locked',
    description: 'User locked out from accessing the system',
    shouldLogin: false,
    expectedResult: 'login_error',
    expectedErrorMessage:
      'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    username: 'problem_user',
    password: COMMON_PASSWORD,
    type: 'problem',
    description:
      'User experiencing broken image links and cart/checkout anomalies',
    shouldLogin: true,
    expectedResult: 'success_with_known_issues',
    hasBrokenImages: true,
    hasCheckoutIssues: true,
  },
  {
    username: 'performance_glitch_user',
    password: COMMON_PASSWORD,
    type: 'performance',
    description: 'User with delayed page responses during login/navigation',
    shouldLogin: true,
    expectedResult: 'success',
    hasPerformanceGlitch: true,
    hasBrokenImages: false,
    hasCheckoutIssues: false,
  },
  {
    username: 'error_user',
    password: COMMON_PASSWORD,
    type: 'error',
    description:
      'User encountering JavaScript/UI errors during checkout actions',
    shouldLogin: true,
    expectedResult: 'success_with_known_issues',
    hasCheckoutIssues: true,
  },
  {
    username: 'visual_user',
    password: COMMON_PASSWORD,
    type: 'visual',
    description:
      'User encountering layout alignment and image rendering anomalies',
    shouldLogin: true,
    expectedResult: 'success_with_known_issues',
    hasVisualGlitches: true,
  },
];

// Convenience subsets
export const validUsers = userProfiles.filter((u) => u.shouldLogin);
export const lockedUser = userProfiles.find(
  (u) => u.username === 'locked_out_user'
);

// ---------------------------------------------------------------------------
// Checkout / Order Data
// ---------------------------------------------------------------------------
export const checkoutData = {
  firstName: 'Saad',
  lastName: 'Riasat',
  zipCode: '74800',
};

export const sampleOrderData = {
  products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
  firstName: checkoutData.firstName,
  lastName: checkoutData.lastName,
  zipCode: checkoutData.zipCode,
};

// ---------------------------------------------------------------------------
// Invalid Login Scenarios (for negative login tests)
// ---------------------------------------------------------------------------
export const invalidLoginScenarios = [
  {
    label: 'Invalid username',
    username: 'invalid_user',
    password: COMMON_PASSWORD,
    expectedError:
      'Epic sadface: Username and password do not match any user in this service',
  },
  {
    label: 'Invalid password',
    username: 'standard_user',
    password: 'wrong_password',
    expectedError:
      'Epic sadface: Username and password do not match any user in this service',
  },
  {
    label: 'Empty username',
    username: '',
    password: COMMON_PASSWORD,
    expectedError: 'Epic sadface: Username is required',
  },
  {
    label: 'Empty password',
    username: 'standard_user',
    password: '',
    expectedError: 'Epic sadface: Password is required',
  },
  {
    label: 'Both empty',
    username: '',
    password: '',
    expectedError: 'Epic sadface: Username is required',
  },
];

// ---------------------------------------------------------------------------
// Sorting options
// ---------------------------------------------------------------------------
export const sortOptions = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo',
};
