# Scalability Strategy — MyPropertyAsset Web Platform

**Companion to:** [`NG-009_Performance_Scalability_Architecture.md`](NG-009_Performance_Scalability_Architecture.md)
**Covers:** Scalability Principles, Horizontal Scaling Considerations, Multi-Organization Scaling, Capacity Planning, Future Expansion Strategy.

## 26. Scalability Principles

- **The Angular application is stateless by construction** (`TECHNICAL_STANDARDS.md` §20, restated) — no server-side session state, no in-memory data that must survive between requests on any particular server instance. Every durable fact lives in Supabase; the Angular build artifact is a static, horizontally-replicable asset.
- **Scaling this platform is a hosting/CDN-capacity question, not an application-architecture question** — because of the above, "handling more traffic" means serving more copies of an identical static bundle from more edge locations (§27), not redesigning application code as load grows.
- Supabase's own backend scaling (connection pooling, read replicas, RLS performance at scale) is explicitly out of this document's scope (`TECHNICAL_STANDARDS.md` §20, restated) — this platform's Angular layer places no architectural assumption on how the backend scales, only on the query discipline (`CACHE_PERFORMANCE.md` §13) that keeps its own request volume reasonable regardless.

## 27. Horizontal Scaling Considerations

Because each application (`ADR-009`) builds to an independent, stateless static bundle, horizontal scaling is achieved entirely at the CDN/hosting layer (`BUNDLE_STRATEGY.md` §20) — adding capacity means adding edge nodes/cache capacity for existing static files, not deploying additional application server instances that need to coordinate state with each other. There is no session affinity requirement (no "sticky sessions") anywhere in this architecture, since there is no server-side session to be sticky about.

## 28. Multi-Organization Scaling

- **Organization isolation is a correctness boundary (RLS, `AUTHORIZATION_ARCHITECTURE.md` §22), not a scaling boundary** — this document's contribution is confirming that the *performance* characteristics of that isolation don't degrade as the number of Organizations grows: every query is already Organization-scoped and paginated (`SUPABASE_INTEGRATION.md` §11–12) at the individual-request level, so a request's cost is bounded by *one* Organization's page of data, never by the platform's total Organization count.
- **A growing number of Organizations does not grow any individual session's memory footprint** — `CACHE_STRATEGY.md`'s Organization-scoped cache keys mean a Builder Portal session (single-Organization by construction, ADR-011) never accumulates cache entries for Organizations it isn't scoped to; a Super Admin session's cross-Organization views are themselves paginated lists, not a full in-memory index of every Organization at once.
- **White-label scaling**: `theme-runtime`'s per-Organization resolution (`BUNDLE_STRATEGY.md` §9) is a per-session lookup, not a build-time enumeration of every Organization's branding — adding the platform's thousandth Organization requires zero Angular build changes, consistent with `TECHNICAL_STANDARDS.md` §17's "data-driven, never a build-time flag" principle.

## 31. Capacity Planning

This document does not set a specific numeric capacity target (concurrent users, total Organizations, requests/second) — no prior business document (A-001–A-009) has stated a commercial growth projection this document could plan against, and inventing one here would misrepresent product planning as architecture. What this document does commit to: the architecture places no artificial ceiling of its own (§26–28 above) — capacity is bounded by Supabase's backend scaling and CDN capacity, both external to this Angular codebase, not by any assumption baked into the frontend. If a genuine capacity target is set by the business in the future, it should be evaluated against Supabase's own scaling characteristics, not this document.

## 32. Future Expansion

- **Future Tenant Platform and Future Marketplace** (reserved application boundaries, `LIBRARY_CATALOG.md` #29–30) would each be a new, independent stateless application following this exact same scalability model (§26) — no change to this document's principles would be needed, only new `apps/` entries (`SOURCE_TREE.md` §2).
- **Realtime, if activated** (`CACHE_PERFORMANCE.md` §16): the Feature-scoped subscription lifecycle already designed there is what keeps Realtime adoption from becoming a scaling liability — this document's principles already anticipate that expansion path rather than needing to be revisited when it happens.
- **SSR expansion beyond Public Website** (`PERFORMANCE_STRATEGY.md` §19): not anticipated under current scope (Super Admin/Builder Portal have no SEO surface), but if a future requirement changed that calculus, the hybrid-rendering boundary is per-application already, so adding SSR to a second application would not require restructuring the other two.
