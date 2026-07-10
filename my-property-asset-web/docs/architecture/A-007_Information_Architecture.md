---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | A-007 |
| **Document Name** | Information Architecture |
| **Project** | MyPropertyAsset Web Platform |
| **Version** | 1.0 |
| **Status** | Draft |
| **Prepared By** | Enterprise Architecture Team (Enterprise Information Architect / Enterprise Solution Architect / SaaS Product Architect / UX Architect / Business Architect) |
| **Target AI** | Claude AI (Opus / Sonnet) |
| **Created Date** | 2026-07-09 |
| **Updated Date** | 2026-07-09 |
| **Dependencies** | A-001, A-002, A-003, A-003A, A-004, A-005, ~~A-006~~ *(does not exist — see Pre-Check Result)* |
| **Referenced Documents** | `A-001-product-vision-scope.md`, `A-002-business-flow.md`, `A-003_User_Journey.md`, `A-003A_User_Stories.md`, `A-004_Screen_Flow.md`, `SCREEN_INVENTORY.md`, `A-005_Navigation_Flow.md`, `NAVIGATION_HIERARCHY.md`, `MENU_STRUCTURE.md` |
| **Previous Document** | A-005 Navigation Flow *(not A-006, which was never written — see Pre-Check Result)* |
| **Next Document** | A-008 Permission Matrix (RBAC) |
| **Related ADR** | None yet — see `docs/adr/ADR_INDEX.md` |
| **Revision History** | v1.0 — 2026-07-09 — Initial draft |
| **Approval Status** | Pending approval |

**Companion documents:** [`INFORMATION_DOMAINS.md`](INFORMATION_DOMAINS.md) (flat catalog), [`CONTENT_HIERARCHY.md`](CONTENT_HIERARCHY.md) (content trees), [`SEARCH_ARCHITECTURE.md`](SEARCH_ARCHITECTURE.md), [`METADATA_STANDARDS.md`](METADATA_STANDARDS.md), [`diagrams/A-007_Information_Architecture_Diagrams.md`](diagrams/A-007_Information_Architecture_Diagrams.md).

---

# A-007 — Information Architecture

## Pre-Check Result

A-001 through A-005 were read in full and are treated as source of truth; nothing in any of them is modified or contradicted below. **A-006 (Functional Module Architecture) does not exist** — confirmed absent via file search, twice now. This was flagged to the user as a blocking gap; the user's follow-up resent this A-007 prompt unchanged rather than supplying A-006, which this document treats as an instruction to proceed using a fallback: **§2.1 below constructs a lightweight, explicitly-labeled working module reference**, derived from A-002's business processes, A-004's screen modules, and A-005's navigation modules, so that "module consistency" (a pre-check requirement) has *something* concrete to check against. This is not a substitute for a real A-006 and is not presented as one — every information domain below that depends on it is traceable back to A-002/A-004/A-005 directly, not to a fabricated A-006. No ADR documents exist. No duplicate information domain was created (verified against `INFORMATION_DOMAINS.md`).

---

## 1. Executive Summary

This document organizes how information is structured across the MyPropertyAsset Web Platform: 15 information domains spanning all four products, their content hierarchy, ownership, visibility, search boundaries, and metadata standards. It builds on A-004 (screens) and A-005 (navigation) by answering a different question than either: not "what's on screen" or "how do I get there," but "what is this data, who owns it, and who is allowed to see it." No technical, API, or database content appears anywhere in this document. One structural note carried through every section: this document was written without its expected predecessor, A-006 (Functional Module Architecture), which does not exist — see §2.1.

## 2. Information Architecture Principles

- **Information domains are not modules and not screens.** A module (A-006's intended subject) is a functional grouping of capability; a screen (A-004) is a UI surface; an information domain (this document) is a category of *data* with its own ownership, lifecycle, and visibility rules, which may be touched by many screens across many modules (e.g., ID-09 Handover Document Information is touched by BA-08, BA-10, and OA-REF-03).
- **Organization scope is the platform's primary information boundary**, not product or role — a Builder-type Organization's data is invisible to every other Builder-type Organization, and an Owner-type Organization's data is invisible to every other Owner-type Organization, regardless of which screen or product is asking (carried directly from A-004 §12 and A-005 §8's Role Based Navigation).
- **Classification is a fixed, small vocabulary** (Public / Internal / Organization-Confidential / Restricted-Financial — `METADATA_STANDARDS.md`), applied consistently rather than invented per domain.
- **Reference, don't duplicate**, extended from A-003A's EPIC-06 discipline to the whole document: Owner Financial & Property Information (ID-13) is described only enough to confirm this document doesn't invent a competing structure for it — the real specification lives in the backend's Expense/Loan/Financial History IES documents.

