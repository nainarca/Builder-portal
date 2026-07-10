---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | NG-004 |
| **Document Name** | Angular Routing & Navigation Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Last Updated** | 2026-07-09 |
| **Dependencies** | NG-000, NG-001, NG-002, NG-003, A-001 through A-009 |
| **Referenced Documents** | All prior A-series and NG-series documents, especially A-004 (Screen Flow), A-005 (Navigation Flow), A-008 (RBAC) |
| **Previous Document** | NG-003 Angular Library & Package Architecture |
| **Next Document** | NG-005 Folder Structure *(swapped with this document — see Pre-Check Result)* |
| **Related ADR** | ADR-011 (Organization Context Routing) — decided by this document, see §18 |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`ROUTING_STRATEGY.md`](ROUTING_STRATEGY.md), [`NAVIGATION_ARCHITECTURE.md`](NAVIGATION_ARCHITECTURE.md), [`URL_PHILOSOPHY.md`](URL_PHILOSOPHY.md), [`LAZY_LOADING_STRATEGY.md`](LAZY_LOADING_STRATEGY.md), [`diagrams/NG-004_Routing_Diagrams.md`](diagrams/NG-004_Routing_Diagrams.md).

---

# NG-004 — Angular Routing & Navigation Architecture

## Pre-Check Result

NG-000 (precedence), NG-001, NG-002, and NG-003 were read in full. `MASTER_CONTEXT.md`/`PROJECT_FACTS.md` remain absent. **One sequencing discrepancy found and resolved:** NG-002 and NG-003 both explicitly announced NG-004 = Folder Structure and NG-005 = Routing Strategy. This prompt is NG-004, titled Routing & Navigation Architecture — the two slots have swapped. This document's own "governing reference for" list confirms Folder Structure now sits at NG-005 with everything else (NG-006 State Management through NG-010 Performance) unchanged, so this is a clean two-document swap, not a broader renumbering. **Concrete consequence:** NG-003 redirected ADR-001 (Standalone Components) to "NG-004 Folder Structure" — that target no longer exists at this slot. ADR-001 is redirected a fourth time, to **NG-005**, its corrected new home (§ Updated ADR List).

No content conflict was found. This document translates A-004 (Screen Flow) and A-005 (Navigation Flow) into route-tree shape without redesigning either — every route table below cites the screen or navigation flow it represents rather than re-deriving business rationale.

---

## 1. Executive Summary

NG-004 defines the platform's routing architecture: three independent route trees (one per ADR-009 application), lazy-loaded per feature library (NG-003's finer-grained catalog), Organization-scoped without URL-carried tenant identifiers for Builder Portal but URL-identified for Super Admin (a new decision, ADR-011), and governed throughout by the same principle NG-000 established at the very start of this technical series: a route is UX, never the security boundary. No route configuration, guard implementation, or Angular code appears anywhere in this document.

## 2. Routing Principles

See [`ROUTING_STRATEGY.md`](ROUTING_STRATEGY.md) §1 — most notably, cross-application navigation is a hard browser navigation, never a Router call, a direct and previously unstated consequence of ADR-009's three-separate-applications decision.

## 3. Application Entry Points

See `ROUTING_STRATEGY.md` §2.

## 4. Routing Hierarchy

See `NAVIGATION_ARCHITECTURE.md` §3, §5, §6 — full per-application route tables, each row citing its A-004 screen or NG-003 library. Full tree diagram: `diagrams/NG-004_Routing_Diagrams.md` §2.

## 5. Navigation Architecture

See [`NAVIGATION_ARCHITECTURE.md`](NAVIGATION_ARCHITECTURE.md) in full. This document does not redesign A-005's navigation flows — it expresses them as URL structure, one section per A-005 concern (Breadcrumb Strategy, Navigation Hierarchy) explicitly pointing back rather than re-deriving.

## 6. Layout Routing

See `ROUTING_STRATEGY.md` §9 — two layout shapes, one per navigation pattern already established (A-005's Global Navigation = sidebar for authenticated apps; header/footer for Public Website).

## 7. Public Routes

See `NAVIGATION_ARCHITECTURE.md` §3 — nine Public Website routes, all unauthenticated, all safely deep-linkable (`URL_PHILOSOPHY.md` §22).

## 8. Protected Routes

See `NAVIGATION_ARCHITECTURE.md` §5–6 — every Super Admin and Builder Portal route requires authentication at minimum; role-specific access is `PERMISSION_MATRIX.md`-derived, never independently decided at the routing layer (§10 below).

## 9. Lazy Loading Strategy

See [`LAZY_LOADING_STRATEGY.md`](LAZY_LOADING_STRATEGY.md) in full — the complete loading-tier map, including how `infra-feature-flags` interacts with lazy boundaries for the still-toggled Builder-Projects-dependent features.

## 10. Role Based Navigation

Every route's role requirement traces directly to `PERMISSION_MATRIX.md` (A-008) and `SCREEN_PERMISSIONS.md` — this document introduces no independent authorization logic. Navigation Guards (item 14 in this prompt's Define list) are a *concept* here, not an implementation: a route "requires Super Admin" means exactly the role/permission level `SCREEN_PERMISSIONS.md` already assigned that route's screen, nothing more, nothing independently decided.

## 11. Deep Linking Strategy

See `URL_PHILOSOPHY.md` §22 — four deep-link scenarios, each with defined behavior, including the explicit statement that a Builder Portal deep link referencing another Organization's data fails at the RLS layer, not the routing layer, because routing cannot and must not be trusted to make that determination.

