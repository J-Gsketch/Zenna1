<div align="center">

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>Built with AI Studio</h1>

  <p>The fastest path from prompt to production with Gemini.</p>

  <a href="https://aistudio.google.com/apps">Start building</a>

</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b6b91c21-42f1-486f-a5f7-6ab0804105e0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Zenna AI Receptionist

This app is **Zenna**, a multi-tenant AI receptionist for service
businesses (plumbing, electrical, etc.) that answers missed calls and SMS,
qualifies leads, and books jobs automatically via Gemini, Twilio, Stripe,
and Google Calendar/Drive.

### Going to market

| Topic | Doc |
|---|---|
| Production deployment & environment setup | [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) |
| Customer self-onboarding flow | [`docs/ONBOARDING.md`](docs/ONBOARDING.md) |
| API reference | [`docs/API.md`](docs/API.md) |
| Troubleshooting | [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) |
| Security & compliance checklist | [`docs/SECURITY.md`](docs/SECURITY.md) |
| Landing page messaging & customer success | [`docs/MARKETING.md`](docs/MARKETING.md) |
| Pricing tiers & feature matrix | [`features/copilot/plans/README.md`](features/copilot/plans/README.md) |
| AI system prompt template | [`SYSTEM_INSTRUCTIONS.md`](SYSTEM_INSTRUCTIONS.md) |

The app is multi-tenant out of the box: each customer configures their own
business name, owner, call-out fee, and booking link through the
onboarding dashboard, and their AI receptionist prompt is generated
dynamically from that configuration — no code changes needed per customer.
