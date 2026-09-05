# Zenna by Hammer & Code — Autonomous AI Receptionist & Multi-Tenant Platform

[![Zenna by Hammer & Code](https://img.shields.io/badge/Brand-Zenna%20by%20Hammer%20%26%20Code-ff6a1a.svg)](https://zenna.au)
[![Platform](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Express%20%7C%20Firebase-blue.svg)](#)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%202.5-gold.svg)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-slate.svg)](#)

> **Never miss a lead. Stay on the tools.**  
> Zenna by Hammer & Code is an autonomous multi-tenant AI receptionist engineered for tradies, contractors, and service businesses across Australia, New Zealand, and global markets.

---

## ⚡ Core Capabilities

- **24/7 AI Receptionist Call Answering**: Powered by Google Gemini 2.5, Zenna answers calls, qualifies caller logistics, states call-out fees, and schedules appointments.
- **Dynamic Customer Configuration**: Replace hardcoded business details with tenant-configured business name, owner name, call-out fee, region (AU/NZ/US), and booking links.
- **Multi-Tenant Architecture**: One application serves multiple trade business tenants isolated by `tenant_id`.
- **Pricing & Plans Engine (`features/copilot/plans/`)**: Starter ($99/mo), Pro ($199/mo), and Enterprise ($399/mo) plan definitions with dual-currency Stripe billing integration.
- **Stripe Invoicing & Subscriptions**: Collect automated call-out fee deposits and recurring SaaS subscriptions.
- **Twilio Telephony & Auto SMS**: Instant missed-call text-backs under 3 seconds.
- **6 PM Daily Executive Briefing**: Automated evening SMS wrap-up sent directly to the business owner.
- **Automated Marketing & Ad Studio**: Built-in Hammer & Code creative generator for TikTok/Meta video ad scripts, social blueprints, and partnership agreements.

---

## 🏗️ Repository & Module Architecture

```
Zenna1/
├── features/copilot/plans/       # Pricing tiers, feature matrix, schema & Stripe billing helpers
│   ├── schema.ts                 # TypeScript types & validation schemas
│   ├── plans.ts                  # Starter, Pro, Enterprise tier definitions
│   ├── featureMatrix.ts          # Feature comparison matrix
│   ├── stripeIntegration.ts      # Stripe checkout session generator & webhook helpers
│   ├── index.ts                  # Re-export module entrypoint
│   └── README.md                 # Plans architecture documentation
├── docs/                         # Production & Onboarding Documentation Suite
│   ├── DEPLOYMENT.md             # Production deployment & environment guide
│   ├── DEPLOYMENT_CHECKLIST.md   # Deployment pre-flight checklist
│   ├── SETUP_GUIDE.md            # Setup guide for first-time operators
│   ├── ONBOARDING_GUIDE.md       # Self-serve customer onboarding guide
│   ├── API_DOCUMENTATION.md      # REST API & Webhook specifications
│   ├── TROUBLESHOOTING.md        # Troubleshooting & diagnostic guide
│   ├── BRAND_GUIDELINES.md       # Visual & tone guidelines
│   ├── LANDING_MESSAGING.md      # Landing page positioning
│   ├── CUSTOMER_SUCCESS.md       # Retention & 6 PM briefing materials
│   ├── SECURITY_COMPLIANCE.md    # Data isolation & PCI checklist
│   └── PARTNER_COLLATERAL.md     # Trade group co-marketing materials
├── src/                          # React Frontend Source Code
│   ├── App.tsx                   # Main App layout & Landing page
│   ├── components/               # Cyberpunk Dashboard, Onboarding Modal, Hammer & Code Hub
│   └── video/                    # Remotion Video Marketing Components
├── server.ts                     # Express Multi-Tenant Backend (Gemini, Twilio, Stripe)
├── db.ts                         # Multi-tenant Firestore & SQLite Database Layer
├── SYSTEM_INSTRUCTIONS.md        # Dynamic Master System Prompt Specifications
└── firebase.json                 # Firebase Hosting & Functions Config
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js v20+ installed.

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and insert your credentials:
```bash
cp .env.example .env
```

Key environment variables:
```env
BUSINESS_NAME="Zenna by Hammer & Code"
GEMINI_API_KEY="your_gemini_key"
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your_twilio_token"
STRIPE_SECRET_KEY="sk_live_..."
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the application.

---

## 🛠️ Build & Verification Commands

```bash
# Typecheck TypeScript files
npm run lint

# Build production bundle (Vite + esbuild server)
npm run build
```

---

## 📄 License & Brand Notice

© 2026 Hammer & Code. **Zenna by Hammer & Code** is a registered trademark and software service. All rights reserved.
