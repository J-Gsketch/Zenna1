# Financial Tracking Guide

> MRR, burn rate, runway calculations, and financial reporting for Zenna.

---

## Financial Metrics Definitions

### Revenue Metrics

| Metric | Formula | Description |
|---|---|---|
| MRR (Monthly Recurring Revenue) | Sum of all active monthly subscriptions | Predictable monthly revenue |
| ARR (Annual Recurring Revenue) | MRR × 12 | Annualised recurring revenue |
| ARPU (Average Revenue Per User) | MRR / Total Active Customers | Revenue per customer per month |
| Expansion Revenue | Revenue from upsells, add-ons, upgrades | Growth from existing customers |
| Contraction Revenue | Revenue lost from downgrades | Revenue reduction (not churn) |
| Net Revenue Retention | (Starting MRR + Expansion − Contraction − Churn) / Starting MRR | Overall revenue retention |

### Cost Metrics

| Metric | Formula | Description |
|---|---|---|
| CAC (Customer Acquisition Cost) | Total S&M Spend / New Customers | Cost to acquire one customer |
| COGS (Cost of Goods Sold) | Hosting + Twilio + Stripe fees + support costs | Direct cost of serving customers |
| Gross Margin | (Revenue − COGS) / Revenue | Profit margin before operating expenses |
| Burn Rate | Total Expenses − Total Revenue | Net cash outflow per month |
| Runway | Cash On Hand / Monthly Burn Rate | Months until we run out of money |

### Unit Economics

| Metric | Formula | Target |
|---|---|---|
| LTV (Lifetime Value) | ARPU × Gross Margin × Avg Lifespan (months) | $1,000+ |
| LTV:CAC Ratio | LTV / CAC | 3:1+ |
| CAC Payback Period | CAC / (ARPU × Gross Margin) | <6 months |
| Magic Number | (Current Qtr Revenue − Prior Qtr Revenue) × 4 / Prior Qtr S&M Spend | >0.75 |

---

## MRR Tracking

### MRR Calculation

```
MRR = Σ (Active Subscriptions × Monthly Price)

Example:
  20 customers × $99/mo (Starter)  = $1,980
  10 customers × $249/mo (Pro)     = $2,490
  2 customers  × $500/mo (Enterprise) = $1,000
  ─────────────────────────────────
  Total MRR = $5,470
```

### MRR Movement

```
New MRR        = MRR from new customers this month
Expansion MRR  = MRR from upgrades/upsells
Contraction MRR = MRR lost from downgrades
Churned MRR    = MRR lost from cancellations

Net New MRR = New MRR + Expansion MRR − Contraction MRR − Churned MRR
Ending MRR = Starting MRR + Net New MRR
```

### Monthly MRR Tracking Table

| Month | Starting MRR | New | Expansion | Contraction | Churned | Net New | Ending MRR |
|---|---|---|---|---|---|---|---|
| Month 1 | $0 | — | — | — | — | — | — |
| Month 2 | — | — | — | — | — | — | — |
| Month 3 | — | — | — | — | — | — | — |

---

## Expense Tracking

### Monthly Expense Categories

| Category | Budget | Actual | Variance | Notes |
|---|---|---|---|---|
| **Personnel** | | | | |
| Salaries | $— | $— | — | |
| Contractor fees | $— | $— | — | |
| Superannuation | $— | $— | — | |
| Payroll tax | $— | $— | — | |
| **Technology** | | | | |
| Firebase hosting | $— | $— | — | |
| Twilio | $— | $— | — | |
| Stripe fees | $— | $— | — | |
| SaaS tools | $— | $— | — | |
| Domain & SSL | $— | $— | — | |
| **Marketing** | | | | |
| Advertising | $— | $— | — | |
| Content creation | $— | $— | — | |
| Events/sponsorships | $— | $— | — | |
| **Operations** | | | | |
| Legal & accounting | $— | $— | — | |
| Insurance | $— | $— | — | |
| Office/coworking | $— | $— | — | |
| Bank fees | $— | $— | — | |
| **Total** | **$—** | **$—** | **—** | |

---

## Runway Calculation

### Simple Runway

```
Runway (months) = Cash On Hand / Monthly Burn Rate

Example:
  Cash on hand: $100,000
  Monthly revenue: $5,000
  Monthly expenses: $15,000
  Monthly burn: $10,000
  Runway: 10 months
```

### Runway Scenarios

| Scenario | Monthly Burn | Cash | Runway | Action |
|---|---|---|---|---|
| Current | $— | $— | — months | — |
| If revenue grows 20%/mo | $— | $— | — months | — |
| If we cut costs 20% | $— | $— | — months | — |
| If we raise $500K | $— | $600K+ | — months | — |

### Runway Alerts

| Runway | Status | Action |
|---|---|---|
| 18+ months | ✅ Healthy | Continue as planned |
| 12–18 months | 👀 Monitor | Start planning next raise or profitability push |
| 6–12 months | ⚠️ Warning | Reduce discretionary spending, accelerate revenue |
| <6 months | 🚨 Critical | Immediate cost cuts, emergency fundraising, or bridge |

---

## Financial Reports

### Monthly P&L Template

```
ZENNA — PROFIT & LOSS STATEMENT
Period: [Month Year]

REVENUE
  Subscription Revenue (MRR)        $_________
  One-Time Revenue                   $_________
  Other Revenue                      $_________
  ─────────────────────────────────
  Total Revenue                      $_________

COST OF GOODS SOLD (COGS)
  Firebase / Hosting                 $_________
  Twilio (telephony)                 $_________
  Stripe (payment processing)        $_________
  Customer Support                   $_________
  ─────────────────────────────────
  Total COGS                         $_________

GROSS PROFIT                         $_________
Gross Margin                         ____%

OPERATING EXPENSES
  Salaries & Benefits                $_________
  Marketing & Advertising            $_________
  SaaS Tools & Software              $_________
  Legal & Accounting                 $_________
  Insurance                          $_________
  Office & Admin                     $_________
  Other                              $_________
  ─────────────────────────────────
  Total Operating Expenses           $_________

NET INCOME (LOSS)                    $_________
Net Margin                           ____%
```

### Monthly Cash Flow Template

```
ZENNA — CASH FLOW STATEMENT
Period: [Month Year]

OPENING CASH BALANCE                 $_________

CASH INFLOWS
  Customer Payments                  $_________
  Investment/Funding                 $_________
  Other                              $_________
  ─────────────────────────────────
  Total Inflows                      $_________

CASH OUTFLOWS
  Salaries                           $_________
  Vendor Payments                    $_________
  Marketing Spend                    $_________
  Other Expenses                     $_________
  ─────────────────────────────────
  Total Outflows                     $_________

NET CASH FLOW                        $_________
CLOSING CASH BALANCE                 $_________
RUNWAY (months)                      _________
```

---

## Financial Cadence

| Frequency | Report | Owner |
|---|---|---|
| Daily | Cash balance check | Ops Manager |
| Weekly | MRR update, burn rate, runway | Ops Manager |
| Monthly | P&L, balance sheet, cash flow | Accountant |
| Quarterly | Board report, financial forecast | CFO/Founder |
| Annually | Tax return, annual budget | Accountant |

---

*Last updated: September 2026*
