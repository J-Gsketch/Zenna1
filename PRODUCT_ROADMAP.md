# Zenna Product Roadmap: Feature Matrix & Technical Architecture

> **Product Vision:** Build the world's most intuitive, high-velocity AI receptionist platform designed specifically for trade businesses, driving seamless call qualification, auto-booking, and revenue expansion.

---

## 1. Growth Phase Alignment Matrix

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         PRODUCT ROADMAP HORIZONS                        │
  ├───────────────────┬───────────────────┬───────────────────┬─────────────┤
  │ PHASE 1           │ PHASE 2           │ PHASE 3           │ PHASE 4     │
  │ Foundation        │ Traction          │ Scale             │ Dominance   │
  │ (Weeks 1 - 4)     │ (Weeks 5 - 12)    │ (Weeks 13 - 26)   │ (Months 7-12│
  │ 10 Customers      │ 50 Customers      │ 200 Customers     │ 500+ Cust.  │
  ├───────────────────┼───────────────────┼───────────────────┼─────────────┤
  │ - Multi-Tenant    │ - Gemini 2.0 Voice│ - WhatsApp / SMS  │ - White-Label
  │   Architecture    │   Media Streams   │   Multi-Channel   │   Portal    │
  │ - Stripe Billing  │ - ServiceM8 &     │ - Custom Voice    │ - Xero/MYOB │
  │   ($99/$249/$499) │   Jobber Webhooks │   Cloning         │   Invoicing │
  │ - Google Calendar │ - Instant Lead    │ - Multi-Van Fleet │ - Enterprise│
  │   Sync            │   Qualification   │   Dispatch Routing│   API       │
  └───────────────────┴───────────────────┴───────────────────┴─────────────┘
```

---

## 2. Phase-by-Phase Feature Breakdown

### Phase 1: Foundation (Weeks 1–4) — First 10 Customers
- [x] **Multi-Tenant Firestore Isolation:** Tenant configuration per tradie (`businessName`, `calloutFee`, `region`, `currency`).
- [x] **Stripe Subscription Billing:** Support for $99 (Solo), $249 (Pro), and $499 (Fleet) plans with 7-day free trial.
- [x] **Twilio Call Routing & SMS Text-Back:** Missed call detection forwarding to instant SMS auto-responder.
- [x] **Google Calendar Integration:** Direct calendar access to check availability and write booked slots.
- [x] **Cyberpunk Dashboard UI:** Real-time call logs, lead status, and interactive test call simulator.

---

### Phase 2: Traction (Weeks 5–12) — 50+ Customers ($7k-$10k MRR)
- [ ] **Real-Time Gemini Voice Assistant (Twilio Media Streams):**
  - Ultra-low latency (< 1.5s) bi-directional voice assistant using Google Gemini.
  - Custom brand voice configuration (Aussie & Kiwi regional accents).
- [ ] **Jobber & ServiceM8 Native Webhook Sync:**
  - Automatically create lead records in popular trade CRMs when Zenna qualifies a call.
- [ ] **Instant Lead Qualification Engine:**
  - AI parses emergency level ("burst pipe" vs "quote request") and alerts tradie mobile via SMS priority dispatch.
- [ ] **In-App Referral & Affiliate Portal:**
  - Self-serve dashboard for tradies to share referral links and track $50 credit payouts.

---

### Phase 3: Scale (Weeks 13–26) — 200+ Customers ($30k+ MRR)
- [ ] **Multi-Channel AI Receptionist (SMS + WhatsApp + Voice):**
  - Handle customer inquiries seamlessly across SMS, WhatsApp Business API, and Voice inbound.
- [ ] **Custom AI Voice Cloning:**
  - Tradies can record 3 minutes of their own voice to clone as their personalized receptionist.
- [ ] **Multi-Van Fleet Dispatching:**
  - Route incoming calls to specific technicians based on suburb/postcode geography.
- [ ] **Advanced Call Analytics & ROI Insights:**
  - Weekly report detailing total calls caught, revenue generated, and top requested suburbs.

---

### Phase 4: Market Dominance (Months 7–12) — 500+ Customers ($75k+ MRR)
- [ ] **Xero & MYOB Automated Invoice Generation:**
  - Automatically issue call-out deposit invoices ($150) upon booking.
- [ ] **White-Label Agency Portal:**
  - Allow trade business coaches and supply shops to rebrand Zenna under their own label.
- [ ] **Enterprise API & Custom Webhooks:**
  - Public API for large commercial plumbing and electrical franchises (> 20 vans).

---

## 3. Customer Feedback Loop & Feature Prioritization

1. **NPS Feedback Loop:** Automated NPS survey triggered on Day 30 (`"How likely are you to recommend Zenna to a fellow tradie?"`).
2. **Public Product Roadmap & Feature Voting Board:** Tradies vote on upcoming integrations (e.g., "Add Fergus Integration"). Features with > 20 votes get fast-tracked into the sprint cycle.
