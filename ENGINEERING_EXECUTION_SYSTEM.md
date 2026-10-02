# Engineering Execution System

> **Grand Task:** 99.9% Uptime, Zero Security Breaches, Ship 2x/week

---

## Role Overview

The Lead Engineer/DevOps owns architecture, infrastructure, code quality, security, and incident response for Zenna's platform (React/Vite frontend, Express/TypeScript server, Firebase hosting, SQLite/PostgreSQL database, Stripe payments, Twilio telephony).

### Core Responsibilities

| Responsibility | Description |
|---|---|
| Architecture | Scalability, performance, reliability of the platform |
| Infrastructure | Firebase, serverless functions, monitoring, CI/CD |
| Code Quality | Testing (70%+ coverage), code review, lint, type-check |
| Security | Data protection, encryption, compliance, dependency scanning |
| Incident Response | On-call rotation, debugging, hotfixes, post-mortems |

---

## Daily Tasks (50 hrs/week)

### Development — 30 hrs/week
- Code review PRs (24-hr SLA)
- Write code for assigned features
- Unit tests (70%+ coverage target)
- Integration tests for critical paths (auth, payments, telephony)
- Deploy to staging for QA

### Infrastructure & Monitoring — 10 hrs/week
- **Daily:** Check Sentry error logs, fix critical bugs same day
- **Daily:** Monitor Firebase performance (database latency, function duration)
- **Weekly:** Review monitoring dashboards (uptime, error rate, latency)
- **Weekly:** Security scanning (dependency vulnerabilities via `npm audit`)

### On-Call Rotation — 10 hrs/week
- On-call 1 week/month (responding to production alerts)
- Fix critical bugs within 1 hour
- Document incident, post-mortem within 24 hrs

---

## Weekly Tasks

### Sprint Planning — 2 hrs
- Commit to 2-week sprint
- Define story points per feature
- Identify blockers and dependencies

### Code Review Standards — 1 hr
- **Security review:** No hardcoded secrets, proper auth middleware (`verifyToken`)
- **Performance review:** Database queries optimised, no N+1 problems
- **Architecture review:** Follows established patterns, testable code
- **SLA:** 24-hour turnaround on all PRs

### Deployment — 1 hr
- Deploy to production 2x/week (Wednesday + Friday)
- Canary deployment (test with 10% of users first)
- Rollback plan ready if issues arise
- Announcement to marketing/sales (new features live)

---

## Monthly Tasks

### Security Audit — 3 hrs
- Dependency scanning (`npm audit`, `pip check`)
- Vulnerability patching (update libraries)
- Access control review (who has prod access?)
- Backup validation (can we restore from backup?)

### Performance Optimisation — 2 hrs
- Database query analysis (any slow queries?)
- API latency review (p99 latency trending?)
- Bundle size check (frontend performance via Vite build output)
- Cost analysis (Firebase spend justified?)

### Technical Debt Review — 2 hrs
- Identify 3–5 high-impact tech debt items
- Estimate effort to fix
- Prioritise with product manager
- Allocate 20% of sprint to tech debt

---

## Quarterly Tasks

### Architecture Review — 4 hrs
- Can current architecture handle 10x traffic?
- Do we need database sharding or a caching layer?
- Security posture for upcoming features?
- Disaster recovery plan tested?

### Capacity Planning — 2 hrs
- **Q1:** 1–2 engineers (MVP)
- **Q2:** 2–3 engineers (feature expansion)
- **Q3:** 3–4 engineers + DevOps specialist
- **Q4:** 4–5 engineers + full DevOps team

---

## Team Structure

| Role | When | Focus |
|---|---|---|
| Lead Engineer | Immediate | Architecture, code quality, on-call |
| Backend Engineer(s) | Hire at Q2 | API, database, integrations |
| Frontend Engineer | Hire at Q2 | React UI, dashboard, video |
| DevOps Engineer | Hire at Q3 | Infrastructure, CI/CD, monitoring |

---

## Metrics Dashboard

| Metric | Target | Review Cadence |
|---|---|---|
| Uptime | 99.9% | Daily |
| Deployment Frequency | 2x/week | Weekly |
| Mean Time to Recovery (MTTR) | <1 hr | Per incident |
| Code Coverage | 70%+ | Weekly |
| Critical Bugs | 0 | Daily |
| Security Vulnerabilities | 0 | Weekly |
| P99 API Latency | <200ms | Daily |

---

## Tech Stack Reference

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind CSS | SPA served via Vite dev / Firebase hosting |
| Backend | Express + TypeScript (`server.ts`) | RESTful API, webhook handlers |
| Database | SQLite (dev) → Firebase/PostgreSQL (prod) | Multi-tenant via `tenant_id` |
| Auth | Firebase Auth (Google OAuth) | JWT via `getIdToken()` |
| Payments | Stripe | Webhook at `/api/stripe-webhook` |
| Telephony | Twilio | SMS + voice integration |
| Hosting | Firebase | Static hosting + Cloud Functions |
| Monitoring | Sentry | Error tracking + performance |
| CI/CD | GitHub Actions | Lint, build, deploy |

---

*Last updated: September 2026*
