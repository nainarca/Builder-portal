---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-001 |
| **Document Name** | Angular Enterprise Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Solution Architect / Enterprise Technical Architect / Angular Architect / Security Architect / DevOps Architect / SaaS Platform Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-000 documents; `ARCHITECTURE_INDEX.md`; `docs/adr/ADR_INDEX.md` |
| **Previous Document** | NG-000 Web Platform Technical Governance |
| **Next Document** | NG-002 Workspace & Project Structure |
| **Related ADR** | ADR-009 (Application Boundary Strategy) — decided by this document, see §20 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`APPLICATION_ARCHITECTURE.md`](APPLICATION_ARCHITECTURE.md), [`ARCHITECTURE_PRINCIPLES.md`](ARCHITECTURE_PRINCIPLES.md), [`FEATURE_BOUNDARIES.md`](FEATURE_BOUNDARIES.md), [`DEPENDENCY_RULES.md`](DEPENDENCY_RULES.md), [`diagrams/NG-001_Architecture_Diagrams.md`](diagrams/NG-001_Architecture_Diagrams.md).

---

# NG-001 — Angular Enterprise Architecture

## Pre-Check Result

NG-000 was read in full and takes precedence over this document, per instruction — nothing here contradicts it, only elaborates it (`DEPENDENCY_RULES.md`'s Reconciliation section addresses the one place elaboration could look like contradiction: the layer count). A-001 through A-005, A-007, A-008, A-009 were read; A-006 remains absent, consistent with every prior finding. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent.

**One scope item has no business-architecture backing**: this prompt's Future scope names a **"Partner Portal"** — a concept never mentioned anywhere in A-001 through A-009. It is treated here exactly as this series has always treated an unbacked item: reserved as a placeholder in the Future Expansion Model (§17), not designed, not assumed to mean anything specific.

**On A-009's split verdict versus this document's full-platform scope**: A-009 found the Builder Portal's operational core not ready for feature-specific technical design, pending the Builder Projects backend domain and A-006. This document does not violate that finding — it defines *layers, boundaries, and principles* that apply uniformly to any feature, including a Builder Portal one, without needing that feature's backend to exist (the same reasoning that let NG-000 proceed). What this document explicitly does **not** do — consistent with both its own scope restriction and A-009's finding — is design Builder Portal routing, components, or state specifics. Where the Project & Unit Preparation feature boundary is defined (`APPLICATION_ARCHITECTURE.md`, `FEATURE_BOUNDARIES.md`), its dependency on the undesigned backend domain is stated explicitly, not glossed over.

---

## 1. Executive Summary

NG-001 defines the overall Angular architecture governing the MyPropertyAsset Web Platform: three independently deployable applications (Public Website, Super Admin, Builder Portal) sharing a common platform of libraries, organized into five architectural layers, with feature isolation enforced as a structural rule rather than a convention. Every major decision here traces to a specific finding in a prior document — most importantly, the three-application boundary is the direct code-level consequence of A-005 §8's finding that no product's navigation ever merges with another's. This document defines shape; it defines no folder, no route, no component, and no line of code.

## 2. Architecture Vision

Build an Angular platform where the business architecture's own isolation guarantees (Organization isolation, Restricted-Financial's absolute protection, Builder-Portal-is-not-ERP) are structurally true in the code, not just enforced by convention — the same discipline nine business-architecture documents and one governance document have already practiced, now expressed as application boundaries, dependency rules, and layer contracts.

## 3. Architecture Principles

See [`ARCHITECTURE_PRINCIPLES.md`](ARCHITECTURE_PRINCIPLES.md) in full, including the Principle Provenance table tracing every principle back to its originating business-architecture finding.

## 4. Application Architecture

See [`APPLICATION_ARCHITECTURE.md`](APPLICATION_ARCHITECTURE.md) in full — three applications, their feature boundaries, and the shared/core platform they draw on.

## 5. Architecture Layers

```
Presentation → Application → Domain → Infrastructure (cross-cutting) → Backend Integration
```
Full detail and reconciliation with NG-000's four-layer model: [`DEPENDENCY_RULES.md`](DEPENDENCY_RULES.md).

## 6. Shell Architecture

