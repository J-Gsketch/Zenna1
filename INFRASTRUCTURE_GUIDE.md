# Zenna Infrastructure Guide

> Firebase setup, scaling strategy, security configuration, and operational runbooks.

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Twilio     │────▶│  Express API  │────▶│  SQLite/PG    │
│  (Voice/SMS) │     │  (server.ts)  │     │  (Database)   │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────▼───────┐
                    │   Firebase    │
                    │  (Auth+Host)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Stripe     │
                    │  (Payments)   │
                    └──────────────┘
```

### Components

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind | SPA dashboard, served via Firebase Hosting |
| API Server | Express + TypeScript | REST API, webhooks, business logic |
| Database | SQLite (dev) / Cloud SQL (prod) | Leads, calls, tenants, settings |
| Auth | Firebase Authentication | Google OAuth, JWT tokens |
| Hosting | Firebase Hosting + Cloud Functions | Static assets + serverless API |
| Payments | Stripe | Deposits, subscriptions, invoices |
| Telephony | Twilio | Inbound call answering, SMS notifications |
| Monitoring | Sentry + Firebase Performance | Error tracking, latency, uptime |
| Storage | Google Drive API | Project briefs, customer files |

---

## Firebase Setup

### 1. Project Configuration

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialise project (already configured in firebase.json)
firebase use <project-id>
```

### 2. Firebase Configuration Files

| File | Purpose |
|---|---|
| `firebase.json` | Hosting + Functions configuration |
| `.firebaserc` | Project aliases |
| `firebase-applet-config.json` | Applet-specific config |

### 3. Environment Variables

Required environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google Gemini AI for conversation engine |
| `STRIPE_SECRET_KEY` | Stripe API secret for payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `TWILIO_ACCOUNT_SID` | Twilio account identifier |
| `TWILIO_AUTH_TOKEN` | Twilio authentication token |
| `TWILIO_PHONE_NUMBER` | Provisioned Twilio phone number |
| `SLACK_WEBHOOK_URL` | Slack alerts for VIP leads and errors |
| `GOOGLE_APPLICATION_CREDENTIALS` | Firebase Admin SDK service account |

### 4. Deployment

```bash
# Build frontend + server
npm run build

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions
```

---

## Scaling Strategy

### Phase 1: MVP (0–50 customers)
- Single Firebase project
- SQLite for local dev, Firebase RTDB/Firestore for prod
- Single Cloud Function instance
- Twilio single phone number

### Phase 2: Growth (50–500 customers)
- Migrate to Cloud SQL (PostgreSQL) for multi-tenant data
- Enable Cloud Functions auto-scaling (min 1, max 100 instances)
- Add Redis/ElastiCache for session caching
- Multiple Twilio numbers (one per tenant)

### Phase 3: Scale (500–5000 customers)
- Database read replicas
- CDN for static assets (Firebase Hosting CDN)
- Horizontal scaling with load balancer
- Dedicated Twilio SIP trunk

### Database Scaling

| Metric | Threshold | Action |
|---|---|---|
| Query latency p99 | >100ms | Add indexes, optimise queries |
| Database connections | >80% pool | Increase pool size or add read replica |
| Storage | >80% capacity | Provision additional storage |
| Concurrent tenants | >1000 | Evaluate database sharding |

---

## Security Configuration

### Authentication Flow
1. User signs in via Firebase Auth (Google OAuth)
2. Frontend obtains JWT via `getIdToken()` from `src/lib/googleAuth.ts`
3. Frontend attaches `Authorization: ****** to all API requests
4. Server middleware (`verifyToken` in `server.ts`) validates JWT
5. Multi-tenant isolation enforced via `tenant_id` in all database queries

### Security Checklist

- [ ] All API routes protected by `verifyToken` middleware
- [ ] Webhook endpoints use signature verification (Stripe, Twilio)
- [ ] Environment variables stored in Firebase environment config (never in code)
- [ ] CORS configured for allowed origins only
- [ ] Rate limiting on public endpoints
- [ ] Input validation on all user-supplied data
- [ ] SQL parameterised queries (prevent injection)
- [ ] HTTPS enforced everywhere
- [ ] Sensitive data encrypted at rest
- [ ] Regular dependency audits (`npm audit`)

### Secrets Management
- **Never** commit secrets to the repository
- Use `.env.local` for local development (gitignored)
- Use Firebase environment config for production
- Rotate secrets quarterly
- Use separate Stripe keys for test vs. production

---

## Monitoring & Alerting

### Dashboards
| Dashboard | Tool | Frequency |
|---|---|---|
| Error rates | Sentry | Real-time |
| API latency | Firebase Performance | Real-time |
| Uptime | Firebase / UptimeRobot | Real-time |
| Database performance | Cloud SQL Insights | Real-time |
| Cost | Firebase Console | Weekly |

### Alert Thresholds

| Alert | Threshold | Severity | Response |
|---|---|---|---|
| Error rate | >1% of requests | Critical | On-call engineer, fix within 1 hr |
| API p99 latency | >500ms for 5 min | Warning | Investigate within 4 hrs |
| Uptime | <99.9% in 24 hrs | Critical | Incident response protocol |
| Database connections | >80% pool | Warning | Scale database |
| Stripe webhook failures | >3 consecutive | Critical | Check endpoint, verify secret |

---

## Backup & Disaster Recovery

### Backup Strategy
- **Database:** Automated daily backups (Cloud SQL) / manual `zenna_db.json` export
- **Code:** Git repository (GitHub) — every commit is a backup
- **Config:** Firebase config stored in version control
- **Secrets:** Stored in 1Password / vault (not in code)

### Recovery Procedures
1. **Database restore:** Restore from latest Cloud SQL backup
2. **Code rollback:** `git revert` to last known good commit, redeploy
3. **Full rebuild:** Clone repo, `npm install`, configure env vars, `firebase deploy`
4. **RTO (Recovery Time Objective):** 1 hour
5. **RPO (Recovery Point Objective):** 24 hours (daily backups)

---

*Last updated: September 2026*
