# Troubleshooting Guide — Zenna by Hammer & Code

Common issues and resolution steps for **Zenna by Hammer & Code**.

---

## 1. Twilio SMS Not Delivered
- **Symptom**: Incoming call receives no SMS text-back.
- **Root Cause**: Carrier filtering due to long messages or missing credentials.
- **Resolution**:
  - Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` in `.env`.
  - Ensure reply text is under 120 plain ASCII characters (emojis removed for international carrier stability).

## 2. Gemini API Rate Limits or Timeout
- **Symptom**: AI response returns fallback message ("G'day! Zenna here...").
- **Root Cause**: Invalid API key or quota exceeded.
- **Resolution**:
  - Test `GEMINI_API_KEY` in Google AI Studio console.
  - Server automatically falls back across `gemini-2.5-flash`, `gemini-1.5-flash`, and standard template response.

## 3. Stripe Webhook Signature Verification Failure
- **Symptom**: `400 Bad Request` on `/api/stripe-webhook`.
- **Root Cause**: `STRIPE_WEBHOOK_SECRET` mismatch or modified raw body.
- **Resolution**:
  - Ensure raw body is preserved before JSON parsing (`express.raw({ type: 'application/json' })`).
  - Copy secret from Stripe Dashboard -> Developers -> Webhooks.

## 4. Multi-Tenant Lookup Failures
- **Symptom**: Calls not mapping to correct business settings.
- **Resolution**:
  - Confirm Twilio phone number is registered under `tenants` collection with matching `twilio_number` field.
