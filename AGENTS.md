# Zenna Agent Workspace

This repository includes Antigravity custom agents in `.agents/agents/`. They are repository-scoped and should appear in Antigravity’s agent selector after the workspace is reopened.

## Route A: independent acquisition contractor pilot

The Route A source of truth is `docs/route-a/OFFER-SOURCE-OF-TRUTH.md`. All agents must read it before working on recruitment, candidates, customers, activation, or bounties.

## Operating rules

- Current scope is a five-customer, New Zealand electrician/sparky pilot.
- Personal founder identity remains private; service communications use **Zenna Operations** truthfully.
- Contractors only prospect, qualify, document, and arrange consent-based operations handoffs.
- Contractors never accept payment, configure forwarding, access credentials, or handle customer support.
- Never claim a guaranteed revenue result, response time, conversion result, carrier coverage, or unapproved system capability.
- No paid job-board submission, signed contractor agreement, customer charge/refund, or bounty payment without a human approval at that exact action.
- Keep immutable IDs and evidence for every candidate, prospect, accepted account, activation, and payout decision.

## Agent choices

| Agent | Use for |
|---|---|
| `route-a-orchestrator` | End-to-end pilot execution and reporting |
| `recruitment-publisher` | SEEK-ready job-ad preparation and compliance checks |
| `candidate-operations` | Application screening, interviews, and onboarding packs |
| `rep-performance-manager` | Active-rep, activation, retention, and bounty evidence review |

## File map

| File | Purpose |
|---|---|
| `docs/route-a/OFFER-SOURCE-OF-TRUTH.md` | Controlling commercial and operating rules |
| `docs/route-a/SEEK-JOB-AD.md` | Publish-ready job ad and application pack |
| `docs/route-a/CANDIDATE-OPERATIONS.md` | Pipeline, scoring, interview, and candidate messages |
| `docs/route-a/INDEPENDENT-CONTRACTOR-TERMS-DRAFT.md` | Internal contractor-terms draft; requires NZ legal review before use |
| `docs/route-a/OPERATIONS-LOG.md` | Ongoing factual Route A decisions and next actions |

## Primary launch instruction

Select `route-a-orchestrator` and issue this single instruction:

> Run Zenna Route A end-to-end from the current stage. Read the Route A source of truth and all Route A operating assets. Complete every safe autonomous action, maintain the operations log, and use specialist subagents as needed. Do not submit a paid job ad, sign terms, process payments, or make a payout; stop only at those exact approval boundaries with a clear decision packet.
