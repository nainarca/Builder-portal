---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-001 |
| **Document Name** | Product Vision & Scope |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Solution Architect / SaaS Product Architect / Angular Technical Architect / Database Architect / Security Architect / UI/UX Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | None (root document) |
| **Referenced Documents** | `my_property_asset/MASTER_ARCHITECTURE.md`, `my_property_asset/PLATFORM_FOUNDATION_SPECIFICATION.md`, `my_property_asset/docs/ies/*` |
| **Previous Document** | None — this is the first document in the series |
| **Next Document** | A-002 (recommended: *Platform & Product Architecture Overview* — see §19, §24 Future Documents) |
| **Related ADR** | None yet — see `ARCHITECTURE_INDEX.md` §2 for anticipated ADR slots |
| **Review Status** | Pending review |
| **Approval Status** | Pending approval |

---

# A-001 — Product Vision & Scope

## 1. Executive Summary

MyPropertyAsset is expanding from a single mobile product into a multi-surface platform. The existing Flutter Owner Mobile App is a working, real product used by property owners today; this document defines the vision and scope for the next layer of the platform — a web-based enterprise suite consisting of a Public Website, a Super Admin Portal, and a Builder Handover Portal, built on Angular, sharing the same Supabase/PostgreSQL backend the mobile app already uses. This document does not specify how any of these will be built — it establishes *what* the platform is, *who* it serves, and *what stays out of scope*, so every subsequent architecture and engineering document has a single, unambiguous foundation to build from.

## 2. Product Vision

A single account gives one property owner a unified view across every builder and every property they own — mobile for day-to-day management, web for the administrative, handover, and oversight work that a phone screen was never meant to carry.

## 3. Business Vision

Grow MyPropertyAsset from a single-product mobile tool into a multi-surface, multi-organization platform — without re-architecting the parts that already work. The mobile app's data model, backend, and user base are not being replaced; the web platform is additive, built to extend the same account and the same backend to surfaces the mobile app was never meant to serve (administrative oversight, builder-side handover workflows, public-facing marketing/acquisition).

## 4. Business Goals

- Give property owners a web surface for tasks that don't belong on mobile: bulk document review, multi-property administrative oversight, and structured handover from builders.
- Give the business itself (MyPropertyAsset operators) a Super Admin Portal to operate the platform — support, monitoring, subscription oversight — without needing direct database access.
- Give builders a structured, scoped way to hand over property information to owners, replacing ad hoc PDF/email handover with a defined portal workflow.
- Establish a public-facing website as the platform's acquisition and marketing surface, independent of the authenticated product surfaces.
- Do all of the above without touching the already-working mobile app's data model or user experience.

## 5. Problems Being Solved

| Problem today | How the Web Platform addresses it |
|---|---|
| Property handover from builder to owner is informal (PDF sets, WhatsApp, email) | A structured Builder Handover Portal with a defined document/data handover workflow |
| No administrative surface for the business to operate the platform | A Super Admin Portal — subscription oversight, support tooling, platform monitoring |
| No public acquisition surface separate from the authenticated app | A Public Website as a dedicated, unauthenticated marketing/signup surface |
| Owner-side administrative tasks (multi-property document review, multi-builder oversight) are awkward on mobile | A web surface designed for exactly this class of task |

## 6. Target Customers

- Individual property owners and small portfolios already served by the mobile app (the web platform extends their experience, it does not introduce a new customer segment on its own).
- Real estate builders/developers who hand over completed or under-construction units to buyers and want a structured digital handover process instead of paper/PDF.
- (Internally) MyPropertyAsset's own operations team, as the consumer of the Super Admin Portal.

## 7. Target Users

| User | Surface |
|---|---|
| Property owner | Owner Mobile App (existing) + relevant web surfaces (future, not scoped by this document beyond the portals named in §8) |
| Builder representative | Builder Handover Portal |
| Platform operator / support staff | Super Admin Portal |
| Prospective customer / visitor | Public Website |
| Tenant | Owner Mobile App today (tenant-facing flows already exist in-app); a dedicated Tenant Mobile App is future scope (§19), not part of this document's product portfolio |

## 8. Product Portfolio

