---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-005 |
| **Document Name** | Angular State Management Strategy |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000 through NG-004, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-series documents; `../../../my_property_asset/docs/ies/STAGE4_DATABASE_REVIEW.md` (backend Realtime finding) |
| **Previous Document** | NG-004 Angular Routing & Navigation Architecture |
| **Next Document** | NG-006 Folder Structure *(third slot shift — see Pre-Check Result)* |
| **Related ADR** | **ADR-004 (Angular Signals) — finally decided by this document**, see §18 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`STATE_OWNERSHIP.md`](STATE_OWNERSHIP.md), [`SIGNALS_STRATEGY.md`](SIGNALS_STRATEGY.md), [`CACHE_STRATEGY.md`](CACHE_STRATEGY.md), [`RXJS_GUIDELINES.md`](RXJS_GUIDELINES.md), [`diagrams/NG-005_State_Diagrams.md`](diagrams/NG-005_State_Diagrams.md).

---

# NG-005 — Angular State Management Strategy

## Pre-Check Result

NG-000 (precedence) through NG-004 were read in full. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent. **Sequence shifted a third time**: NG-004 established NG-005 = Folder Structure as "the corrected, intended-to-be-final" slot. This prompt is NG-005 titled State Management — Folder Structure is bumped again, to NG-006, per this prompt's own governing-reference-for list (which leaves NG-007 Authentication onward unchanged). This is noted plainly and not re-litigated at length: three shifts in a row establishes that each new prompt's own stated identity is the reliable source of truth, not any prior document's announcement — `ARCHITECTURE_INDEX.md` §1 is updated accordingly, and this is likely the last time this needs restating unless the pattern continues.

**Concrete consequence:** ADR-001 (Standalone Components) is redirected a fifth time, to NG-006.

**This document does resolve something real, rather than deferring further**: ADR-004 (Angular Signals), open since this series' very first prompt, redirected through NG-001 and NG-002's renumbering to "NG-006 State Management" — and now correctly landing here, at the actual State Management document. Decided, not deferred again (§18).

---

## 1. Executive Summary

NG-005 defines a Signal-first state architecture: every state category named in this prompt is mapped to exactly one owner (Core, Feature, or Component), Signals are the default primitive everywhere state is read more often than it changes, RxJS is retained only at genuinely asynchronous or stream-based boundaries, and every cache respects the Organization-ID-keyed rule this series established three documents ago. ADR-004 is finally decided. No Angular code, service, or component appears anywhere in this document.

## 2. State Principles

See [`STATE_OWNERSHIP.md`](STATE_OWNERSHIP.md) § State Ownership Rules — one owner per state category, Core/Feature/Component scoping matching NG-001/NG-003's existing library boundaries exactly, no new ownership model invented.

## 3. State Categories

Seventeen categories this prompt named, all resolved in `STATE_OWNERSHIP.md`'s Ownership Map — from Authentication (Core) through Future Tenant (reserved, unassigned).

## 4. State Ownership

See `STATE_OWNERSHIP.md` in full, including its most consequential single rule: Dashboard state is always `computed()`, never independently fetched (§ Why Dashboard Is Never Its Own Fetch).

## 5. State Lifecycle

