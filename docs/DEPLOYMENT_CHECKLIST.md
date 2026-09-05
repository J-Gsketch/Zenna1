# Zenna Deployment Checklist

Sign-off checklist for taking Zenna to production. Complete every item
before routing live customer calls or processing live payments.

---

## Firebase Hosting

- [ ] Firebase project created (production account)
- [ ] Custom domain configured (zenna.com or similar)
- [ ] Auto-deployment on push to main branch configured
- [ ] SSL certificate active (Firebase auto-handles)

## Environment Configuration

- [ ] `.env.production` file created (DO NOT commit to repo)
- [ ] Secrets stored in Firebase Environment Config (not hardcoded)
- [ ] Variables set: `GEMINI_API_KEY`, `STRIPE_LIVE_KEY`,
      `TWILIO_ACCOUNT_SID`, and other secrets referenced in `.env.example`
- [ ] Rotation schedule defined: rotate secrets every 90 days

## Stripe (Production)

- [ ] Stripe live account created
- [ ] Live API keys obtained (public + secret)
- [ ] Subscription products created (Starter $99, Pro $249, Enterprise $499)
- [ ] Tax settings configured (Australian GST)
- [ ] Webhook endpoints configured (`payment.success`, `payment.failed`
      events)
- [ ] Test payment processed (sandbox first, then live)

## Twilio (Production)

- [ ] Twilio live account created
- [ ] Australian phone number(s) provisioned
- [ ] Webhook URL configured (points to Firebase Functions endpoint)
- [ ] IVR script configured (Zenna greeting)
- [ ] Call forwarding tested (call number → Zenna → booking flow)

## Error Logging & Monitoring

- [ ] Sentry account created (free tier)
- [ ] Sentry DSN configured in backend
- [ ] Test error logged and alert received
- [ ] Slack/email alerts configured for critical errors

## Database

- [ ] Firestore backups enabled
- [ ] Retention policy set (30-day automatic backups)
- [ ] Security rules configured (tenant isolation)

## Go-Live Sign-Off

- [ ] All tests pass (CI/CD green)
- [ ] First customer configured and ready
- [ ] Deployment checklist completed (this document, 100%)
- [ ] Runbook for incident response ready
- [ ] Support email/Slack ready (you respond to issues)

---

**Do not route live customer calls or process live payments until every
item above is checked off.**