Each application owns one Shell — the outermost component responsible for bootstrap sequencing (§14), Global Navigation rendering, and the primary route outlet. Public Website's Shell is structurally simpler (header/footer, no auth/Organization/RBAC resolution) than Super Admin's and Builder Portal's (which both resolve auth → Organization Context → RBAC → theme before rendering). Full diagram: `diagrams/NG-001_Architecture_Diagrams.md` §5.

## 7. Feature Architecture

See [`FEATURE_BOUNDARIES.md`](FEATURE_BOUNDARIES.md) in full — module responsibilities and the three permitted cross-feature communication channels (Core services, routing, Core-level events).

## 8. Core Platform

Per-application, not shared: each app's Core composes the shared primitives (`shared-auth`, `shared-organization-context`, `shared-rbac`) into an app-specific bootstrap. Core is instantiated once per app session; it is not a library reused verbatim across apps, because the three apps' bootstrap sequences are legitimately different (`APPLICATION_ARCHITECTURE.md` § Core Platform).

## 9. Shared Platform

Six shared libraries (`shared-ui`, `shared-auth`, `shared-rbac`, `shared-organization-context`, `shared-data-access`, `shared-models`) — full detail in `APPLICATION_ARCHITECTURE.md`. None of the six may ever depend on an application or a feature (`DEPENDENCY_RULES.md` rule 2).

## 10. Cross Module Communication

Three permitted channels only — Core services, routing, and a Core-level event mechanism with contracts defined in `shared-models` — detailed in `FEATURE_BOUNDARIES.md`. A cross-feature need that fits none of the three is a signal the feature boundary is wrong, not a reason to add a fourth channel.

## 11. Dependency Rules

See [`DEPENDENCY_RULES.md`](DEPENDENCY_RULES.md) in full — six hard rules, mechanically checkable once NG-002 selects tooling.

## 12. Layout Strategy

One layout per application (not per feature): Public Website's header/footer layout, and a shared sidebar+topbar+content-outlet shape for Super Admin and Builder Portal (matching `MENU_STRUCTURE.md`'s established Global Navigation pattern for both). Breadcrumbs render only at three-or-more levels of depth, per A-005 §11 — restated here as a layout constraint, not redesigned.

## 13. White-label Strategy

Theming is runtime, Organization-scoped configuration resolved during Shell bootstrap (§14) — never a build-time, per-tenant artifact. This has one concrete architectural consequence stated here even though the theming *mechanism* itself is out of this document's scope (a future UI-001 concern): the Shell must be capable of reconfiguring its visual presentation after bootstrap without a rebuild, which rules out build-time SCSS-variable-per-tenant approaches as a viable implementation path before UI-001 even starts.

## 14. Scalability Strategy

New products are added as new applications in the same workspace, reusing the Shared Platform without modifying any existing application (`diagrams/NG-001_Architecture_Diagrams.md` §9, Future Expansion Model). This is the concrete mechanism behind NG-000 and A-007/A-008's repeated claim that this architecture accommodates future products without redesign — this document is where that claim is actually cashed out as a structural property, not just asserted again.

## 15. Security Architecture (High-Level)

- Application-level isolation (three separate bundles) is itself a security property, not just an organizational one — restated from `APPLICATION_ARCHITECTURE.md`'s justification.
- RBAC (route guards, component-level conditionals) is always derived from `PERMISSION_MATRIX.md`, never independently invented, and is always backed by Supabase RLS as the real enforcement layer (NG-000 restated).
- Full authentication/authorization mechanism design is explicitly deferred to a future NG-006 — this document defines only that the boundary exists and where it sits in the layer stack (§5, `DEPENDENCY_RULES.md`).

## 16. Performance Architecture

`OnPush` change detection as the default (NG-000 restated); every Feature lazy-loads as its own chunk; Core and Shared libraries are eager (needed before any feature can render); route-level code-splitting aligns with A-004's screen-to-feature mapping so a Builder Portal user never downloads Super Admin's feature chunks even within the (hypothetical, rejected) single-app alternative — though in this document's actual three-app design, that separation is already total at the application level, making feature-level lazy-loading a performance optimization within an app rather than a security boundary between apps.

