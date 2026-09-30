# Marketing Tools & Stack — Recommended Software + Setup Guide

> The marketing agent's complete toolchain. Setup is a one-time Week 1 task; after that everything runs on automation.

## Brand & Email Identity

**Brand architecture (fixed):**
- **Hammer & Code** — parent company. Used for corporate/legal, hiring, investor material, and future products. Owns the corporate domain.
- **Zenna** — product #1. All customer-facing marketing ships under the Zenna brand. Owns the product domain (e.g. `zenna.com.au`).

**Email sending domains (deliverability is non-negotiable):**

| Purpose | From address | Domain |
|---|---|---|
| Product transactional (trial, billing, notifications) | `hello@zenna.com.au` | Product domain |
| Marketing sequences (newsletter, nurture) | `news@zenna.com.au` | Product domain |
| Partnership/corporate outreach | `partners@hammerandcode.com` | Corporate domain |

**Setup checklist (Week 1, before any campaign sends):**
- [ ] Register/confirm product + corporate domains
- [ ] Configure **SPF** records for both sending domains (include SendGrid + Google Workspace as senders)
- [ ] Configure **DKIM** signing in SendGrid for both domains
- [ ] Publish **DMARC** policy (`p=quarantine` minimum; move to `p=reject` after 30 days clean)
- [ ] Set up custom tracking domain (e.g. `link.zenna.com.au`) so link reputation is ours
- [ ] Warm up new domains: start at <50 emails/day, ramp over 3–4 weeks
- [ ] Verify with mail-tester.com (score ≥ 9/10) before the first campaign
- [ ] Never send marketing from a free mailbox (Gmail/Outlook) — kills deliverability and brand trust

---

## Content Production

| Tool | Use | Setup notes |
|---|---|---|
| Notion | Planning, SOPs, this playbook's working copy | Duplicate [CONTENT_CALENDAR_TEMPLATE.md](./CONTENT_CALENDAR_TEMPLATE.md) into a Notion database |
| Google Docs | Writing | Shared "Zenna Content" drive folder |
| Canva | Graphics, thumbnails, quote cards | Brand kit: Zenna colours/logo; Hammer & Code in footer imprint only |
| CapCut / Adobe Premiere | Video editing | Freelancer's choice; agent QC's output |
| Descript | Video transcription + edit | Feed demo recordings → cut + captions |
| Zenna marketing factory | Automated ad creative variants | `scripts/marketing-factory/index.ts` (Gemini → Veo → ElevenLabs → Remotion) — needs `GEMINI_API_KEY`, `ELEVENLABS_API_KEY` in env |

## Distribution

| Tool | Use | Setup notes |
|---|---|---|
| WordPress | Blog hosting on product domain | Yoast/RankMath for SEO; fast theme; blog at `/blog` |
| YouTube | Video platform | Brand account under Zenna; consistent thumbnails |
| Buffer (or Later) | Social scheduling | Queue 3 posts/week minimum; connect FB/LinkedIn/IG |
| SendGrid | Transactional + sequence email | Authenticate both domains (see above) |
| Mailchimp | Newsletter (if not using SendGrid for it) | Same authentication rules apply |

## Analytics

| Tool | Use | Setup notes |
|---|---|---|
| Google Analytics 4 | Website traffic | Goals: signup, trial start, demo booked |
| Stripe Dashboard | MRR, churn, LTV | Source of truth for revenue metrics |
| Amplitude or Mixpanel | User behaviour | Trial activation funnel, feature usage |
| Airtable | Content calendar + partner tracker | Import [PARTNER_TRACKER.md](./PARTNER_TRACKER.md) as base |
| Google Sheets | Weekly metrics dashboard | Template in [METRICS_DASHBOARD.md](./METRICS_DASHBOARD.md) |

## Ads & Outreach

| Tool | Use | Setup notes |
|---|---|---|
| Facebook Ads Manager | Paid social | Pixel on site; lookalike audiences from customer list |
| Google Ads | Search ads | Start: "missed call plumber", "tradie answering service", competitor terms |
| Mailshake or Lemlist | Cold email sequences | Connected to `partners@hammerandcode.com` (authenticated) |
| LinkedIn Sales Navigator | Partner research | Build lists from [PARTNER_TRACKER.md](./PARTNER_TRACKER.md) categories |
| Calendly | Booking partner calls | Agent's calendar, not founder's |

## Automation & Support (zero-founder ops)

| Tool | Use |
|---|---|
| Stripe | Subscriptions, retries, referral credits — fully automated |
| Twilio | SMS notifications to customers |
| Zenna AI chatbot | First-line support on the marketing site (yes — Zenna runs on Zenna) |
| Firebase Functions | Event-driven email/SMS triggers (trial started, payment failed, win-back) |

## Cost Summary

~$300/month in Q1–Q2 scaling within the tools line of [MARKETING_BUDGET.md](./MARKETING_BUDGET.md). Free tiers cover most tools until Q3.
