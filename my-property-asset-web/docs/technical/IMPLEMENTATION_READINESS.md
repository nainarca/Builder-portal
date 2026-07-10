# Implementation Readiness — MyPropertyAsset Web Platform

**Companion to:** [`NG-014_Technical_Architecture_Review.md`](NG-014_Technical_Architecture_Review.md)
**Covers:** Document Status Matrix, Recommended Implementation Order (detail).

## Document Status Matrix

| Document | Version | Status | Approval Checklist run? | Blocking issues |
|---|---|---|---|---|
| A-001 | 1.0 | Draft | No | None architectural — awaiting human approval |
| A-002 | 1.0 | Draft | No | `organization_type` discriminator undecided (non-blocking, narrowed) |
| A-003 / A-003A | 1.0 | Draft | No | None |
| A-004 | 1.0 | Draft | No | 3 story-less screens (non-blocking, flagged) |
| A-005 | 1.0 | Draft | No | 2 screen-less nav items (non-blocking, flagged) |
| A-006 | — | **Does not exist** | N/A | **Blocking for Builder Portal operational core specifically** |
| A-007 | 1.0 | Draft | No | Built on A-006's provisional bridge |
| A-008 | 1.0 | Draft | No | ADR-008 invocation workflow undesigned (blocks Support Access specifically) |
| A-009 | 1.0 | Draft (audit) | No | Terminal business audit; findings largely still current |
| NG-000 | 1.0 | Draft | No | None |
| NG-001–NG-005 | 1.0 each | Draft | No | None blocking |
| NG-006 | 1.0 | Draft | No | First Super Admin bootstrap unresolved (non-blocking, operational) |
| NG-007 | 1.0 | Draft | No | Depends on external backend schema completeness |
| NG-008–NG-010 | 1.0 each | Draft | No | None blocking |
| NG-011 | 1.0 | Draft | No | Tooling/vendor selection pending (expected at this stage) |
| NG-012 | 1.0 | Draft | No | Numeric targets unvalidated (expected at this stage) |
| NG-013 | 1.0 | Draft | No | PrimeNG theming-API assumption unconfirmed |

**23 of 23 documents: Draft. 0 of 23: Approved.** This single fact is the dominant finding of this entire review, restated once here plainly rather than repeated in every row above.

## Recommended Implementation Order

Sequenced to front-load what is both highest-confidence (§ Readiness Scorecard) and least blocked, mirroring A-009's own Track A/Track B split rather than inventing a new sequencing philosophy:

**Phase 0 — Governance unblock (prerequisite to everything else):**
1. A human stakeholder formally runs the Approval Checklist on NG-000 through NG-013 (and the A-series) — this is not an architecture task, it is the single action this entire review identifies as the actual gate.
2. `MASTER_CONTEXT.md` and `PROJECT_FACTS.md` are created or the requirement to read them is formally retired from the prompt template — currently a mandatory pre-read for every prompt that has never once existed.

**Phase 1 — Cross-cutting foundation (highest readiness, no Builder-Projects dependency):**
3. Nx workspace scaffold, exactly matching `SOURCE_TREE.md` (NG-008) — the highest-confidence, most mechanically-specified area of the series.
4. Core, Shared, Utility, Theme, and Infrastructure libraries (NG-002, NG-003, NG-013) — `shared-auth`, `shared-organization-context`, `shared-rbac`, `shared-data-access`, `shared-models`, `shared-ui` (with PrimeNG wrapped per ADR-005), `theme-tokens`/`theme-runtime`, `infra-*`.
5. Authentication and Authorization implementation (NG-006) against the existing backend's already-specified Platform Foundation (Organizations/Members/Roles/Permissions) — this is the one Business Domain area the backend's own Stage 4 Review confirms has a written specification, even without implementation.

**Phase 2 — Public Website (fully unblocked, no Organization/backend-schema dependency for its core content):**
6. Public Website application — marketing/conversion, per A-009's own 🟡-approved scope, SSR per ADR-015.

**Phase 3 — Super Admin, non-Builder-data surfaces:**
7. Super Admin's Organization/Builder management, Commercial, and Operations features — the surfaces A-009 already scoped as 🟡-approved.

**Phase 4 — Blocked pending Phase 0's Builder-Projects-specific prerequisites:**
8. Builder Portal's operational core (Projects, Units, Documents, Invitations) — remains blocked until **both** A-006 is written (or formally waived) **and** the Builder Projects backend domain is commissioned. `infra-feature-flags` allows this phase's *boundaries* to be built earlier (toggled off) without violating this sequencing, consistent with the mitigation this series has used since NG-000.
9. Support Access implementation — blocked until ADR-008's invocation workflow is designed by an owning document.

**Phase 5 — Platform-wide hardening, throughout, not a discrete final phase:**
10. CI/CD pipeline (NG-011), test automation (NG-012) — built alongside Phases 1–4, not deferred to the end, per this series' own "shift-left" testing philosophy (`TESTING_STRATEGY.md` §2).

This ordering does not introduce new architecture — it sequences already-decided architecture by the readiness and dependency facts this review itself established.
