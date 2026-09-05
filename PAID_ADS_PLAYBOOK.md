# Zenna Paid Ads Playbook (Meta & Google Ads)

> **Objective:** Execute high-ROI, low-CAC paid acquisition campaigns targeting Australian and New Zealand trade business owners. Target CAC: <$35 (Meta) / <$50 (Google Search). Initial Budget: $40/day ($1,200/month).

---

## 1. Campaign Structure & Budget Allocation

```
                        TOTAL DAILY BUDGET: $40 / DAY
                                      │
             ┌────────────────────────┴────────────────────────┐
             ▼                                                 ▼
   META (FB/IG) ADS ($25/day)                        GOOGLE SEARCH ADS ($15/day)
   ├─ TOFU Prospecting ($15/day)                     └─ High-Intent Search ($15/day)
   └─ BOFU Retargeting ($10/day)                        - "AI receptionist plumber"
                                                        - "tradie answering service"
```

---

## 2. Meta (Facebook & Instagram) Ads Blueprint

### Campaign 1: TOFU Prospecting (Broad & Interest Targeting)
- **Objective:** Leads / Website Conversions (`trial_started`).
- **Daily Budget:** $15/day.
- **Geographic Location:** Australia & New Zealand (Target top trade metro regions: Sydney, Melbourne, Brisbane, Perth, Auckland, Wellington, Christchurch).
- **Demographics:** Men & Women, Age 25–55.
- **Detailed Targeting (Interests):**
  - *Job Titles / Industry:* Plumbing, Electrical contracting, HVAC, Construction, Tradesperson.
  - *Business Admins:* Facebook Business Page Admins, Small Business Owners.
  - *Tool Brands:* Milwaukee Tool, DeWalt, Makita Australia, Reece Plumbing, Middy's Electrical.

### Campaign 2: BOFU Retargeting (High-Intent Visitors)
- **Objective:** Conversions (`trial_started`).
- **Daily Budget:** $10/day.
- **Custom Audience:** Website visitors (Last 30 days) EXCLUDING existing active subscribers (`subscription_created`).
- **Ad Creative:** Customer testimonial videos (Dave's Plumbing 45s clip) + 7-Day Free Trial Urgency.

---

## 3. Creative Matrix & Assets

| Ad Angle | Ad Format | Primary Headline | Visual Hook | Primary CTA |
| :--- | :--- | :--- | :--- | :--- |
| **Problem Hook** | Video (15s vertical) | "Stop Losing $3k/wk on Site" | Tradie holding pipes with phone ringing in pocket | Try 7 Days Free |
| **Social Proof** | Raw iPhone Video (45s) | "How Dave Added 3 Jobs/Week" | Auckland plumber speaking in front of work ute | Watch Proof |
| **Financial ROI** | Carousel / Static Graphic | "1 Job Pays for 1 Year of Zenna" | Screenshot of Zenna Dashboard + $1,200 job log | Calculate Savings |
| **Direct Feature** | GIF / Screen Capture | "AI Receptionist That Auto-Texts" | Animation of call coming in → auto-text sent in 3s | Start Free Trial |

---

## 4. Google Search Ads Blueprint

### Campaign Setup & Bidding Strategy
- **Campaign Type:** Search Only (No Display expansion).
- **Bidding Strategy:** Maximize Conversions (Target CPA: $45 AUD).
- **Daily Budget:** $15/day.

### Ad Group 1: Plumber & Tradie Call Answering (Exact & Phrase Match)
- **Target Keywords:**
  - `[AI receptionist for plumbers]`
  - `"answering service for plumbers"`
  - `[plumbing business call software]`
  - `"missed call text back for tradies"`
  - `[virtual receptionist trades Australia]`

### Negative Keyword Master List (Save Budget)
- `free`, `jobs`, `employment`, `salary`, `diy`, `course`, `training`, `apprentice`, `cheap`, `meaning`, `wikipedia`.

---

## 5. Conversion Tracking Architecture

Ensure Meta Pixel and Google Conversion Tags fire on key web actions:

```
  Website Visitor ──► Views Pricing Page ──► Clicks Free Trial ──► Completes Signup
                                                                           │
                                                                           ▼
                                                                  FIRES CUSTOM EVENT:
                                                                 - Meta Pixel: 'Lead'
                                                                 - Google Tag: 'trial_started'
                                                                 - Stripe Webhook: 'subscription_created'
```

---

## 6. Optimization & Rules for Scaling

1. **Kill Rule:** If an ad set spends **2x Target CAC ($70)** without generating a trial signup, turn it OFF immediately.
2. **Scale Rule:** Increase budget by **20% every 48 hours** on ad sets with CAC < $30 and Trial Conversion Rate > 20%.
3. **Ad Creative Fatigue Rule:** Refresh video hooks every 14 days to prevent ad fatigue in AU/NZ audience pools.
