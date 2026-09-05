# Daily Marketing Tasks — Agent Execution

> The dedicated marketing agent's daily operating rhythm. ~6.5 hrs/day of execution, fully autonomous. No founder involvement required in any task below.

**Daily time budget:**

| Block | Time | Focus |
|---|---|---|
| Content production | 3.0 hrs | Blog, video, email |
| Community engagement | 1.5 hrs | Reddit, Facebook, LinkedIn, Discord |
| Partnership outreach | 1.0 hr | Cold email, referrals, mods |
| Paid ads management | 0.5 hr | Facebook + Google |
| Analytics & reporting | 0.5 hr | Dashboard + logging |

---

## 1. Content Tasks (3 hrs/day)

### Blog Writing (2x/week cycle)
- **Day 1:** Research keyword, outline blog post (1 hr). Source keywords from the SEO roadmap; prioritise problem-aware trade queries ("how to stop missing calls plumbing business").
- **Day 2:** Write 1,500–2,000 word post (2 hrs).
- **Day 3:** Publish, optimise SEO (meta, headings, alt text), add internal links (30 min).
- **Target:** 10–12 posts/month (hire freelancer for overflow — see [MARKETING_BUDGET.md](./MARKETING_BUDGET.md)).

### YouTube / Short-Form Content (1x/week cycle)
- **Day 1:** Plan video — script + demo scenario (30 min).
- **Day 2:** Record on phone or screencast (1 hr).
- **Day 3:** Edit, upload, create thumbnail, write description (1.5 hrs). Editing may be outsourced to a freelancer; agent QC's and publishes.
- **Target:** 4 videos/month.
- **Automation option:** the repo's `scripts/marketing-factory/index.ts` pipeline (Gemini script → Veo visuals → ElevenLabs voiceover → Remotion assembly) can generate ad creative variants at scale. Agent owns running and QC'ing it.

### Email Sequences (2x/week)
- Draft automated sequences: welcome, trial → paid, win-back, referral ask.
- Review existing sequence performance (open/click/conversion).
- A/B test subject lines and CTAs.
- **Target:** 2–3 new sequences/month + continuous optimisation.
- **Deliverability rule:** all sequences send from the authenticated product domain (e.g. `zenna.com.au` via SendGrid with SPF/DKIM/DMARC configured — never a Gmail address). Setup in [MARKETING_TOOLS_STACK.md](./MARKETING_TOOLS_STACK.md#brand--email-identity).

---

## 2. Community Engagement Tasks (1.5 hrs/day)

### Reddit & Forums (30 min/day)
- Morning read: r/Plumbing, r/Electricians, r/Trades, r/smallbusinessaustralia.
- Answer 2–3 questions authentically — be helpful, never salesy.
- If Zenna fits naturally, mention it with a link; disclose affiliation.
- Respond to previous day's replies.

### Facebook Groups (30 min/day)
- Maintain membership in 3–5 Australian trade business groups.
- Post daily value (no promotion): e.g. "3 Ways Plumbers Lose Leads" (free content).
- Comment genuinely on others' posts.
- Mention Zenna only when directly relevant.

### LinkedIn (30 min/day)
- Engage with target-audience posts (like, comment, share).
- Post 2–3x/week from the Zenna brand page: tradie wins, business insights, product updates.
- Respond to all comments on Zenna posts.
- Founder personal-brand posts are drafted by the agent; founder only approves (async, batched weekly).

### Discord & Slack (15 min/day)
- Monitor trade-business communities.
- Answer questions, share resources.
- Subtle Zenna mentions when relevant.

---

## 3. Partnership Outreach (1 hr/day)

Full partner list and status live in [PARTNER_TRACKER.md](./PARTNER_TRACKER.md).

### Cold Email Campaigns (3x/week)
- Research 10 potential partners: complementary software (Xero, MYOB, ServiceM8, Jobber, Fergus), trade YouTube channels, business coaches, government small-business programs.
- Personalised cold emails — no raw templates.
- Follow-up sequence: 3 touches over 2 weeks.
- **Target:** 2–3 partnership conversations/week.
- **Sending rule:** partnership outreach sends from the corporate domain (`hammerandcode.com` or similar) or the product domain, both fully authenticated — see [MARKETING_TOOLS_STACK.md](./MARKETING_TOOLS_STACK.md#brand--email-identity).

### Referral Program Management (1x/week)
- Monitor referral signups (automated dashboard).
- Thank referrers, celebrate wins publicly (with permission).
- Update referral leaderboard.
- Identify top referrers for a feature/case study.

### Community Mod Recruitment (1x/week)
- Identify potential community mods (already active in trade groups).
- Pitch: "Help your community, get free Zenna in return."
- Onboard new mods to the Facebook group / Discord.

---

## 4. Paid Ads Management (30 min/day)

### Facebook/Instagram Ads (3x/week)
- Review performance dashboard: CTR, CPC, conversion rate.
- Pause underperformers (>$50 CPC equivalent cost per trial).
- Launch new creative (testimonial videos on rotation).
- Adjust targeting: interests, geography, lookalike audiences.
- **Target:** <$40 CAC, 3–5% conversion rate.

### Google Search Ads (2x/week)
- Monitor keyword performance.
- Adjust bids on high-converting keywords.
- Pause low performers.
- A/B test ad copy.
- **Target:** <$50 CAC.

---

## 5. Analytics & Reporting (30 min/day)

### Daily Dashboard Check
- New signups (trial + free tier)
- Trial → paid conversions
- Churn (cancellations)
- Email open/click rates
- Website traffic by source
- Organic search rankings

Log everything into the metrics sheet ([METRICS_DASHBOARD.md](./METRICS_DASHBOARD.md)).

### Weekly Metrics Report (compiled Friday, reviewed at standup)
- Compile week's data.
- Identify wins (what worked?).
- Identify blockers (what underperformed?).
- Recommend optimisations.

---

## Daily Definition of Done

- [ ] Content block complete per cycle day
- [ ] 2–3 Reddit/forum answers posted
- [ ] 1 Facebook group value post + comments
- [ ] LinkedIn engagement done (post on scheduled days)
- [ ] Partner outreach per schedule (10 researched or 3–5 sent on outreach days)
- [ ] Ads reviewed on scheduled days
- [ ] Metrics logged in dashboard
- [ ] Anything blocked flagged for Friday standup