### 2.1 Working Module Reference (fallback for the missing A-006 — not a substitute for it)

| Working Module | Product | Derived From |
|---|---|---|
| Marketing & Conversion | Public Website | A-002 §6, A-004 §5 |
| Builder Onboarding | Super Admin | A-002 §7, A-004 §6 |
| Tenancy & Branding | Super Admin | A-002 §16, A-004 §6 |
| Commercial | Super Admin | A-002 §7, A-004 §6 |
| Operations | Super Admin | A-002 §7, A-004 §6 |
| Project & Unit Preparation | Builder Portal | A-002 §8, A-004 §7 |
| Handover | Builder Portal | A-002 §8/§10/§11, A-004 §7 |
| Reporting | Builder Portal / Super Admin | A-002 §8, A-004 §7 |
| Communication | Builder Portal (+ cross-product) | A-002 §14, A-004 §7 |
| Owner Property Management (reference) | Owner Mobile App | A-002 §9, A-004 §8 |

This table exists solely so §3's domains can state "Related Modules" against *something* verifiable. A real A-006 may define modules differently; if/when it's written, this table (and every "Related Modules" reference to it below) should be reconciled against it, not assumed correct.

## 3. Information Domain Catalog

See [`INFORMATION_DOMAINS.md`](INFORMATION_DOMAINS.md) for the flat index. Full specification for each of the 15 domains follows.

