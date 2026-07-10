# NG-007 — API & Data Access Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-007 |
| Name | API & Data Access Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000, NG-001, NG-002, NG-003, NG-004, NG-005, NG-006, A-001–A-009 |
| Previous Document | NG-006 — Authentication & Authorization Architecture |
| Next Document | NG-008 — Folder Structure |
| Governing reference for | ADR-013 (Repository Pattern), ADR-008 candidate (Support Access Invocation — names the RPC surface, does not design it) |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth (NG-000 precedence rule applied):** NG-000 through NG-006 in full, plus A-001, A-002, A-005, A-007 (`INFORMATION_DOMAINS.md`, `SEARCH_ARCHITECTURE.md`), A-008 (`PERMISSION_MATRIX.md`, §7 Support Access), and the upstream backend's Stage 4 Database Review (via NG-005's prior citation) for Realtime table-configuration status.

**Renumbering:** None. This is the first document in the NG-series to land exactly where its predecessor announced it would — NG-006 named NG-007 as "API & Data Access," and that is this document's own title. `ARCHITECTURE_INDEX.md` §1's renumbering table required no new row for this document; only "Folder Structure" continues to hold the pattern flagged there.

**Conflict identified and resolved — Data Domains vs. Restricted-Financial rule:** This prompt's own Data Domains list includes **Properties, Loans, and Expenses**. These map directly onto A-007 ID-13 (Owner Financial & Property Information), the single Restricted-Financial domain this series has protected as an absolute rule since NG-001 `ARCHITECTURE_PRINCIPLES.md`. **This document does not design a repository, query, mutation, RPC, or any other data-access pattern for Properties, Loans, or Expenses.** That data belongs exclusively to the Owner Mobile App's own Supabase integration, entirely outside this workspace. This is the **second time** this series has declined to fulfill part of an explicit prompt request outright, rather than merely reserving it as unbacked — the first was NG-003's refusal to build a `property` library. Full reasoning is recorded in `REPOSITORY_ARCHITECTURE.md`'s "Data Domains — Scope Resolution" section, which every reader of this document should treat as required reading before the rest of the companion files. "Owners" is scoped narrowly to Owner Assignment (ID-08) and Invitation (ID-10) data only.

**No other conflicts found.** Every other Data Domain named in the prompt (Authentication, Organizations, Users, Builders, Projects, Units, Invitations, Documents, Notifications, Reports, Settings, Audit, Search, Dashboard, Future Tenant, Future Marketplace) maps cleanly onto A-007's Information Domains and this series' prior decisions, with no new rule violations.

---

## 1. Executive Summary

NG-007 defines how this platform reads and writes data at all — the layer between NG-005's Signal-based state and the backend's Supabase surface. Its single organizing decision is **ADR-013: the Repository Pattern is the mandatory, sole data-access abstraction** — no Feature, Service, or Component ever calls the Supabase client directly. Six companion files carry the actual design: `REPOSITORY_ARCHITECTURE.md` (the pattern itself and its scope), `SUPABASE_INTEGRATION.md` (CRUD/read/write/query mechanics), `RPC_STRATEGY.md` (atomic operations and retry semantics), `REALTIME_STRATEGY.md` (reserved, not active, plus offline/sync posture), `STORAGE_STRATEGY.md` (document and asset handling, reusing backend conventions), and `DATA_TRANSFORMATION.md` (mapping, DTOs, validation, error propagation, caching integration). As with every document in this series, Properties/Loans/Expenses are out of scope by absolute rule, not oversight.

---

## 2. Data Access Principles

See `REPOSITORY_ARCHITECTURE.md` §1. The Repository Pattern is the sole interface between Feature/Core state and Supabase. RLS remains the only real authorization enforcement (restated from NG-000 §14 and NG-006 §22) — a Repository queries, and the backend decides what comes back; it never implements its own authorization logic.

## 3. Repository Pattern

