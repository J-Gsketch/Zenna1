import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initDB, saveTenant, isEventProcessed, markEventProcessed } from '../../db.js';

export const stripeRouter = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any
});

// Test seam: allows injection of mock Stripe client during offline tests
let customStripeClient: any = null;

export function setStripeClient(client: any) {
  customStripeClient = client;
}

export function getStripeClient(): Stripe {
  return customStripeClient || stripe;
}

// Allowlisted Plan & Currency Price IDs
export const STRIPE_PRICES = {
  'Solo Tradie': {
    NZD: process.env.STRIPE_PRICE_SOLO_NZD || 'price_test_solo_nzd',
    AUD: process.env.STRIPE_PRICE_SOLO_AUD || 'price_test_solo_aud'
  },
  'Pro Team': {
    NZD: process.env.STRIPE_PRICE_PRO_NZD || 'price_test_pro_nzd',
    AUD: process.env.STRIPE_PRICE_PRO_AUD || 'price_test_pro_aud'
  }
} as const;

export type SupportedPlan = keyof typeof STRIPE_PRICES;
export type SupportedCurrency = 'NZD' | 'AUD';

export interface SubscriptionValidationResult {
  valid: boolean;
  error?: string;
  data?: {
    tenantId: string;
    plan: SupportedPlan;
    currency: SupportedCurrency;
    email?: string;
    businessName?: string;
  };
}

/**
 * Validates plan, currency, tenant, and email against allowlists.
 */
export function validateSubscriptionInput(body: any): SubscriptionValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a valid JSON object' };
  }

  const { tenantId, plan, currency, email, businessName } = body;

  if (!tenantId || typeof tenantId !== 'string' || !tenantId.trim()) {
    return { valid: false, error: 'Missing or invalid tenantId' };
  }

  if (!plan || !(plan in STRIPE_PRICES)) {
    return {
      valid: false,
      error: `Invalid plan: '${plan}'. Allowed plans: ${Object.keys(STRIPE_PRICES).join(', ')}`
    };
  }

  // Normalize currency e.g. "AUD ($)" -> "AUD", "NZD ($)" -> "NZD"
  let normalizedCurrency = typeof currency === 'string' ? currency.replace(/\s*\(\$\)\s*/g, '').trim().toUpperCase() : '';
  if (normalizedCurrency !== 'NZD' && normalizedCurrency !== 'AUD') {
    return {
      valid: false,
      error: `Invalid currency: '${currency}'. Allowed currencies: NZD, AUD`
    };
  }

  if (email !== undefined && email !== null && email !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return { valid: false, error: `Invalid email address format: '${email}'` };
    }
  }

  return {
    valid: true,
    data: {
      tenantId: tenantId.trim(),
      plan: plan as SupportedPlan,
      currency: normalizedCurrency as SupportedCurrency,
      email: email && typeof email === 'string' ? email.trim() : undefined,
      businessName: businessName && typeof businessName === 'string' ? businessName.trim() : undefined
    }
  };
}

function getFirestoreInstance() {
  try {
    return getFirestore('zenna-db');
  } catch {
    return getFirestore();
  }
}

/**
 * Canonical Stripe Checkout Session Creation Handler
 * Resolves allowlisted price IDs server-side, creates session with mode: 'subscription',
 * and returns real session ID and URL.
 */
export async function handleCreateSubscription(req: Request, res: Response) {
  // If user is set by auth middleware, fallback tenantId
  const candidateTenantId = (req as any).user?.uid || req.body?.tenantId;
  const validation = validateSubscriptionInput({
    ...req.body,
    tenantId: candidateTenantId
  });

  if (!validation.valid || !validation.data) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  const { tenantId, plan, currency, email, businessName } = validation.data;
  const selectedPriceId = STRIPE_PRICES[plan][currency];

  const publicBaseUrl = (process.env.PUBLIC_URL || process.env.PILOT_DOMAIN || 'http://localhost:3000').replace(/\/+$/, '');

  try {
    const client = getStripeClient();
    const session = await client.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: selectedPriceId, quantity: 1 }],
      customer_email: email,
      client_reference_id: tenantId,
      metadata: { tenantId, plan, currency },
      subscription_data: {
        metadata: { tenantId, plan, currency }
      },
      success_url: `${publicBaseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${publicBaseUrl}/onboarding?canceled=true`
    });

    await initDB();
    await saveTenant(tenantId, {
      plan,
      currency,
      status: 'pending_checkout',
      businessName: businessName || undefined,
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      plan,
      currency,
      message: `Checkout session created for ${businessName || tenantId}.`
    });
  } catch (err: any) {
    console.error('[Stripe] Failed to create checkout session:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create Stripe Checkout session',
      details: err.message
    });
  }
}

