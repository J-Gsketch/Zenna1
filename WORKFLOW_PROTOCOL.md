# Zenna shipping protocol

The team optimizes for happy paying tradies and reliable revenue, not feature
volume. Every change links to an issue, uses a conventional commit, and states
the customer outcome and rollback plan.

## Delivery loop

1. **Discover:** confirm the tradie problem and define one measurable outcome.
2. **Ship small:** open a focused PR with tests or a documented manual check.
3. **Review:** check tenant isolation, secrets, Stripe/Twilio behavior and
   failure handling before merge.
4. **Release:** CI runs lint and builds on every PR; `main` deploys only after
   the protected production environment approves it.
5. **Learn:** review signups, trial conversion, failed payments, calls answered,
   bookings and customer feedback daily; record incidents and follow-ups.

Production incidents get an owner, customer communication, mitigation and
post-incident action. Shortcuts are logged and revisited in the weekly retro.
