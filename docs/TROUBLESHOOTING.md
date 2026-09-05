# Troubleshooting Guide

## Server won't start

- **`Error: Cannot find module ...`** — run `npm install` (or `npm ci`) first.
- **Firestore initialization errors** — `initDB()` requires Google
  Application Default Credentials. Locally, run
  `gcloud auth application-default login`, or set
  `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON file. In
  Firebase Functions, this is provided automatically.

## AI responses look generic / say "demo mode"

- `askZenna()` falls back to a canned response when `GEMINI_API_KEY` is not
  set. Set a real key from https://aistudio.google.com/ in your `.env` (or
  Firebase Functions config) to get live Gemini-generated responses.

## Missed-call texts / SMS replies aren't sending

1. Confirm `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and
   `TWILIO_FROM_NUMBER` are all set — without them, `sendSMS()` silently
   runs in "demo mode" and only logs to the console (`[SMS Demo Mode]`).
2. Confirm the tenant actually has a Twilio number provisioned via
   `POST /api/setup-tenant`, and that number's webhook URLs point at your
   deployed `/webhook/missed-call` and `/webhook/sms` endpoints.
3. Check that `getTenantByTwilioNumber()` can resolve the `To` number —
   this requires the tenant document in Firestore to have a matching
   `twilio_number` field.

## Stripe checkout redirects to a fake/demo URL

`/api/create-subscription` only creates a real Stripe Checkout Session
when **both** `STRIPE_SECRET_KEY` is set **and** the relevant
`STRIPE_PRICE_*` environment variable has been replaced with a real Stripe
Price ID (not the `price_starter_monthly` placeholder default). See
`docs/DEPLOYMENT.md` → "Setting Up Stripe Billing".

## Stripe webhook signature verification fails

Set `STRIPE_WEBHOOK_SECRET` to the signing secret shown when you create the
webhook endpoint in the Stripe Dashboard (starts with `whsec_`). Without a
correctly configured secret and a real `application/json` raw body, Stripe
webhook events will be rejected with a 400.

## Firebase deploy GitHub Action is skipped or fails

- **"Skipping Firebase deploy" warning** — `FIREBASE_SERVICE_ACCOUNT` and/or
  `GCP_PROJECT_ID` repository secrets aren't set yet. See
  `docs/DEPLOYMENT.md` → "Firebase Deployment".
- **Deploy runs but site 404s** — confirm `firebase.json`'s `hosting.site`
  matches the actual Hosting site name in your Firebase project, and that
  `npm run build` produced a non-empty `dist/` directory before deploying.

## Where do I find logs?

All server-side errors are logged as single-line JSON via `logger.ts`
(`{ timestamp, level, message, meta }`) to stdout/stderr, so they show up
in `firebase functions:log`, Cloud Logging, or your terminal in local dev.
