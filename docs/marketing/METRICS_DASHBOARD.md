# Metrics Dashboard — Weekly / Monthly / Quarterly KPIs

> Single reference for every number the agent tracks. Implementation: Google Sheets (daily/weekly log) + Stripe Dashboard (revenue truth) + GA4 (traffic truth). The founder reads the weekly summary; the agent lives in the detail.

## Daily Log (agent, 30 min/day)

| Metric | Source |
|---|---|
| New signups (trial + free) | Product DB / Stripe |
| Trial → paid conversions | Stripe |
| Churn (cancellations) | Stripe |
| Email open / click rates | SendGrid |
| Website traffic by source | GA4 |
| Organic keyword rankings (top 10 tracked) | Rank tracker / Search Console |

## Weekly KPIs (Friday standup)

| KPI | Target | Red flag |
|---|---|---|
| New customers | Phase plan ([QUARTERLY_PHASES.md](./QUARTERLY_PHASES.md)) | 2 consecutive weeks <70% of plan |
| Trial → paid conversion | 3–5% | <2% |
| Blended CAC | <$50 | >$65 |
| Organic traffic | +30% MoM pace | Flat 2 weeks |
| Content shipped vs. calendar | 100% | <80% |
| Outreach sent vs. plan | 100% | <80% |
| Partnership conversations started | 2–3/week | 0 for 2 weeks |
| Referrals | Growing WoW | Flat 3 weeks |

## Monthly KPIs (month-end review)

| KPI | Target | Notes |
|---|---|---|
| MRR growth | 10–15% MoM | Ultimate metric |
| New customers | Phase ramp (20 → 50 → 100 → 200/mo) | |
| CAC (blended) | <$50 | By channel breakdown required |
| LTV | Calculate; LTV:CAC ≥ 3:1 | Stripe data |
| Churn | <3% (trending <2%) | >4% = product escalation |
| NPS | 65+ (trending 70+) | Automated in-app survey |
| Organic traffic | +30% MoM | GA4 |
| Email list growth | +20% MoM | SendGrid/Mailchimp |
| ROAS (paid) | ≥ 5:1 | Per channel |
| Case studies published | 4/month | Social proof engine |
| Partner launches | 1–2/quarter (≥1/mo in pipeline) | |

## Quarterly KPIs (phase gate)

| KPI | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| Customers (cumulative) | 50 | 200 | 500 | 1,000 |
| Subscription MRR | $5K | $50K | $120K | $250K |
| Integrations + white-label MRR | $0 | $2K | $10K | $50K |
| Organic traffic /month | 3K | 10K | 25K | 50K |
| YouTube subscribers | 250 | 1K | 10K | 50K |
| Active partnerships | 1 | 5 | 10 | 20 |
| Podcast/press appearances | 2–3 | 4 | 6 | 8 |
| NPS | baseline | 65 | 68 | 70 |
| Monthly churn | <5% | <3% | <2.5% | <2% |

## Weekly Metrics Report Format (agent files every Friday)

```
Week of: [date]
Phase: [Q1 Launch]  Week [#] of phase

HEADLINE NUMBERS
- Customers: [+N this week] → [total] (target [N])
- MRR: $[X] ([+/-]% WoW)
- CAC: $[X] blended | FB: $[X] | Google: $[X] | Organic: $[X]
- Churn: [N] cancellations ([X]%)

WINS
- [what worked, with numbers]

BLOCKERS
- [what underperformed, hypothesis, proposed fix]

NEXT WEEK
- [top 3 priorities]
```

## Pivot Triggers (from [QUARTERLY_PHASES.md](./QUARTERLY_PHASES.md))

Any red flag held for the stated duration forces a documented decision at the Friday standup: fix, pause, or pivot. No silent drift.
