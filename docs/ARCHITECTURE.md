# Zenna by Hammer & Code architecture

Firebase Hosting serves the React client. Hosting rewrites `/api/**` and
`/webhook/**` to the Firebase Functions `api` handler. Express authenticates
Firebase ID tokens, resolves the tenant from the token or Twilio number, and
uses Firestore as the tenant-scoped source of truth. Gemini only receives the
tenant's configured business context and the current conversation.

Stripe Checkout creates subscriptions with a seven-day trial and stores the
tenant ID in Stripe metadata. Stripe webhooks update subscription state. Twilio
webhooks create tenant-scoped call/lead records and send the configured
confirmation SMS.

Secrets remain in Firebase/GitHub environment configuration; `.env.example`
contains placeholders only.
