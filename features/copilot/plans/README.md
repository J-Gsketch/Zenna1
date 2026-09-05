# Zenna by Hammer & Code — Pricing & Plans Architecture

This module (`features/copilot/plans/`) provides the pricing, subscription tier definitions, feature matrix, plan configuration schemas, and Stripe subscription integration for **Zenna by Hammer & Code**.

## Tiers & Pricing Overview

| Tier | AUD Price | NZD Price | USD Price | Target Audience | Highlights |
| --- | --- | --- | --- | --- | --- |
| **Starter (Solo Tradie)** | $99/mo | $109/mo | $79/mo | Sole Traders & Vans | 1 Twilio Line, Auto-SMS, 150 Calls, Evening Brief |
| **Pro (Multi-Van & Team)** | $199/mo | $219/mo | $149/mo | Growing Trade Teams | 3 Lines, Dynamic Prompt, Stripe, Calendar Sync |
| **Enterprise (Fleet & Franchise)** | $399/mo | $439/mo | $299/mo | Franchises & Fleets | Unlimited Lines, Voice Clones, SLA, Custom ERP |

## Module Exports

- **`schema.ts`**: TypeScript definitions for `PlanDefinition`, `PlanFeature`, `TenantSubscription`, and checkout options.
- **`plans.ts`**: Tier definitions (`PLANS.starter`, `PLANS.pro`, `PLANS.enterprise`) with multi-currency pricing and feature limits.
- **`featureMatrix.ts`**: Feature breakdown and capabilities matrix.
- **`stripeIntegration.ts`**: Checkout session generation, webhook verification, and Stripe helpers.
- **`index.ts`**: Unified entrypoint re-exporting all plans functionality.

## Stripe Integration

To configure Stripe checkout for subscription fulfillment:

1. Set `STRIPE_SECRET_KEY` in environment variables.
2. Set `STRIPE_WEBHOOK_SECRET` for webhook signature verification.
3. Handle the `checkout.session.completed` event in `/api/stripe-webhook`.
