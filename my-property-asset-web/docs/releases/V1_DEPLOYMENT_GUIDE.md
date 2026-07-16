# V1 Deployment Guide

## Prerequisites

- Node.js 20.x, npm 10.x  
- Access to target hosting (static CDN / container / App Service)  
- Supabase project(s) — **prefer one project per environment**  
- Secrets store for anon URL/key (do not rely on committed keys long-term)

## Build

```bash
npm ci
npm run test -- --no-watch --browsers=ChromeHeadless
npm run build            # production → dist/my-property-asset-web
# or
npm run build:staging
npm run build:qa
```

## Configure

1. Set environment-specific Supabase URL + anon key for the target tier.  
2. Confirm `appVersion` matches release tag (`1.0.0`).  
3. Apply SQL migrations in timestamp order to the **target** database.  
4. Run matching `supabase/migrations/verify/*_verify.sql` scripts.  
5. **Do not** apply B08 until units + owner-assignment tables exist.

## Deploy

1. Publish `dist/my-property-asset-web` to hosting.  
2. Configure SPA fallback to `index.html`.  
3. Enable HTTPS only.  
4. Smoke: public home → auth → super-admin → builder-portal.  
5. Verify feature flags / maintenance mode in Super Admin settings.

## Backup Strategy

| Asset | Cadence | Method |
|---|---|---|
| Postgres | Daily + pre-release | Supabase PITR / logical dump |
| Storage buckets | Daily | Bucket versioning / export |
| Config / secrets | On change | Secrets manager snapshot |
| Build artifact | Per release | Retain tagged `dist` + git tag |

## Post-deploy Checks

- [ ] Auth sign-in works  
- [ ] Super Admin dashboard loads metrics  
- [ ] Builder portal loads for demo org  
- [ ] No console fatal errors  
- [ ] Migration verify scripts green  

## Demo vs Production

| Mode | Allowed |
|---|---|
| Demo (in-memory) | Yes — current default providers |
| Production multi-tenant | No — until repositories + RLS + schema gaps closed |
