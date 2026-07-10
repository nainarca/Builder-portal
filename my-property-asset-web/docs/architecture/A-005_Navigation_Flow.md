---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-005 |
| **Document Name** | Navigation Flow |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise UX Architect / Enterprise Solution Architect / Information Architect / SaaS Product Architect / Navigation Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001, A-002, A-003, A-003A, A-004 |
| **Referenced Documents** | `A-001-product-vision-scope.md`, `A-002-business-flow.md`, `A-003_User_Journey.md`, `A-003A_User_Stories.md`, `A-004_Screen_Flow.md`, `SCREEN_INVENTORY.md` |
| **Previous Document** | A-004 Screen Flow |
| **Next Document** | A-006 Functional Modules |
| **Related ADR** | None yet — see `docs/adr/ADR_INDEX.md` |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`NAVIGATION_HIERARCHY.md`](NAVIGATION_HIERARCHY.md) (structural tree), [`MENU_STRUCTURE.md`](MENU_STRUCTURE.md) (flat menu-item listing), [`diagrams/A-005_Navigation_Diagrams.md`](diagrams/A-005_Navigation_Diagrams.md) (all diagrams).

---

# A-005 — Navigation Flow

## Pre-Check Result

A-001 through A-004 were read in full and are treated as source of truth; nothing in any of them is modified or contradicted below. No ADR documents exist. Screen ownership from A-004 is preserved — every navigation flow below references A-004 Screen IDs, no new screen is silently introduced. **Two navigation items named in this prompt's own scope have no backing screen in A-004's 33-screen inventory**: "Owners" (a cross-Organization owner directory, distinct from the unit-scoped BA-07 Owner Assignment) and "Profile" (a personal account-settings screen, distinct from BA-13's Organization-level Settings). Both are flagged in §16 rather than silently mapped onto an existing screen that doesn't actually cover them — the same discipline A-004 applied to SA-08/SA-10/BA-13.

---

## 1. Executive Summary

This document defines how users move through the MyPropertyAsset Web Platform — not what screens exist (A-004) or what they must do (A-003A), but the paths between them: menus, hierarchy, breadcrumbs, context-sensitive links, quick actions, and the rules governing what's reachable from where. It surfaces two navigation-scope items with no backing screen, consistent with A-004's own practice of flagging rather than papering over gaps. No routing, URL, or component content appears anywhere in this document.

## 2. Navigation Principles

These terms are used consistently throughout this document and its companions:

| Term | Definition |
|---|---|
| **Global Navigation** | The persistent, always-available navigation surface within a product (e.g., Super Admin's sidebar reaching every top-level section) |
| **Local Navigation** | Navigation within a specific module/section (e.g., Projects → Project Detail → Units) |
| **Context Navigation** | Navigation that depends on the specific entity currently being viewed (e.g., from a Unit Detail, links to that unit's own Owner Assignment and Documents) |
| **Action Navigation** | Movement triggered by completing an action rather than clicking a menu item (e.g., approving a builder opens White-label Configuration next) |
| **Dashboard Shortcuts** | Direct, often pre-filtered links from a Dashboard to a specific destination (e.g., "3 pending registrations" → Builder Management, filtered) |
| **Primary Navigation** | The most prominent, top-level navigation within a product (its Global Navigation, in practice) |
| **Secondary Navigation** | Sub-navigation within a primary section (e.g., tabs within Builder Detail: Overview / White-label / Subscription) |
| **Breadcrumb Strategy** | How a user sees their current location in the hierarchy and moves back up it (§11) |
| **Search Strategy** | How a user finds a specific entity without full menu navigation (§12) |
| **Empty State Navigation** | Where a user is directed when a list/section has no data yet (§9, per-flow) |
| **Permission Based Navigation** | Navigation items shown/hidden based on the user's specific permissions (§15) |
| **Role Based Navigation** | The entire navigation set differs by product/role — a Super Admin never sees Builder Portal navigation and vice versa (§8) |
| **Future Scalability** | How this model accommodates future products (Tenant App) or menu growth without redesign (§19) |

## 3. Navigation Hierarchy

See [`NAVIGATION_HIERARCHY.md`](NAVIGATION_HIERARCHY.md) for the full structural tree per product. Summary: three independent hierarchies (Public Website, Super Admin Portal, Builder Handover Portal), joined only at the Login Gateway (PW-09) and at the Owner-App handoff point (post-handover). No hierarchy nests inside another.

## 4. Public Website Navigation

**Product-level defaults:** **Security Requirements:** none — unauthenticated throughout. **Deep Linking Considerations default:** every Public Website screen is safely deep-linkable with no precondition (no session state required to render correctly).

#### NAV-PW-01 — Main Navigation
| Field | Value |
|---|---|
| Product / Module | Public Website / Marketing |
| Actor | Public Visitor |
| Entry Point | Any external referrer or direct navigation |
| Exit Point | Login Gateway (→ authenticated portals) or unconverted exit |
| Parent Navigation | None — top of hierarchy |
| Child Navigation | NAV-PW-04 (Marketing Journey), NAV-PW-03 (Authentication Navigation) |
| Navigation Goal | Let a visitor reach any core informational screen in at most one click from anywhere on the site |
| Available Actions | Navigate to Home, Features, Pricing, About, Login |
| Navigation Rules | Always visible; identical on every Public Website screen (true Global Navigation) |
| Breadcrumb | Not used — the site is shallow enough that Main Navigation itself is sufficient orientation |
| Context Navigation | None — this flow is context-independent by design |
| Quick Actions | None beyond the menu itself |
| Dashboard Links | N/A — no dashboard on this product |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | PW-01, PW-02, PW-03, PW-04, PW-09 |
| Related User Stories | US-PW-01 |
| Related Business Flows | A-002 §6 |
| Future Considerations | An explicit owner/builder fork within Main Navigation itself (A-003 §12 opportunity) |

#### NAV-PW-02 — Footer Navigation
| Field | Value |
|---|---|
| Product / Module | Public Website / Marketing |
| Actor | Public Visitor |
| Entry Point | Any Public Website screen (footer is persistent) |
| Exit Point | FAQ, Contact, or Builder Registration |
| Parent Navigation | None — parallel to Main Navigation, not nested under it |
| Child Navigation | None |
| Navigation Goal | Surface secondary/support content that doesn't belong in Main Navigation's primary path |
| Available Actions | Navigate to FAQ, Contact, Builder Registration |
| Navigation Rules | Always visible, lower visual priority than Main Navigation (a content/priority distinction, not a technical one — out of this document's scope to specify further) |
| Breadcrumb | Not used |
| Context Navigation | None |
| Quick Actions | None |
| Dashboard Links | N/A |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | PW-05, PW-06, PW-08 |
| Related User Stories | US-PW-01, US-SA-01 (Builder Registration entry) |
| Related Business Flows | A-002 §6 |
| Future Considerations | None named |

#### NAV-PW-03 — Authentication Navigation
| Field | Value |
|---|---|
| Product / Module | Public Website / Authentication |
| Actor | Returning Builder Administrator or Super Admin |
| Entry Point | Main Navigation's Login item |
| Exit Point | SA-02 (Super Admin Dashboard) or BA-02 (Builder Dashboard) |
| Parent Navigation | NAV-PW-01 |
| Child Navigation | None — this is a terminal handoff, not a browsable section |
| Navigation Goal | Route an authenticating user to the correct portal without a separate login screen per portal |
| Available Actions | Authenticate |
| Navigation Rules | Never routes to the Owner Mobile App — owners do not authenticate on this web platform (A-001 §8) |
| Breadcrumb | Not used |
| Context Navigation | None |
| Quick Actions | None |
| Dashboard Links | N/A |
| Deep Linking Considerations | A direct link to the Login Gateway is always safe; a direct link attempting to bypass it into SA-02/BA-02 without authenticating must fail closed |
| Security Requirements | Role determines destination; an authenticated Super Admin can never land on BA-02 and vice versa |
| Related Screens | PW-09, SA-01, SA-02, BA-01, BA-02 |
| Related User Stories | US-SA-*, US-BA-01 |
| Related Business Flows | A-002 §7, §8 |
| Future Considerations | None named |

#### NAV-PW-04 — Marketing Journey
| Field | Value |
|---|---|
| Product / Module | Public Website / Conversion |
| Actor | Public Visitor |
| Entry Point | Home |
| Exit Point | Demo Request submitted, Contact Sales submitted, Builder Registration submitted, or sign-up (off-platform) |
| Parent Navigation | NAV-PW-01 |
| Child Navigation | None |
| Navigation Goal | Move a visitor from discovery to a conversion action along the shortest reasonable path |
| Available Actions | Progress Home → Features → Pricing → (Demo Request \| Contact Sales \| Builder Registration) |
| Navigation Rules | No forced linear order — a visitor may enter this journey at any point via a deep link (§Deep Linking Considerations) |
| Breadcrumb | Not used |
| Context Navigation | Builder-track content surfaces Builder Registration more prominently than owner-track content does (a content-weighting note, not a technical rule) |
| Quick Actions | "Request Demo" and "Register as Builder" calls-to-action available from Features/Pricing directly, not only from a dedicated page |
| Dashboard Links | N/A |
| Deep Linking Considerations | Default — a visitor may land directly on Pricing or Features from an ad/referral and never traverse Home |
| Security Requirements | Default |
| Related Screens | PW-01, PW-02, PW-03, PW-06, PW-07, PW-08 |
| Related User Stories | US-PW-01, US-PW-02, US-PW-03, US-PW-04, US-SA-01 |
| Related Business Flows | A-002 §6 |
| Future Considerations | Early owner/builder fork (A-003 §12), same as NAV-PW-01 |

#### NAV-PW-05 — Support Journey
| Field | Value |
|---|---|
| Product / Module | Public Website / Support |
| Actor | Public Visitor |
| Entry Point | Any Public Website screen, via Footer Navigation |
| Exit Point | Question answered (FAQ) or escalated (Contact Sales) |
| Parent Navigation | NAV-PW-02 |
| Child Navigation | None |
| Navigation Goal | Resolve a visitor's question with the least friction — self-serve first, contact as fallback |
| Available Actions | Browse FAQ; escalate to Contact if unanswered |
| Navigation Rules | FAQ always offers an explicit escalation path to Contact — never a dead end |
| Breadcrumb | Not used |
| Context Navigation | None |
| Quick Actions | None |
| Dashboard Links | N/A |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | PW-05, PW-06 |
| Related User Stories | US-PW-01, US-PW-04 |
| Related Business Flows | A-002 §6 |
| Future Considerations | None named |

## 5. Super Admin Navigation

**Product-level defaults:** **Security Requirements:** Super Admin role required for every screen in this section; unauthenticated or non-Super-Admin access is rejected. **Deep Linking Considerations default:** a direct link to any Super Admin screen must re-authenticate if the session isn't already valid, then resolve to that exact screen (not force a restart at the Dashboard).

#### NAV-SA-01 — Dashboard Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Overview |
| Actor | Super Admin |
| Entry Point | SA-01 Login |
| Exit Point | Any other Super Admin screen |
| Parent Navigation | None — root of the Super Admin hierarchy |
| Child Navigation | NAV-SA-02 through NAV-SA-08 |
| Navigation Goal | Let the Super Admin identify what needs attention and reach it in one click |
| Available Actions | Navigate to any Global Navigation item; act on a Dashboard Shortcut |
| Navigation Rules | Always the landing screen post-login (NAV-PW-03) |
| Breadcrumb | Not used at this level — Dashboard is the root |
| Context Navigation | None — Dashboard is context-independent |
| Quick Actions | "N pending registrations" → SA-03 filtered to pending |
| Dashboard Links | This *is* the dashboard — its links are enumerated in `MENU_STRUCTURE.md` |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-02 |
| Related User Stories | US-SA-06 (partial), general orientation |
| Related Business Flows | A-002 §7 |
| Future Considerations | None named |

#### NAV-SA-02 — Administration Menu
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Administration |
| Actor | Super Admin |
| Entry Point | NAV-SA-01 (Global Navigation, always visible) |
| Exit Point | Any Super Admin screen |
| Parent Navigation | NAV-SA-01 |
| Child Navigation | NAV-SA-03 through NAV-SA-08 |
| Navigation Goal | Provide the one persistent menu structure reaching every Super Admin capability |
| Available Actions | Navigate to Builders, Organizations, Users, Monitoring, Audit, Settings |
| Navigation Rules | This is the Global Navigation for the whole product — identical on every Super Admin screen |
| Breadcrumb | Section name shown (e.g., "Builders") once inside a section |
| Context Navigation | None at this level |
| Quick Actions | None beyond Dashboard Shortcuts (NAV-SA-01) |
| Dashboard Links | N/A — this menu *is* reached from the dashboard |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-02 through SA-11 |
| Related User Stories | All US-SA-* |
| Related Business Flows | A-002 §7 |
| Future Considerations | None named |

#### NAV-SA-03 — Builder Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Builder Onboarding |
| Actor | Super Admin |
| Entry Point | NAV-SA-02 Administration Menu |
| Exit Point | Builder approved/rejected, or configuration completed |
| Parent Navigation | NAV-SA-02 |
| Child Navigation | White-label (SA-06), Subscription (SA-07) — Secondary Navigation within Builder Detail |
| Navigation Goal | Take a builder from registration through full onboarding without leaving this section |
| Available Actions | List/search builders; open a specific builder; approve/reject; configure white-label; activate subscription |
| Navigation Rules | White-label and Subscription tabs are only reachable once a builder is approved (Permission/state-based navigation) |
| Breadcrumb | Builders → [Builder Name] → (Overview \| White-label \| Subscription) |
| Context Navigation | Once inside a specific builder's detail, all secondary navigation is scoped to that one builder |
| Quick Actions | Approve / Reject buttons directly from the list view's row-level context, not requiring a full detail-screen visit first *(a UX recommendation, not a commitment — actual interaction design belongs to a later document)* |
| Dashboard Links | Dashboard Shortcut "N pending registrations" (NAV-SA-01) lands here, pre-filtered |
| Deep Linking Considerations | A direct link to a specific builder's detail must resolve to that builder, not a generic list |
| Security Requirements | Default |
| Related Screens | SA-03, SA-04, SA-06, SA-07 |
| Related User Stories | US-SA-01, US-SA-02, US-SA-03, US-SA-04 |
| Related Business Flows | A-002 §7, §15, §16 |
| Future Considerations | Self-service white-label by builders themselves would remove SA-06 from this flow entirely (US-SA-03 Future Considerations) |

#### NAV-SA-04 — Organization Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Tenancy |
| Actor | Super Admin |
| Entry Point | NAV-SA-02 |
| Exit Point | Back to NAV-SA-02, or into a specific Organization's detail |
| Parent Navigation | NAV-SA-02 |
| Child Navigation | None further decomposed in this document |
| Navigation Goal | Confirm every builder and owner is represented by exactly one correctly-typed Organization |
| Available Actions | List/search/filter Organizations by type; drill into detail |
| Navigation Rules | Must present Builder-type and Owner-type Organizations as the same underlying entity, differently populated — never as two unrelated lists (A-002 §16) |
| Breadcrumb | Organizations → [Organization Name] |
| Context Navigation | None beyond the drill-down itself |
| Quick Actions | None |
| Dashboard Links | None |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-05 |
| Related User Stories | US-SA-05 |
| Related Business Flows | A-002 §16, A-003A §16 |
| Future Considerations | The `organization_type` discriminator decision (still open across five documents now) shapes this flow's eventual filtering/labeling |

#### NAV-SA-05 — Subscription Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Commercial |
| Actor | Super Admin |
| Entry Point | NAV-SA-03 (from within Builder Detail) |
| Exit Point | Back to NAV-SA-03 |
| Parent Navigation | NAV-SA-03 |
| Child Navigation | None |
| Navigation Goal | Give an approved builder commercial standing without leaving the Builder Onboarding context |
| Available Actions | Activate, change/upgrade a subscription plan |
| Navigation Rules | Not reachable independently of a specific Organization — always entered in-context, never as a standalone top-level destination |
| Breadcrumb | Builders → [Builder Name] → Subscription |
| Context Navigation | Fully scoped to the one Organization it was entered from |
| Quick Actions | None |
| Dashboard Links | None |
| Deep Linking Considerations | A direct link must resolve to the correct Organization's subscription state, not a generic form |
| Security Requirements | Default |
| Related Screens | SA-07 |
| Related User Stories | US-SA-04 |
| Related Business Flows | A-002 §7 |
| Future Considerations | Self-service subscription management (US-SA-04 Future Considerations) would make this reachable by the builder, not only Super Admin — out of this document's scope |

#### NAV-SA-06 — Monitoring Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Operations |
| Actor | Super Admin |
| Entry Point | NAV-SA-02 |
| Exit Point | Contextual drill-down (e.g., to Builder Navigation for a flagged item) |
| Parent Navigation | NAV-SA-02 |
| Child Navigation | None |
| Navigation Goal | Business-level platform health visibility, reachable in one click from anywhere in the portal |
| Available Actions | View indicators; drill into a flagged area |
| Navigation Rules | Read-only navigation — no data-entry action originates from this flow |
| Breadcrumb | Not used — single-screen destination |
| Context Navigation | Drill-downs are contextual to whatever indicator was clicked |
| Quick Actions | None beyond drill-down links |
| Dashboard Links | None (this section largely duplicates the Dashboard's own summary at greater depth — an intentional overlap, not a duplicate navigation *path*, since the Dashboard's version is a subset shortcut and this is the full view) |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-09 |
| Related User Stories | US-SA-06 |
| Related Business Flows | A-002 §7 |
| Future Considerations | Technical/APM-level monitoring is out of scope (US-SA-06 Future Considerations) |

#### NAV-SA-07 — Audit Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Operations |
| Actor | Super Admin |
| Entry Point | NAV-SA-02 |
| Exit Point | Back to NAV-SA-02 |
| Parent Navigation | NAV-SA-02 |
| Child Navigation | None |
| Navigation Goal | Not fully specifiable — see §16 |
| Available Actions | Search/filter the audit log |
| Navigation Rules | Read-only |
| Breadcrumb | Not used — single-screen destination |
| Context Navigation | None specified — gap |
| Quick Actions | Unknown — gap |
| Dashboard Links | None |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-10 |
| Related User Stories | **None** (A-004 §14) |
| Related Business Flows | A-003A §6 |
| Future Considerations | Recommend a proper A-003A story before this flow is designed further |

#### NAV-SA-08 — Settings Navigation
| Field | Value |
|---|---|
| Product / Module | Super Admin Portal / Administration |
| Actor | Super Admin |
| Entry Point | NAV-SA-02 |
| Exit Point | Back to NAV-SA-02 |
| Parent Navigation | NAV-SA-02 |
| Child Navigation | None |
| Navigation Goal | Standard account/platform-level settings, distinct from any single Organization's settings |
| Available Actions | Update settings |
| Navigation Rules | Not scoped to any single Organization — this is the Super Admin's own account context |
| Breadcrumb | Not used — single-screen destination |
| Context Navigation | None |
| Quick Actions | None |
| Dashboard Links | None |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | SA-11 |
| Related User Stories | None named directly |
| Related Business Flows | A-002 §7 |
| Future Considerations | None named |

*User Management (SA-08) is deliberately folded into NAV-SA-02's Administration Menu as a child item rather than given its own top-level navigation flow, since this prompt's own Super Admin Navigation scope list didn't name "Users" as a peer of Builder/Organization/Subscription/Monitoring/Audit/Settings — see `MENU_STRUCTURE.md` for its menu placement.*

## 6. Builder Navigation

**Product-level defaults:** **Security Requirements:** Builder Administrator (or authorized team member) role required, strictly scoped to the user's own Organization; cross-Organization access must be structurally impossible (A-003A §6). **Deep Linking Considerations default:** a direct link to any Organization-scoped screen must verify the requesting user belongs to that exact Organization before rendering — failing closed, not falling back to a generic view.

#### NAV-BA-01 — Dashboard
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Overview |
| Actor | Builder Administrator |
| Entry Point | BA-01 Login |
| Exit Point | Any other Builder Portal screen |
| Parent Navigation | None — root of the Builder Portal hierarchy |
| Child Navigation | NAV-BA-02 through NAV-BA-09 |
| Navigation Goal | Let the builder see overall handover progress and reach anything in one click |
| Available Actions | Navigate to any Global Navigation item; act on a Dashboard Shortcut |
| Navigation Rules | Always the landing screen post-login |
| Breadcrumb | Not used at this level — Dashboard is the root |
| Context Navigation | None |
| Quick Actions | "N units awaiting response" → Invitations filtered; "N documents pending" → Documents filtered |
| Dashboard Links | This *is* the dashboard |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | BA-02 |
| Related User Stories | General orientation for all US-BA-* |
| Related Business Flows | A-002 §8 |
| Future Considerations | None named |

#### NAV-BA-02 — Projects
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Project & Unit Preparation |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 (Global Navigation) |
| Exit Point | Into a specific project (→ NAV-BA-03 Units) |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | NAV-BA-03 |
| Navigation Goal | Organize handover work by construction/development effort |
| Available Actions | List/search projects; create a new project; open a project |
| Navigation Rules | Every project belongs to exactly one Organization — never shown across Organizations |
| Breadcrumb | Projects → [Project Name] |
| Context Navigation | Once inside a project, Units navigation is scoped to that project |
| Quick Actions | "Create Project" available directly from the list |
| Dashboard Links | None beyond NAV-BA-01's general orientation |
| Deep Linking Considerations | A direct link to a specific project must verify Organization ownership (product default) |
| Security Requirements | Default |
| Related Screens | BA-03, BA-04 |
| Related User Stories | US-BA-02 |
| Related Business Flows | A-002 §8 |
| Future Considerations | Depends on the still-undesigned backend Builder Projects domain (§16, carried from A-002/A-003/A-003A/A-004) |

#### NAV-BA-03 — Units
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Project & Unit Preparation |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-02 (from within a specific Project) |
| Exit Point | Into a specific unit (→ Unit Detail, then Owner Assignment / Document Upload) |
| Parent Navigation | NAV-BA-02 |
| Child Navigation | None further decomposed (Owner Assignment and Document Upload are Context Navigation from Unit Detail, not children of this list) |
| Navigation Goal | Individually addressable properties, ready to progress through the handover lifecycle |
| Available Actions | List/search units within the project; create a new unit; open a unit |
| Navigation Rules | Every unit belongs to exactly one project |
| Breadcrumb | Projects → [Project Name] → Units → [Unit Name] |
| Context Navigation | Unit Detail (BA-06) is the hub for all further unit-specific navigation |
| Quick Actions | "Create Unit" available directly from the list; bulk creation (A-003A US-BA-03 alternate) |
| Dashboard Links | None |
| Deep Linking Considerations | A direct link to a specific unit must verify both project and Organization ownership |
| Security Requirements | Default |
| Related Screens | BA-05, BA-06 |
| Related User Stories | US-BA-03 |
| Related Business Flows | A-002 §8, §12 |
| Future Considerations | Same Builder Projects backend dependency as NAV-BA-02 |

#### NAV-BA-04 — Owners *(navigation gap — no backing screen)*
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Handover (implied) |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 (named as a Global Navigation item by this prompt's own scope) |
| Exit Point | Unknown — no backing screen exists |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | Unknown |
| Navigation Goal | Presumed: a cross-Organization directory of prospective/assigned owners, distinct from BA-07's per-unit assignment action |
| Available Actions | Unknown — gap |
| Navigation Rules | Unknown — gap |
| Breadcrumb | Unknown |
| Context Navigation | Unknown |
| Quick Actions | Unknown |
| Dashboard Links | Unknown |
| Deep Linking Considerations | Unknown |
| Security Requirements | Presumed same product default (Organization-scoped) |
| Related Screens | **None in A-004.** BA-07 (Owner Assignment) is unit-scoped, entered only from BA-06 — it is not a cross-Organization owner list and should not be silently treated as satisfying this navigation item |
| Related User Stories | **None** |
| Related Business Flows | None directly — implied only by this prompt's own Builder Portal navigation scope list |
| Future Considerations | Recommend a dedicated "Owners Directory" screen (e.g., BA-14) be added to A-004 in a future revision, backed by a proper A-003A story, before this navigation item is built |

#### NAV-BA-05 — Documents
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Handover |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 (Documents Library) or Unit Detail (per-unit upload) |
| Exit Point | Back to the source unit, or to Unit Detail from the library |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | None |
| Navigation Goal | Find any uploaded document (cross-project) or upload one against a specific unit |
| Available Actions | Search/filter the library; upload against a unit; open the owning unit |
| Navigation Rules | Documents remain invisible to any owner until the owning unit's handover is accepted (A-002 §13) — this rule constrains the *data* shown, not the navigation path itself, but is restated here since it directly limits what "search" can ever surface to anyone but the builder |
| Breadcrumb | Documents → [Document] → [Owning Unit], or Units → [Unit] → Documents |
| Context Navigation | Document Upload (BA-08) is entered from Unit Detail; the Documents Library (BA-10) is entered from Global Navigation — two entry paths to related but distinct screens, not a duplicate path to the same one |
| Quick Actions | "Upload Document" from within a specific Unit Detail |
| Dashboard Links | "N documents pending" shortcut (NAV-BA-01) |
| Deep Linking Considerations | A direct link to the library must still respect Organization scoping; a direct link to a specific document must resolve to its owning unit's context |
| Security Requirements | Default |
| Related Screens | BA-08, BA-10 |
| Related User Stories | US-BA-05 |
| Related Business Flows | A-002 §8, §13 |
| Future Considerations | Document-level completeness indicators (A-003 §12 opportunity) |

#### NAV-BA-06 — Invitations
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Handover |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 (Global Navigation) or Unit Detail (contextual status) |
| Exit Point | Back to the relevant unit for reassignment, or resend action |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | None |
| Navigation Goal | Answer "wait, follow up, or reassign" for every outstanding invitation without checking units one by one (A-003 §11) |
| Available Actions | View status across all units; resend an about-to-expire invitation; navigate to a specific unit for reassignment |
| Navigation Rules | A unit has at most one active invitation at a time — reflected here as a single status per unit row, never a list of concurrent invitations for the same unit (A-002 §16) |
| Breadcrumb | Invitations → [Unit Name] |
| Context Navigation | Also reachable inline from Unit Detail as a status display, not only from Global Navigation |
| Quick Actions | Resend directly from the list row |
| Dashboard Links | "N units awaiting response" shortcut (NAV-BA-01) |
| Deep Linking Considerations | A direct link to a specific invitation's status must resolve to that unit's current state, not a stale cached view |
| Security Requirements | Default |
| Related Screens | BA-09, BA-06 |
| Related User Stories | US-BA-06, US-BA-07 |
| Related Business Flows | A-002 §8, §11, §15 |
| Future Considerations | None named |

#### NAV-BA-07 — Reports
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Reporting |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 |
| Exit Point | Back to NAV-BA-01, or filtered into a specific project |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | None |
| Navigation Goal | Answer "how is my handover program going" without unit-by-unit reconciliation (US-BA-09) |
| Available Actions | View aggregate figures; filter by project |
| Navigation Rules | Scoped entirely to the Builder's own Organization |
| Breadcrumb | Not used — single-screen destination with in-page filtering |
| Context Navigation | Filter state is the only context this flow carries |
| Quick Actions | None |
| Dashboard Links | None |
| Deep Linking Considerations | A direct link with a project filter pre-applied must resolve correctly |
| Security Requirements | Default |
| Related Screens | BA-11 |
| Related User Stories | US-BA-09 |
| Related Business Flows | A-002 §8 |
| Future Considerations | Report design detail is future scope (US-BA-09) |

#### NAV-BA-08 — Notifications
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Communication |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 |
| Exit Point | Contextual — the unit or item the notification concerns |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | None |
| Navigation Goal | Surface invitation and handover-milestone events in one place |
| Available Actions | View/dismiss; navigate to the relevant unit |
| Navigation Rules | Trigger set is exactly A-002 §14's Builder-facing rows — no navigation item here should imply a notification type that isn't actually generated |
| Breadcrumb | Not used |
| Context Navigation | Each notification links to its relevant unit (BA-06) |
| Quick Actions | None beyond dismiss |
| Dashboard Links | Unread count, presumed, though not specified as a distinct requirement here |
| Deep Linking Considerations | A direct link to a specific notification must resolve to its relevant unit context |
| Security Requirements | Default |
| Related Screens | BA-12, BA-06 |
| Related User Stories | US-BA-07, US-BA-08 |
| Related Business Flows | A-002 §14 |
| Future Considerations | None named |

#### NAV-BA-09 — Settings
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Administration |
| Actor | Builder Administrator |
| Entry Point | NAV-BA-01 |
| Exit Point | Back to NAV-BA-01 |
| Parent Navigation | NAV-BA-01 |
| Child Navigation | None |
| Navigation Goal | Not fully specifiable — see §16 |
| Available Actions | Update Organization profile; manage team members (scope undefined) |
| Navigation Rules | Team-member-level permission granularity is undefined (A-003 §3) |
| Breadcrumb | Not used — single-screen destination |
| Context Navigation | None specified — gap |
| Quick Actions | Unknown — gap |
| Dashboard Links | None |
| Deep Linking Considerations | Default |
| Security Requirements | Default |
| Related Screens | BA-13 |
| Related User Stories | **None** (A-004 §14) |
| Related Business Flows | A-002 §8 |
| Future Considerations | Recommend a proper A-003A story before this flow is designed further |

#### NAV-BA-10 — Profile *(navigation gap — no backing screen)*
| Field | Value |
|---|---|
| Product / Module | Builder Handover Portal / Account (implied) |
| Actor | Builder Administrator |
| Entry Point | Presumed: an account menu, distinct from Global Navigation |
| Exit Point | Unknown |
| Parent Navigation | None specified |
| Child Navigation | Unknown |
| Navigation Goal | Presumed: the individual Builder Administrator's own personal account settings (name, password, notification preferences) — distinct from BA-13's Organization-level profile/team settings |
| Available Actions | Unknown — gap |
| Navigation Rules | Unknown — gap |
| Breadcrumb | Unknown |
| Context Navigation | Unknown |
| Quick Actions | Unknown |
| Dashboard Links | Unknown |
| Deep Linking Considerations | Unknown |
| Security Requirements | Presumed: scoped to the individual user, not the Organization |
| Related Screens | **None in A-004.** BA-13 (Settings) is explicitly described as "Organization profile and team member management" — it does not cover an individual's own account, and should not be silently treated as satisfying this navigation item |
| Related User Stories | **None** |
| Related Business Flows | None directly — implied only by this prompt's own Builder Portal navigation scope list |
| Future Considerations | Recommend a dedicated personal-Profile screen be added to A-004 in a future revision, backed by a proper A-003A story |

## 7. Owner App Integration Points

Per instruction, the existing Owner Mobile App's navigation is **not redesigned**. The only navigational fact this document adds: an invitation link (from NAV-BA-06) is a new deep-link entry point into the existing app's account-activation flow, alongside its existing self-serve entry. Everything past that point (property review, document access, existing feature navigation) is unchanged, existing mobile navigation, out of this series' scope to specify.

## 8. Global Navigation

Each product has exactly one Global Navigation surface, and they never merge: Public Website's Main Navigation (NAV-PW-01), Super Admin's Administration Menu (NAV-SA-02), Builder Portal's sidebar (root of NAV-BA-02 through NAV-BA-09). This is Role Based Navigation in its strictest form — a user's role determines which one (if any) they ever see; no user is ever shown two products' Global Navigation at once.

## 9. Local Navigation

Local Navigation exists wherever a Global Navigation item leads into a multi-screen sub-hierarchy: Builder Navigation's Projects → Units → Unit Detail (NAV-BA-02/03), and Super Admin's Builder Detail's Overview/White-label/Subscription tabs (NAV-SA-03). Empty State Navigation within these: a Projects list with zero projects presents "Create Project" as the only meaningful action (no other Local Navigation is reachable until at least one project exists) — the same pattern applies to Units within an empty project.

## 10. Context Navigation

The clearest example is Unit Detail (BA-06, NAV-BA-03's terminus): every link available from it (Owner Assignment, Document Upload, inline invitation status) is scoped to that one unit. Leaving Unit Detail for a different unit resets this context entirely — no cross-unit state carries over.

## 11. Breadcrumb Strategy

Breadcrumbs are used only where genuine depth exists (three or more levels): Builder Portal's Projects → Project → Units → Unit path, and Super Admin's Builders → Builder → (tab) path. Shallow products/sections (Public Website; Super Admin's Monitoring, Audit, Settings; Builder Portal's Reports, Notifications) rely on Global Navigation alone for orientation — a breadcrumb would add no information a persistent menu doesn't already provide.

## 12. Search Navigation

Named as a required principle but not committed to specific mechanics by this document (that's implementation detail, out of scope). What is established: search is a Local Navigation aid within a list screen (Builder Management, Organization Management, Projects, Units, Documents Library), never a cross-product search — a Super Admin cannot search into Builder Portal data, and vice versa (Role Based Navigation, §8, holds even for search).

## 13. Dashboard Navigation

Both authenticated products (Super Admin, Builder Portal) root their hierarchy at a Dashboard (SA-02, BA-02) that is always the post-login landing screen and always reachable via Global Navigation. Public Website has no dashboard — it's an unauthenticated, non-personalized surface by design (A-001 §8).

## 14. Quick Actions

| Product | Quick Action | Target |
|---|---|---|
| Super Admin | "N pending registrations" | NAV-SA-03, filtered |
| Super Admin | Approve/Reject from list row | NAV-SA-03 (in-context, no forced detail-screen visit) |
| Builder Portal | "Create Project" | NAV-BA-02, from the list itself |
| Builder Portal | "Create Unit" / bulk creation | NAV-BA-03, from the list itself |
| Builder Portal | "N units awaiting response" | NAV-BA-06, filtered |
| Builder Portal | "N documents pending" | NAV-BA-05, filtered |
| Builder Portal | Resend invitation from list row | NAV-BA-06 (in-context) |

## 15. Permission Based Navigation

| Rule | Applies to |
|---|---|
| White-label and Subscription tabs only appear once a builder is approved | NAV-SA-03 |
| Owner Assignment only reachable once a unit is "Ready for Handover" | NAV-BA-04 (via BA-06 context) |
| Document Upload/Invitation actions blocked once a unit is "Handed Over" (read-only from that point) | NAV-BA-03, NAV-BA-06 |
| No screen or navigation item in either portal is ever reachable across Organizations | Both NAV-SA-* and NAV-BA-* (product-level default) |

## 16. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Two navigation items ("Owners," "Profile") named in this prompt's own scope have no backing A-004 screen | Their navigation flows are necessarily incomplete (NAV-BA-04, NAV-BA-10) | Flagged explicitly rather than mapped onto an existing screen that doesn't actually cover them; recommend A-004 be revised with new screens (e.g., BA-14 Owners Directory, a personal Profile screen) backed by new A-003A stories |
| NAV-SA-07 (Audit) and NAV-BA-09 (Settings) inherit A-004's own story-less-screen gaps (SA-10, BA-13) | Their navigation rules/quick actions are underspecified | Restated here rather than silently resolved |
| Builder Projects backend dependency now touches navigation too (NAV-BA-02, NAV-BA-03) | Fifth consecutive document (A-002 → A-003 → A-003A → A-004 → A-005) carrying this forward | Restated again; this should be a hard prerequisite for A-006, not deferred a sixth time |

## 17. Assumptions

- Every navigation flow not flagged in §16 has sufficient backing (a specific A-004 screen and A-003A story) to be considered complete at this document's level of detail.
- A single Login Gateway correctly serves as the sole authentication entry point for both authenticated portals (carried from A-004 §15).
- Empty State Navigation (§9) requires no dedicated screen beyond the relevant list screen itself, displaying a call-to-action in place of a data — a content-state assumption, not a new screen.

## 18. Constraints

- No Angular routing, URLs, components, UI design, folder structure, APIs, SQL, database, or CSS content appears anywhere in this document (explicit Quality Rule).
- The Builder Portal exclusion list (CRM/Sales/HR/Accounting/Inventory/Procurement/Payroll/Society Management) constrains every Builder Portal navigation flow in §6 exactly as it constrained every prior document in this series.
- No navigation flow was introduced without tracing to either an A-004 screen or an explicit gap declaration (§16) — no flow is silently invented.

## 19. Future Navigation

- A dedicated Owners Directory screen and navigation flow (NAV-BA-04).
- A dedicated personal Profile screen and navigation flow (NAV-BA-10).
- Self-service White-label navigation reachable by builders themselves, removing SA-06 from the Super Admin-only flow (NAV-SA-03 Future Considerations).
- Tenant Mobile App navigation, once that product is formally scoped (A-003 §9, A-003A §3.5) — this document's Role Based Navigation principle (§8) already accommodates a fourth, fully independent navigation set without requiring any redesign of the three defined here, which is the specific sense in which this model satisfies "Future Scalability" (§2).

## 20. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-005 entry. No prior document was overwritten.

## 21. Updated ADR List

**Not required.** This document introduces no new technical/architectural decision. See `docs/adr/ADR_INDEX.md` — unchanged.

## 22. Review Checklist

- [ ] All 23 navigation flows reviewed for completeness against A-002/A-003/A-003A/A-004
- [ ] Two story-less/screen-less navigation items (NAV-BA-04 Owners, NAV-BA-10 Profile) acknowledged as genuine gaps requiring new A-004 screens + A-003A stories, not accepted as already covered
- [ ] Builder Projects backend dependency (NAV-BA-02, NAV-BA-03) acknowledged as blocking for A-006, five documents deep now
- [ ] Role Based Navigation (§8) confirmed as strictly non-overlapping across all three products

## 23. Approval Checklist

- [ ] Reviewed by Enterprise/Solution Architect
- [ ] Reviewed by UX Architect / Information Architect
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-006 (Functional Modules) authorized to begin
