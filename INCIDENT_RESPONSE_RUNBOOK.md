# Incident Response Runbook

> How to detect, respond to, and learn from production incidents.

---

## Severity Levels

| Level | Name | Description | Response Time | Examples |
|---|---|---|---|---|
| P0 | Critical | Service completely down, data loss, security breach | 15 min | Site down, database corruption, breach |
| P1 | High | Major feature broken, significant user impact | 1 hr | Payments failing, calls not answered |
| P2 | Medium | Feature degraded, workaround available | 4 hrs | Slow performance, minor UI bug |
| P3 | Low | Cosmetic issue, no user impact | Next sprint | Typo, styling issue |

---

## Incident Response Process

### 1. Detect (0–5 min)
- **Automated:** Sentry alert, Firebase alert, UptimeRobot page
- **Manual:** Customer report, team member discovers issue
- **Action:** Acknowledge alert, create incident channel (`#incident-YYYY-MM-DD`)

### 2. Assess (5–15 min)
- What is broken?
- How many users are affected?
- What is the severity level?
- Is data at risk?

### 3. Communicate (15 min)
- **Internal:** Post in `#engineering` Slack channel
- **External (if P0/P1):** Update status page
- **Stakeholders:** Notify founder/CEO for P0

### 4. Mitigate (15 min–1 hr)
- **Goal:** Stop the bleeding. Restore service ASAP.
- **Options:**
  - Rollback to previous deployment
  - Disable the broken feature (feature flag)
  - Scale up resources if overloaded
  - Apply hotfix if root cause is known

### 5. Resolve (1–24 hrs)
- Fix root cause
- Deploy permanent fix
- Verify fix in production
- Monitor for recurrence

### 6. Post-Mortem (within 24 hrs)
- Document timeline, root cause, and resolution
- Identify action items to prevent recurrence
- Share learnings with team (blameless culture)

---

## Common Incident Scenarios

### Scenario 1: Site Down (Firebase Hosting)

**Symptoms:** Users see blank page or 404.

**Diagnosis:**
```bash
# Check Firebase Hosting status
firebase hosting:sites:list

# Check recent deploys
firebase hosting:releases:list
```

**Resolution:**
```bash
# Rollback to previous version
firebase hosting:rollback

# Or redeploy from last known good commit
git checkout <last-good-commit>
npm run build
firebase deploy --only hosting
```

---

### Scenario 2: API Errors (Express Server)

**Symptoms:** 500 errors in Sentry, API endpoints failing.

**Diagnosis:**
```bash
# Check Firebase Functions logs
firebase functions:log

# Check Sentry for error details
# Look for stack traces, error frequency
```

**Resolution:**
1. If recent deploy caused it → rollback
2. If external service (Stripe/Twilio) → check their status pages
3. If code bug → hotfix on a branch, fast-track review, deploy

---

### Scenario 3: Stripe Webhook Failures

**Symptoms:** Payments processing but subscriptions not activating.

**Diagnosis:**
1. Check Stripe Dashboard → Webhooks → Recent deliveries
2. Look for failed deliveries (non-2xx responses)
3. Check server logs for signature validation errors

**Resolution:**
1. Verify `STRIPE_WEBHOOK_SECRET` env var is correct
2. Check that `/api/stripe-webhook` endpoint is reachable
3. Replay failed webhooks from Stripe Dashboard
4. If code bug → fix, deploy, replay webhooks

---

### Scenario 4: Twilio Integration Down

**Symptoms:** Calls not being answered by AI receptionist.

**Diagnosis:**
1. Check Twilio Console → Monitor → Errors
2. Verify Twilio webhook URL is correct
3. Check if Express server is processing Twilio requests

**Resolution:**
1. Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set
2. Check Twilio phone number configuration
3. Test webhook manually with Twilio's request inspector
4. Set up fallback: forward calls to Dave's mobile if AI is down

---

### Scenario 5: Database Issues

**Symptoms:** Slow queries, data inconsistencies, connection errors.

**Diagnosis:**
```bash
# For SQLite (dev)
node check_db.js

# For production (Cloud SQL)
# Check Cloud SQL Insights in GCP Console
```

**Resolution:**
1. If slow queries → identify and add indexes
2. If connection pool exhausted → increase pool size or restart
3. If data corruption → restore from latest backup
4. If disk full → increase storage allocation

---

## On-Call Rotation

### Schedule
| Week | On-Call Engineer |
|---|---|
| Week 1 | Lead Engineer |
| Week 2 | Backend Engineer |
| Week 3 | Frontend Engineer |
| Week 4 | Lead Engineer |

### On-Call Responsibilities
- Respond to P0/P1 alerts within SLA
- Carry laptop and phone at all times during on-call week
- Escalate to Lead Engineer if unable to resolve within 1 hour
- Document all incidents in post-mortem format

### Escalation Path
1. **On-Call Engineer** (0–1 hr)
2. **Lead Engineer** (1–2 hrs)
3. **Founder/CEO** (2+ hrs or business-critical decisions)

---

## Post-Mortem Template

```markdown
## Incident: [Title]
**Date:** YYYY-MM-DD
**Severity:** P0/P1/P2/P3
**Duration:** X hours Y minutes
**Impact:** [Number of users affected, revenue impact]

### Timeline
- HH:MM — [Event]

### Root Cause
[What caused the incident]

### Resolution
[How it was fixed]

### Action Items
- [ ] [Preventive measure 1]
- [ ] [Preventive measure 2]
- [ ] [Monitoring improvement]
```

---

## Incident Log

| Date | Severity | Description | Duration | Post-Mortem |
|---|---|---|---|---|
| — | — | — | — | — |

---

*Last updated: September 2026*
