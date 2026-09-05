# First-Time Setup & Deployment Guide — Zenna by Hammer & Code

This guide provides a step-by-step walkthrough for first-time operators deploying **Zenna by Hammer & Code**.

---

## 1. Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/J-Gsketch/Zenna1.git
   cd Zenna1
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Launch Local Server & Frontend**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 2. Setting Up External Integrations

### A. Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API key.
3. Paste the key into `GEMINI_API_KEY` in `.env`.

### B. Twilio Telephony
1. Sign up at [Twilio](https://www.twilio.com/).
2. Purchase local phone numbers (AU, NZ, or US).
3. Set your webhook URLs in Twilio Console:
   - Voice Webhook: `https://<your-domain>/webhook/missed-call`
   - SMS Webhook: `https://<your-domain>/webhook/sms`

### C. Stripe Invoicing & Subscriptions
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Obtain your Secret API Key (`sk_live_...` or `sk_test_...`).
3. Set up a Webhook endpoint pointing to `https://<your-domain>/api/stripe-webhook` listening for `checkout.session.completed`.