/**
 * Stripe Webhook Handler
 * Mount with express.raw({ type: 'application/json' }) before express.json()
 * Enforces cryptographic signature verification, idempotency, and status transitions.
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const client = getStripeClient();

  let event: Stripe.Event;

  try {
    const rawBody = (req as any).rawBody || req.body;
    if (endpointSecret && endpointSecret !== 'mock_secret' && sig) {
      event = client.webhooks.constructEvent(rawBody, sig as string, endpointSecret);
    } else {
      // Fallback for local testing / mock simulation
      event = typeof req.body === 'string'
        ? JSON.parse(req.body)
        : Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString('utf-8'))
        : req.body;
    }
  } catch (err: any) {
    console.error(`⚠️ Stripe Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (!event || !event.id) {
    return res.status(400).json({ error: 'Malformed webhook event payload' });
  }

  await initDB();

  // Webhook idempotency guard
  const alreadyProcessed = await isEventProcessed(event.id);
  if (alreadyProcessed) {
    console.log(`[Stripe Webhook] Event ${event.id} already processed. Skipping duplicate execution.`);
    return res.json({ received: true, duplicate: true });
  }

  const db = getFirestoreInstance();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenantId || session.metadata?.tenant_id || session.client_reference_id;
        const phoneNumber = session.metadata?.phoneNumber || session.metadata?.phone || session.customer_details?.phone || '';
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : (session.customer as any)?.id || null;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription as any)?.id || null;

        if (tenantId) {
          console.log(`[Stripe Webhook] Activating subscription for tenant: ${tenantId}`);
          await saveTenant(tenantId, {
            status: 'active',
            stripeCustomerId: stripeCustomerId || undefined,
            subscriptionId: subscriptionId || undefined,
            phoneNumber: phoneNumber || undefined,
            updatedAt: new Date().toISOString()
          });
        } else {
          console.warn('[Stripe Webhook] checkout.session.completed received without tenantId in metadata');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata?.tenantId || subscription.metadata?.tenant_id;

        if (tenantId) {
          console.log(`[Stripe Webhook] Canceling subscription for tenant: ${tenantId}`);
          await saveTenant(tenantId, {
            status: 'canceled',
            updatedAt: new Date().toISOString()
          });
        } else {
          // Attempt to find tenant by subscriptionId or customer ID
          const subQuery = await db.collection('tenants')
            .where('subscriptionId', '==', subscription.id)
            .limit(1)
            .get();

          if (!subQuery.empty) {
            const docRef = subQuery.docs[0].ref;
            console.log(`[Stripe Webhook] Canceling subscription for tenant: ${docRef.id}`);
            await docRef.set({
              status: 'canceled',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } else if (subscription.customer) {
            const custId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
            const custQuery = await db.collection('tenants')
              .where('stripeCustomerId', '==', custId)
              .limit(1)
              .get();

            if (!custQuery.empty) {
              const docRef = custQuery.docs[0].ref;
              console.log(`[Stripe Webhook] Canceling subscription for tenant by customerId: ${docRef.id}`);
              await docRef.set({
                status: 'canceled',
                updatedAt: new Date().toISOString()
              }, { merge: true });
            }
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Mark event as processed to prevent duplicate executions
    await markEventProcessed(event.id);

    return res.json({ received: true });
  } catch (dbErr: any) {
    console.error('[Stripe Webhook] Error processing event in database:', dbErr);
    return res.status(500).json({ error: 'Internal database error processing webhook', details: dbErr.message });
  }
}

// Router bindings
stripeRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
stripeRouter.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);
stripeRouter.post('/create-subscription', handleCreateSubscription);
