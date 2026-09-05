# Production deployment

1. Create Firebase project credentials and enable Authentication, Firestore and
   Hosting. Deploy `firestore.rules`.
2. Add GitHub secrets `FIREBASE_SERVICE_ACCOUNT` and `GCP_PROJECT_ID`, then
   protect the `production` environment with an approval rule.
3. Configure Functions secrets: `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`,
   `STRIPE_PRICE_ENTERPRISE`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and
   `TWILIO_FROM_NUMBER`.
4. Run `npm ci`, `npm run build`, `npm run build:functions`, then merge to
   `main`. The workflow verifies the build and deploys only after production
   approval.
5. Register `/api/stripe-webhook`, `/webhook/missed-call` and `/webhook/sms`
   with their providers. Use HTTPS URLs only and perform a test call and
   payment before onboarding a customer.

Do not commit `.env` files, service-account JSON, Stripe keys or Twilio tokens.
