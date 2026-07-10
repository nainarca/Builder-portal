# NG-008 — Angular Folder Structure & Source Tree Architecture

## Document Information

| Field | Value |
|---|---|
| Document ID | NG-008 |
| Name | Angular Folder Structure & Source Tree Architecture |
| Version | 1.0 |
| Status | Draft |
| Series | Technical Architecture (`docs/technical/`) |
| Depends On | NG-000–NG-007, A-001–A-009 |
| Previous Document | NG-007 — API & Data Access Architecture |
| Next Document | NG-009 — Error Handling & Logging |
| Governing reference for | ADR-001 (Standalone Components — finally decided here), NG-009, NG-010, NG-011 (Build & Deployment), NG-012 (Testing Strategy), Cursor AI implementation |
| Last Updated | 2026-07-09 |

---

## Pre-Check Result

**Documents read as Source of Truth:** NG-000 through NG-007 in full (including every companion file — `LIBRARY_CATALOG.md`, `PROJECT_ORGANIZATION.md`, `FEATURE_BOUNDARIES.md`, `WORKSPACE_GUIDE.md`, `LIBRARY_STRATEGY.md`, `DEPENDENCY_GUIDE.md`, `ROUTING_STRATEGY.md`, `STATE_OWNERSHIP.md`, `AUTHENTICATION_ARCHITECTURE.md`, `AUTHORIZATION_ARCHITECTURE.md`, `CODING_STANDARDS.md`, `REPOSITORY_ARCHITECTURE.md`), plus `ARCHITECTURE_INDEX.md` and `docs/adr/ADR_INDEX.md`.

**`MASTER_CONTEXT.md` and `PROJECT_FACTS.md` re-verified absent** (file search, this session) — consistent with every prior document since A-009 first surfaced this. Not re-litigated at length; noted once, per this series' established practice for a finding that hasn't changed.

**Renumbering:** None. NG-007 announced this document as NG-008, and this document's own title matches exactly — the second consecutive on-schedule document (the first was NG-007 itself), which is worth noting only because the prior four documents in a row were not.

**Angular project directory re-verified still absent** (`apps/`, `libs/`, `package.json` all confirmed absent on disk this session) — this remains a genuinely greenfield source-tree design, not a retrofit. See §16 Migration Strategy.

**ADR-001 (Standalone Components) — decided in this document, as anticipated.** `docs/adr/ADR_INDEX.md` has named this document as ADR-001's trigger since its most recent redirect; `CODING_STANDARDS.md` §9 already flagged standalone components as "the *provisional* default (pending NG-001's formal decision, tracked as ADR-001)" — that pending decision is resolved here, formally, in §17.

**No conflicts found.** Every folder-organization decision in this document derives directly from an already-decided prior document (ADR-009's three apps, NG-002's Nx tag matrix, NG-003's finer-grained feature libraries, NG-005's Core/Feature/Component state ownership, NG-006's Authentication/Organization/RBAC layering, NG-007's Repository pattern) — this document places each of those decisions into a physical path, it does not re-decide any of them.

---

## 1. Executive Summary

NG-008 defines where every piece of this platform's code physically lives. It introduces no new architectural principle beyond what NG-000 through NG-007 already established — its entire contribution is translating seven documents' worth of layering, boundary, and naming rules into one concrete, enforceable `apps/`/`libs/` source tree, plus the one decision every prior document deferred: **ADR-001, Angular Standalone Components**, which this document accepts because folder structure is the first place that choice has physical consequences (no `*.module.ts`, no NgModule-shaped folder anywhere in this tree). Six companion files carry the detail: `SOURCE_TREE.md` (the tree itself), `IMPORT_RULES.md` (physical import boundaries), `NAMING_STANDARDS.md` (folder/project naming), `SCSS_STRUCTURE.md`, `ASSET_STRUCTURE.md`, and `LOCALIZATION_STRUCTURE.md` (reserved only).

## 2. Source Tree Principles

- **The folder structure is the tag matrix, made visible.** `DEPENDENCY_GUIDE.md` §22's `type:*` tags already determine what a project may depend on; this document's `libs/<category>/<name>` grouping means the *folder path itself* now tells a reader (or Cursor AI) which tag applies, before opening `project.json` at all.
- **A folder exists because a decided document justifies it.** Every feature folder maps to an A-007 Information Domain or A-007 §2.1 Working Module (`PROJECT_ORGANIZATION.md` §7); no folder in this tree exists for "organizational convenience" alone.
- **Reserved boundaries are named explicitly as reserved**, never built out further than the prior document that reserved them (Search's Utility slot, Theme's i18n slot, `util-formatting`/`util-validation`) — this document places their folders; it does not populate them.
- **No folder for Restricted-Financial data, anywhere.** The physical absence of `property/`, `loans/`, `expenses/` under any category is this document's own restatement of NG-003's and NG-007's refusals — see `SOURCE_TREE.md` §3.

