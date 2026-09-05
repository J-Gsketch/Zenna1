import Stripe from 'stripe';
import { StripeCheckoutSessionOptions, PlanId, Currency } from './schema';
import { PLANS } from './plans';

export function getStripeClient(apiKey?: string): Stripe {
  const key = apiKey || process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
  return new Stripe(key, { apiVersion: '2026-07-29.dahlia' as any });
}

export async function createPlanCheckoutSession(
  stripe: Stripe,
  options: StripeCheckoutSessionOptions
): Promise<{ sessionId?: string; url: string; isMock?: boolean }> {
  const plan = PLANS[options.planId];
  if (!plan) {
    throw new Error(`Invalid plan ID: ${options.planId}`);
  }

  const currencyPricing = plan.pricing[options.currency] || plan.pricing.AUD;
  const priceAmount = options.billingInterval === 'yearly' 
    ? currencyPricing.yearly 
    : currencyPricing.monthly;

  // In test or missing secret key environment, return formatted mock checkout URL
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
    const mockUrl = `https://checkout.stripe.com/c/pay/cs_mock_zenna_${Date.now()}?plan=${options.planId}&currency=${options.currency}&interval=${options.billingInterval}&tenant=${options.tenantId}`;
    return {
      url: mockUrl,
      isMock: true
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    client_reference_id: options.tenantId,
    customer_email: options.customerEmail,
    metadata: {
      tenant_id: options.tenantId,
      plan_id: options.planId,
      business_name: options.businessName || 'Zenna Customer',
      brand: 'Zenna by Hammer & Code'
    },
    line_items: [
      {
        price_data: {
          currency: options.currency.toLowerCase(),
          product_data: {
            name: `${plan.name} — Zenna by Hammer & Code`,
            description: plan.description,
          },
          unit_amount: priceAmount * 100, // cents
          recurring: {
            interval: options.billingInterval === 'yearly' ? 'year' : 'month'
          }
        },
        quantity: 1
      }
    ],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl
  });

  return {
    sessionId: session.id,
    url: session.url || options.successUrl
  };
}

export function parseStripeWebhookEvent(
  stripe: Stripe,
  rawBody: Buffer | string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
