# Customer Onboarding Guide

Zenna is **multi-tenant**: one deployment serves every customer, and each
customer's AI receptionist is fully configured through the dashboard — no
code changes or redeploys are required to onboard a new business.

## How multi-tenancy works

- Every authenticated API request resolves a `tenant_id` from the caller's
  Firebase Auth token (`req.user.uid`), and every customer's leads, calls,
  and settings are stored/queried scoped to that `tenant_id` (see `db.ts`).
- Incoming Twilio calls/SMS are matched to a tenant by looking up the
  Twilio phone number they were sent to (`getTenantByTwilioNumber`), so
  each customer's dedicated number routes to their own configuration.
- The AI system prompt sent to Gemini is built **dynamically per request**
  from that tenant's stored settings (business name, owner name, call-out
  fee, booking link, region) — see `SYSTEM_INSTRUCTIONS.md` for the
  template and placeholder mapping.

## Self-service onboarding flow (first customer)

1. **Sign up** — the customer authenticates via Firebase Auth (handled by
   the frontend in `src/App.tsx` / `src/lib/googleAuth.ts`).
2. **Provision a phone number** — `POST /api/setup-tenant` automatically
   purchases and configures a Twilio number for the tenant, wiring its
   voice/SMS webhooks to `/webhook/missed-call` and `/webhook/sms`.
3. **Configure business details** — the onboarding modal
   (`src/components/OnboardingModal.tsx`) posts to
   `GET/POST /api/business-config` to set:
   - Business name & owner name
   - Owner phone (for daily briefings)
   - Call-out/diagnostic fee
   - Booking link
   - Region & currency (AU/NZ)
4. **Choose a plan & subscribe** — `POST /api/create-subscription` creates
   a real Stripe Checkout session (see `features/copilot/plans/`) for the
   selected plan, and updates the tenant's `subscriptionStatus` when Stripe
   confirms payment via the `/api/stripe-webhook` handler.
5. **Go live** — as soon as the Twilio number is provisioned and business
   details are saved, the customer's AI receptionist is live. No manual
   intervention or deployment is required per customer.

## What a new customer needs to provide

- Business name, owner name, and owner mobile number
- Standard call-out/diagnostic fee
- A booking link (Calendly, website form, etc.)
- Their operating region (AU/NZ) and currency
- Payment details (handled securely by Stripe Checkout)

## Support materials for customer success

- Point new customers at `SYSTEM_INSTRUCTIONS.md` if they want to
  understand/tweak how Zenna talks on their behalf.
- Point them at `docs/TROUBLESHOOTING.md` for common first-week issues
  (missed webhooks, SMS not sending, etc.).
- Escalate integration questions to `docs/API.md`.