## 3. Workspace Structure

See `SOURCE_TREE.md` §1. `apps/` and `libs/` as top-level siblings, plus `docs/` (existing), `tools/`, and workspace-level config.

## 4. Folder Hierarchy

See `SOURCE_TREE.md` §2–3. Application source trees under `apps/`, library source trees under `libs/`, organized by technical category (`core/shared/util/theme/infra/feature`) at the first level and by project at the second.

## 5. Feature Placement

See `SOURCE_TREE.md` §3, `feature/` subtree. Every feature named in `FEATURE_BOUNDARIES.md`/`LIBRARY_CATALOG.md` gets exactly one folder, grouped under its owning application (`libs/feature/<app>/<feature>/`) — resolving the one naming ambiguity `LIBRARY_CATALOG.md` left open (`communication`, ambiguous as a single shared name for two per-app instances) into two concrete, distinct paths: `super-admin-communication` and `builder-portal-communication` (`SOURCE_TREE.md` § Communication Naming).

## 6. Core Placement

`libs/core/auth/`, `libs/core/organization-context/`, `libs/core/rbac/` — the three Core-category libraries NG-001 named (`shared-auth`, `shared-organization-context`, `shared-rbac`). Each application's own **app-specific Core composition** (the bootstrap sequence that assembles these into that app's particular order — `APPLICATION_ARCHITECTURE.md`'s "Core is not itself a shared library" distinction) lives inside that application's own tree at `apps/<app>/src/app/core/` (`SOURCE_TREE.md` §2) — never inside `libs/core/`, because it is not itself a reusable library, it is one application's specific wiring of reusable libraries.

## 7. Shared Placement

See `SOURCE_TREE.md` §3, `shared/` subtree and Diagram 6. `shared-data-access`, `shared-models`, `shared-ui` — the domain-shaped and design-system libraries reused across more than one application.

## 8. Infrastructure Placement

`libs/infra/logging/`, `error-handling/`, `config/`, `caching/`, `feature-flags/` — the cross-cutting layer NG-001 §5 named and NG-003 `LIBRARY_CATALOG.md` #22–27 gave concrete library identities to. Tagged `type:util` in the dependency matrix (consumable by everything, per `DEPENDENCY_GUIDE.md` §22's "Infrastructure is cross-cutting" row) but kept in its own `infra/` folder rather than merged into `util/`, because grouping by *purpose* (cross-cutting platform concern) reads more clearly than grouping purely by *tag* here — the one place this document's folder grouping and the tag matrix intentionally diverge, and it is called out explicitly rather than left as an unexplained inconsistency.

## 9. API Layer Placement

