# Production Deployment Guide — Zenna by Hammer & Code

This guide outlines the production deployment strategy for **Zenna by Hammer & Code** across Vite/React frontend, Node.js Express server, and Firebase Hosting / Functions.

---

## 1. Prerequisites & Environment Architecture

Before deploying to production, ensure you have:
- **Node.js**: v20 LTS installed.
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google AI Studio API Key**: Gemini 2.5 Flash / 1.5 Pro enabled.
- **Twilio Account**: Account SID, Auth Token, and regional AU/NZ/US phone numbers.
- **Stripe Account**: Secret key (`sk_live_...`) and webhook signing secret.

---

## 2. Environment Configuration Best Practices

Create `.env` (or set environment variables in Firebase functions config / GitHub Secrets):

```bash
PORT=3000
NODE_ENV=production
SECRET_KEY=your_production_jwt_secret

# Business Defaults
BUSINESS_NAME="Zenna by Hammer & Code"
OWNER_NAME="Dave"
OWNER_PHONE="+61400000000"
BOOKING_LINK="https://hammer-and-code.web.app/book"
CALLOUT_FEE="$150"

# AI Provider
GEMINI_API_KEY=your_gemini_api_key

# Telephony
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=+61291234567

# Billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://hammer-and-code.web.app/dashboard?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=https://hammer-and-code.web.app/pricing

# Monitoring & Alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00/B00/X00
```

---

## 3. Build & Bundling Instructions

Build the Vite React frontend and Node.js backend server:

```bash
# Typecheck & Lint
npm run lint

# Build Frontend & Server
npm run build
```

This creates:
- `dist/` — Optimized frontend static assets.
- `dist-server/server.js` — Single bundled Node.js server executable.

---

## 4. Firebase Hosting & Functions Deployment Automation

Firebase is configured in `firebase.json` and `.firebaserc`.

### Automated GitHub Actions Workflow (`.github/workflows/firebase-deploy.yml`):
On push to `main`, GitHub Actions automatically installs dependencies, builds static & server bundles, and deploys to Firebase Hosting.

### Manual Firebase CLI Deployment:
```bash
firebase login
firebase deploy --only hosting
```

---

## 5. Error Handling, Logging & Monitoring Infrastructure

1. **Slack VIP Alert Webhooks**:
   Critical errors and completed payment conversions automatically post formatted alerts to `SLACK_WEBHOOK_URL`.
2. **Health Check Endpoint**:
   `GET /api/health` returns status code `200` with database connection state:
   ```json
   { "status": "ok", "product": "Zenna by Hammer & Code", "db": "Firestore Active" }
   ```
3. **Structured Error Logging**:
   All server routes implement `try/catch` blocks with fallback mock responses to ensure zero downtime during external API degradations.
