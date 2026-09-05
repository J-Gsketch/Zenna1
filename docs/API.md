# API Documentation

Base URL: `https://<your-domain>` (or `http://localhost:3000` in dev).

Most endpoints require a Firebase Auth ID token:

```
Authorization header: the word "Bearer" followed by a space and the Firebase ID token
```

The server verifies the token and derives `tenant_id` from the token's
`uid`, so every authenticated call is automatically scoped to the caller's
own business data — no `tenant_id` needs to be passed explicitly.

## Core Tenant & Onboarding

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/setup-tenant` | ✅ | Auto-provisions a Twilio phone number for the tenant and links it to their account. |
| GET | `/api/business-config` | ✅ | Fetches the tenant's business configuration (name, owner, fee, booking link, plan, region). |
| POST | `/api/business-config` | ✅ | Updates the tenant's business configuration. |
| POST | `/api/create-subscription` | ✅ | Creates a Stripe Checkout session for the selected plan (Starter/Pro/Enterprise) and returns `checkoutUrl`. |
| GET | `/api/health` | — | Health check. Returns `{ status: "ok" }`. |

## Leads & Calls (CRM)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/stats` | ✅ | Aggregate stats for the tenant's dashboard. |
| GET | `/api/leads` | ✅ | List all leads for the tenant. |
| POST | `/api/leads` | ✅ | Create/update a lead. |
| GET | `/api/lookup?phone=` | ✅ | Look up a caller by phone number against the tenant's CRM. |
| POST | `/api/simulate-call` | ✅ | Simulates an inbound call, generating a live AI voice script personalized to the tenant's business details. |
| POST | `/api/ask` | ✅ | Ask Zenna a business-context question (chief-of-staff style Q&A). |
| POST | `/api/brief` | ✅ | Sends the owner a daily SMS briefing of calls/leads. |

## Voice Engine (Demo / Public)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/voice-engine/conversation/create` | — | Starts a stateless demo voice session. |
| POST | `/api/voice-engine/process` | — | Processes a turn of the demo voice conversation. |
| POST | `/api/voice-engine/conversation/end` | — | Ends a demo voice session. |

## Twilio Webhooks

These are configured as the Voice/SMS webhook URLs on each tenant's Twilio
phone number (done automatically by `/api/setup-tenant`).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/webhook/missed-call` | Twilio signature | Handles a missed call: resolves the tenant by the dialed number, generates an AI text-back SMS, and logs the lead/call. |
| POST | `/webhook/sms` | Twilio signature | Handles an inbound SMS: resolves the tenant, generates an AI reply, and logs the lead/call. |

## Billing Webhooks

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/stripe-webhook` | Stripe signature | Handles `checkout.session.completed` to activate a tenant's subscription. Requires `STRIPE_WEBHOOK_SECRET`. |

## Internal / Marketing Tooling

These endpoints power the internal "Hammer & Code" partner/marketing
tooling used by the platform operator (not per-tenant customer features):
`/api/draft-quote`, `/api/route-dispatch`, `/api/generate-tradie-campaign`,
`/api/run-marketing-campaign`, `/api/scale-zenna`,
`/api/marketing/ad-copy`, `/api/marketing/video-scripts`.

## Pricing Plans

Plan definitions consumed by the billing endpoints above live in
[`features/copilot/plans/`](../features/copilot/plans/README.md) and are
shared between the server and any frontend pricing UI.
