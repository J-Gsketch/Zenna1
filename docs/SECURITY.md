# Security & Compliance Checklist

This checklist covers the baseline security and compliance items to review
before onboarding paying customers.

## Secrets & Configuration

- [ ] No secrets (API keys, tokens, service account JSON) are committed to
      source control. `.env`, `.env.local`, and `*.pem`/`*.json` service
      account keys are covered by `.gitignore`.
- [ ] Production secrets (`GEMINI_API_KEY`, `STRIPE_SECRET_KEY`,
      `TWILIO_AUTH_TOKEN`, `STRIPE_WEBHOOK_SECRET`, Firebase service
      account) are stored as platform secrets (Firebase Functions config,
      GitHub Actions repository secrets) — never as plaintext files in the
      deployed environment.
- [ ] `SECRET_KEY` / any signing secrets are unique per environment
      (dev/staging/production) and rotated periodically.

## Authentication & Authorization

- [ ] All tenant-scoped API routes are protected by `verifyToken`
      middleware, which validates the Firebase Auth ID token and derives
      `tenant_id` from it — no route should trust a client-supplied
      `tenant_id`.
- [ ] Firestore security rules (configured separately in the Firebase
      console/`firestore.rules`) restrict direct client reads/writes so
      that only the backend (with the Admin SDK) can access cross-tenant
      collections.

## Multi-Tenant Data Isolation

- [ ] Every Firestore query in `db.ts` filters by `tenant_id` (leads,
      calls, settings) so one tenant can never read another tenant's data.
- [ ] Twilio numbers are mapped 1:1 to a tenant via
      `getTenantByTwilioNumber`, so inbound webhook traffic can't leak
      across tenants.

## Payments

- [ ] Stripe webhook signature verification (`stripe.webhooks.constructEvent`)
      is enforced whenever `STRIPE_WEBHOOK_SECRET` is a real (non-mock)
      value — never disable this in production.
- [ ] Stripe Checkout is used for card collection; the app itself never
      stores raw card numbers.

## Third-Party Integrations

- [ ] Twilio, Gemini, and Stripe API keys use least-privilege
      scopes/restrictions where the provider supports it (e.g. Stripe
      restricted API keys).
- [ ] Outbound webhook URLs (Slack alerts) are treated as sensitive
      configuration, not hardcoded.

## Monitoring

- [ ] Structured logs (`logger.ts`) and the global Express error handler
      are enabled in production so failures are visible instead of silent.
- [ ] Critical failures (Stripe webhook errors, missed-call handling
      errors) trigger a Slack alert via `SLACK_WEBHOOK_URL` if configured.

## Data Handling

- [ ] Customer/lead PII (name, phone, notes) is only stored in Firestore,
      scoped per tenant, and not logged in plaintext in application logs.
- [ ] Review data retention needs with each customer (how long call/lead
      history is retained) before scaling to markets with specific privacy
      regulations (e.g. GDPR, Australian Privacy Act).

This checklist is a starting point, not a substitute for a formal security
review before handling sensitive customer or payment data at scale.
