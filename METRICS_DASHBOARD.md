# Zenna Growth Metrics & SaaS Economics Dashboard

> **Executive Overview:** Complete measurement framework, SaaS unit economics, cohort retention tracking, and 12-month revenue financial projections for Zenna.

---

## 1. Zenna Unit Economics Engine

```
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                        ZENNA UNIT ECONOMICS                              │
   ├───────────────────────────────┬──────────────────────────────────────────┤
   │ Average Revenue Per User (ARPU)│ $150 / month (Blend of Solo & Pro Tiers) │
   │ Customer Acquisition Cost (CAC)│ $30 - $45 (Paid) / $15 - $25 (Organic)  │
   │ Gross Margin                  │ 85% (Twilio + Gemini Voice API Cost ~$22)│
   │ Average Customer Lifetime     │ 24–36 Months                             │
   │ Lifetime Value (LTV)          │ $3,600 – $5,400                          │
   │ LTV : CAC Ratio               │ 10:1 – 15:1 (World-Class SaaS Benchmark) │
   │ CAC Payback Period            │ < 0.3 Months (< 10 Days)                 │
   └───────────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. Growth Target Grid by Phase (12-Month Roadmap)

| Metric | Phase 1 (W4) | Phase 2 (W12) | Phase 3 (W26) | Phase 4 (W52) |
| :--- | :--- | :--- | :--- | :--- |
| **Paying Customers** | 10 | 50 | 200 | 500 |
| **Monthly Recurring Revenue (MRR)** | $1,500 | $7,500 | $30,000 | $75,000 |
| **Annual Run Rate (ARR)** | $18,000 | $90,000 | $360,000 | $900,000 |
| **Blended CAC** | $40 | $30 | $25 | $20 |
| **Trial-to-Paid Conv. Rate** | 15% | 22% | 28% | 32% |
| **Monthly Net Churn Rate** | < 4.0% | < 2.5% | < 1.8% | < 1.2% |
| **Net Promoter Score (NPS)** | 55 | 65 | 72 | 78 |
| **Organic Monthly Traffic** | 500 | 5,000 | 20,000 | 50,000+ |

---

## 3. Metric Formulas & Calculations

### 1. Monthly Recurring Revenue (MRR)
$$\text{MRR} = (\text{Solo Tradies} \times \$99) + (\text{Pro Teams} \times \$249) + (\text{Fleet Tradies} \times \$499)$$

### 2. Customer Acquisition Cost (CAC)
$$\text{CAC} = \frac{\text{Total Marketing Spend (Ads + Software + Content)}}{\text{Total New Paid Subscribers Acquired}}$$

### 3. Customer Lifetime Value (LTV)
$$\text{LTV} = \frac{\text{ARPU} \times \text{Gross Margin \%}}{\text{Monthly Churn Rate}}$$
*Example:* $(\$150 \times 0.85) / 0.025 = \$5,100$

### 4. Trial-to-Paid Conversion Rate
$$\text{Conversion \%} = \left(\frac{\text{New Paid Subscribers}}{\text{7-Day Free Trial Signups}}\right) \times 100$$

---

## 4. Full Funnel Analytics Architecture

```
   Stage 1: Website Visitors (Target: 20,000/mo)
     │
     ▼  [2.5% Click-to-Trial Rate]
   Stage 2: 7-Day Free Trial Signups (Target: 500/mo)
     │
     ▼  [75% Activation Rate: Handles > 1 Call]
   Stage 3: Activated Trial Users (Target: 375/mo)
     │
     ▼  [28% Trial-to-Paid Rate]
   Stage 4: New Paying Customers (Target: 105/mo)
     │
     ▼  [98.2% Monthly Retention Rate]
   Stage 5: Retained & Expanding Subscribers (LTV: $5,100)
```

---

## 5. Cohort Analysis & Retention Benchmark Table

| Cohort Month | M0 (Signup) | M1 Retention | M3 Retention | M6 Retention | M12 Retention |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Month 1 Cohort** | 100% (10) | 90% (9) | 80% (8) | 80% (8) | 80% (8) |
| **Month 3 Cohort** | 100% (50) | 92% (46) | 88% (44) | 86% (43) | 84% (42) |
| **Month 6 Cohort** | 100% (200) | 95% (190) | 92% (184) | 90% (180) | 88% (176) |

---

## 6. Real-Time Metric Health Check Rules

1. 🟢 **Healthy (Green):**
   - LTV:CAC > 5:1
   - Monthly Churn < 2.5%
   - Trial Conversion > 20%
2. 🟡 **Warning (Yellow):**
   - LTV:CAC between 3:1 and 5:1
   - Monthly Churn between 2.5% and 4.0%
   - Trial Conversion between 12% and 20%
3. 🔴 **Critical Action Required (Red):**
   - LTV:CAC < 3:1 → Immediately halt paid ad expansion, audit landing page copy.
   - Monthly Churn > 4.0% → Trigger immediate founder calls with churned tradies.
