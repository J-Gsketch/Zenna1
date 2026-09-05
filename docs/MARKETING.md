# Market Positioning

## Value Proposition

**Zenna is the AI receptionist that never misses a call — so tradies and
service businesses stop losing jobs to voicemail.**

Every missed call is a missed job. Zenna answers, qualifies, and books
leads 24/7 in an authentic local voice, then hands owners a same-day
summary — without hiring a receptionist.

## Target Customer

Solo tradies and small service businesses (plumbing, electrical, HVAC,
etc.) who:
- Can't answer the phone while on the tools
- Lose leads to competitors who reply faster
- Don't want the overhead of a full-time receptionist

## Landing Page Messaging (starter copy)

**Headline:** "Never Miss Another Call — Zenna Answers For You, 24/7."

**Subhead:** "Your AI receptionist qualifies leads, quotes call-out fees,
and books the job — while you're on the tools."

**Key bullets:**
- ⚡ Instant missed-call text-back, every time
- 🤙 Sounds like a real local receptionist, not a robot
- 📅 Auto-books qualified leads straight into your calendar
- 💬 Daily SMS briefing so you always know what's in the pipeline
- 💳 Set up in minutes — no contracts, cancel anytime

**Call to action:** "Start your 7-day free trial" (see
`features/copilot/plans/plans.ts` for current pricing tiers).

## Customer Success Materials

- Onboarding walkthrough: `docs/ONBOARDING.md`
- Sample first-week check-in questions:
  - "Has Zenna caught any calls you would've otherwise missed?"
  - "Does the call-out fee messaging match how you actually quote jobs?"
  - "Do you want Slack alerts turned on for VIP leads?" (Pro/Enterprise)
- Renewal/upsell triggers: tenants approaching their plan's
  `maxCallsPerMonth` or `maxPhoneNumbers` limit (see
  `features/copilot/plans/schema.ts`) are good candidates for a Pro/
  Enterprise upgrade conversation.

## Security & Compliance Checklist

See `docs/SECURITY.md` for the full pre-launch security and compliance
checklist (secrets management, tenant data isolation, payment handling).
