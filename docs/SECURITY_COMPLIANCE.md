# Security & Compliance Checklist — Zenna by Hammer & Code

Security protocols and compliance architecture for **Zenna by Hammer & Code**.

---

- [x] **Data Isolation**: Multi-tenant database queries strictly filtered by `tenant_id` at Firestore / SQLite level.
- [x] **Authentication**: Firebase Auth token verification middleware (`****** on all administrative API endpoints.
- [x] **PCI DSS Compliance**: Stripe Checkout handles payment card processing; no raw credit card details are stored or logged.
- [x] **Sanitization & Telephony**: SMS replies sanitized of special non-ASCII characters to prevent carrier payload injection.
- [x] **API Key Security**: Environment variables used for all API secrets (`GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `TWILIO_AUTH_TOKEN`).
- [x] **Slack Audit Logging**: Critical errors and webhook failures logged to private Slack alert webhooks.
