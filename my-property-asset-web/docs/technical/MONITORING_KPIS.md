# Monitoring & KPIs — MyPropertyAsset Web Platform

**Companion to:** [`NG-009_Performance_Scalability_Architecture.md`](NG-009_Performance_Scalability_Architecture.md)
**Covers:** Monitoring Metrics, Performance KPIs.
**Note:** Application-health/APM monitoring is a distinct concern from the business-level Platform Monitoring already specified (A-004 SA-09, A-007 ID-06) and from Support Access security monitoring (`TECHNICAL_STANDARDS.md` §13) — this document is the performance-specific slice of monitoring, complementary to both, not a replacement for either.

## 29. Monitoring Metrics

| Category | Metrics | Source |
|---|---|---|
| Core Web Vitals (real users) | LCP, INP, CLS, per application | Real User Monitoring — specific tool not selected by this document (implementation choice) |
| Bundle size | Per-application initial size, per-chunk size, tracked over time | CI build output, checked against `BUNDLE_STRATEGY.md` §2's budgets on every build |
| API/query latency | p50/p95/p99 per Repository method category (`REPOSITORY_ARCHITECTURE.md` §2) | `infra-logging`, correlated via the correlation IDs `TECHNICAL_STANDARDS.md` §12 already mandates |
| Error rate | Repository-layer error rate, split by type (`RPC_STRATEGY.md` §23's transient/RLS-denial/validation categories) | `infra-error-handling` |
| Cache effectiveness | Cache-hit vs. re-fetch ratio per Feature (an informational signal, not a target — this platform prioritizes correctness over cache-hit maximization, `CACHE_STRATEGY.md` restated) | Feature-level instrumentation |

## 30. Performance KPIs

| KPI | Target | Ties to |
|---|---|---|
| LCP (Public Website, p75) | < 2.5s | `PERFORMANCE_STRATEGY.md` §3 |
| INP (all apps, p75) | < 200ms | `PERFORMANCE_STRATEGY.md` §3 |
| CLS (all apps, p75) | < 0.1 | `PERFORMANCE_STRATEGY.md` §3, `BUNDLE_STRATEGY.md` §9's theme-loading guarantee |
| Initial bundle size, any application | Within `BUNDLE_STRATEGY.md` §2's budget, 100% of builds | CI-enforced, zero tolerance (`QUALITY_GATES.md` §35) |
| API p95 latency, any Repository method | < 500ms (excludes Supabase-side/network variance outside this platform's control) | `CACHE_PERFORMANCE.md` §13 |
| Support Access invocation visibility | 100% of invocations independently monitored, not just recoverable from audit log after the fact | `TECHNICAL_STANDARDS.md` §13, restated as a KPI here because it is as much a performance-of-response (how fast can an anomaly be noticed) concern as a security one |

These are targets this architecture is designed to make achievable, not measured commitments this document can verify today — no code exists yet (`ARCHITECTURE_INDEX.md` §4, re-confirmed throughout this series) to measure against. They exist so Cursor AI implementation and future review documents (NG-014 Technical Architecture Review) have a concrete bar to check the eventual build against, rather than a vague "should be fast."
