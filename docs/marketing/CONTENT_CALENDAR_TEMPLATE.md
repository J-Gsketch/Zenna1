# Content Calendar Template — Notion / Airtable

> Duplicate this structure into Notion or Airtable in Week 1. The agent maintains it as the single source of truth for all content.

## Database Schema

| Field | Type | Options / Notes |
|---|---|---|
| Title | Text | Working title of the piece |
| Type | Select | Blog Post, YouTube Video, Short (Reel/TikTok/Short), Email Sequence, Social Post, Case Study, Guest Post |
| Status | Select | Idea, Outlined, Drafting, In Review, Scheduled, Published, Promoted, Retired |
| Channel | Select | Blog, YouTube, LinkedIn, Facebook, Reddit, Email, Partner Site |
| Target Keyword | Text | Primary SEO keyword (blog/guest posts) |
| Funnel Stage | Select | Problem-aware, Solution-aware, Decision-stage, Retention |
| Author | Person | Agent, Freelancer name, Partner (guest post) |
| Draft Due | Date | |
| Publish Date | Date | |
| URL | URL | Filled after publish |
| Promoted | Checkbox | Re-shared to social/newsletter after publish |
| 30-day Views | Number | Logged monthly for the content audit |
| Signups Attributed | Number | From GA4 / UTM |
| Notes | Text | Internal linking targets, repurposing ideas |

## Views to Create

1. **This Week** — filter: Publish Date within 7 days, Status ≠ Published
2. **Pipeline** — group by Status (kanban)
3. **By Channel** — group by Channel (weekly output check vs. [DAILY_MARKETING_TASKS.md](./DAILY_MARKETING_TASKS.md))
4. **SEO Targets** — filter: Target Keyword not empty, sort by Publish Date
5. **Monthly Audit** — sort by 30-day Views desc (top = promote more; bottom = update/rewrite)

## Weekly Output Targets (automation checklist)

| Type | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| Blog posts / month | 8–10 | 12–15 | 15–20 | 20+ |
| Videos / month | 4 | 8 | 10 | 12 |
| Social posts / week | 3 | 4 | 5 | 6 |
| New email sequences / month | 2–3 | 2–3 | 1–2 (optimise) | 1–2 (optimise) |
| Case studies / month | 4 | 4 | 4 | 4 |

## Content Pillars (SEO-aligned)

1. **Problem-aware** — "how to stop missing calls", "tradie admin overload", "cost of missed jobs"
2. **Solution-aware** — "AI receptionist vs answering service", "automated booking for tradies"
3. **Decision-stage** — "Zenna vs [competitor]", "Zenna pricing", "Zenna reviews"
4. **Retention/expansion** — "getting deposits faster", "using Zenna with Xero", "tradie referral programs"

## Repurposing Rule

Every blog post produces: 1 LinkedIn post, 2 Facebook group value posts, 1 short-form video script, 1 newsletter segment. One idea, five assets — that's how the agent hits volume targets without five times the work.
