# NG-010 — Error Handling & Logging Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-010 |
| Name | Error Handling & Logging Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-009, A-001–A-009 |
| Previous Document | NG-009 — Performance & Scalability Architecture |
| Next Document | NG-011 — Build & Deployment Architecture |
| Governing reference for | ADR-016 (Centralized Error Handling), NG-011 Build & Deployment, NG-012 Testing Strategy, NG-013 UI Design System Integration, NG-014 Technical Architecture Review & Implementation Readiness, Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-009 in full (including `TECHNICAL_STANDARDS.md` §11–14, `QUALITY_GATES.md`, `DATA_TRANSFORMATION.md` §22, `RPC_STRATEGY.md` §23, `CACHE_STRATEGY.md` § Error Recovery, `AUTHENTICATION_ARCHITECTURE.md`, `AUTHORIZATION_ARCHITECTURE.md` §19–22, `REALTIME_STRATEGY.md` §24, `MONITORING_KPIS.md`, `PERFORMANCE_STRATEGY.md`), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` re-verified absent (file search, this session) — noted once, per this series' established practice for an unchanged finding.

**Renumbering: none — the NG-009/NG-010 slot swap held.** NG-009's own "governing reference for" list announced NG-010 as Error Handling & Logging, and this prompt's own title matches exactly. One minor refinement, not a conflict: NG-014 is now titled "Technical Architecture Review **& Implementation Readiness**" (NG-009 had named it "Technical Architecture Review" only) — noted in `ARCHITECTURE_INDEX.md` §1 as a title expansion, not a renumbering.

**No new Restricted-Financial conflict, but the strongest restatement yet.** This document does not request or design anything touching Properties, Loans, or Expenses — but because logging is exactly the kind of secondary channel where a rule enforced at the primary data layer could silently leak through (a stack trace, a debug payload), `OBSERVABILITY_STRATEGY.md` §29 restates the exclusion at full strength as this series' **fourth** layer of the same absolute rule (library — NG-003, repository/data-access — NG-007, physical folder — NG-008, and now logging/observability — NG-010).

**Folder Structure explicitly out of scope**, per this prompt's own Quality Rules (❌ Folder Structure) — this document places no new folder, consistent with NG-008 already having settled `libs/infra/logging/` and `libs/infra/error-handling/`'s placement.

**No other conflicts found.** Every mechanism this document formalizes (centralized error handling, structured logging, correlation IDs, RLS-denial retry exclusion) already existed as a stated principle somewhere in NG-000 through NG-009 — this document's job is consolidating those scattered principles into one coherent architecture and closing the genuinely new gaps (severity/category taxonomy, the Global Error Handler's precise architecture, the Business-Audit-Log-vs-Audit-Logging distinction, the incident investigation workflow), not introducing a competing approach.

---

## 1. Executive Summary

NG-010 defines how this platform detects, classifies, handles, and logs every error it can produce, and how those logs become genuine observability rather than noise. It introduces one new architectural decision — **ADR-016, Centralized Error Handling** — formalizing what `TECHNICAL_STANDARDS.md` §11 already stated as a principle (a Global Error Handler plus one HTTP/Supabase interceptor, no local `try/catch` swallowing) into a mandatory, ADR-backed architecture, the same pattern NG-007 used to formalize the Repository Pattern (ADR-013). Four companion files carry the detail: `ERROR_CLASSIFICATION.md` (the severity/category taxonomy every other document in this set builds on), `ERROR_HANDLING_GUIDELINES.md` (principles through retry strategy), `LOGGING_STANDARDS.md` (levels through security/performance event logging), and `OBSERVABILITY_STRATEGY.md` (notification through future observability).

## 2. Error Handling Principles

See `ERROR_HANDLING_GUIDELINES.md` §1. Centralized, not scattered; user-facing and technical errors are distinct objects; an error is handled at the layer with enough context to handle it correctly.

## 3. Error Classification

See `ERROR_CLASSIFICATION.md` in full. Two independent axes — Severity (Critical/High/Medium/Low) and Category (Validation/Authentication/Authorization/Network/Data/System) — tagged once, at the point of detection, never inferred later.

## 4. Logging Architecture

See `LOGGING_STANDARDS.md` §17–21. `infra-logging` is the single implementation every layer routes through; structured entries only, never free-text; client-side logging stays minimal (browser is not a durable log store), server-side integration carries everything `warn` and above plus all Security and Audit events.

## 5. Monitoring Strategy

See `OBSERVABILITY_STRATEGY.md` §27. Critical Security Events alert immediately with no threshold; High-severity error-rate regressions and Performance KPI regressions (NG-009) alert on threshold; Support Access invocations remain always independently visible, restated once more as the one rule in this area that must never quietly degrade to "check the log later."

## 6. User Error Experience

See `ERROR_HANDLING_GUIDELINES.md` §5, §9, `OBSERVABILITY_STRATEGY.md` §26. Authored, category-level messages, never a raw backend error string; toast for Medium-severity recoverable issues, blocking in-context messages for High-severity action-preventing failures, a persistent (non-auto-dismissing) treatment for Critical-severity events; a manual retry action is always available for Network-category failures.

## 7. Developer Diagnostics

See `ERROR_HANDLING_GUIDELINES.md` §6, `LOGGING_STANDARDS.md` §19, §22. Full technical error (stack trace, error code, correlation ID, request context) captured and logged, never rendered outside a development-only surface; correlation IDs thread every log entry produced while handling one user-initiated operation, enabling `OBSERVABILITY_STRATEGY.md` §30's investigation workflow.

## 8. Security Logging

See `LOGGING_STANDARDS.md` §24. Every RLS denial, Support Access invocation, and Restricted-Financial access attempt is a Security Event, logged at `error` level regardless of whether the underlying operation was a "successful" denial — an attempt is itself worth knowing about (`TECHNICAL_STANDARDS.md` §11, restated).

## 9. Audit Logging

See `LOGGING_STANDARDS.md` §23. **The distinction this document resolves explicitly for the first time**: the Business Audit Log (A-004 SA-10, a Super Admin-facing screen, still gap-flagged with no backing A-003A story) is a different thing from Audit Logging (this document's infrastructure-level event-capture mechanism) — this document defines the latter, ensuring the underlying event trail exists and is durable regardless of whether SA-10's screen is ever built, the same complementary-not-duplicate relationship `TECHNICAL_STANDARDS.md` §13 already established between APM and business-level Platform Monitoring.

## 10. Observability Strategy

See `OBSERVABILITY_STRATEGY.md` §28–31. Error analytics as a reserved, valid downstream use of structured log data (never touching Restricted-Financial content); an incident investigation workflow anchored on correlation IDs; distributed tracing and session-replay tooling both explicitly not adopted now, for stated reasons rather than left unaddressed.

## 11. Risks

- **Builder Projects backend dependency is now carried by 17 consecutive documents** (adds NG-010 — the error handling and logging this document specifies applies uniformly to the still-undesigned Projects/Units backend domain's eventual error paths, gated as always by `infra-feature-flags`).
- **This document's error-classification taxonomy (`ERROR_CLASSIFICATION.md`) is new and unvalidated against real error volume** — a two-axis severity/category model is a reasonable starting design, but only implementation and real production traffic can confirm the categories are exhaustive and the severity thresholds are calibrated correctly; NG-014 (Technical Architecture Review) is the natural place to revisit this once there's evidence to check it against.
- **Vendor selection for logging backend, alerting/on-call tooling, and error-analytics tooling remains fully deferred** (`LOGGING_STANDARDS.md` §21, `OBSERVABILITY_STRATEGY.md` §27–28) — three separate implementation decisions this document intentionally does not make, each a real risk if left unresolved too close to launch.

## 12. Assumptions

- `infra-error-handling` and `infra-logging` (already placed at `libs/infra/error-handling/` and `libs/infra/logging/`, NG-008) are sufficient as library boundaries for everything this document specifies — no new library is introduced.
- A server-side logging backend and alerting tool will be selected and available before production readiness (`QUALITY_GATES.md` §36's Production Readiness Checklist already requires monitoring/alerting to be "live," restated as a dependency here).

## 13. Constraints

- No Angular code, `ErrorHandler` implementation, HTTP interceptor implementation, or logging library integration is generated by this document (Quality Rules, restated) — every mechanism here is a specification for implementation to satisfy.
- This document does not select a logging backend, APM/RUM vendor, alerting/on-call tool, or error-analytics platform — each is named as a category of decision correctly deferred to implementation, consistent with `MONITORING_KPIS.md` §29's own deferrals.
- Folder structure is explicitly out of scope (Quality Rules) — this document places no new path; `SOURCE_TREE.md`'s existing `infra/error-handling/` and `infra/logging/` placements stand unchanged.

## 14. Architecture Decisions

**ADR-016: Centralized Error Handling — Accepted.** Every error in this workspace is caught at exactly one of two points — a Global Error Handler (Angular's `ErrorHandler` extension point, one instance per application) for unhandled application-code exceptions, and a single HTTP/Supabase-client interceptor for every Repository-originated network/RPC/RLS response. No Feature, Service, or Component implements its own local `try/catch` that swallows an error rather than letting it reach one of these two points. This formalizes, as a mandatory architecture with real enforcement consequences (a local swallowed `try/catch` is now a reviewable violation, not just against convention but against a named ADR), what `TECHNICAL_STANDARDS.md` §11 already stated as a principle — the same pattern NG-007 used for the Repository Pattern (ADR-013): a principle stated early in the series becomes a formal, ADR-backed decision once the document whose job it actually is arrives. See `ERROR_HANDLING_GUIDELINES.md` §7.

## 15. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Error handling principles defined | ✅ §2, `ERROR_HANDLING_GUIDELINES.md` §1 |
| Error classification (severity + category) defined | ✅ §3, `ERROR_CLASSIFICATION.md` |
| Global vs. Feature-level error handling architecture defined | ✅ `ERROR_HANDLING_GUIDELINES.md` §7–8 |
| API/Auth/Authorization/Network/Offline/Timeout/Retry handling defined | ✅ `ERROR_HANDLING_GUIDELINES.md` §10–16 |
| Logging principles, levels, structured standards defined | ✅ §4, `LOGGING_STANDARDS.md` §17–19 |
| Correlation ID strategy defined | ✅ `LOGGING_STANDARDS.md` §22 |
| Audit vs. Business Audit Log distinction resolved | ✅ §9, `LOGGING_STANDARDS.md` §23 |
| Security and Performance Event logging defined | ✅ §8, `LOGGING_STANDARDS.md` §24–25 |
| Monitoring, alerting, analytics, privacy, incident workflow defined | ✅ §5, §10, `OBSERVABILITY_STRATEGY.md` |
| Privacy/Restricted-Financial exclusion restated at the logging layer | ✅ `OBSERVABILITY_STRATEGY.md` §29 (4th layer) |
| ADR-016 decided | ✅ §14 |
| Diagrams produced | ✅ `diagrams/NG-010_Error_Architecture_Diagrams.md` (8 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (A-009's "not formally approved" finding still stands) |

## 16. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, repository-structure tree, Known Open Items, NG-014 title refinement noted).

## 17. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-016 added to Decided ADRs).

## 18. Review Checklist

| Item | Status |
|---|---|
| Every mechanism traced to an already-stated principle or explicitly minted as a new ADR | ✅ |
| No Angular code, interceptor implementation, or folder structure generated | ✅ |
| Restricted-Financial exclusion consistency checked at the logging layer | ✅ (`OBSERVABILITY_STRATEGY.md` §29) |
| Business Audit Log (SA-10) vs. Audit Logging distinction stated explicitly, not left implicit | ✅ (§9) |
| Renumbering/title-change checked against prior announcement | ✅ (Pre-Check Result — NG-014 title expansion noted) |

## 19. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed (consistent with every prior NG document) |
| Ready to govern NG-011 onward | ✅ Structurally, per §15 |
