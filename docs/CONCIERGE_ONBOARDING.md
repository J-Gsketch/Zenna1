# Concierge Onboarding: "We Set It Up For You"

**Context:** Founder feedback — self-serve setup ("~30 mins") is too much friction for tradies, and Zenna is "more than a receptionist." This is how we elaborate the value *without* complicating the customer experience.

**The answer:** make onboarding a done-for-you service. The product is sophisticated; the customer experience is a 10-minute phone call.

---

## The Offer

> **"Sign up, answer 5 questions, and we'll have Zenna answering your calls within 24 hours. No tech skills needed — we do it for you."**

This is included **free** with every plan during the launch phase (later: free on annual plans, $99 one-off on monthly).

## What the Customer Does (≤ 10 minutes total)

1. **Sign up** with Google (one click).
2. **Answer 5 questions** (the onboarding modal — or over the phone with us):
   - Business name
   - Owner name + mobile
   - Region (AU/NZ)
   - Standard call-out fee
   - Plan choice (Starter / Pro — with "not sure? pick Starter, upgrade anytime")
3. **Dial one code** on their mobile when we text it (we pre-fill their Zenna number): call forwarding on.
4. Done. Zenna is live.

That's it. Everything else is ours.

## What We Do (the concierge checklist, ≤ 24h turnaround)

For every new signup, the Zenna team (initially: founder + VA) completes:

| Step | Task | Time |
|------|------|------|
| 1 | Provision Twilio number in their region, wire webhooks | 5 min |
| 2 | Configure AI receptionist prompt with their business name, fee, suburbs, tone | 10 min |
| 3 | Set up Stripe billing + their deposit payment link template | 5 min |
| 4 | Send them the forwarding code via SMS with a photo walkthrough | 2 min |
| 5 | **Test call:** we ring their number, verify Zenna answers, qualifies, books | 5 min |
| 6 | Send "You're live" SMS + short Loom video showing their dashboard | 5 min |
| 7 | Day-3 check-in call: "How's it going? Any calls you want handled differently?" | 10 min |

**Total our-side effort: ~40 min per customer.** That's a $99/mo customer for ~40 minutes of work — excellent CAC economics, and it doubles as customer research (ServiceTitan/Stripe founder-obsession playbook).

## Why This Beats Self-Serve (for this market)

| Self-serve 30-min setup | Concierge onboarding |
|---|---|
| Tradie must understand call forwarding, webhooks, billing | Tradie answers 5 questions and dials one code |
| Drop-off at every technical step | Zero drop-off — we carry them over every step |
| Support tickets when it's misconfigured | We test it live before handing over |
| "Software I have to set up" | "A service that sets itself up" |

## "More Than a Receptionist" — Elaborate Without Complicating

Keep the **landing page** simple (one promise: *Book 3X more jobs without hiring*), and reveal depth progressively **after** signup:

| Moment | What they see |
|--------|---------------|
| Landing page | One promise, one CTA: "Get Zenna working for you" |
| Signup | 5 questions, "we'll set it up within 24 hours" |
| Go-live message | "Zenna answers, qualifies, filters tyre-kickers, books jobs and collects deposits" — the full value, now that they're listening |
| Week 1 email | Deposit collection + SMS confirmations |
| Week 2 email | Daily 6pm briefing + lead dashboard |
| Week 3 email | Quote drafting + calendar sync |

Each layer lands after the previous one is delivering value. **Elaborate over time, never all at once.**

## Positioning Line for the Setup Flow

> "You wouldn't ask a customer to fix their own hot water system. We won't ask you to set up your own software."

## Scaling Path

- **0–50 customers:** founder does every concierge setup personally (maximum learning).
- **50–200:** VA/ops hire follows the checklist above; founder does day-3 check-ins only.
- **200+:** automate steps 1–3 (already API-driven), keep human test call + check-in. Concierge stays — it's the differentiator vs. self-serve competitors.