`libs/shared/data-access/src/lib/`, one sub-path per in-scope Information Domain (NG-007 `REPOSITORY_ARCHITECTURE.md` §2's 14 domains, ID-13 excluded) — e.g. `organizations/`, `projects/`, `units/`, `documents/`, `invitations/`. Each sub-path holds that domain's Repository plus its Read/Write DTOs (`DATA_TRANSFORMATION.md` §19), consistent with "one repository per in-scope Information Domain." No sub-path exists for Properties, Loans, or Expenses — the third physical restatement of the Restricted-Financial exclusion in this series (after NG-003's library refusal and NG-007's repository refusal), now at the folder level within `shared-data-access` itself.

## 10. Authentication Folder Placement

`libs/core/auth/` (`shared-auth`) — holds Authentication Context (`AUTHENTICATION_ARCHITECTURE.md` §9), session lifecycle, and the Supabase Auth wrapper. Nothing role- or Organization-related lives here, by the same separation ADR-012 already mandates — that content lives in `organization-context/` and the User Context portion of `rbac/` instead, never folded into `auth/` for convenience.

## 11. Authorization Folder Placement

`libs/core/rbac/` (`shared-rbac`) — holds Permission Resolution (`AUTHORIZATION_ARCHITECTURE.md` §13), the resolved permission-set Signal, and the guards/directives derived from it. `libs/core/organization-context/` is a separate library, not a subfolder of `rbac/`, because Organization Context gates *whether* RBAC can be evaluated at all (§6 of that document) — a dependency relationship, not a containment one, and folder nesting would misrepresent it as the latter.

## 12. State Folder Placement

State has no folder of its own at the workspace level — per `STATE_OWNERSHIP.md`'s ownership rules, state physically lives inside whichever project owns it: Core-tagged libraries hold Global/Core state (§6/§10/§11 above), each `type:feature` library holds its own Feature state inside its own `src/lib/`, and Component state stays inside the component file that owns it. This document does not introduce a `state/` folder anywhere, because doing so would imply state is a separate architectural layer from the code that produces it — which `STATE_OWNERSHIP.md` already explicitly rejects ("never two" owners, and never a layer separate from its owner).

## 13. Layout Folder Placement

Two layout shapes exist (`ROUTING_STRATEGY.md` §9): Public Website's header/footer layout, and the sidebar+topbar+content-outlet shape shared by Super Admin and Builder Portal. Each lives inside its owning application's Shell, at `apps/<app>/src/app/` alongside `app.ts` — not extracted into `shared-ui` as a reusable layout component, because a layout is a property of *which application* renders it (`ROUTING_STRATEGY.md` §9: "a route never changes layout mid-navigation within an app — layout is a property of the application"), not a cross-application reusable unit the way a button or icon is.

## 14. Asset Organization

See `ASSET_STRUCTURE.md` in full.

## 15. Theme Organization

See `SCSS_STRUCTURE.md` in full.

## 16. Documentation Structure

`docs/` already exists and needs no change — `architecture/` (A-series), `technical/` (NG-series, this document's own home), `adr/` (ADR_INDEX.md), and the two root indexes (`ARCHITECTURE_INDEX.md`). This document's one addition: every `libs/` and `apps/` project carries its own `README.md` (`SOURCE_TREE.md` § Internal library shape), tracing that project back to the Information Domain or Working Module that justifies it (`CODING_STANDARDS.md` §10) — code-level documentation stays physically with the code, business/architecture documentation stays in `docs/`, never duplicated between the two.

## 11. Import Rules

*(See `IMPORT_RULES.md` in full — numbered per this document's own Output Requirements list, distinct from §11 State Folder Placement above; the prompt's own numbering repeats "11" as a section label once at the top level and once inside Output Requirements, so both are honored here without renumbering either.)*

## 12. Naming Standards

*(See `NAMING_STANDARDS.md` in full.)*

## 13. Dependency Rules

Restated, not redesigned: `DEPENDENCY_GUIDE.md` §22's tag matrix remains the sole enforcement mechanism. This document's contribution is `IMPORT_RULES.md` §2's Circular Dependency Prevention detail (the `util-*` leaf rule) and confirming the folder hierarchy itself doesn't introduce any new coupling the tag matrix wouldn't already catch.

## 14. Risks

- **Builder Projects backend dependency is now carried by 15 consecutive documents** (adds NG-008, via the physical `builder-portal-projects/` and `builder-portal-units/` folders this document places for a still-undesigned backend domain — gated, as always, by `infra-feature-flags`'s own folder at `libs/infra/feature-flags/`).
- **The folder structure makes the Restricted-Financial exclusion physically checkable for the first time** — a CI rule can now assert "no `property`, `loan`, or `expense` folder exists under `libs/`" as a literal grep, not just a documented principle. This is a risk-reduction, not a new risk, but is recorded here because it's the first document able to make that specific claim.
- **`libs/infra/` sits outside the `type:util` folder grouping while sharing its tag** (§8) — a deliberate, explained divergence, but worth flagging as the one place a future contributor might reasonably expect folder path and tag to match exactly and find they don't.

## 15. Assumptions

- Nx remains the workspace tool (ADR-010) — this document's entire `apps/`/`libs/` shape is Nx's own convention, not reinvented.
- No application or library will be renamed once created without a corresponding update to this document and `ARCHITECTURE_INDEX.md` — consistent with this whole series' traceability discipline.

## 16. Constraints

- No Angular code, components, services, or implementation is generated by this document (Quality Rules, restated) — every path in `SOURCE_TREE.md` is a planned location, not a created one.
- This document does not decide SCSS preprocessing tooling choices (Sass vs. plain CSS custom properties beyond tokens) or icon library selection (`ASSET_STRUCTURE.md` §2) — those are implementation details correctly deferred past this document's own scope.

## 16. Migration Strategy

*(Second "16" — this prompt's own Output Requirements list places Migration Strategy after Constraints without renumbering; both are honored under their own header rather than force-renumbered, consistent with how §11's duplicate was handled above.)*

**This is a greenfield adoption, not a migration from existing code** — re-verified this session that `apps/`, `libs/`, and `package.json` remain absent (Pre-Check Result). If Angular code is scaffolded before this document receives formal approval, the correct sequence is: scaffold directly into the `apps/`/`libs/` shape `SOURCE_TREE.md` defines (an Nx workspace generator run with this document as its spec), never scaffold into a default/generic Angular CLI layout and reorganize afterward — reorganizing afterward risks the same "lost work" ambiguity A-001's now-resolved directory-disappearance incident already illustrated once in this series.

**Folder-structure evolution rule, for when this tree needs to grow:** a category folder (`feature/`, `core/`, etc.) never grows a new *sub-category* without a corresponding ADR or NG document decision — e.g., if Realtime (NG-007 §14, reserved) is ever activated, its code lives inside the relevant domain's existing `shared-data-access` sub-path, not a new `libs/realtime/` category invented ad hoc. This mirrors NG-003's own precedent (splitting "Handover" into `documents/`+`invitations/` was a *refinement* of an existing boundary, never an unreviewed new one).

## 17. Architecture Decisions

**ADR-001: Angular Standalone Components — Accepted.** Every component, directive, and pipe in this workspace is standalone; no `NgModule` is authored anywhere in application or library code, including the root bootstrap (`bootstrapApplication()`, not `platformBrowserDynamic().bootstrapModule()`). Decided here, specifically, because folder structure is the first document with a genuine physical stake in the answer: an NgModule-based architecture would need `*.module.ts` files and often module-per-feature folders that a standalone architecture does not — `SOURCE_TREE.md` §2's application tree and §3's "no `.module.ts` anywhere" rule are both direct, physical consequences of this decision, not independent choices. This closes an ADR slot open since this series' very first prompt (A-001), redirected six times (NG-001 → NG-002 → "NG-004" → NG-005 → NG-006 → NG-008) as each intervening document correctly found the decision outside its own scope — the redirect chain itself, preserved in `docs/adr/ADR_INDEX.md`, is a demonstration of this series' "defer rather than force" discipline working as intended, not indecision.

## 18. Implementation Readiness Checklist

| Item | Status |
|---|---|
| Workspace root structure defined | ✅ `SOURCE_TREE.md` §1 |
| Application source tree defined | ✅ `SOURCE_TREE.md` §2 |
| Library source tree defined | ✅ `SOURCE_TREE.md` §3 |
| Every NG-001–NG-007 boundary mapped to a physical path | ✅ §5–13 above |
| Import rules defined | ✅ `IMPORT_RULES.md` |
| Naming standards (folder/project level) defined | ✅ `NAMING_STANDARDS.md` |
| SCSS/Theme/Asset/Localization structure defined | ✅ respective companions |
| ADR-001 decided | ✅ §17 |
| Restricted-Financial exclusion physically enforceable | ✅ §14, `SOURCE_TREE.md` §3 |
| Ready for an Nx workspace generator to scaffold against | 🟡 Structurally ready; still gated by A-009's overall split verdict (🔴 for Builder Portal operational core) — this document does not override that gate, only prepares the folders it would use once cleared |

## 19. Updated ARCHITECTURE_INDEX.md

See the actual `ARCHITECTURE_INDEX.md` update accompanying this document (registry row, repository-structure tree, Known Open Items).

## 20. Updated ADR List

See the actual `docs/adr/ADR_INDEX.md` update accompanying this document (ADR-001 moved to Decided).

## 21. Review Checklist

| Item | Status |
|---|---|
| Every folder traced to a justifying prior document | ✅ |
| No folder introduced for Restricted-Financial data | ✅ (verified absent, §9, §14) |
| No Angular code generated | ✅ |
| Tag matrix consistency checked | ✅ (§8's one deliberate, explained divergence) |
| Reserved-only items kept reserved, not designed further | ✅ (`LOCALIZATION_STRUCTURE.md`, `util-formatting`/`util-validation`) |

## 22. Approval Checklist

| Item | Status |
|---|---|
| Formal sign-off | ⬜ Not yet performed by any document in this series (consistent with every prior NG document — A-009's "not formally approved" finding still stands) |
| Ready to govern NG-009 onward | ✅ Structurally, per §18 |