## 12. URL Philosophy

See `URL_PHILOSOPHY.md` §19 — URLs address screens, not permissions; the routing layer's job is navigation, never authorization.

## 13. Breadcrumb Strategy

See `NAVIGATION_ARCHITECTURE.md` §20 — unchanged from A-005 §11, now expressed as: exactly one route zone (`/projects/:id/units/:id/**`) is deep enough to warrant one.

## 14. Future Expansion

Reserved, unbacked route paths (`/preferences`, `/help` — `NAVIGATION_ARCHITECTURE.md` §7), the Future Tenant application's entire route tree (§8), and custom-domain white-labeling (`URL_PHILOSOPHY.md` §17) are all named as future expansion, none designed further than their reservation.

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Builder Portal's Projects/Units routes are 11 consecutive documents deep into the undesigned Builder Projects backend dependency | Route structure is defined but cannot be validated against a real data shape | Same feature-toggle mitigation (`infra-feature-flags`) as every prior document; routes exist and lazy-load a placeholder until the backend resolves |
| ADR-001 has now been redirected four times (NG-001 → NG-002 → NG-004 → NG-005) | Could read as the decision being avoided rather than correctly sequenced | Each redirection has had a specific, stated reason (the receiving document's scope excluded it); NG-005 (Folder Structure) is the first document whose actual subject matter forces the choice — this should be the last redirect |
| Session-based Organization Context routing (ADR-011) assumes Builder Portal users never belong to multiple Organizations | If multi-Organization Builder membership is ever introduced, Builder Portal routing needs a breaking change (adding a URL-carried Organization identifier retroactively) | Accepted risk, stated explicitly in the ADR itself — matches A-003A/A-008's own existing assumption that today's Owner/Builder Organization membership is single, not multiple |
| "Shared Platform Routes" introduces two genuinely new, unbacked concepts (Preferences, Help) | A future document could mistake reservation for design | Flagged explicitly in `NAVIGATION_ARCHITECTURE.md` §7, consistent with this series' standing practice |

## 16. Assumptions

- A-004's 33-screen inventory and A-005's navigation flows remain the accurate business-level source for this document's route tables — not re-verified against any change since NG-003, since none was reported.
- Builder Portal sessions are genuinely single-Organization for the foreseeable term, per `PLATFORM_FOUNDATION_SPECIFICATION.md`'s and A-008's existing model — the basis for ADR-011.

## 17. Constraints

No route configuration, Angular routing code, components, folder structure, services, APIs, SQL, CSS, or state management appears anywhere in this document or its companions (explicit Quality Rule). Every route table is a URL-and-screen mapping, not a `Routes` array.

## 18. Architecture Decisions

| Decision | Status | Reasoning |
|---|---|---|
| **Organization Context Routing: session-scoped for Builder Portal, URL-identified for Super Admin** | **ADR-011 — Accepted** | Builder Portal sessions are single-Organization by construction (no switching UI exists); a URL-carried Organization ID would be redundant and a needless trust surface. Super Admin genuinely operates across Organizations, so its URLs identify *which one is being viewed*. See `URL_PHILOSOPHY.md` §16 |
| Cross-application navigation is hard browser navigation, not Router-mediated | Elaboration of ADR-009, not a new ADR — a direct, unavoidable consequence, not a choice with an alternative | `ROUTING_STRATEGY.md` §1 |
| No slug/subdomain-based multi-tenant URL scheme | Rejected explicitly, not merely undesigned | `URL_PHILOSOPHY.md` §17 |

## 19. Implementation Readiness Checklist

- [ ] Every route table (`NAVIGATION_ARCHITECTURE.md` §3, §5, §6) traced to an existing A-004 screen or explicitly marked as a reserved/unbacked path — verified, no route invented without a citation
- [ ] ADR-011's session-vs-URL Organization scoping asymmetry understood by whoever implements NG-005/NG-007 (Folder Structure, Authentication)
- [ ] Lazy-loading tiers (`LAZY_LOADING_STRATEGY.md`) understood as a mapping onto NG-003's library catalog, not a new library structure
- [ ] The Builder Projects backend dependency's routing-level manifestation (Projects/Units routes exist, content toggled) is not mistaken for "ready to implement fully"

## 20. Updated ARCHITECTURE_INDEX.md

See `../../ARCHITECTURE_INDEX.md` — updated with the NG-004 entry and the NG-004/NG-005 slot swap correction.

## 21. Updated ADR List

**Required and completed.** ADR-011 (Organization Context Routing) is Accepted, decided by this document. ADR-001 (Standalone Components) is redirected a fourth time, from the now-incorrect "NG-004 Folder Structure" to the corrected **NG-005 Folder Structure** — same target document, corrected slot number, not a new redirection in substance.

## 22. Review Checklist

- [ ] NG-004/NG-005 slot swap (Routing ↔ Folder Structure) confirmed as intentional
- [ ] ADR-011 (session-scoped Builder Portal, URL-identified Super Admin) accepted, or redirected toward a uniform URL-based scheme
- [ ] Route tables cross-checked against `SCREEN_INVENTORY.md`/`MENU_STRUCTURE.md` for completeness
- [ ] "Shared Platform Routes" (Preferences, Help) confirmed as reserved-only, not mistakenly treated as scoped features

## 23. Approval Checklist

- [ ] Reviewed by Enterprise/Technical Architect
- [ ] Reviewed by Angular Architect
- [ ] Reviewed by Security Architect (ADR-011 specifically)
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] NG-005 (Folder Structure) authorized to begin
