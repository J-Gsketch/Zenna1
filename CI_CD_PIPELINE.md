# CI/CD Pipeline

> Deployment process, testing standards, and release management for Zenna.

---

## Pipeline Overview

```
Developer Push → Lint/Type-Check → Build → Test → Deploy Staging → QA → Deploy Production
```

### Environments

| Environment | URL | Branch | Auto-Deploy |
|---|---|---|---|
| Local Dev | `localhost:3000` | feature branches | No |
| Staging | `zenna-staging.web.app` | `main` | Yes |
| Production | `zenna.au` | `release/*` tags | Manual approval |

---

## Build Process

### Local Development

```bash
# Install dependencies
npm install

# Run dev server (Vite + Express with HMR)
npm run dev

# Type check
npm run lint
```

### Production Build

```bash
# Build frontend (Vite) + server (esbuild)
npm run build

# This runs:
# 1. vite build → dist/ (frontend assets)
# 2. esbuild server.ts → dist-server/server.js (server bundle)
```

### Build Output

| Output | Path | Description |
|---|---|---|
| Frontend | `dist/` | Vite-built static assets (HTML, CSS, JS) |
| Server | `dist-server/server.js` | esbuild-bundled Express server |

---

## Testing Standards

### Test Pyramid

| Level | Coverage Target | Tools | When |
|---|---|---|---|
| Unit Tests | 70%+ | Vitest / Jest | Every commit |
| Integration Tests | Critical paths | Supertest | Every PR |
| E2E Tests | Key user flows | Playwright | Before release |

### Critical Paths Requiring Integration Tests

1. **Auth flow:** `verifyToken` middleware → protected routes
2. **Stripe webhook:** `/api/stripe-webhook` → signature validation → event processing
3. **Twilio webhook:** Inbound call → AI response → lead capture
4. **Lead management:** `saveLead()` → `getLeads()` with `tenant_id` isolation
5. **Booking flow:** Create booking → calendar sync → SMS confirmation

### Code Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] All new API routes use `verifyToken` middleware
- [ ] Database queries include `tenant_id` for multi-tenant isolation
- [ ] Input validation on all user-supplied data
- [ ] Error handling with meaningful error messages
- [ ] No console.log in production code (use structured logging)
- [ ] TypeScript strict mode compliance
- [ ] Tests written for new functionality

---

## Deployment Process

### Staging Deployment

1. Merge feature branch into `main`
2. CI runs: `npm run lint` → `npm run build`
3. Auto-deploy to Firebase staging project
4. QA verifies on staging URL
5. Product Manager approves

### Production Deployment

1. Create release tag: `git tag v1.x.x`
2. CI runs full pipeline: lint → build → test
3. Manual approval required (Lead Engineer or Founder)
4. Deploy to Firebase production project
5. Canary release: 10% of traffic for 30 minutes
6. Monitor Sentry for errors
7. Full rollout or automatic rollback

### Deployment Commands

```bash
# Full deployment
npm run build
firebase deploy --project production

# Hosting only
firebase deploy --only hosting --project production

# Functions only
firebase deploy --only functions --project production

# Rollback (redeploy previous version)
firebase hosting:rollback --project production
```

---

## Release Schedule

| Day | Activity |
|---|---|
| Monday | Sprint planning, feature branch creation |
| Tuesday | Development, code review |
| Wednesday | **Deploy #1** — staging → production |
| Thursday | Development, code review |
| Friday | **Deploy #2** — staging → production |

### Release Checklist

- [ ] All PRs merged and reviewed
- [ ] `npm run lint` passes (TypeScript no errors)
- [ ] `npm run build` succeeds
- [ ] Staging verified by QA
- [ ] Database migrations (if any) tested on staging
- [ ] Rollback plan documented
- [ ] Marketing/sales notified of new features
- [ ] Post-deploy monitoring for 30 minutes

---

## CI Configuration

### GitHub Actions Workflow (Recommended)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## Monitoring Post-Deployment

### First 30 Minutes After Deploy
- Watch Sentry for new errors
- Check Firebase Functions logs
- Verify Stripe webhook processing
- Test critical user flows manually

### First 24 Hours
- Review error rate trend
- Check API latency (p99)
- Monitor customer support tickets for new issues
- Verify analytics tracking is working

---

*Last updated: September 2026*
