# Deployment Guide

This guide covers first-time production deployment of the Zenna AI
Receptionist platform, and the environment variables required to run it
safely and reliably for real customers.

## 1. Prerequisites

- Node.js 20.x
- A [Firebase](https://console.firebase.google.com/) project (Firestore in
  Native mode, Hosting, and Cloud Functions enabled)
- A [Stripe](https://dashboard.stripe.com/) account (for subscription billing)
- A [Twilio](https://www.twilio.com/console) account (for calls/SMS)
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key

## 2. Local Development

```bash
npm install
cp .env.example .env   # fill in your own keys
npm run dev            # starts the Express + Vite dev server on :3000
```

## 3. Production Build

```bash
npm run build          # builds the React frontend (Vite) AND bundles server.ts
```

This produces:
- `dist/` — the static frontend bundle, served by Express/Firebase Hosting
- `dist-server/server.js` — the bundled Node.js backend (esbuild, ESM, Node 20 target)

## 4. Environment Configuration

Copy `.env.example` to `.env` and fill in real values before deploying. Key
groups:

| Section | Purpose |
|---|---|
| Server & system | `PORT`, `NODE_ENV`, `SECRET_KEY` |
| Business defaults | Fallback business details used only until a tenant configures their own (see `docs/ONBOARDING.md`) |
| AI provider keys | `GEMINI_API_KEY` (required for real AI responses; omit to run in demo/mock mode) |
| Telephony | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, plan `STRIPE_PRICE_*` IDs |
| Monitoring | `SLACK_WEBHOOK_URL` (optional; receives VIP lead and critical error alerts) |

**Never commit `.env` to source control.** In production, set these as
platform secrets (Firebase Functions config / GitHub Actions repository
secrets), not as plaintext files.

## 5. Setting Up Stripe Billing

1. In the Stripe Dashboard, create three Products: **Starter**, **Pro**, and
   **Enterprise** (matching `features/copilot/plans/plans.ts`).
2. For each Product, create monthly and yearly recurring Prices.
3. Copy each Price ID (`price_...`) into the corresponding
   `STRIPE_PRICE_*_MONTHLY` / `STRIPE_PRICE_*_YEARLY` environment variable.
4. Create a webhook endpoint in Stripe pointing at
   `https://<your-domain>/api/stripe-webhook`, subscribed to
   `checkout.session.completed`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.

If `STRIPE_SECRET_KEY` or the plan Price IDs aren't configured, the
`/api/create-subscription` endpoint automatically falls back to a demo
checkout URL so local development still works without live Stripe
credentials.

## 6. Firebase Deployment (Automated via GitHub Actions)

This repo ships with `.github/workflows/firebase-deploy.yml`, which builds
and deploys to Firebase Hosting + Functions on every push to `main`.

To enable it, add these **repository secrets** (Settings → Secrets and
variables → Actions):

| Secret | Description |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | JSON key for a Firebase service account with Hosting/Functions deploy permissions |
| `GCP_PROJECT_ID` | Your Firebase/GCP project ID |

Until both secrets are set, the workflow will **skip the deploy step with a
warning** instead of failing the whole run, so you can still verify the
build passes.

To deploy manually instead:

```bash
npm run build
firebase deploy --only hosting,functions
```

## 7. Error Handling & Monitoring

- All server errors are logged as structured JSON via `logger.ts`
  (`{ timestamp, level, message, meta }`), making them easy to ingest into
  Google Cloud Logging, Datadog, or any log aggregator.
- A global Express error-handling middleware in `server.ts` catches
  unhandled route errors and returns a safe generic JSON error instead of
  leaking stack traces.
- `process.on('uncaughtException')` / `process.on('unhandledRejection')`
  handlers log crashes instead of letting them fail silently.
- Set `SLACK_WEBHOOK_URL` to receive real-time Slack alerts for new VIP
  leads and critical errors (Stripe webhook failures, etc.).

For deeper production monitoring (APM, uptime checks, alerting), plug a
provider like Sentry, Google Cloud Monitoring, or Datadog into `logger.ts`
without needing to change any call sites.
