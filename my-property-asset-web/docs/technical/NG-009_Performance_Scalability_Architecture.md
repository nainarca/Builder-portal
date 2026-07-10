# NG-009 — Performance & Scalability Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-009 |
| Name | Performance & Scalability Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-008, A-001–A-009 |
| Previous Document | NG-008 — Folder Structure & Source Tree Architecture |
| Next Document | NG-010 — Error Handling & Logging *(renumbered this turn — see Pre-Check Result)* |
| Governing reference for | ADR-014 (Zoneless Change Detection), ADR-015 (Hybrid Rendering by Application), NG-010 Error Handling & Logging, NG-011 Build & Deployment, NG-012 Testing Strategy, NG-013 UI Design System Integration, NG-014 Technical Architecture Review, Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-008 in full (including `LAZY_LOADING_STRATEGY.md`, `CACHE_STRATEGY.md`, `SIGNALS_STRATEGY.md`, `TECHNICAL_STANDARDS.md`, `QUALITY_GATES.md`, `STORAGE_STRATEGY.md`, `REALTIME_STRATEGY.md`, `SOURCE_TREE.md`, `ASSET_STRUCTURE.md`, `SCSS_STRUCTURE.md`), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` re-verified absent (file search, this session) — noted once, consistent with this series' established practice for an unchanged finding.

**Renumbering — flagged explicitly.** NG-008's own "governing reference for" list announced NG-009 as **Error Handling & Logging** and NG-010 as **Performance & Scalability**. This incoming prompt is titled **NG-009 Performance & Scalability Architecture** — the two have swapped slots. This prompt's own "governing reference for" list now reads: NG-010 Error Handling & Logging, NG-011 Build & Deployment, NG-012 Testing Strategy, **NG-013 UI Design System Integration** and **NG-014 Technical Architecture Review** (both named for the first time — NG-008 had not announced either). Per this series' standing rule (established after four consecutive renumberings around NG-002–NG-006), the current prompt's own text is authoritative, not a prior document's announcement — this document proceeds as NG-009 Performance & Scalability, and `ARCHITECTURE_INDEX.md` §1 is updated accordingly below, including the two newly-named future documents.

**No Restricted-Financial conflict.** This document's scope (bundle size, caching, rendering, scaling) never touches a specific Information Domain's data content, so the Properties/Loans/Expenses exclusion (NG-003, NG-007, NG-008) requires no new refusal here — it is restated once, briefly, in `CACHE_PERFORMANCE.md` §13, only because "API Performance Strategy" could otherwise be read as implying optimization work across every domain including the excluded one.

**No other conflicts found.** Every technique this document specifies builds directly on an already-decided foundation (ADR-001 Standalone, ADR-004 Signals, ADR-009 three applications, NG-004's lazy-loading map, NG-007's pagination/narrow-query discipline) rather than introducing a competing approach.

---

## 1. Executive Summary

NG-009 defines how this platform stays fast and scales as a commercial SaaS product, translating decisions already made (Signals, Standalone Components, three independently-built applications, mandatory pagination) into concrete budgets, targets, and the two genuinely new decisions no prior document had reason to make: **ADR-014 (Zoneless Change Detection)**, enabled directly by ADR-001 and ADR-004 now both being in place, and **ADR-015 (Hybrid Rendering by Application)** — Server-Side Rendering for the SEO-relevant, unauthenticated Public Website, Client-Side Rendering only for the authenticated Super Admin and Builder Portal applications. Five companion files carry the detail: `PERFORMANCE_STRATEGY.md`, `BUNDLE_STRATEGY.md`, `CACHE_PERFORMANCE.md`, `SCALABILITY_STRATEGY.md`, and `MONITORING_KPIS.md`.

## 2. Performance Vision

A platform where performance is a structural property of decisions already made — not a separate optimization pass bolted on before launch. Every Feature loads only when navigated to (NG-004), every state update propagates only to what actually depends on it (ADR-004, now zoneless — §14), every query is bounded and Organization-scoped (NG-007), and every application ships only the bytes its own audience needs (ADR-015). Enterprise-grade performance, for this platform, means the architecture makes the fast path the only path, not the disciplined one.

## 3. Performance Principles

See `PERFORMANCE_STRATEGY.md` §1, §3. Performance budgets are CI-enforced, not aspirational; Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1) are adopted from Google's own published thresholds, not invented.

## 4. Scalability Principles

See `SCALABILITY_STRATEGY.md` §26. The Angular application is stateless by construction — scaling is a hosting/CDN-capacity question, not an application-redesign question.

## 5. Bundle Strategy

See `BUNDLE_STRATEGY.md` §2–7. One independent bundle per application (ADR-009 restated at build-output level), Feature-library boundaries as the code-splitting mechanism, selective route preloading rather than all-or-nothing.

## 6. Rendering Strategy

See `PERFORMANCE_STRATEGY.md` §17–19. `OnPush` remains default (`TECHNICAL_STANDARDS.md` §19); zoneless change detection is newly adopted (ADR-014, §14 below); Public Website is Server-Side Rendered and prerendered, Super Admin and Builder Portal remain Client-Side Rendered only (ADR-015, §14 below).

## 7. Asset Strategy

See `BUNDLE_STRATEGY.md` §8–12. Content-hashed, long-cached shared and application assets; theme resolution blocks first paint deliberately to prevent a branding-flash CLS defect; Organization branding assets are fetched at runtime, never bundled; modern image formats with lazy-loading below the fold only; self-hosted, `font-display: swap` fonts.

## 8. Cache Strategy

See `CACHE_PERFORMANCE.md` §13–16 and `BUNDLE_STRATEGY.md` §20 (CDN). Synchronous, in-memory Signal-based cache reads (no lookup latency to optimize); no cache warm-up or background polling; a scoped, lifecycle-bound posture defined in advance for Realtime, should it ever be adopted; static build output is CDN-distributed, Organization-scoped data and white-label assets never are.

## 9. Monitoring Strategy

See `MONITORING_KPIS.md` §29. Core Web Vitals via Real User Monitoring, bundle size tracked in CI against `BUNDLE_STRATEGY.md` §2's budgets, API/query latency and error rate via `infra-logging`/`infra-error-handling`, and Support Access invocation visibility tracked as a performance-of-response KPI alongside its existing security-monitoring role (`TECHNICAL_STANDARDS.md` §13).

## 10. Performance KPIs

See `MONITORING_KPIS.md` §30 in full — the concrete, numeric targets this architecture is designed to make achievable, to be verified once code exists (`ARCHITECTURE_INDEX.md` §4).

## 11. Risks

- **Builder Projects backend dependency is now carried by 16 consecutive documents** (adds NG-009 — the Projects/Units feature chunks this document sets a bundle budget for still depend on an undesigned backend domain, gated by `infra-feature-flags` as always).
- **Zoneless change detection (ADR-014) is a relatively young Angular capability** — this document adopts it because ADR-001/ADR-004 already make it a natural fit, but it is a newer part of the Angular platform than most of this series' other adopted techniques, worth flagging as a slightly higher implementation-risk item than, say, `OnPush` alone would have been.
- **SSR for Public Website (ADR-015) introduces a hosting/deployment shape (a Node SSR server or equivalent, not purely static hosting) that Super Admin and Builder Portal do not need** — a real, asymmetric operational complexity across the three applications that NG-011 (Build & Deployment) will need to design for explicitly, not assume away.
- **No numeric capacity target exists to validate §4/`SCALABILITY_STRATEGY.md` §31 against** — this document states the architecture places no ceiling of its own, but cannot verify actual capacity without a real business growth projection, which no document in this series has provided.

## 12. Assumptions

- Nx/Angular CLI's build-budget mechanism and a Real User Monitoring tool (unselected) are both available to implement this document's targets — neither is designed here, both are assumed obtainable.
- Supabase's own backend scaling keeps pace with this platform's query discipline (§8) — an assumption this document states explicitly rather than silently, since it is genuinely outside this document's authority to verify.

## 13. Constraints

- No Angular code, build configuration, or CI pipeline is generated by this document (Quality Rules, restated) — every budget and target here is a specification for implementation to satisfy, not a working configuration.
- This document does not select a specific RUM tool, image pipeline, font subsetting tool, or CDN provider — each is named as a category of decision correctly deferred to implementation (`MONITORING_KPIS.md` §29, `BUNDLE_STRATEGY.md` §11–12).

## 14. Architecture Decisions

**ADR-014: Zoneless Change Detection — Accepted.** This platform runs without `zone.js`. Enabled directly by ADR-001 (Standalone Components) and ADR-004 (Signals) both already being decided: every state category already has exactly one Signal owner that notifies Angular's renderer directly on change, so `zone.js`'s automatic dirty-checking of every async API is redundant machinery this platform never needed. Removing it both shrinks the initial bundle (serving `PERFORMANCE_STRATEGY.md` §3's LCP target directly) and removes a class of unnecessary change-detection cycles triggered by async work that was never going to affect the UI. See `PERFORMANCE_STRATEGY.md` §17.

**ADR-015: Hybrid Rendering by Application — Accepted.** Public Website is Server-Side Rendered with prerendering for its largely-static marketing routes; Super Admin and Builder Portal remain Client-Side Rendered only. Decided per-application, not platform-wide, because the deciding factor — SEO relevance and unauthenticated-visitor latency sensitivity — is true of exactly one of the three applications (`APPLICATION_ARCHITECTURE.md`'s own audience table: Public Website is the only unauthenticated surface). Applying SSR to Super Admin or Builder Portal would add real hosting and implementation complexity for an audience with no SEO exposure and already-established login gating — a considered rejection, not an oversight, consistent with this series' practice of stating rejections plainly (the precedent: NG-004's rejected slug/subdomain URL scheme). See `PERFORMANCE_STRATEGY.md` §19.

## 15. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Performance principles and Core Web Vitals targets defined | ✅ §3, `PERFORMANCE_STRATEGY.md` |
| Bundle strategy and performance budgets defined | ✅ §5, `BUNDLE_STRATEGY.md` §2 |
| Rendering strategy decided (change detection + SSR/CSR) | ✅ §6, §14 (ADR-014, ADR-015) |
| Asset/theme/CDN strategy defined | ✅ §7, `BUNDLE_STRATEGY.md` §8–12, §20 |
| Cache performance strategy defined, consistent with NG-005 | ✅ §8, `CACHE_PERFORMANCE.md` |
| Scalability principles and multi-Organization scaling defined | ✅ §4, `SCALABILITY_STRATEGY.md` |
| Monitoring metrics and KPIs defined | ✅ §9–10, `MONITORING_KPIS.md` |
| Diagrams produced | ✅ `diagrams/NG-009_Performance_Diagrams.md` (8 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (A-009's "not formally approved" finding still stands) |

## 16. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, renumbering table, repository-structure tree, Known Open Items).

## 17. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-014 and ADR-015 added to Decided ADRs).

## 18. Review Checklist

| Item | Status |
|---|---|
| Every technique traced to an already-decided prior document or explicitly minted as a new ADR | ✅ |
| No Angular code generated | ✅ |
| Restricted-Financial exclusion consistency checked | ✅ (§ Pre-Check Result, `CACHE_PERFORMANCE.md` §13) |
| Renumbering flagged, not silently absorbed | ✅ (Pre-Check Result) |
| Reserved-only items (Realtime, Web Workers) kept reserved, not designed further | ✅ (`PERFORMANCE_STRATEGY.md` §25, `CACHE_PERFORMANCE.md` §16) |

## 19. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed (consistent with every prior NG document) |
| Ready to govern NG-010 onward | ✅ Structurally, per §15 |