#### ID-01 — Public Marketing & Lead Information
| Field | Value |
|---|---|
| Purpose | Support visitor evaluation and capture conversion-intent data |
| Business Owner | Marketing/Commercial function (external to the platform's own product organization) |
| Primary Users | Public Visitor (creates), MyPropertyAsset commercial team (consumes, off-platform) |
| Related Modules | Marketing & Conversion |
| Information Categories | Marketing content (static); Lead records (Demo Requests, Sales Inquiries, Builder Registrations) |
| Content Hierarchy | See `CONTENT_HIERARCHY.md` §ID-01 |
| Relationships | A Builder Registration, once approved, produces exactly one Organization (ID-03) — the only cross-domain edge this domain has |
| Metadata | Universal (`METADATA_STANDARDS.md`) — no Organization scope until conversion occurs |
| Searchability | None end-user-facing; see `SEARCH_ARCHITECTURE.md` |
| Visibility | Marketing content: Public. Lead records: Internal (MyPropertyAsset commercial process only) |
| Organization Scope | None — pre-Organization by definition |
| Lifecycle | Draft/Pending (content authored) → Active (published); Lead records: Active (submitted) → Archived (converted or expired) |
| Security Classification | Public (content); Internal (lead records) |
| Retention Considerations | Unconverted leads — data-subject-request-deletable, per `METADATA_STANDARDS.md` |
| Future Expansion | Personalized content by visitor track (A-003 §12) |

#### ID-02 — Builder Onboarding & Approval Information
| Field | Value |
|---|---|
| Purpose | Track a builder's path from registration to approved, active platform participant |
| Business Owner | Super Admin |
| Primary Users | Super Admin (decides), Prospective Builder (submits, receives outcome) |
| Related Modules | Builder Onboarding |
| Information Categories | Registration record; Approval decision |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-02 |
| Relationships | Produces exactly one Organization (ID-03) on approval; sourced from ID-01 (self-submission) or created directly by Super Admin |
| Metadata | Universal + approval status, decided-by, reason |
| Searchability | Super Admin, platform-wide |
| Visibility | Internal — never visible to any Builder or Owner beyond their own registration's outcome notification |
| Organization Scope | None until approval (pre-Organization); the approval event is what creates scope |
| Lifecycle | Pending → Active (approved) or Archived (rejected) |
| Security Classification | Internal |
| Retention Considerations | Rejected registrations retained for reapplication reference (no specific period set here) |
| Future Expansion | None named |

#### ID-03 — Organization & Tenancy Information
| Field | Value |
|---|---|
| Purpose | The platform's core tenancy record — one shared construct for both Builder and Owner populations (A-002 §16) |
| Business Owner | Super Admin (creation/approval); each Organization's own members (day-to-day) |
| Primary Users | Super Admin, Builder Administrator, Property Owner |
| Related Modules | Tenancy & Branding |
| Information Categories | Organization identity; Membership |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-03 |
| Relationships | Root of scope for ID-04, ID-05, ID-07 (Builder-type); root of scope for ID-13 (Owner-type, reference only) |
| Metadata | Universal + type (Builder/Owner) |
| Searchability | Super Admin, platform-wide (`SEARCH_ARCHITECTURE.md`) |
| Visibility | Organization-Confidential to its own members; Internal (existence/type only) to Super Admin |
| Organization Scope | Is the scope boundary itself — not scoped to something else |
| Lifecycle | Active (from creation); Archived (if an Organization is ever deactivated — mechanism not designed here) |
| Security Classification | Organization-Confidential |
| Retention Considerations | Open question, not resolved: does Organization deletion cascade to ID-07/ID-09 data? (`METADATA_STANDARDS.md`) |
| Future Expansion | The `organization_type` discriminator mechanism decision (open across six documents now — A-002/A-003/A-003A/A-004/A-005/A-007) |

#### ID-04 — White-label & Branding Information
| Field | Value |
|---|---|
| Purpose | A Builder-type Organization's presentation configuration |
| Business Owner | Super Admin (configures); the Builder Organization (subject of it) |
| Primary Users | Super Admin |
| Related Modules | Tenancy & Branding |
| Information Categories | Branding configuration (vision-level, no mechanism defined — A-001 §13) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-04 |
| Relationships | Belongs to exactly one Organization (ID-03), Builder-type only |
| Metadata | Universal |
| Searchability | Not searchable — looked up by Organization (`SEARCH_ARCHITECTURE.md`) |
| Visibility | Organization-Confidential |
| Organization Scope | Single Organization |
| Lifecycle | Draft/Pending (unconfigured) → Active (configured) |
| Security Classification | Organization-Confidential |
| Retention Considerations | None specified — no mechanism exists yet to retain |
| Future Expansion | Self-service configuration by builders themselves; extension to owner-facing surfaces (A-001 §13) |

#### ID-05 — Subscription & Commercial Information
| Field | Value |
|---|---|
| Purpose | An Organization's commercial standing on the platform |
| Business Owner | Super Admin |
| Primary Users | Super Admin |
| Related Modules | Commercial |
| Information Categories | Plan; Status |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-05 |
| Relationships | Belongs to exactly one Organization (ID-03) |
| Metadata | Universal |
| Searchability | Super Admin, platform-wide |
| Visibility | Internal (Super Admin); the owning Organization presumably sees its own state (not explicitly designed as a Builder-facing screen in A-004) |
| Organization Scope | Single Organization |
| Lifecycle | Active (from activation) → potentially inactive (mechanism not designed) |
| Security Classification | Internal |
| Retention Considerations | Billing-history retention is a future, unaddressed concern — connects to the backend's own known open item (per-organization billing reconciliation, `PLATFORM_FOUNDATION_SPECIFICATION.md`) |
| Future Expansion | Self-service subscription management (A-004 §6 SA-07) |

#### ID-06 — Platform Operations Information
| Field | Value |
|---|---|
| Purpose | Business-level platform health visibility (Monitoring) and a record of Super Admin actions (Audit) |
| Business Owner | Super Admin |
| Primary Users | Super Admin |
| Related Modules | Operations |
| Information Categories | Monitoring indicators; Audit records *(Audit sub-domain has no backing A-003A story — A-004 §14, A-005 §16)* |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-06 |
| Relationships | Monitoring aggregates ID-02/ID-03/ID-12; Audit references whatever entity a Super Admin action touched (structure undefined) |
| Metadata | Universal; Audit requires actor/action/target/timestamp at minimum, undefined further |
| Searchability | Super Admin; Audit's search fields are a gap (`SEARCH_ARCHITECTURE.md`) |
| Visibility | Internal |
| Organization Scope | Platform-wide (not Organization-scoped — this is Super Admin's own domain) |
| Lifecycle | Monitoring: always-current (not a persisted lifecycle in the usual sense); Audit: Active → Archived/Historical (append-only, presumed immutable per `METADATA_STANDARDS.md`, though not confirmed by any story) |
| Security Classification | Internal |
| Retention Considerations | Audit records are presumed immutable/long-retained (consistent with the backend's own audit-log convention) but this is an assumption, not a confirmed requirement — no story defines it |
| Future Expansion | Technical/APM-level monitoring (A-004 §6 SA-09, explicitly out of scope); a proper Audit story (A-004 §14, A-005 §16) |

#### ID-07 — Project & Unit Information
| Field | Value |
|---|---|
| Purpose | The construction/development structure a Builder hands units over from |
| Business Owner | Builder Administrator (their own Organization's data) |
| Primary Users | Builder Administrator |
| Related Modules | Project & Unit Preparation |
| Information Categories | Project; Unit; Lifecycle state |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-07 |
| Relationships | Belongs to exactly one Organization (ID-03, Builder-type); parents ID-08, ID-09, ID-10 |
| Metadata | Universal + lifecycle state (A-002 §12) |
| Searchability | Builder Administrator, own Organization only |
| Visibility | Organization-Confidential |
| Organization Scope | Single Organization |
| Lifecycle | Draft → Under Construction → Ready for Handover → Assigned → Invited → Accepted/Needs Reassignment → Handed Over (A-002 §12's full state set, mapped onto the generic three-stage vocabulary as: Draft/Pending through "Ready for Handover"; Active from "Assigned" through "Invited"; Archived/Historical at "Handed Over" for the Builder's view, while remaining Active for the Owner's — same asymmetry noted in `METADATA_STANDARDS.md`) |
| Security Classification | Organization-Confidential |
| Retention Considerations | Persists for the life of the owning Organization (open question on Organization deletion, ID-03) |
| Future Expansion | **This entire domain depends on the still-undesigned backend Builder Projects domain** — sixth consecutive document (A-002 → A-003 → A-003A → A-004 → A-005 → A-007, compounded by A-006 itself never having been written to resolve it) to carry this dependency forward without resolution. See §16. |

#### ID-08 — Owner Assignment & Prospect Information
| Field | Value |
|---|---|
| Purpose | Link a prospective owner to a unit ahead of formal invitation |
| Business Owner | Builder Administrator |
| Primary Users | Builder Administrator |
| Related Modules | Project & Unit Preparation |
| Information Categories | Assignment record; Prospect contact detail |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-08 |
| Relationships | Belongs to exactly one Unit (ID-07); precedes ID-10 |
| Metadata | Universal + assignment status |
| Searchability | Builder Administrator, own Organization only |
| Visibility | Organization-Confidential |
| Organization Scope | Single Organization |
| Lifecycle | Active (assigned) → Archived (superseded by reassignment or completed handover) |
| Security Classification | Organization-Confidential |
| Retention Considerations | None specified |
| Future Expansion | **This is the domain-level counterpart of A-005's flagged "Owners" navigation gap (NAV-BA-04)** — a cross-Organization owner directory was named in navigation scope but has no backing screen or, now confirmed, no distinct information domain beyond this unit-scoped assignment record. Explicitly **not** a CRM/sales-pipeline domain — no content beyond a name and a contact channel is in scope, per the Builder Portal's permanent exclusions |

#### ID-09 — Handover Document Information
| Field | Value |
|---|---|
| Purpose | The actual documents transferred from Builder to Owner at handover |
| Business Owner | Builder Organization (pre-handover) → Owner Organization (post-handover) |
| Primary Users | Builder Administrator (uploads), Property Owner (receives) |
| Related Modules | Project & Unit Preparation, Handover, Owner Property Management (reference) |
| Information Categories | Document (typed: sale deed, building plan, possession certificate, etc. — not enumerated exhaustively here) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-09 |
| Relationships | Belongs to exactly one Unit (ID-07); ownership transfers, on invitation acceptance (ID-10), into the Owner's existing Property Documents domain (ID-13, reference only) |
| Metadata | Universal + ownership state (Builder-owned-pending / Owner-owned-transferred) |
| Searchability | Builder (own Organization, pre- and post-handover as historical reference); Owner (own property, post-handover, via existing search) |
| Visibility | Organization-Confidential, strictly one-sided until transfer (the assigned owner cannot see it before accepting) |
| Organization Scope | Builder's Organization pre-transfer; Owner's Organization post-transfer — the scope itself changes at the moment of transfer, which is the whole point of this domain existing separately from ID-07 |
| Lifecycle | Draft/Pending (uploaded, unseen by owner) → Active (transferred, owner-visible) → whatever the existing Property Documents domain's own lifecycle already defines from that point (not redesigned here) |
| Security Classification | Organization-Confidential |
| Retention Considerations | Transfer is permanent and one-directional — no mechanism to revoke a transferred document (consistent with A-002 §16's "when builders lose access") |
| Future Expansion | Document-level completeness indicators (A-003 §12, A-004 §7 BA-08) |

#### ID-10 — Invitation Information
| Field | Value |
|---|---|
| Purpose | The time-bounded mechanism connecting a Builder's assignment to an Owner's acceptance decision |
| Business Owner | Builder Administrator (creates); Property Owner (acts on) |
| Primary Users | Builder Administrator, Property Owner |
| Related Modules | Handover |
| Information Categories | Invitation record (token, expiry, status) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-10 |
| Relationships | Belongs to exactly one Unit (ID-07); on acceptance, triggers transfer of ID-09 and creation of an Owner-side Property record (ID-13, reference only) |
| Metadata | Universal + token expiry, status |
| Searchability | Builder Administrator, own Organization only |
| Visibility | Organization-Confidential (Builder side); the specific Owner sees only their own invitation, never another unit's |
| Organization Scope | Builder's Organization (the invitation itself is the Builder's record; the Owner's acceptance is what creates the Owner-side data) |
| Lifecycle | Active (pending) → Archived (accepted, declined, or expired) — never re-activated; a "resend" (A-004 §7 BA-09) creates function-level continuity but a fresh record per the "at most one active invitation per unit" rule (A-002 §16) |
| Security Classification | Organization-Confidential |
| Retention Considerations | Retained as a historical record even after expiry/decline, for the Builder's own audit trail — not deleted |
| Future Expansion | None named |

#### ID-11 — Notification Information
| Field | Value |
|---|---|
| Purpose | Cross-product event delivery |
| Business Owner | Each product, for its own triggers |
| Primary Users | Super Admin, Builder Administrator, Property Owner |
| Related Modules | Communication |
| Information Categories | Notification record (trigger, recipient, channel) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-11 |
| Relationships | Generated by events in ID-02 (registration), ID-10 (invitation/expiry), ID-09/ID-10 (handover complete), plus existing owner-app triggers (ID-13, unchanged) |
| Metadata | Universal + read/unread, channel |
| Searchability | Each recipient, own notifications only |
| Visibility | Organization-Confidential (scoped to the recipient's own Organization/account) |
| Organization Scope | The recipient's own |
| Lifecycle | Active (delivered, unread) → Archived (read/dismissed) |
| Security Classification | Organization-Confidential |
| Retention Considerations | None specified |
| Future Expansion | None named beyond the delivery-channel mechanism itself, which is explicitly not designed here |

#### ID-12 — Reporting & Analytics Information
| Field | Value |
|---|---|
| Purpose | Aggregate views over ID-07/ID-09/ID-10, at Builder or platform scope |
| Business Owner | Builder Administrator (own Organization); Super Admin (platform-wide) |
| Primary Users | Builder Administrator, Super Admin |
| Related Modules | Reporting |
| Information Categories | Aggregate counts/figures (no new atomic content — see Relationships) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-12 |
| Relationships | Always derived from ID-07/ID-09/ID-10 (Builder-scoped) or ID-02/ID-03/ID-06 (Super-Admin-scoped) — never a separately stored copy |
| Metadata | Universal only — this domain has no atomic records of its own to add metadata to beyond what it derives |
| Searchability | Filterable (by project, by date) rather than searched in the ID-07-style sense |
| Visibility | Organization-Confidential (Builder); Internal (Super Admin) |
| Organization Scope | Single Organization (Builder view) or platform-wide (Super Admin view) |
| Lifecycle | Always-current — reports reflect live underlying data, not a snapshot (unless a future materialized/scheduled report is introduced, not designed here) |
| Security Classification | Organization-Confidential / Internal, matching its source domains |
| Retention Considerations | N/A — derived, not stored |
| Future Expansion | Report design detail (A-004 §7 BA-11, explicitly future scope) |

#### ID-13 — Owner Financial & Property Information (reference only)
| Field | Value |
|---|---|
| Purpose | The Owner's existing property/financial data — Property, Loan, Expense, Tenant, Financial History |
| Business Owner | Property Owner (their own Organization/account) |
| Primary Users | Property Owner |
| Related Modules | Owner Property Management (reference) |
| Information Categories | Not enumerated here — already fully specified in the backend's own IES documents |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-13 — shown only to confirm no competing structure is introduced |
| Relationships | Receives Property + Document (ID-09) content at handover acceptance (ID-10); otherwise entirely independent of every other domain in this catalog |
| Metadata | Not redefined here — existing backend metadata stands (this domain does not need the Universal set imposed on it, since it predates this document) |
| Searchability | Existing, unmodified (Property Owner, own properties only) |
| Visibility | **Restricted-Financial** — the only domain in this catalog at this classification level, matching the backend's own "managers never see financial data" rule exactly |
| Organization Scope | The Owner's own personal (or, in the future, team) Organization |
| Lifecycle | Existing, unmodified |
| Security Classification | Restricted-Financial |
| Retention Considerations | Existing, unmodified — governed by the backend's own immutable-ledger conventions (Financial History IES) |
| Future Expansion | None proposed by this document — any change belongs to a backend IES revision, not this series |

#### ID-14 — User Identity & Access Information
| Field | Value |
|---|---|
| Purpose | Who a user is, and what they're a member of |
| Business Owner | Super Admin (platform-wide identity); each Organization (its own membership) |
| Primary Users | Every authenticated actor, indirectly; Super Admin, directly (User Management) |
| Related Modules | Cross-cutting — not owned by a single working module in §2.1 |
| Information Categories | Identity (Supabase Auth, existing); Membership (per-Organization role) |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-14 |
| Relationships | Every other Organization-scoped domain (ID-03 through ID-12) ultimately resolves visibility through this domain's membership records |
| Metadata | Universal + role, Organization type |
| Searchability | Super Admin, platform-wide (User Management, A-004 §6 SA-08 — itself a story-less screen, A-004 §14) |
| Visibility | Identity itself: the individual only, plus Super Admin for administration. Membership: Organization-Confidential to fellow members |
| Organization Scope | An identity can belong to multiple Organizations (future team scenarios); today, one personal Organization per Owner, one Organization per approved Builder admin |
| Lifecycle | Active (from signup) → Suspended/Removed (membership-level, not identity-level — matches the backend Platform Foundation Specification's own membership lifecycle) |
| Security Classification | Treated as sensitive by default across this whole document, even though it doesn't map cleanly onto the four-level scale — identity data is never Public and is Organization-Confidential at best from any other member's point of view |
| Retention Considerations | Existing Supabase Auth conventions, not redesigned |
| Future Expansion | **This domain is the direct subject of A-008 (Permission Matrix / RBAC), the next document in this series** — everything here is deliberately left at "what exists," not "who can do what," which A-008 owns |

#### ID-15 — Future Tenant Information
| Field | Value |
|---|---|
| Purpose | Not designed — placeholder only |
| Business Owner | Not yet assigned |
| Primary Users | Future Tenant (via a future Tenant Mobile App) |
| Related Modules | None yet |
| Information Categories | Not designed |
| Content Hierarchy | `CONTENT_HIERARCHY.md` §ID-15 — explicitly empty |
| Relationships | Presumed: document access and notifications, analogous to today's in-app tenant experience (A-002 §21, A-003 §9, A-003A §3.5, A-005 §19) |
| Metadata | Not designed |
| Searchability | Not designed |
| Visibility | Not designed |
| Organization Scope | Not designed |
| Lifecycle | Not designed |
| Security Classification | Not yet classified |
| Retention Considerations | Not designed |
| Future Expansion | The entire domain is future expansion — this row exists only to reserve the domain ID for whenever the Tenant Mobile App is formally scoped |

## 4. Content Hierarchy

See [`CONTENT_HIERARCHY.md`](CONTENT_HIERARCHY.md) for the full per-domain trees.

## 5. Content Taxonomy

| Taxonomy Axis | Values |
|---|---|
| By Product | Public Website, Super Admin Portal, Builder Handover Portal, Owner Mobile App (reference), Future Tenant |
| By Classification | Public, Internal, Organization-Confidential, Restricted-Financial (`METADATA_STANDARDS.md`) |
| By Lifecycle Stage | Draft/Pending, Active, Archived/Historical (`METADATA_STANDARDS.md`) |
| By Ownership Transfer | Static (never changes owning Organization — ID-01, ID-02, ID-06) vs. Transferable (ID-09 specifically; ID-14 memberships can also move between states but not between Organizations in the current single-membership model) |

## 6. Entity Relationships (Business View)

```
Public Visitor --submits--> Builder Registration (ID-02) --approved--> Organization (ID-03)
Organization (ID-03) --Builder-type--> Project (ID-07) --> Unit (ID-07)
Unit --> Owner Assignment (ID-08) --> Invitation (ID-10) --accepted--> Document Transfer (ID-09)
Invitation acceptance --> creates/links --> Owner-side Organization (ID-03) + Property (ID-13, reference)
Every ID-02 through ID-12 record --> resolves visibility via --> User Identity & Membership (ID-14)
```
Full diagram: `diagrams/A-007_Information_Architecture_Diagrams.md` §2.

## 7. Information Ownership

| Domain | Owner While... |
|---|---|
| ID-01, ID-02 | MyPropertyAsset's own commercial/Super Admin function, always |
| ID-03, ID-04, ID-05 | Super Admin (administrative authority) + the Organization itself (subject) — dual, not conflicting, ownership |
| ID-06 | Super Admin, exclusively |
| ID-07, ID-08 | The Builder Organization, exclusively, until... |
| ID-09 | ...handover transfers it to the Owner Organization (the one domain whose *owner* changes over its lifecycle, by design) |
| ID-10 | The Builder Organization (the invitation itself); the Owner's acceptance is a separate act, not a transfer of the invitation record itself |
| ID-11, ID-12 | Whichever product/actor generated or requested it |
| ID-13 | The Property Owner, exclusively, always (reference only) |
| ID-14 | Super Admin (platform identity) + each Organization (its own membership) |
| ID-15 | Unassigned |

## 8. Information Visibility

| Domain | Public Visitor | Super Admin | Builder (own Org) | Builder (other Org) | Owner (own) | Owner (other) |
|---|---|---|---|---|---|---|
| ID-01 (content) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ID-01 (leads) | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ID-02 | ❌ | ✅ | Own submission only | ❌ | ❌ | ❌ |
| ID-03 | ❌ | ✅ (all) | Own only | ❌ | Own only | ❌ |
| ID-04, ID-05 | ❌ | ✅ | Own only | ❌ | ❌ | ❌ |
| ID-06 | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| ID-07, ID-08 | ❌ | ❌* | ✅ | ❌ | ❌ | ❌ |
| ID-09 (pre-handover) | ❌ | ❌* | ✅ | ❌ | ❌ (even the assigned owner) | ❌ |
| ID-09 (post-handover) | ❌ | ❌* | Read-only historical | ❌ | ✅ | ❌ |
| ID-10 | ❌ | ❌* | ✅ | ❌ | Own invitation only | ❌ |
| ID-11 | ❌ | Own | Own | ❌ | Own | ❌ |
| ID-12 | ❌ | ✅ (platform) | Own only | ❌ | ❌ | ❌ |
| ID-13 | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| ID-14 | ❌ | ✅ (identity mgmt) | Own Org membership | ❌ | Own Org membership | ❌ |

*\*Super Admin's exact visibility into Builder-Organization-scoped operational data (ID-07/ID-08/ID-09/ID-10) is not settled by any prior document — A-002/A-004/A-005 describe Super Admin's role as approval/monitoring/support, which plausibly requires *some* visibility for support purposes, but no story or screen grants it explicitly. Marked ❌ here as the conservative default (Organization-Confidential means confidential, including from Super Admin, unless a story says otherwise) — flagged as an open question in §13, not silently assumed either way.*

## 9. Information Lifecycle

Per-domain lifecycle is detailed in each §3 entry; the shared three-stage vocabulary (Draft/Pending → Active → Archived/Historical) is defined once in `METADATA_STANDARDS.md` and referenced, not redefined, throughout.

## 10. Search Architecture

See [`SEARCH_ARCHITECTURE.md`](SEARCH_ARCHITECTURE.md) in full. Summary: no cross-product global search exists or is proposed; every domain's search is scoped to at most one Organization (or, for Super Admin, the platform-wide administrative view of Internal-classification domains only — never Restricted-Financial, never another Organization's Organization-Confidential data).

## 11. Dashboard Information Model

| Dashboard | Aggregates From | Presented As |
|---|---|---|
| Super Admin Dashboard (A-004 SA-02) | ID-02 (pending count), ID-03 (Organization count), ID-06 (monitoring highlights) | Summary indicators + Dashboard Shortcuts (A-005 §14) |
| Builder Dashboard (A-004 BA-02) | ID-07 (project/unit counts by lifecycle state), ID-10 (invitation status counts) | Summary indicators + Dashboard Shortcuts (A-005 §14) |

Both dashboards are **read-only aggregations** — no dashboard is itself an information domain or a system of record; this reinforces §7's ownership table (a dashboard never owns what it displays).

## 12. Metadata Standards

See [`METADATA_STANDARDS.md`](METADATA_STANDARDS.md) in full — Universal fields, the four-level classification scale, domain-specific additions, and the lifecycle vocabulary.

## 13. Cross Module Information Flow

```
Public Website (ID-01, ID-02) --Organization creation--> Super Admin (ID-03, ID-04, ID-05)
Super Admin --approval--> Builder Portal (ID-07, ID-08, ID-09, ID-10)
Builder Portal --handover--> Owner Mobile App (ID-13, reference)
All products --events--> Notification (ID-11)
Builder Portal, Super Admin --derive--> Reporting (ID-12)
```
This is the same cross-product flow already established in A-002 §17 and A-005 §5's Cross Product Navigation, restated here at the information-domain level rather than the process or screen level — a third, consistent view of the same underlying flow, not a fourth competing one.

## 14. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **A-006 was never written**, and this document had to construct a fallback "Working Module Reference" (§2.1) to proceed | Every "Related Modules" reference in §3 is provisional, not verified against a real module architecture | Labeled explicitly as provisional throughout; recommend A-006 be written and this document's module references reconciled against it before A-008 relies on them further |
| **Super Admin's visibility into Builder-Organization-scoped data (§8) is unresolved** — no prior document settles whether Super Admin can see ID-07 through ID-10 for support purposes | A-008 (Permission Matrix) cannot correctly specify Super Admin's permissions on these domains without this being resolved first | Flagged explicitly as an open question, defaulted conservatively (❌) rather than guessed either way |
| **Builder Projects backend dependency (ID-07) is now the sixth consecutive document** to carry this forward, compounded by A-006 (which should have addressed it) never existing | The dependency has had no opportunity to be resolved by the one document type built for exactly that purpose | Restated with explicit escalation language; recommend this become a hard blocker before any further document depends on it further |
| ID-08's relationship to A-005's flagged "Owners" navigation gap confirms there is genuinely no cross-Organization owner directory anywhere in this series | A-008/A-006 (whenever written) might otherwise assume one exists | Confirmed and cross-referenced explicitly (§3, ID-08) |

## 15. Assumptions

- Every domain not flagged in §14 has sufficient backing across A-001–A-005 to be considered complete at this document's level of detail.
- The Working Module Reference (§2.1) is an adequate stand-in for the purposes of this document only — it should not be treated as an approved module architecture by any future document.
- Super Admin's Restricted-Financial visibility is assumed to be **none**, consistent with the backend's existing "managers never see financial data" rule extended to its logical platform-wide conclusion — not explicitly stated by any prior document but treated as the safe default here.

## 16. Constraints

- No Angular, API, SQL, database schema, folder structure, routing, component, or UI design content appears anywhere in this document (explicit Quality Rule).
- The Builder Portal exclusion list (CRM/Sales/HR/Payroll/Accounting/Inventory/Procurement/Society Management) constrains ID-07/ID-08 exactly as it constrained every prior document — ID-08 in particular is deliberately kept to a bare contact-link, not a prospect/lead-management domain.
- No information domain was created without tracing to at least one of A-002/A-004/A-005, even where §2.1's fallback module reference had to stand in for A-006.

## 17. Future Expansion

- A real A-006 Functional Module Architecture, and reconciliation of every "Related Modules" reference in §3 against it once it exists.
- Resolution of Super Admin's visibility into Builder-Organization-scoped data (§8, §14).
- A proper Audit information domain specification (ID-06's Audit sub-domain), once a backing A-003A story exists.
- A cross-Organization Owner directory, if the "Owners" navigation gap (A-005 NAV-BA-04) is ever formally built — this would be a new information domain, not an extension of ID-08.
- Future Tenant Information (ID-15), once that product is scoped.

## 18. Updated ARCHITECTURE_INDEX.md

See `../ARCHITECTURE_INDEX.md` — updated with the A-007 entry, and an explicit note that A-006 remains unwritten. No prior document was overwritten.

## 19. Updated ADR List

**Not required.** This document introduces no new technical/architectural decision. See `docs/adr/ADR_INDEX.md` — unchanged.

## 20. Review Checklist

- [ ] All 15 information domains reviewed for completeness against A-001–A-005
- [ ] The missing A-006 and its fallback Working Module Reference (§2.1) acknowledged as provisional, not accepted as equivalent to a real module architecture
- [ ] Super Admin's visibility into Builder-Organization-scoped data (§8) resolved or explicitly deferred with owner assigned
- [ ] Builder Projects backend dependency (ID-07) escalated as a blocking issue before any further document depends on it

## 21. Approval Checklist

- [ ] Reviewed by Enterprise/Information Architect
- [ ] Reviewed by Enterprise/Solution Architect
- [ ] A-006 gap explicitly acknowledged and a resolution path chosen (write it retroactively / continue without it / other)
- [ ] Status updated from Draft to Approved in `ARCHITECTURE_INDEX.md`
- [ ] A-008 (Permission Matrix / RBAC) authorized to begin
