# Zenna Product Roadmap — Detailed (Q1–Q4)

> 12-month product roadmap with feature priorities, specs, and success criteria.

---

## Q1 — MVP Features

> **Theme:** Nail the core value proposition. Get customers to "aha moment" fast.

### 1.1 AI Call Answering
- **Priority:** P0 (Must-have)
- **Effort:** 4 weeks
- **Description:** AI receptionist answers inbound calls, greets callers, captures name/number/intent
- **Acceptance Criteria:**
  - Answers within 2 rings
  - Captures caller name, phone, suburb, and job description
  - Handles 95%+ of calls without human escalation
  - Works with Australian accents and colloquialisms
- **Metric:** 90%+ call capture rate

### 1.2 Booking & Scheduling
- **Priority:** P0 (Must-have)
- **Effort:** 3 weeks
- **Description:** Book qualified leads into Dave's calendar with real-time availability
- **Acceptance Criteria:**
  - Syncs with Google Calendar
  - Prevents double-booking
  - Sends confirmation SMS to customer
  - Supports rescheduling
- **Metric:** <2% booking errors

### 1.3 Deposit Collection (Stripe)
- **Priority:** P0 (Must-have)
- **Effort:** 2 weeks
- **Description:** Collect call-out/diagnostic fee deposits via Stripe payment links
- **Acceptance Criteria:**
  - Generates Stripe payment link after booking
  - Sends link via SMS (Twilio)
  - Confirms payment before locking calendar slot
  - Handles refunds for cancellations
- **Metric:** 80%+ deposit collection rate

### 1.4 Calendar Sync
- **Priority:** P1 (Should-have)
- **Effort:** 2 weeks
- **Description:** Two-way sync between Zenna bookings and Google Calendar
- **Acceptance Criteria:**
  - New bookings appear in Google Calendar within 30 seconds
  - Calendar changes reflect in Zenna availability
  - Handles timezone correctly (AEST/AEDT)
- **Metric:** 100% sync accuracy

---

## Q2 — Expansion Features

> **Theme:** Scale to multi-operator businesses and add analytics.

### 2.1 Multi-Location Support
- **Priority:** P1
- **Effort:** 4 weeks
- **Description:** Support businesses with multiple locations or service areas
- **Acceptance Criteria:**
  - Each location has its own calendar, phone number, and settings
  - Call routing based on caller's suburb
  - Unified dashboard across locations
- **Metric:** 10+ multi-location customers onboarded

### 2.2 Team Management
- **Priority:** P1
- **Effort:** 3 weeks
- **Description:** Manage team members, roles, and permissions
- **Acceptance Criteria:**
  - Admin can add/remove team members
  - Role-based access (admin, technician, viewer)
  - Each technician has their own calendar
- **Metric:** 50%+ of Pro customers use team features

### 2.3 Analytics Dashboard
- **Priority:** P2
- **Effort:** 3 weeks
- **Description:** Business analytics — call volume, booking rate, revenue attribution
- **Acceptance Criteria:**
  - Daily/weekly/monthly call volume charts
  - Booking conversion rate
  - Revenue per call metric
  - Export to CSV
- **Metric:** 70%+ weekly active usage

---

## Q3 — Integration Features

> **Theme:** Open the platform. Build an ecosystem.

### 3.1 Public API
- **Priority:** P1
- **Effort:** 4 weeks
- **Description:** RESTful API for third-party integrations
- **Acceptance Criteria:**
  - CRUD for leads, bookings, customers
  - API key authentication
  - Rate limiting (100 req/min)
  - Webhook support for real-time events
- **Metric:** 5+ active API integrations

### 3.2 White-Label
- **Priority:** P1
- **Effort:** 4 weeks
- **Description:** Partners can rebrand Zenna as their own product
- **Acceptance Criteria:**
  - Custom logo, colours, domain
  - Partner dashboard for managing sub-accounts
  - Revenue share tracking
- **Metric:** 2+ white-label partners signed

### 3.3 Partner Ecosystem
- **Priority:** P2
- **Effort:** 3 weeks
- **Description:** Integration marketplace (Housecall Pro, JobTracker, MYOB, Xero)
- **Acceptance Criteria:**
  - At least 3 live integrations
  - Self-serve integration setup
  - Partner directory page
- **Metric:** 20%+ of customers use at least 1 integration

---

## Q4 — Advanced Features

> **Theme:** AI-powered differentiation. Predictive and proactive.

### 4.1 AI Customisation
- **Priority:** P1
- **Effort:** 4 weeks
- **Description:** Customers can train Zenna on their specific business rules, pricing, FAQs
- **Acceptance Criteria:**
  - Custom greeting messages
  - Business-specific qualification questions
  - Custom call-out fee and pricing rules
  - FAQ knowledge base
- **Metric:** 60%+ of customers customise their AI

### 4.2 Predictive Analytics
- **Priority:** P2
- **Effort:** 4 weeks
- **Description:** Predict busy periods, suggest pricing, identify churn risk
- **Acceptance Criteria:**
  - Weekly demand forecast per location
  - Dynamic pricing suggestions
  - Churn risk score per customer
- **Metric:** 15%+ improvement in booking utilisation

### 4.3 Adjacent Products
- **Priority:** P2 (Explore)
- **Effort:** 4 weeks
- **Description:** Evaluate adjacent products (SMS marketing, review management, quoting)
- **Acceptance Criteria:**
  - Market research completed
  - Prototype for top opportunity
  - Customer validation interviews (10+)
- **Metric:** Go/no-go decision by end of Q4

---

## Feature Prioritisation Framework

| Factor | Weight | Description |
|---|---|---|
| Revenue Impact | 40% | Will this feature increase MRR or reduce churn? |
| Customer Request Volume | 30% | How many customers have asked for this? |
| Complexity | 20% | Engineering effort (inverse — lower effort = higher score) |
| Strategic Alignment | 10% | Does this align with the 12-month vision? |

---

*Last updated: September 2026*
