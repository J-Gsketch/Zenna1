# Production Deployment Checklist — Zenna by Hammer & Code

Use this checklist before releasing new production updates for **Zenna by Hammer & Code**.

- [ ] **Branding Verification**
  - [ ] App title displays "Zenna by Hammer & Code".
  - [ ] Landing page badges reflect Hammer & Code trade partnership branding.
  - [ ] Default system prompts use dynamic customer variables instead of hardcoded businesses.

- [ ] **Environment Security**
  - [ ] `GEMINI_API_KEY` validated and restricted in Google Cloud Console.
  - [ ] `STRIPE_SECRET_KEY` set to live mode key (`sk_live_...`).
  - [ ] `STRIPE_WEBHOOK_SECRET` configured for production webhook endpoint.
  - [ ] `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` set.
  - [ ] Firebase credentials properly scoped.

- [ ] **Build & Quality Assurance**
  - [ ] `npm run lint` passes with zero TypeScript errors.
  - [ ] `npm run build` generates `dist/` and `dist-server/server.js`.
  - [ ] API health endpoint (`GET /api/health`) returns HTTP 200.

- [ ] **Telephony & Webhooks**
  - [ ] Twilio incoming voice URL pointing to `https://<domain>/webhook/missed-call`.
  - [ ] Twilio incoming SMS URL pointing to `https://<domain>/webhook/sms`.
  - [ ] Stripe webhook listener pointing to `https://<domain>/api/stripe-webhook`.

- [ ] **Monitoring & Alerts**
  - [ ] Slack webhook configured to receive lead alerts and critical errors.
  - [ ] Logging verified for tenant provisioning and subscription lifecycle events.
