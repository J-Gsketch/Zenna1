# Zenna Pricing Plans

This directory is the single source of truth for Zenna's subscription plans.
It defines pricing tiers, the feature matrix used for comparison tables and
feature gating, and the shared TypeScript schema so the frontend dashboard,
the landing page, and the Stripe billing integration in `server.ts` never
drift out of sync.

## Files

- `schema.ts` — TypeScript types describing a `PricingTier` (limits, features, Stripe price IDs).
- `plans.ts` — The actual **Starter / Pro / Enterprise** tier definitions, including price and Stripe Price IDs sourced from environment variables.
- `featureMatrix.ts` — Helpers to build a feature-by-plan comparison table and to check `hasFeature(planId, feature)` for server-side gating.
- `index.ts` — Barrel export for convenient importing.

## Usage

```ts
import { PRICING_TIERS, getPlanById, hasFeature, buildFeatureMatrix } from "../features/copilot/plans/index.js";

// Render pricing cards
PRICING_TIERS.forEach((tier) => console.log(tier.name, tier.priceCents.month));

// Gate a feature server-side
if (hasFeature(tenantPlan, "slackAlerts")) {
  await sendSlackAlert(...);
}
```

## Configuring Stripe Price IDs

Each plan reads its Stripe Price IDs from environment variables so you can
point staging/production or different regions at different Stripe
Products/Prices without touching code:

```
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_YEARLY=price_...
```

See `.env.example` at the repo root for the full list, and
`docs/DEPLOYMENT.md` for how to create these Products/Prices in Stripe.
