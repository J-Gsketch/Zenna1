import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Configure test environment BEFORE importing DB and routes
const TEST_DB_PATH = path.join(__dirname, '..', 'zenna_db.test.json');
process.env.ZENNA_DB_PATH = TEST_DB_PATH;
process.env.LOCAL_RUN = 'true';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';

// Clean existing test db
if (fs.existsSync(TEST_DB_PATH)) {
  fs.unlinkSync(TEST_DB_PATH);
}

// 2. Import DB and Stripe route modules
import { initDB, getTenant, getLocalDBPath } from '../db.js';
import {
  setStripeClient,
  handleCreateSubscription,
  handleStripeWebhook,
  validateSubscriptionInput,
  STRIPE_PRICES
} from '../src/routes/stripe.js';

function createMockRes() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
    send(data: any) {
      this.body = data;
      return this;
    }
  };
  return res;
}

let lastCreatedSessionParams: any = null;

const fakeStripeClient = {
  checkout: {
    sessions: {
      async create(params: any) {
        lastCreatedSessionParams = params;
        return {
          id: 'cs_test_mock_12345',
          url: 'https://checkout.stripe.com/c/pay/cs_test_mock_12345'
        };
      }
    }
  },
  webhooks: {
    constructEvent(rawBody: any, sig: string, secret: string) {
      if (sig === 'invalid_signature') {
        throw new Error('Invalid signature header');
      }
      if (Buffer.isBuffer(rawBody)) {
        return JSON.parse(rawBody.toString('utf-8'));
      }
      return typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    }
  }
};

