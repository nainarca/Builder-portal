---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-003 |
| **Document Name** | Angular Library & Package Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000, NG-001, NG-002, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-series documents |
| **Previous Document** | NG-002 Angular Workspace & Project Architecture |
| **Next Document** | NG-004 Folder Structure |
| **Related ADR** | None new — see § Updated ADR List |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`LIBRARY_CATALOG.md`](LIBRARY_CATALOG.md), [`PACKAGE_ARCHITECTURE.md`](PACKAGE_ARCHITECTURE.md), [`LIBRARY_DEPENDENCY_RULES.md`](LIBRARY_DEPENDENCY_RULES.md) *(renamed from the requested `DEPENDENCY_RULES.md` — see Pre-Check Result)*, [`LIBRARY_STANDARDS.md`](LIBRARY_STANDARDS.md), [`diagrams/NG-003_Library_Diagrams.md`](diagrams/NG-003_Library_Diagrams.md).

---

# NG-003 — Angular Library & Package Architecture

## Pre-Check Result

NG-000 (precedence), NG-001, and NG-002 were read in full. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent, consistent with every prior check. Two issues found and resolved rather than silently worked around:

1. **Filename collision.** This prompt's deliverables list names a file `DEPENDENCY_RULES.md` — that file already exists, created by NG-001, and covers the five-layer architectural model. Overwriting it would destroy approved (if not yet formally sign-off) content and contradict this whole series' standing rule against modifying prior documents. This document's dependency-rules companion is named `LIBRARY_DEPENDENCY_RULES.md` instead.
2. **A requested library directly conflicts with an already-established absolute rule.** This prompt asks for a "Property" library. NG-001 `ARCHITECTURE_PRINCIPLES.md` states that this web platform's codebase contains zero code path that can ever touch Restricted-Financial data (Owner Loan/Expense/Tenant/Financial History, A-007 ID-13, A-008's no-exception rule). A `property` library, in the sense this platform's own vocabulary gives that word, would be exactly such a code path. **It is not created.** See `LIBRARY_CATALOG.md`'s Property Resolution section for the full reasoning and for what legitimately does exist instead (the Builder Portal's pre-handover Unit concept).

Every other requested library was mapped to an existing NG-001/NG-002 boundary, added as a genuine new library with clear justification, or reserved as a placeholder — full mapping in `LIBRARY_CATALOG.md`.

---

## 1. Executive Summary

NG-003 catalogs all thirty libraries this prompt named, resolving each to an existing boundary, a newly justified addition, a reserved placeholder, or — for one, "Property" — an explicit refusal grounded in an already-established security rule. It splits NG-001's combined Builder Portal features (Project & Unit Preparation, Handover) into five finer-grained libraries (Projects, Units, Documents, Invitations, Reports) as the natural next level of detail, and formalizes NG-001's cross-cutting Infrastructure layer into five concrete libraries, including `infra-feature-flags` — the literal home for the feature-toggle mitigation this series has invoked at every Builder-Projects-dependent document since NG-000.

## 2. Library Principles

Every principle from NG-001 `ARCHITECTURE_PRINCIPLES.md` applies unchanged at the library level; this document adds one: **a library's existence is itself a claim about what data this platform touches.** Refusing to create the Property library (§ Pre-Check Result) is this principle in action — the strongest access control is a boundary that was never drawn.

## 3. Package Architecture

See [`PACKAGE_ARCHITECTURE.md`](PACKAGE_ARCHITECTURE.md) in full — package boundaries, responsibilities by category, Internal vs. Public, and the plugin/extension pattern.

## 4. Library Catalog

See [`LIBRARY_CATALOG.md`](LIBRARY_CATALOG.md) in full — all thirty requested libraries resolved, table format, with the Property Resolution as its own called-out section.

## 5. Core Libraries

Unchanged from NG-001: `shared-auth`, `shared-organization-context`, `shared-rbac`. No new Core library was justified by this pass — every "Users"/"Authorization"-adjacent request resolved to either an existing Core library or a Feature library (`super-admin-users`), not a new Core one, because Core is reserved for concerns *every* authenticated app needs, and user administration is Super-Admin-specific.

## 6. Shared Libraries

Unchanged from NG-001: `shared-data-access`, `shared-models`. "API Layer" (requested) resolves to `shared-data-access` directly — no second data-access library was created.

## 7. Feature Libraries

Builder Portal's feature libraries are now finer-grained than NG-001 left them: `builder-portal-dashboard`, `builder-portal-projects`, `builder-portal-units`, `builder-portal-documents`, `builder-portal-invitations`, `builder-portal-reports`, `builder-portal-settings`, plus Super Admin's `super-admin-dashboard`, `super-admin-users`, `super-admin-audit`, `super-admin-settings`, `super-admin-operations`. This is a refinement of NG-001 `FEATURE_BOUNDARIES.md`'s four-feature-per-app model, not a contradiction — see `LIBRARY_CATALOG.md` rows 4–11, 14, 17–18 for the specific splits and their justification.

## 8. Platform Libraries

"Platform" (requested item 1) is not itself a library — it is the collective term for Core + Shared + Infrastructure + Utility + Theme, per `LIBRARY_CATALOG.md` row 1.

## 9. Dependency Rules

See [`LIBRARY_DEPENDENCY_RULES.md`](LIBRARY_DEPENDENCY_RULES.md) — the Nx tag matrix (NG-002, unchanged) mapped onto every newly-named library, plus a specific note on the elevated sibling-import risk that comes with Builder Portal now having five adjacent feature libraries instead of two.

## 10. Communication Rules

Unchanged three channels (NG-001 `FEATURE_BOUNDARIES.md`: Core services, routing, Core-level events) — restated in `LIBRARY_DEPENDENCY_RULES.md` § Cross Library Communication as now more load-bearing given the finer split.

## 11. Ownership Rules

See [`LIBRARY_STANDARDS.md`](LIBRARY_STANDARDS.md) § Library Ownership — Infrastructure libraries join Core/Shared/Utility/Theme as Platform-team-owned, never single-application-owned.

## 12. Version Strategy

See `LIBRARY_STANDARDS.md` § Library Version Strategy — every library versions with the platform release (ADR-007, SemVer), no independent per-library versioning at this stage.

## 13. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Five adjacent Builder Portal feature libraries (up from two) increases the number of places a forbidden sibling-import could be attempted | More surface area for a dependency-rule violation, even though the rule itself is unchanged and still mechanically enforced (Nx, ADR-010) | Named explicitly in `LIBRARY_DEPENDENCY_RULES.md`; enforcement mechanism (not the rule) already exists from NG-002 |
| `builder-portal-projects` and `builder-portal-units` are now two separate libraries both depending on the still-undesigned Builder Projects backend domain — **10th consecutive document** carrying this dependency | Splitting the feature earlier means splitting the toggle-gated placeholder into two coordinated pieces once the backend does exist | `infra-feature-flags` (§ new library, this document) is the concrete mechanism; both libraries gate under the same flag until the backend resolves |
| Refusing to create "Property" may read as not fulfilling the prompt | A future reviewer could mistake this for an oversight rather than a deliberate, reasoned refusal | Documented prominently in three places: this section, § Pre-Check Result, and `LIBRARY_CATALOG.md`'s dedicated Property Resolution section — not a footnote |

## 14. Assumptions

- The finer Builder Portal feature split (Projects/Units/Documents/Invitations as separate libraries) is a reasonable level of granularity for a platform of this scope — not verified against an actual team-size or delivery-cadence constraint this series has no visibility into.
- Refusing the Property library is the correct call under NG-001's already-established rule — treated as non-negotiable given that rule's own "no exception, ever" framing, not re-litigated as a judgment call here.

## 15. Constraints

No folder structure, Angular code, components, services, routing, APIs, SQL, CSS, or state management appears anywhere in this document or its companions (explicit Quality Rule). Every new library named here is a boundary and a responsibility statement, not an implementation.

## 16. Future Expansion

`tenant-platform-*` and `service-marketplace-*` library families are reserved, unnamed beyond their application-level placeholder (NG-002 `diagrams/NG-002_Workspace_Diagrams.md` §7) — no library within them is specified until those products are formally scoped.

## 17. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-003 entry, including the filename-collision and Property-exclusion findings.

## 18. Updated ADR List

**Not required.** No new hard-to-reverse, cross-cutting technical decision was made by this document — every library added here fits within categories NG-001/NG-002 already established (Feature, Infrastructure-as-Utility-subcategory). The Property refusal is a *reaffirmation* of an existing rule, not a new decision requiring its own ADR.

## 19. Review Checklist

- [ ] Property library refusal (§ Pre-Check Result, `LIBRARY_CATALOG.md`) confirmed as correct, or the underlying NG-001 rule itself revisited (a much bigger conversation than this document alone)
- [ ] Builder Portal's finer-grained five-library split accepted as reasonable, or reverted toward NG-001's original four-feature grouping
- [ ] `infra-feature-flags` accepted as the concrete home for the recurring Builder-Projects-dependency mitigation
- [ ] `LIBRARY_DEPENDENCY_RULES.md` naming (vs. the requested `DEPENDENCY_RULES.md`) confirmed as the right way to avoid the collision

## 20. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Angular Architect
- [ ] Reviewed by Security Architect (specifically for the Property refusal)
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-004 (Folder Structure) authorized to begin