See `REPOSITORY_ARCHITECTURE.md` §2. One repository per in-scope Information Domain (A-007's 15 domains, minus ID-13) — a domain-shaped public interface, never a raw table/column leak.

## 4. Service Layer Responsibilities

See `REPOSITORY_ARCHITECTURE.md` §3. Repository = stateless *how*. Service, and the Signal it owns (NG-005), = stateful *what/where*. This boundary is never blurred.

## 5. Supabase Client Strategy

See `REPOSITORY_ARCHITECTURE.md` §4. One Supabase client instance per application, injected via Core, touched only by Shared-tagged Repositories — mechanically enforced by the Nx tag matrix (NG-002/NG-003).

## 6. RPC Usage Strategy

See `RPC_STRATEGY.md` §6. A Repository calls an existing backend RPC for any operation requiring atomicity beyond a single-table insert/update, rather than composing multiple raw calls client-side to fake atomicity. The Support Access invocation mechanism (A-008 §7, ADR-008 candidate) is named here as the natural RPC candidate — this document identifies it, it does not design it.

## 7. CRUD Strategy

See `SUPABASE_INTEGRATION.md` §7. CRUD operations map directly onto `PERMISSION_MATRIX.md`'s existing vocabulary — one permission vocabulary, never a parallel one.

## 8. Read Model Strategy

See `SUPABASE_INTEGRATION.md` §8. Shaped for what the UI needs, always mapped into a `shared-models` domain type before leaving the Repository.

## 9. Write Model Strategy

See `SUPABASE_INTEGRATION.md` §9. Deliberately asymmetric from its corresponding read model — no server-computed fields sent back.

## 10. Query Optimization

See `SUPABASE_INTEGRATION.md` §10. No default `select('*')` — fetch narrow, cache narrow (in the owning Feature's Signal), recompute narrow.

## 11. Pagination Strategy

See `SUPABASE_INTEGRATION.md` §11. Every list-returning method accepts pagination by default; no method returns an unbounded result set.

## 12. Filtering Strategy

See `SUPABASE_INTEGRATION.md` §12. Filter parameters resolved server-side, never applied client-side against an already-fetched dataset.

## 13. Sorting Strategy

See `SUPABASE_INTEGRATION.md` §13. Same rule as Filtering — resolved server-side, never re-sorted client-side against a partial page.

## 14. Realtime Strategy

See `REALTIME_STRATEGY.md` §14. Reserved, not active — the backend's Stage 4 Database Review confirms zero tables configured for Realtime today. If ever adopted, a subscription lives inside a Repository, converted to a Signal at the same boundary as any other async source.

## 15. Storage Strategy

See `STORAGE_STRATEGY.md` §15. Reuses the backend's existing private-bucket, signed-URL conventions — not a new design. Applies identically to Handover Documents and white-label branding assets.

## 16. Architecture Decisions

**ADR-013: Repository Pattern as the mandatory, sole data-access abstraction.** Every read or write of Supabase data — CRUD, RPC, Storage, or (if ever adopted) Realtime — passes through a domain-scoped Repository; no Feature, Service, or Component holds a Supabase client reference directly. This is the concrete mechanism that makes NG-001's layering real rather than aspirational: it is what lets Feature/Service code depend on a stable, domain-shaped interface instead of PostgREST's own request/response shape, and what makes the Nx tag matrix (NG-002/NG-003) able to mechanically enforce "only Shared-tagged code touches Supabase" as a build-time constraint rather than a convention. See `REPOSITORY_ARCHITECTURE.md` (full rationale) and `DATA_TRANSFORMATION.md` §28 (the Future API Evolution payoff this decision buys). Recorded in `docs/adr/ADR_INDEX.md` as **Accepted**, decided by NG-007.

## 17. Data Mapping, DTOs, Validation, Serialization, Error Propagation

See `DATA_TRANSFORMATION.md` §18–22. Every Repository maps raw Supabase responses into `shared-models` domain types. Read and Write DTOs are deliberately different types. Client-side validation is a UX convenience only — the backend's constraints are the real boundary. JSON is confirmed (not redesigned) as the wire format. Every error flows to `infra-error-handling`, with RLS denials tagged distinctly per NG-006's Security Event Flow.

## 18. Offline & Synchronization Strategy

See `REALTIME_STRATEGY.md` §24–25. Intentionally minimal — graceful degradation only, not offline-first. Synchronization happens at the Repository/Service boundary via explicit cache invalidation on mutation (restating NG-005), not a standalone sync subsystem.

## 19. Caching Integration

See `DATA_TRANSFORMATION.md` §26. Repositories do not cache — they are stateless. The Feature or Core Signal that calls a repository is the actual cache, per NG-005's ownership model. This boundary is never conflated for convenience.

## 20. Performance, Retry, and Future Evolution

See `SUPABASE_INTEGRATION.md` §10–11, `RPC_STRATEGY.md` §23, `DATA_TRANSFORMATION.md` §27–29. Narrow queries and mandatory pagination are the two concrete performance levers. Transient network failures retry with backoff at the Repository boundary; RLS denials and validation rejections are never auto-retried. A future non-PostgREST backend surface would only require Repository-layer changes — the direct payoff of ADR-013.

## 21. Approval Checklist

| Item | Status |
|---|---|
| Data Access Principles defined | ✅ §2 |
| Repository Pattern defined, scope-resolved against Restricted-Financial rule | ✅ §3, Pre-Check Result |
| Service Layer boundary defined | ✅ §4 |
| Supabase Client Strategy defined | ✅ §5 |
| RPC Usage & Retry Strategy defined | ✅ §6, §20 |
| CRUD / Read / Write / Query / Pagination / Filtering / Sorting defined | ✅ §7–13 |
| Realtime Strategy defined (reserved) | ✅ §14 |
| Storage Strategy defined | ✅ §15 |
| Architecture Decision recorded (ADR-013) | ✅ §16 |
| Data Mapping / DTOs / Validation / Serialization / Error Propagation defined | ✅ §17 |
| Offline & Synchronization Strategy defined | ✅ §18 |
| Caching Integration boundary confirmed against NG-005 | ✅ §19 |
| Diagrams produced | ✅ `diagrams/NG-007_API_Diagrams.md` (10 diagrams) |
| `ARCHITECTURE_INDEX.md` updated | ✅ |
| `docs/adr/ADR_INDEX.md` updated | ✅ |
| Formal sign-off | ⬜ Not yet performed by any document in this series (consistent with every prior NG document — A-009's "not formally approved" finding still stands, see `ARCHITECTURE_INDEX.md` §5) |