async function runOfflineStripeTests() {
  console.log('=== STARTING STRIPE OFFLINE FIXTURE TESTS ===');
  console.log(`Using isolated test DB: ${getLocalDBPath()}`);

  setStripeClient(fakeStripeClient);
  await initDB();

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // --- TEST 1: Validation - Disallowed Plan ---
  console.log('\n--- 1. Input Validation Tests ---');
  const invalidPlanRes = validateSubscriptionInput({
    tenantId: 'tenant_test_1',
    plan: 'Enterprise Tier',
    currency: 'NZD'
  });
  assert(!invalidPlanRes.valid && invalidPlanRes.error?.includes('Invalid plan'), 'Rejects non-allowlisted plan');

  // --- TEST 2: Validation - Disallowed Currency ---
  const invalidCurrRes = validateSubscriptionInput({
    tenantId: 'tenant_test_1',
    plan: 'Solo Tradie',
    currency: 'EUR'
  });
  assert(!invalidCurrRes.valid && invalidCurrRes.error?.includes('Invalid currency'), 'Rejects non-allowlisted currency');

  // --- TEST 3: Validation - Missing Tenant ID ---
  const missingTenantRes = validateSubscriptionInput({
    plan: 'Solo Tradie',
    currency: 'NZD'
  });
  assert(!missingTenantRes.valid && missingTenantRes.error?.includes('tenantId'), 'Rejects missing tenantId');

  // --- TEST 4: Validation - Invalid Email Format ---
  const invalidEmailRes = validateSubscriptionInput({
    tenantId: 'tenant_test_1',
    plan: 'Solo Tradie',
    currency: 'NZD',
    email: 'not-an-email-address'
  });
  assert(!invalidEmailRes.valid && invalidEmailRes.error?.includes('email'), 'Rejects malformed customer email');

  // --- TEST 5: Create Checkout Session via Handler ---
  console.log('\n--- 2. Canonical Checkout Session Creation ---');
  const reqCreate: any = {
    body: {
      tenantId: 'tenant_test_1',
      plan: 'Solo Tradie',
      currency: 'NZD',
      email: 'dave@hartleyplumbing.co.nz',
      businessName: 'Hartley Plumbing'
    }
  };
  const resCreate = createMockRes();
  await handleCreateSubscription(reqCreate, resCreate);

  assert(resCreate.statusCode === 200, 'HTTP status is 200');
  assert(resCreate.body?.success === true, 'Response body has success: true');
  assert(resCreate.body?.sessionId === 'cs_test_mock_12345', 'Returns real session ID from Stripe client');
  assert(resCreate.body?.checkoutUrl === 'https://checkout.stripe.com/c/pay/cs_test_mock_12345', 'Returns real session URL from Stripe client');
  assert(!resCreate.body?.checkoutUrl?.includes('cs_live_zenna_'), 'Never constructs synthetic cs_live_zenna_ template');

  assert(lastCreatedSessionParams?.mode === 'subscription', 'Checkout mode is "subscription"');
  assert(lastCreatedSessionParams?.client_reference_id === 'tenant_test_1', 'Client reference ID matches tenantId');
  assert(lastCreatedSessionParams?.customer_email === 'dave@hartleyplumbing.co.nz', 'Customer email matches input');
  assert(lastCreatedSessionParams?.line_items?.[0]?.price === STRIPE_PRICES['Solo Tradie']['NZD'], 'Price ID matches allowlisted server mapping');

  // Check tenant state in test DB: must be pending_checkout, NOT active
  const tenantPending = await getTenant('tenant_test_1');
  assert(tenantPending?.status === 'pending_checkout', 'Tenant status is pending_checkout (NOT active)');

  // --- TEST 6: Webhook Signature Verification Failure ---
  console.log('\n--- 3. Webhook Signature & Event Processing ---');
  const reqBadSig: any = {
    headers: { 'stripe-signature': 'invalid_signature' },
    body: JSON.stringify({ id: 'evt_invalid', type: 'test' })
  };
  const resBadSig = createMockRes();
  await handleStripeWebhook(reqBadSig, resBadSig);
  assert(resBadSig.statusCode === 400, 'Rejects invalid webhook signature with 400');

  // --- TEST 7: checkout.session.completed Event Fulfillment ---
  const checkoutCompletedEvent = {
    id: 'evt_checkout_12345',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_mock_12345',
        client_reference_id: 'tenant_test_1',
        customer: 'cus_stripe_cust_999',
        subscription: 'sub_stripe_sub_888',
        metadata: {
          tenantId: 'tenant_test_1',
          plan: 'Solo Tradie',
          currency: 'NZD'
        },
        customer_details: {
          email: 'dave@hartleyplumbing.co.nz',
          phone: '+6421555123'
        }
      }
    }
  };

  const reqWebhook: any = {
    headers: { 'stripe-signature': 'valid_test_signature' },
    body: JSON.stringify(checkoutCompletedEvent)
  };
  const resWebhook = createMockRes();
  await handleStripeWebhook(reqWebhook, resWebhook);

  assert(resWebhook.statusCode === 200, 'Webhook returns 200 OK');
  assert(resWebhook.body?.received === true, 'Webhook response acknowledges received: true');

  const tenantActive = await getTenant('tenant_test_1');
  assert(tenantActive?.status === 'active', 'Tenant status transitioned to "active" upon verified webhook');
  assert(tenantActive?.stripeCustomerId === 'cus_stripe_cust_999', 'Tenant has correct stripeCustomerId');
  assert(tenantActive?.subscriptionId === 'sub_stripe_sub_888', 'Tenant has correct subscriptionId');

  // --- TEST 8: Webhook Idempotency (Duplicate Event Delivery) ---
  console.log('\n--- 4. Webhook Idempotency Guard ---');
  const resDuplicate = createMockRes();
  await handleStripeWebhook(reqWebhook, resDuplicate);

  assert(resDuplicate.statusCode === 200, 'Duplicate webhook returns 200 OK');
  assert(resDuplicate.body?.received === true && resDuplicate.body?.duplicate === true, 'Duplicate webhook recognized and acknowledged without re-processing');

  // --- TEST 9: customer.subscription.deleted Event ---
  console.log('\n--- 5. Subscription Cancellation Event ---');
  const subDeletedEvent = {
    id: 'evt_sub_deleted_67890',
    type: 'customer.subscription.deleted',
    data: {
      object: {
        id: 'sub_stripe_sub_888',
        customer: 'cus_stripe_cust_999',
        metadata: {
          tenantId: 'tenant_test_1'
        }
      }
    }
  };

  const reqCancel: any = {
    headers: { 'stripe-signature': 'valid_test_signature' },
    body: JSON.stringify(subDeletedEvent)
  };
  const resCancel = createMockRes();
  await handleStripeWebhook(reqCancel, resCancel);

  assert(resCancel.statusCode === 200, 'Cancel webhook returns 200 OK');
  const tenantCanceled = await getTenant('tenant_test_1');
  assert(tenantCanceled?.status === 'canceled', 'Tenant status transitioned to "canceled" upon subscription deletion');

  // Clean up test DB
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }

  console.log(`\n==============================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runOfflineStripeTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  process.exit(1);
});
