# Library Catalog — MyPropertyAsset Web Platform

**Companion to:** [`NG-003_Angular_Library_Architecture.md`](NG-003_Angular_Library_Architecture.md)
**Purpose:** Maps every library this prompt asked to define to its actual resolution — reused from NG-001/NG-002, newly added here, reserved-only, or explicitly **not created**. Nothing in this catalog contradicts NG-001/NG-002; where a request implies a finer split of an existing boundary, that's noted as a refinement, not a redesign.

| # | Requested | Resolution | Library / Boundary | Basis | Status |
|---|---|---|---|---|---|
| 1 | Platform | Umbrella term, not a single library — Core + Shared + Utility + Theme (NG-002's taxonomy) | *(conceptual grouping)* | NG-002 §6 | Documented |
| 2 | Authentication | `shared-auth` | Core | NG-001 §9 | Existing, cataloged |
| 3 | Authorization | `shared-rbac` | Core | NG-001 §9 | Existing, cataloged |
| 4 | Dashboard | `super-admin-dashboard`, `builder-portal-dashboard` — per-app, since each Dashboard aggregates that app's own data (A-004 SA-02, BA-02) and has no reason to be shared | Feature (Internal) | A-004 §6/§7 | **New** |
| 5 | Projects | `builder-portal-projects` — split out of NG-001's combined "Project & Unit Preparation" feature | Feature (Internal), `scope:builder-portal` | A-007 ID-07 — **depends on the undesigned Builder Projects backend domain (10th consecutive document)** | **New (refinement)** |
| 6 | Units | `builder-portal-units` — split out of the same combined feature | Feature (Internal), `scope:builder-portal` | A-007 ID-07 — same backend dependency as Projects | **New (refinement)** |
| 7 | **Property** | **Not created.** See § Property Resolution below | — | A-007 ID-13, Restricted-Financial | **Explicitly excluded** |
| 8 | Documents | `builder-portal-documents` — split out of NG-001's "Handover" feature | Feature (Internal) | A-007 ID-09 | **New (refinement)** |
| 9 | Invitations | `builder-portal-invitations` — split out of "Handover" | Feature (Internal) | A-007 ID-10 | **New (refinement)** |
| 10 | Notifications | `communication` — one per app (Public Website has none, Super Admin and Builder Portal each have their own) | Feature (Internal) | A-007 ID-11 | Existing concept, formalized as its own library here |
| 11 | Reports | `builder-portal-reports`, `super-admin-operations` (Monitoring already implied this) | Feature (Internal) | A-007 ID-12 | Existing, cataloged |
| 12 | Search | `search` — a Utility library, since search logic (filter/query shaping) is business-agnostic even though *what* is searchable is scoped per app (`SEARCH_ARCHITECTURE.md`) | Utility | A-007 `SEARCH_ARCHITECTURE.md` | **New** |
| 13 | Organization | `shared-organization-context` | Core | NG-001 §9 | Existing, cataloged |
| 14 | Users | `super-admin-users` | Feature (Internal) | A-004 SA-08 — **no backing A-003A story (A-004 §14)** | **New**, inherits existing gap flag |
| 15 | Configuration | `infra-config` | Infrastructure | NG-000/NG-001/NG-002 Config Strategy | **New**, formalizes an existing principle |
| 16 | Theme | `theme-tokens`, `theme-runtime` | Theme | NG-002 §15 | Existing, cataloged |
| 17 | Audit | `super-admin-audit` | Feature (Internal) | A-004 SA-10 — **no backing A-003A story (A-004 §14)** | **New**, inherits existing gap flag |
| 18 | Settings | `super-admin-settings`, `builder-portal-settings` | Feature (Internal) | A-004 SA-11, BA-13 (BA-13 **no backing story**, A-004 §14) | **New** |
| 19 | Shared UI | `shared-ui` | Theme-adjacent (consumes Theme, used by all apps) | NG-001 §9 | Existing, cataloged |
| 20 | Shared Utilities | `util-*` | Utility | NG-002 §6 | Existing, cataloged |
| 21 | Core Services | Core category, in aggregate | Core | NG-001/NG-002 | Existing, cataloged |
| 22 | Infrastructure | `infra-logging`, `infra-error-handling`, `infra-config` — the cross-cutting layer NG-001 §5 already named, now split into concrete libraries | Infrastructure | NG-001 §5 | **New**, formalizes an existing layer |
| 23 | API Layer | `shared-data-access` | Shared | NG-001 §9 | Existing, cataloged |
| 24 | Error Handling | `infra-error-handling` | Infrastructure | NG-000 §11 | **New**, formalizes an existing principle |
| 25 | Logging | `infra-logging` | Infrastructure | NG-000 §12 | **New**, formalizes an existing principle |
| 26 | Caching | `infra-caching` — **every cache key must include Organization ID, no exceptions** (NG-001 §16 restated as a library-level contract) | Infrastructure | NG-000 §19/21, NG-001 §16 | **New** |
| 27 | Feature Flags | `infra-feature-flags` — **the concrete mechanism behind every "feature-toggle it" mitigation this series has used since NG-000** for the Builder Projects backend dependency | Infrastructure | NG-000 §28 | **New**, high-value — this is where that recurring mitigation actually lives in code |
| 28 | White-label | `theme-runtime` — same library as #16, this is not a second, separate concept | Theme | NG-001 §13 | Existing, cataloged (duplicate request, noted not re-created) |
| 29 | Future Tenant | Reserved application boundary only (`tenant-platform`, not yet built) | *(reserved)* | A-007 ID-15 | Reserved |
| 30 | Future Marketplace | Reserved application boundary only (`service-marketplace`, not yet built) | *(reserved)* | A-001 "Future Marketplace" | Reserved |

## Property Resolution — the one request not fulfilled as asked

This prompt's "Libraries to Define" list includes **Property**. In this platform's own established vocabulary (A-007 ID-13, "Owner Financial & Property Information"), Property means a property's acquisition cost, market value, and its associated Loan/Expense/Tenant/Financial History — **Restricted-Financial classification, the single highest sensitivity tier this platform recognizes, with no delegation path for any role, ever (A-008)**. NG-001's `ARCHITECTURE_PRINCIPLES.md` states plainly: *"The web platform's codebase contains zero code path that can ever touch Restricted-Financial data."* Creating a `property` library in this workspace — even an empty one, even one that merely re-exports Owner-side types — would be the first crack in that rule, and this document does not take that step.

What legitimately exists on this side of the platform, and is already covered without a new library: the Builder Portal's pre-handover Unit (`builder-portal-units`, #6) becomes, at the moment of handover acceptance, a Property in the Owner Mobile App — an event this platform observes (via the Documents/Invitations libraries recording that a transfer occurred) but never a record it owns, stores, or displays financial detail for. If a future document genuinely needs a "Property" concept in this workspace, it should be scoped explicitly to that reference-only boundary and reviewed against this same rule again — not assumed from this catalog entry.