Feature state lives and dies with its route-level injector (NG-004's lazy-loading boundaries) — no manual cleanup, no risk of stale state surviving past its route. Full diagram: `diagrams/NG-005_State_Diagrams.md` §3.

## 6. Global State

Auth, Organization Context, RBAC, and Theme — the four Core-owned Signals every authenticated application resolves during Shell bootstrap (NG-001 §14), in that dependency order.

## 7. Feature State

Owned per Feature library (NG-003's finer-grained catalog), never duplicated across sibling Features, never leaked past its route's lifetime.

## 8. Component State

Stays local unless genuinely shared by more than one consumer — lifting to a Feature or Core service "just in case" is explicitly rejected as premature abstraction.

## 9. Signals Strategy

See [`SIGNALS_STRATEGY.md`](SIGNALS_STRATEGY.md) in full — the ADR-004 decision and its rationale (automatic synchronization and automatic memory management, both "by construction" rather than by discipline).

## 10. RxJS Strategy

See [`RXJS_GUIDELINES.md`](RXJS_GUIDELINES.md) in full — three retained scenarios, three explicitly rejected patterns, and the one-sentence rule: RxJS handles the moment a value arrives, Signals hold it once it's here.

## 11. Cache Strategy

See [`CACHE_STRATEGY.md`](CACHE_STRATEGY.md) § Cache Strategy — every Organization-scoped cache key includes the Organization ID, without exception, extending NG-001 §16's rule from a general principle into a Signal-specific, checkable one.

## 12. Synchronization

See `CACHE_STRATEGY.md` § State Synchronization — single-tab only for V1; within a tab, synchronization is automatic because every state category has exactly one owner.

## 13. Persistence

See `CACHE_STRATEGY.md` § Persistence Strategy — a five-row table distinguishing what persists (Auth session, UI preferences) from what deliberately doesn't (Feature data, Theme — both re-resolved fresh to avoid ever showing stale Organization-scoped content).

## 14. Performance Considerations

Signal-based `computed()` values only recalculate when their actual dependencies change (fine-grained reactivity) — this is a direct performance argument for Signal-first beyond the architectural-cleanliness one, and is the specific mechanism behind this prompt's "High Performance" objective, not a separate technique layered on top.

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Builder Portal's Projects/Units Feature state is 12 consecutive documents into the undesigned Builder Projects backend dependency | State shape is architecturally sound but cannot be validated against real Supabase response shapes | Same `infra-feature-flags` mitigation as every prior document; state ownership and caching rules apply regardless of when the backend lands |
| Signal-first is a genuinely opinionated choice that constrains NG-006 (Folder Structure) and later documents from introducing an NgRx-style store later without revisiting this ADR | Reduces flexibility if a future requirement (e.g., complex undo/redo, time-travel debugging) turns out to need a heavier state library | Accepted trade-off — no prior document named such a requirement, and Signals' `computed()`/`effect()` cover this platform's actual needs as documented |
| The Realtime-unused finding is sourced from the *backend's* Stage 4 Review (a different document series, `my_property_asset`), not this Web Platform's own A-series | If the backend adopts Realtime later without this series being told, `RXJS_GUIDELINES.md`'s reservation for it remains correctly scoped, but the "not currently required" framing would need re-verification | Cited explicitly with its source, not silently assumed to still be true forever |

## 16. Assumptions

- The backend's "Realtime confirmed unused" finding (cited from the sibling project's Stage 4 Review) still holds as of this document — not re-verified against the live Supabase project in this session, only cited from prior, documented findings.
- No prior document has established a requirement for cross-tab state synchronization, offline-first operation beyond basic resilience, or a state-library requirement beyond what Signals/`computed()`/`effect()` provide — this document's Signal-first decision is made against that absence, not against a verified absence of future need.

## 17. Constraints

No Angular code, services, components, APIs, folder structure, SQL, or CSS appears anywhere in this document or its companions (explicit Quality Rule). Every state category is an ownership and lifecycle statement, not an implementation.

## 18. Architecture Decisions

| Decision | Status | Reasoning |
|---|---|---|
| **Angular Signals as the default state primitive, RxJS reserved for genuinely async/stream boundaries** | **ADR-004 — Accepted** (finally decided, after redirection through NG-001, NG-002's renumbering, and a corrected landing here) | Automatic synchronization and memory management "by construction," fine-grained reactivity for performance, and a direct, checkable answer to this prompt's own "minimal RxJS complexity" objective. See `SIGNALS_STRATEGY.md`, `RXJS_GUIDELINES.md` |
| Dashboard state is always `computed()`, never independently fetched | Elaboration of A-007 ID-12, not a new ADR — a pre-existing business rule made a checkable state-architecture constraint | `STATE_OWNERSHIP.md` |
| Cache keys always include Organization ID for Organization-scoped data | Elaboration of NG-001 §16/NG-003 #26, not a new ADR — same rule, applied to Signals specifically | `CACHE_STRATEGY.md` |

## 19. Implementation Readiness Checklist

- [ ] Every state category in this prompt's "Define State For" list resolved in `STATE_OWNERSHIP.md`'s Ownership Map — verified, seventeen for seventeen
- [ ] ADR-004 (Signals) understood as binding for NG-006 (Folder Structure) and beyond — no future document should reintroduce RxJS-based state stores without revisiting this decision explicitly
- [ ] Dashboard's `computed()`-only rule understood as a hard constraint, not a suggestion
- [ ] Organization-ID cache-key rule understood as inherited from NG-001, not new here

## 20. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-005 entry and the third NG-series slot correction.

## 21. Updated ADR List

**Required and completed.** ADR-004 (Angular Signals) is Accepted, decided by this document — closing an open item carried since this series' first prompt. ADR-001 (Standalone Components) is redirected a fifth time, to NG-006, its corrected new home for Folder Structure.

## 22. Review Checklist

- [ ] ADR-004 (Signal-first, minimal RxJS) accepted, or redirected toward a different state-management technology
- [ ] `STATE_OWNERSHIP.md`'s Ownership Map reviewed for completeness against actual Builder Portal/Super Admin feature needs
- [ ] Third consecutive NG-series slot shift (Folder Structure now at NG-006) confirmed as intentional, not a recurring symptom worth raising with whoever authors these prompts

## 23. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Angular Architect
- [ ] Reviewed by Performance/Security Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-006 (Folder Structure) authorized to begin
