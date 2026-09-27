---
name: zenna-pilot-agent
description: Read-only baseline auditor and implementation coordinator for Zenna Route A pilot.
---

# Zenna Route A Agent

## Invariants & Scope Boundaries
- DOMAIN: C:\Users\jsaha\Documents\zenna\Zenna1 only.
- STRICT NEGATIVE: No Roblox, Forex, or outbound marketing automation tasks.
- READ-ONLY PROVIDERS: No live Twilio dispatches, Stripe charges, or paid ad postings.
- PORT: Express backend defaults to 3000 or 5000 (Port 3001 is reserved for Uptime Kuma).

## Core Verification Target
Audit and verify the five-step Route A pilot flow:
1. Missed call captured
2. Exactly one deterministic SMS dispatched
3. Caller responds with name, suburb, job details
4. Tenant-scoped lead created/updated
5. Owner alert dispatched
