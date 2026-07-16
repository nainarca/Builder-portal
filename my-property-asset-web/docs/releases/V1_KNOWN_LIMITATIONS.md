# Version 1 Known Limitations

1. **In-memory business data** — Projects, units, owners, branding, communications, subscriptions, platform tickets use mock/in-memory repositories.  
2. **Missing SQL** — Units (B05) and Owner Assignment (B06) migrations are not in repo; Digital Handover SQL cannot apply cleanly.  
3. **Incomplete RLS** — B08–B12 tables lack row-level security policies.  
4. **Shared Supabase project** — Development, QA, staging, and production environment files point to the same project URL.  
5. **Payment gateway** — Abstraction only; no Razorpay/Stripe live integration.  
6. **Invoice PDF** — Download is a placeholder toast.  
7. **Owner App** — Flutter activation is contract-only from this repository.  
8. **E2E automation** — Workflows validated manually / via unit smokes, not Playwright.  
9. **Analytics revenue** — Subscription revenue series is placeholder.  
10. **Bundle size** — Initial bundle exceeds warning budget (~2.2MB).  
11. **support-user** — Portal access without deep resource matrix grants.  
12. **File uploads** — Metadata-centric; not a full secure binary pipeline.