| Product | Status | Description |
|---|---|---|
| **Owner Mobile App** | Existing, in active use (Flutter) | The current product. Treated in this document as a completed, external product this platform extends — not something the Web Platform initiative modifies. (Its own detailed completion/readiness figures live in `my_property_asset/docs/project_context.md` and are not restated here; "existing" is the operative fact for this document's purposes, not a claim of zero remaining work on that product.) |
| **Public Website** | Planned — this document is its starting point | Unauthenticated, public-facing marketing and acquisition surface |
| **Super Admin Portal** | Planned — this document is its starting point | Internal, authenticated platform-operations surface |
| **Builder Handover Portal** | Planned — this document is its starting point | Authenticated, builder-facing property handover workflow |
| **Tenant Mobile App** | Future — not designed by this document | Named in the product vision as a future addition; no scope, no architecture, no timeline is established here |

## 9. Platform Overview

```
                         ┌────────────────────────────┐
                         │   Supabase / PostgreSQL     │
                         │   (Schema V2, target arch.  │
                         │   — see Referenced Docs)    │
                         └──────────────┬───────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
   ┌──────────▼─────────┐   ┌───────────▼──────────┐   ┌──────────▼─────────┐
   │  Owner Mobile App    │   │   Angular Web         │   │  (Future) Tenant   │
   │  (Flutter, existing) │   │   Platform             │   │  Mobile App        │
   └──────────────────────┘   │  ┌──────────────────┐ │   └─────────────────────┘
                               │  │ Public Website    │ │
                               │  ├──────────────────┤ │
                               │  │ Super Admin Portal│ │
                               │  ├──────────────────┤ │
                               │  │ Builder Handover  │ │
                               │  │ Portal            │ │
                               │  └──────────────────┘ │
                               └────────────────────────┘
```

One backend, multiple client surfaces, each serving a distinct audience. No surface owns its own copy of the data model — all read and write through the same Supabase/PostgreSQL backend the mobile app already uses.

## 10. Product Scope

This document's scope is limited to establishing:
- The product portfolio (§8) and which products this architecture track governs.
- The philosophy and boundaries of the Builder Portal (§12).
- The white-label and multi-organization strategy at a vision level (§13, §14).
- The user roles the platform recognizes (§15).

It does **not** scope individual feature sets, page-level UX, API contracts, or database changes — those belong to later documents in this series (§24).

## 11. Out of Scope

Explicitly not addressed by this document, or by the Web Platform initiative it opens:

- Any change to the Owner Mobile App's existing features, data model, or user experience.
- Any Angular code, folder structure, routing, component, or API generation (forbidden at this stage by design — see the governing prompt's Quality Rules).
- Any SQL or Supabase schema change.
- Builder ERP capability of any kind (§12) — CRM, sales, HR, payroll, accounting, procurement, inventory, or society management are permanently out of scope for the Builder Portal, not just deferred.
- A finalized Tenant Mobile App scope (§8) — named as future, not designed here.

## 12. Builder Portal Philosophy

**The Builder Portal is a Property Handover Portal. It is not, and will never become, a Builder ERP.**

Its entire purpose is to give a builder a structured way to hand a property's information and documents to its owner — nothing more. The following capabilities are permanently excluded from this product's scope, not merely deferred to a later phase:

- CRM (lead/customer relationship management)
- Sales (booking, pricing, sales-pipeline tooling)
- HR (staff/workforce management)
- Payroll
- Accounting (builder's own financial books)
- Procurement
- Inventory
- Society Management (post-handover residents'-association tooling)

Any future request to add one of these capabilities is a scope change requiring a new, explicit architecture decision — it is not something a later document can introduce quietly by extension.

## 13. White-label Strategy

White-label is a supported target capability of this platform (per the project's permanent facts), meaning: an organization (see §14) should eventually be able to present the platform under its own branding. **This document establishes that white-label is in scope for the platform's direction; it does not design how.** Branding and theming design is explicitly deferred — the existing `PLATFORM_FOUNDATION_SPECIFICATION.md` (mobile/backend side) already made the same call for the same reason: standing up the underlying organization model first, branding/theming second, once there is a real organization construct to attach it to.

## 14. Multi-Organization Strategy

The project's permanent facts state the ownership model as:

```
One Owner
   ↓
One Login
   ↓
Multiple Builders
   ↓
Multiple Properties
```

**Terminology note (important for future documents):** the backend's `PLATFORM_FOUNDATION_SPECIFICATION.md` already defines an "Organization" concept — a tenancy container a user belongs to (personal, by default, at signup; team-based in the future). The "Multiple Builders" in the diagram above is a **different relationship**: a builder is a distinct business entity a property can be *associated with* (for handover purposes), not the organization the owner themself belongs to. A future document must decide explicitly whether "Builder" becomes a specialization of "Organization" (a builder is itself an organization, and a property's handover relationship is an org-to-org link) or a wholly separate entity — **this document does not decide that**, but flags it now so the two initiatives don't independently invent conflicting models for the same word.

Multi-organization and organization-based isolation are both supported directions per the project's permanent facts. As with white-label (§13), this document establishes the direction, not the mechanism.

## 15. User Roles

| Role | Surface | Scope |
|---|---|---|
| Owner | Owner Mobile App, relevant web surfaces | Owns properties, manages tenants/expenses/loans, receives builder handovers |
| Builder | Builder Handover Portal | Manages handover of property information/documents to owners; no visibility into owner's financial data |
| Platform Operator / Support | Super Admin Portal | Operates the platform, does not act as an owner or builder |
| Tenant | Owner Mobile App today; future Tenant Mobile App | Lease/payment/maintenance self-service, scoped to their own tenancy |
| Visitor | Public Website | Unauthenticated; marketing/acquisition only |

This is a role *catalog*, not an authorization design — how these roles map to actual permissions is Security Architecture scope (§24 Future Documents), building on (not replacing) the role/permission model already established in `PLATFORM_FOUNDATION_SPECIFICATION.md`.

## 16. High-Level Business Architecture

```
                 ┌───────────────────────────────────────────┐
                 │              Public Website                │
                 │        (acquisition / marketing)            │
                 └───────────────────┬───────────────────────┘
                                     │ signup / conversion
                                     ▼
      ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
      │  Owner Mobile App │   │  Builder Handover │   │  Super Admin Portal   │
      │  (existing)        │   │  Portal            │   │  (internal only)      │
      └─────────┬──────────┘   └─────────┬──────────┘   └──────────┬────────────┘
                │                        │                          │
                └────────────┬───────────┴──────────────┬───────────┘
                             ▼                          ▼
                    ┌─────────────────────────────────────────┐
                    │   Supabase / PostgreSQL (Schema V2)       │
                    │   Shared backend, single source of truth  │
                    └─────────────────────────────────────────┘
```

## 17. Business Benefits

- One backend, one data model — every new surface adds capability without fragmenting the platform's source of truth.
- A defined Builder Portal boundary (§12) prevents scope creep into builder-ERP territory, keeping engineering effort focused on the owner/property relationship the whole platform exists to serve.
- A Super Admin Portal reduces operational dependence on direct database access for support and platform operations.
- A Public Website separates acquisition concerns from the authenticated product, allowing each to be optimized independently.

## 18. Platform Principles

- **One backend, many surfaces.** No product in the portfolio maintains its own copy of the data model.
- **Additive, not disruptive.** Nothing in this initiative modifies the existing Owner Mobile App's data or experience.
- **Scope discipline.** The Builder Portal boundary (§12) is a standing principle, not a one-time decision — every future document must respect it.
- **Architecture before code.** Per this document series' own governing rule: documentation is produced and reviewed before any Angular code is generated.
- **Verify before asserting.** Claims about system state (e.g., "Schema V2 is complete") are checked against the actual designed/implemented state before being treated as fact in downstream documents (see the Referenced Documents' verified status note, and `ARCHITECTURE_INDEX.md` §0).

## 19. Future Roadmap

1. A-002 and subsequent documents: detailed architecture for each product surface (Public Website, Super Admin Portal, Builder Handover Portal), Angular technical architecture, security architecture, database-facing API design.
2. Organization/Builder relationship decision (§14) — needed before the Builder Handover Portal's data model can be designed.
3. Tenant Mobile App — scope not yet defined; a future product-vision extension, not an assumed deliverable of this series.
4. White-label and branding/theming design, once the underlying Organization model (backend) and this platform's multi-org decision (§14) are both settled.
5. Angular implementation, per this series' documents, once architecture is approved (Cursor AI generates code from approved documents, not before).

## 20. Guiding Principles

- Prefer extending the existing backend over introducing a parallel one.
- Prefer deferring a design decision explicitly (as this document does for white-label mechanics, Organization/Builder relationship, and Tenant App scope) over deciding it implicitly by omission.
- Prefer a documented conflict over a silently resolved one — see the verified-status note in §0 of `ARCHITECTURE_INDEX.md` as the standing example of how this series handles disagreements between assumed and actual state.

## 21. Success Criteria

This document succeeds if every future Web Platform architecture document can be written by referencing it, without re-litigating: what products exist (§8), what the Builder Portal is and is not (§12), what roles the platform recognizes (§15), and what is explicitly out of scope (§11).

## 22. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| "Schema V2" is treated as complete by a future document, when it is only partially specified | Downstream documents design against capabilities that don't exist yet | This document and the Architecture Index both carry the verified-status note; every future document should re-check `STAGE4_DATABASE_REVIEW.md` rather than assume |
| Builder Portal scope creep toward ERP capability | Effort diverted from the platform's actual purpose; a much larger, differently-shaped product gets built by accretion | §12's exclusion list is explicit and framed as permanent, not a phase boundary |
| "Organization" (backend) and "Builder" (this document) are conflated by a future document | Two incompatible multi-tenancy models get built | §14 flags this explicitly now, before any design work depends on either interpretation |
| The missing `my-property-asset-web` project directory represents lost work rather than an intentional reset | Wasted effort re-deciding things a deleted project may have already settled | Recorded as an open item in `ARCHITECTURE_INDEX.md` §4; if evidence of the prior directory's contents ever surfaces, reconcile against it before assuming this document is the true starting point |

## 23. Assumptions

- The Owner Mobile App's existing backend (Supabase/PostgreSQL) is the correct, permanent backend for the Web Platform as well — no separate backend is being considered.
- "Schema V2" refers to the same target architecture documented in `my_property_asset/docs/ies/` and `PLATFORM_FOUNDATION_SPECIFICATION.md` — not a separate, web-specific schema.
- Angular is the settled frontend framework choice for this initiative (stated as a permanent fact by the governing prompt; not re-derived or challenged here).
- White-label, multi-builder, and organization-based support are strategic directions the business has committed to, even though none are mechanically designed yet.

## 24. Constraints

- No SQL, API, Angular code, folder structure, or routing may be produced by this document or by A-001-level work generally.
- No existing, approved architecture may be redesigned without an explicit, flagged reason (none was found or needed for this document).
- The Builder Portal's scope boundary (§12) is a hard constraint on all future documents in this series, not a recommendation.
- Every future document in this series must state its Dependencies, Referenced Documents, Previous/Next Document, and Related ADR per this series' own Document Information template (as this document does above).

## 25. Glossary

| Term | Meaning in this document series |
|---|---|
| **Organization** (backend sense) | The tenancy container a user belongs to, per `PLATFORM_FOUNDATION_SPECIFICATION.md` — personal by default, team-capable in the future. Distinct from "Builder" (§14) |
| **Builder** | A business entity that constructs and hands over properties; relationship to "Organization" not yet decided (§14) |
| **Schema V2** | The target backend database architecture, partially specified across `docs/ies/EXPENSE_IES.md`, `LOAN_IES.md`, `FINANCIAL_HISTORY_IES.md`, and `PLATFORM_FOUNDATION_SPECIFICATION.md` — **not** a claim that it is fully implemented |
| **Builder Handover Portal** | The web surface builders use to hand property information/documents to owners — explicitly not an ERP (§12) |
| **Super Admin Portal** | Internal, platform-operator-facing administrative surface |
| **ADR** | Architecture Decision Record — a standing decision document; none exist yet for this initiative (`ARCHITECTURE_INDEX.md` §2) |

## 26. Summary

This document establishes the product vision and scope for the MyPropertyAsset Web Platform: a Public Website, Super Admin Portal, and Builder Handover Portal, built on Angular, sharing the existing Supabase/PostgreSQL backend, additive to (never replacing) the existing Owner Mobile App. It defines the Builder Portal's permanent boundary against ERP scope creep, flags an unresolved terminology conflict between this initiative's "Builder" concept and the backend's existing "Organization" concept for a future document to resolve, and records — rather than silently inherits — a factual discrepancy between this initiative's assumed backend completeness and the backend's actual, verified, partially-specified state. No code, API, or database artifact is produced by this document, by design.

---

## Cross-Reference Table

| This document references | For |
|---|---|
| `my_property_asset/MASTER_ARCHITECTURE.md` | Backend architecture ground truth |
| `my_property_asset/PLATFORM_FOUNDATION_SPECIFICATION.md` | Organization/Members/Roles model this initiative must not conflict with (§14) |
| `my_property_asset/docs/ies/STAGE4_DATABASE_REVIEW.md` | Verified Schema V2 status (§0 of Architecture Index, §22 Risks) |

## Related Documents

None yet exist in this series besides this document. See `ARCHITECTURE_INDEX.md` §1.

## Future Documents

- A-002: Platform & Product Architecture Overview
- Security Architecture (Web Platform) — building on, not replacing, `PLATFORM_FOUNDATION_SPECIFICATION.md`
- Builder Handover Portal — Domain & Data Architecture (resolves the Organization/Builder question from §14)
- Angular Technical Architecture (would formally introduce ADR-001, ADR-004)
- White-label & Theming Architecture (would formally introduce ADR-003)

## Review Checklist

- [ ] Product portfolio (§8) matches actual business intent
- [ ] Builder Portal exclusion list (§12) confirmed as permanent, not phase-based
- [ ] Organization/Builder terminology conflict (§14) acknowledged and assigned to a future document
- [ ] Schema V2 status note (§0 of Architecture Index) accepted as the correct framing
- [ ] Missing `my-property-asset-web` directory (§22 Risks) investigated or explicitly accepted as a non-issue

## Approval Checklist

- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Reviewed by Product stakeholder
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] Next document (A-002) authorized to begin