## 17. Architecture Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Project & Unit Preparation feature boundary is architecturally sound but cannot be implemented** — the Builder Projects backend domain remains undesigned (8th consecutive document to carry this dependency: A-002→A-003→A-003A→A-004→A-005→A-007→A-008→NG-001) | The one feature most central to this platform's purpose is the one this document can least fully specify | Feature-toggle it (NG-000 `REPOSITORY_STANDARDS.md` §28) — build the boundary now, gate its content behind a toggle until the backend exists |
| Five architectural layers here vs. NG-000's four could read as a contradiction if not reconciled carefully | Confusion for whoever implements NG-002 onward | Addressed explicitly in `DEPENDENCY_RULES.md`'s Reconciliation section — Infrastructure is cross-cutting, not a fifth sequential step |
| "Partner Portal" appears in this prompt's scope with zero business-architecture backing | A future document could mistakenly treat it as designed | Reserved as a placeholder only (§ Pre-Check Result, §17 Future Expansion) |
| Three-application split increases build/deployment complexity relative to one app | More CI/CD surface area to manage | Accepted trade-off, justified in ADR-009 (§20) — the security/isolation benefit outweighs the operational cost for a platform whose own business architecture insists so strongly on non-overlapping product boundaries |

## 18. Architecture Constraints

No Angular code, folder structure, routing, components, services, APIs, DTOs, models, CSS, PrimeNG implementation, or state implementation appears anywhere in this document or its companions (explicit Quality Rule, respected throughout). Every layer, boundary, and rule defined here is written to remain valid regardless of NG-002 through NG-009's eventual specific technology choices (standalone vs. NgModule, Signals vs. RxJS, NgRx vs. a lighter store) — this document uses "feature module" and "service" as conceptual terms, not literal Angular API references.

## 19. Future Expansion

See `diagrams/NG-001_Architecture_Diagrams.md` §9. Tenant Platform (A-003 §9, A-007 ID-15) and Service Marketplace (A-001's "Future Marketplace") both have real, if thin, business-architecture backing. Partner Portal does not — reserved only.

## 20. Architecture Decision Summary

| Decision | Status | Reasoning |
|---|---|---|
| **Three independently deployable applications**, not one app with route-level guarding | **ADR-009 — Accepted** | Security/isolation benefit (build-level, not just runtime, separation) justifies the added deployment complexity — `APPLICATION_ARCHITECTURE.md` |
| Five-layer model (Infrastructure as cross-cutting addition to NG-000's four) | Elaboration, not a new ADR — doesn't rise to "hard to reverse" | `DEPENDENCY_RULES.md` Reconciliation |
| Organization Context as a single Core-layer service, shaped differently per app | Elaboration, candidate for a future ADR once NG-004/NG-006 make it concrete | `APPLICATION_ARCHITECTURE.md`, §16 (via `ARCHITECTURE_PRINCIPLES.md`) |
| Standalone components vs. NgModules (ADR-001) | **Not decided here** — redirected to NG-002 (Workspace & Project Structure), where the concrete project setup actually forces the choice | `docs/adr/ADR_INDEX.md` updated accordingly |
| Angular Signals vs. RxJS-based state (ADR-004) | **Not decided here** — redirected to NG-004 (State Management), consistent with this document's "state ownership at a high level only" scope | `docs/adr/ADR_INDEX.md` updated accordingly |

## 21. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-001 entry.

## 22. Updated ADR List

**Required and completed.** ADR-009 (Application Boundary Strategy) is Accepted, decided by this document. ADR-001 and ADR-004's anticipated trigger document is updated from a generic "NG-001" to the more precise NG-002 and NG-004 respectively, since this document's own scope explicitly excludes the component-pattern and state-technology decisions those ADRs actually cover.

## 23. Review Checklist

- [ ] Three-application boundary (ADR-009) accepted as the right call, or redirected toward a single-app alternative
- [ ] Five-layer/four-layer reconciliation with NG-000 (`DEPENDENCY_RULES.md`) accepted as elaboration, not contradiction
- [ ] Project & Unit Preparation feature's dependency on the undesigned Builder Projects backend domain (§17) acknowledged as the 8th consecutive carry-forward — a decision point, not a routine flag, by now
- [ ] "Partner Portal" confirmed as a placeholder only, not accidentally treated as scoped

## 24. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Angular Architect
- [ ] Reviewed by Security Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-002 (Workspace & Project Structure) authorized to begin
