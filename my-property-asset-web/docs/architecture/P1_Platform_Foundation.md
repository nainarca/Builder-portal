---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P1 |
| **Document Name** | Platform Foundation (Design) |
| **Project** | MyPropertyAsset Web Platform |
| **Phase** | P1 – Platform Foundation |
| **Version** | 1.0 |
| **Status** | Draft — awaiting approval |
| **Prepared For** | `feature/platform-foundation` |
| **Repository** | `my-property-asset-web` only |
| **Created Date** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Dependencies** | A-001, A-002, A-007, A-008, ROLE_CATALOG, PERMISSION_MATRIX; Schema V2 (Flutter Owner App) |
| **Referenced Documents** | `ARCHITECTURE_INDEX.md`, A-001–A-008, NG-006 Authentication Architecture |
| **Approval Status** | **Pending approval — design only; no implementation until approved** |

### Explicit non-goals of this document

| Forbidden | Status |
|---|---|
| SQL / migrations | Not generated |
| Angular code changes | Not made |
| Flutter repository changes | Not made |
| Authentication implementation changes | Not made |
| Owner Web Portal design | **Out of scope permanently for this phase and product vision** |

---

# P1 — Platform Foundation Design

## 0. Purpose and Binding Decisions

This document designs the **Platform Foundation** required for the Angular Web surfaces:

- Public Website
- Super Admin Portal
- Builder Portal

It does **not** design an Owner Web Portal. Individual property owners continue to use the **Flutter Owner App** exclusively.

### 0.1 Binding product topology

```
Platform
│
├── Super Admin                    ← Angular Web
│
├── Builder Organization           ← Angular Web (Builder Portal)
│      │
│      ├── Projects
│      ├── Units
│      ├── Owners (prospects / invitees)
│      ├── White Label
│      └── Builder Staff
│
└── Individual Owner               ← Flutter App only
       └── Personal Workspace (Schema V2)
```

### 0.2 Binding Schema V2 facts (must not be broken)

| Fact | Implication |
|---|---|
| Schema V2 already exists and is used by Flutter | Web platform is **additive**, not a replacement schema |
| Current organizations are **Personal Workspaces** | These remain the Owner App tenancy model |
| Current organization role is **`owner`** | Correct and **reserved** for Flutter Personal Workspaces |
| Flutter Owner App must keep working unchanged | No Flutter code or Owner UX changes in P1 |

### 0.3 Relationship to prior A-series documents

This document **narrows** A-001/A-008 where earlier drafts left ambiguity:

| Prior ambiguity | P1 decision |
|---|---|
| “Relevant web surfaces” for owners (A-001 §7) | **Clarified:** no Owner Web Portal; owners authenticate and operate only in Flutter |
| Shared Organization roles named identically across Builder and Owner types (A-008) | **Clarified:** Schema V2 role `owner` stays Flutter-only; Builder roles use **distinct platform role identifiers** for Web RBAC |
| Post-login web default destination | **Clarified:** Web login serves Super Admin and Builder only; Owner accounts must not be routed into Web portals |

Nothing in this document authorizes changing authentication code, guards, or JWT handling until a later approved implementation phase.

---

## 1. Platform Roles

### 1.1 Role families

Three role families exist on the platform. They must not be collapsed into one enum without type context.

| Family | Used by | Surface | Notes |
|---|---|---|---|
| **System roles** | Platform operators | Super Admin Portal | Not Organization-scoped |
| **Builder organization roles** | Builder staff | Builder Portal | Scoped to a Builder Organization |
| **Owner personal roles** | Property owners | Flutter Owner App only | Schema V2 Personal Workspace; role value `owner` |

### 1.2 System roles (Web)

| Role ID (design) | Label | Description |
|---|---|---|
| `super-admin` | Super Admin | Full platform administration: builder onboarding approval, tenancy oversight, operations, support tooling |
| `support-user` | Support User | Limited platform operations; may use time-boxed Support Access into Builder Organization-Confidential data (A-008 §7); never Restricted-Financial |

### 1.3 Builder organization roles (Web)

| Role ID (design) | Label | Description |
|---|---|---|
| `builder-org-owner` | Builder Organization Owner | Full authority within one Builder Organization, including irreversible org actions |
| `builder-org-admin` | Builder Organization Admin | Operational authority within the Builder Organization except ownership transfer / org deletion |
| `builder-org-member` | Builder Organization Member | Contribute to projects/units/documents; no team invite, no org settings/white-label/subscription control |

### 1.4 Owner personal roles (Flutter only)

| Role ID (Schema V2) | Label | Surface | Description |
|---|---|---|---|
| `owner` | Owner (Personal Workspace) | Flutter only | Correct Schema V2 role for Individual Owner Personal Workspaces |

**Design rule:** The Web Angular RBAC catalog must treat Schema V2 `owner` as **out of Web portal scope**. An authenticated user whose only membership is a Personal Workspace with role `owner` has **no Web portal grant**.

### 1.5 Explicitly excluded Web roles

| Role | Status |
|---|---|
| Owner Web User / Owner Org Admin for a Web portal | **Not used** — no Owner Web Portal |
| Tenant Portal User (Web) | Future / Flutter or future Tenant app — not P1 Web |

### 1.6 Role hierarchy (within one Builder Organization)

```
builder-org-owner
   └─ ⊃ builder-org-admin
         └─ ⊃ builder-org-member
```

Super Admin does **not** inherit into Builder Organizations. Cross-org access for support is only via explicit Support Access (A-008).

---

## 2. Organization Types

### 2.1 Type catalog

| Organization type | Purpose | Primary client | Membership model |
|---|---|---|---|
| **`personal`** (Personal Workspace) | Individual owner’s private tenancy | Flutter Owner App | Typically single member; role `owner` |
| **`builder`** (Builder Organization) | Builder company tenancy for handover work | Angular Builder Portal | Multi-member staff; builder-* roles |
| **`platform`** (logical) | Platform operator context | Angular Super Admin | Not a customer org; Super Admin / Support operate here |

Optional future types (`partner`, `marketplace`) remain undesigned and out of P1.

### 2.2 Critical separation

```
Personal Workspace (type: personal, role: owner)
        ≠
Builder Organization (type: builder, roles: builder-org-*)
```

| Rule | Statement |
|---|---|
| R-ORG-01 | A Personal Workspace must never grant Builder Portal access |
| R-ORG-02 | A Builder Organization must never grant Flutter Restricted-Financial (owner expense/loan) access to builder staff |
| R-ORG-03 | Creating a Builder Organization does not convert or replace a user’s Personal Workspace |
| R-ORG-04 | One human identity (auth user) may hold memberships of different types over time; each membership is evaluated independently |

### 2.3 What “current organizations” means

Today’s live Schema V2 organizations are **Personal Workspaces**. That is correct for Flutter. P1 designs **adding** Builder Organizations as a new organization type for Web — it does not redefine Personal Workspaces as Builder orgs.

---

## 3. Builder Organization Model

### 3.1 Definition

A **Builder Organization** is a multi-user tenancy representing a real-estate builder/developer business. It is the sole authenticated tenancy type for the Builder Portal.

### 3.2 Capabilities (in scope)

| Domain | Capability |
|---|---|
| Projects | Create/manage builder projects |
| Units | Manage units within projects |
| Owners | Prospect / assign / invite owners for units (handover path into Flutter) |
| White label | Org branding presentation (config authority per A-008 / Super Admin split) |
| Builder staff | Invite and manage builder-org-admin / builder-org-member |

### 3.3 Permanently out of scope (Builder ERP exclusion — A-001 §12)

CRM, sales pipeline, HR, payroll, builder accounting, procurement, inventory, society management.

### 3.4 Membership structure (logical)

```
Builder Organization
├── Members[]
│     ├── user_id
│     ├── role ∈ { builder-org-owner, builder-org-admin, builder-org-member }
│     └── status ∈ { active, invited, suspended, … }
├── Projects[]
├── Units[]
├── Owner assignments / invitations[]
└── Branding / commercial metadata
```

### 3.5 Relationship to Individual Owners

Builders do **not** become owners. Builders invite owners to claim units; accepted owners continue in **Flutter Personal Workspaces**. Document/property handover transfers ownership of handover artifacts to the owner’s Personal Workspace (A-002), not into a Web owner portal.

### 3.6 Isolation

- Builder A never sees Builder B’s projects/units/documents.
- Builder staff never see owner Restricted-Financial data (ID-13).
- Super Admin has no standing access to Builder Organization-Confidential data without Support Access.

---

## 4. Super Admin Model

### 4.1 Definition

**Super Admin** is a platform operator identity, not a customer organization member in the Builder or Personal sense.

### 4.2 Responsibilities

| Area | Responsibility |
|---|---|
| Builder onboarding | Approve/reject builder registration / organization activation |
| Tenancy | Administrative view of Organizations (without Restricted-Financial) |
| Commercial | Subscription / plan oversight for Builder Organizations |
| Operations | Platform health, failed logins, maintenance signals |
| IAM (platform) | Manage Super Admin / Support identities; oversight of invitations |
| Support Access | Invoke time-boxed, audited access into a Builder org’s Confidential resources |
| White-label (platform policy) | Platform-level branding controls where A-series assigns Super Admin |

### 4.3 Hard limits

| Limit | Rule |
|---|---|
| No standing Builder data access | Must use Support Access |
| No Restricted-Financial access | Absolute — no exception path (A-008) |
| No acting as Owner | Cannot operate Flutter Personal Workspace as if they were the owner |
| No Builder ERP tools | Same ERP exclusion as Builder Portal |

### 4.4 Support User

A narrower system role for day-to-day support. Portal access may include Super Admin and (under policy) Builder Portal with delegated permissions only — never Personal Workspace financial surfaces.

---

## 5. Builder Invitation Flow

Two distinct invitation concepts must not be mixed.

### 5.1 Invitation Type A — Builder staff invitation (into Builder Organization)

**Purpose:** Add staff to a Builder Organization.

```
Builder Org Owner/Admin
        │
        ▼
Creates invitation (email + role: admin|member)
        │
        ▼
Invitee receives email / link
        │
        ▼
Accepts → becomes organization_members row
        │   role = builder-org-admin | builder-org-member
        ▼
Signs in to Angular → Builder Portal
```

| Rule | Statement |
|---|---|
| INV-A-01 | Staff invitations never create Personal Workspaces |
| INV-A-02 | Staff invitations never assign Schema V2 role `owner` |
| INV-A-03 | First Builder Organization Owner is provisioned via Super Admin onboarding approval (not self-serve staff invite) |

### 5.2 Invitation Type B — Owner property invitation (handover)

**Purpose:** Invite an individual to claim a unit / receive handover (A-002).

```
Builder Org Owner/Admin/Member (per RBAC)
        │
        ▼
Invites owner for a unit
        │
        ▼
Owner receives invitation
        │
        ▼
Owner accepts in Flutter Owner App
        │
        ▼
Personal Workspace (role: owner) receives property/handover artifacts
```

| Rule | Statement |
|---|---|
| INV-B-01 | Owner invitations land in **Flutter**, not Angular Owner Web |
| INV-B-02 | Accepting an owner invitation must not grant Builder Portal access |
| INV-B-03 | Unit has at most one active owner invitation at a time (A-002) |

### 5.3 Builder organization onboarding (high level)

```
Public Website / Register as Builder
        │
        ▼
Super Admin reviews (Decide)
        │
        ├── Reject → terminal / resubmit path
        └── Approve → Builder Organization activated
                        + initial builder-org-owner membership
                        │
                        ▼
                   Builder signs in → Builder Portal
```

---

## 6. Authentication Flow

### 6.1 Shared identity

One Supabase Auth identity (`auth.users`) may be used across clients. **Authorization is membership- and role-driven**, not “logged in ⇒ Web portal.”

### 6.2 Web authentication flow (design intent)

```
1. User submits credentials on Angular Login Gateway
2. Supabase Auth validates → session issued
3. Auth Context resolves (identity only)
4. Organization / membership context resolves (type + role)
5. RBAC resolves portal grants
6. Router sends user to the correct Web portal — or denies Web access
```

### 6.3 Portal grant rules after authentication

| Membership reality | Web outcome |
|---|---|
| Has `super-admin` or `support-user` | → Super Admin Portal |
| Has active Builder Organization membership (`builder-org-*`) | → Builder Portal |
| Has **only** Personal Workspace with role `owner` | → **No Web portal**; access denied or guided to Flutter Owner App |
| Has both Builder membership and Personal Workspace | → Web portal uses Builder membership only; Personal Workspace remains Flutter |

### 6.4 What this document does **not** change

Until an approved implementation phase:

- No changes to Angular auth services, guards, or JWT mapping
- No changes to Flutter auth
- No requirement to alter Schema V2 `owner` semantics

### 6.5 Known design gap (for later implementation approval)

Current Web default post-login redirect and portal routes assume Super Admin / Builder paths. A Personal Workspace–only `owner` user authenticating on Web **must not** be treated as Super Admin or Builder. Resolution belongs to an approved implementation task (JWT claims / membership resolution / role-aware redirect) — **not** to silent code change in this design phase.

---

## 7. Route Flow

### 7.1 Web route families

| Route family | Audience | Auth |
|---|---|---|
| Public Website (`/`, marketing, pricing, demo, register) | Visitors | Unauthenticated |
| Auth (`/auth/*`) | All | Login gateway, recovery, access-denied, session-expired |
| Super Admin (`/super-admin/*`) | System roles | Authenticated + portal + role/permission |
| Builder Portal (`/builder-portal/*`) | Builder org roles | Authenticated + portal + role/permission |

### 7.2 Explicit non-route

| Path concept | Status |
|---|---|
| `/owner-portal` or any Owner Web shell | **Does not exist and must not be introduced in P1** |

### 7.3 Post-login routing decision tree (design)

```
Authenticated?
  ├─ No  → /auth/login
  └─ Yes
       ├─ System role?           → /super-admin
       ├─ Builder membership?    → /builder-portal
       └─ Personal owner only?   → /auth/access-denied
                                    (reason: no Web portal for this account)
                                    + messaging to use Flutter Owner App
```

### 7.4 Deep-link rules

- Deep links into `/super-admin/*` or `/builder-portal/*` without matching portal grant → access denied.
- Deep links that bypass Login Gateway into protected shells must fail closed (A-005).

---

## 8. Portal Architecture

### 8.1 Three Web products, one Flutter product

| Product | Tech | Auth | Tenancy |
|---|---|---|---|
| Public Website | Angular | None | None |
| Super Admin Portal | Angular | Required | Platform context |
| Builder Portal | Angular | Required | Builder Organization context |
| Owner App | Flutter | Required | Personal Workspace |

### 8.2 Architectural boundaries

```
┌─────────────────────────────────────────────────────────┐
│                 Supabase / Schema V2                      │
└───────────────┬─────────────────────────┬───────────────┘
                │                         │
     ┌──────────▼──────────┐   ┌──────────▼──────────┐
     │ Angular Web Platform │   │ Flutter Owner App    │
     │ • Public             │   │ • Personal Workspace │
     │ • Super Admin        │   │ • role: owner        │
     │ • Builder Portal     │   │ • Restricted-Financial│
     └─────────────────────┘   └─────────────────────┘
```

### 8.3 Shell rules

| Rule | Statement |
|---|---|
| P-SHELL-01 | Super Admin and Builder Portal never share a global nav |
| P-SHELL-02 | Organization switcher (if present) lists only orgs the user may access for that portal |
| P-SHELL-03 | White-label tokens apply inside Builder Portal for the active Builder Organization |
| P-SHELL-04 | Flutter owns all owner day-to-day and financial UX |

### 8.4 Cross-product handoffs

| From | To | Mechanism |
|---|---|---|
| Public Website | Auth / Builder registration | Conversion links |
| Super Admin | Builder Organization | Onboarding approval |
| Builder Portal | Flutter Owner App | Owner invitation / handover acceptance |
| Flutter | Angular Web | Not required for owners; builders/admins use Web login directly |

---

## 9. RBAC Matrix

### 9.1 Permission vocabulary (unchanged from A-008)

Full / Operate / Contribute / Decide / Read / Own-Read / None / Delegated.

### 9.2 Portal permission keys (Web)

| Portal key | Granted to |
|---|---|
| `portal:super-admin` | `super-admin`, (policy) `support-user` |
| `portal:builder-portal` | `builder-org-owner`, `builder-org-admin`, `builder-org-member`, (delegated) `support-user` |
| `portal:owner-web` | **Not used** — no Owner Web Portal |

### 9.3 Condensed Role × Portal matrix

| Role | Super Admin Portal | Builder Portal | Owner Web | Flutter Owner App |
|---|---|---|---|---|
| `super-admin` | Yes | No (unless Support Access policy) | N/A | No |
| `support-user` | Yes (limited) | Delegated only | N/A | No |
| `builder-org-owner` | No | Yes | N/A | No* |
| `builder-org-admin` | No | Yes | N/A | No* |
| `builder-org-member` | No | Yes | N/A | No* |
| Schema V2 `owner` | No | No | **N/A — does not exist** | Yes |

\*A human may separately hold a Personal Workspace; that membership does not unlock Web portals.

### 9.4 Condensed Role × Resource matrix (Web-relevant)

Full detail remains in `PERMISSION_MATRIX.md`. P1 binding highlights:

| Resource | Super Admin | Builder roles | Schema V2 `owner` (Flutter) |
|---|---|---|---|
| Platform operations / audit | Full | None | None |
| Builder onboarding | Decide | Own submission Read | None |
| Builder org tenancy | Admin view | Full/Operate/Read own org | None |
| Projects / Units | Delegated | Full/Contribute own org | None |
| Owner assignment / invite | Delegated | Full/Contribute own org | Decide on own invite (Flutter) |
| Handover documents | Delegated | Full pre / Read post | Full post (Flutter) |
| Owner financial (ID-13) | **None** | **None** | Full own (Flutter) |

### 9.5 Evaluation order (design)

1. Authenticated?
2. Organization / membership context resolved for the requested portal?
3. Role allowed for route?
4. Portal permission present?
5. Resource permission level sufficient?
6. Feature flag (if any) enabled?

Fail closed at the first failed step.

---

## 10. Migration Strategy

### 10.1 Principles

| Principle | Statement |
|---|---|
| Additive | Prefer new organization types and memberships over rewriting Personal Workspaces |
| Non-destructive | Existing Personal Workspaces and role `owner` remain valid |
| Dual-client safe | Flutter continues against Schema V2 without mandatory Web release coupling |
| Explicit cutovers | Builder features go live only when Builder Organizations and Web RBAC exist |

### 10.2 Logical migration stages (no SQL in this document)

| Stage | Intent |
|---|---|
| M0 | Document & approve P1 (this document) |
| M1 | Confirm Schema V2 Personal Workspace semantics frozen for Flutter |
| M2 | Introduce Builder Organization type + builder membership roles (backend design/approval separate) |
| M3 | Provision first Builder Organizations via Super Admin onboarding |
| M4 | Enable Angular Builder Portal against Builder Organizations only |
| M5 | Enable owner invitation Type B → Flutter acceptance path |
| M6 | Optional: backfill / audit tools in Super Admin; no rewrite of Personal Workspaces |

### 10.3 Data that must not be migrated away

- Existing `auth.users` identities used by owners
- Personal Workspace organizations
- Role value `owner` on Personal Workspace memberships
- Owner Restricted-Financial records

### 10.4 Data that is new (conceptual)

- Builder Organizations (`type = builder`)
- Builder staff memberships with `builder-org-*` roles
- Builder projects/units/handover artifacts as designed in Builder feature docs
- Platform operator identities for Super Admin

---

## 11. Backward Compatibility

### 11.1 Flutter Owner App (hard requirements)

| Requirement | Status |
|---|---|
| Schema V2 Personal Workspace continues to work | Required |
| Role `owner` remains valid | Required |
| No Flutter repository changes in P1 design phase | Required |
| Owner financial and day-to-day UX remain in Flutter | Required |
| Owner invitations continue to resolve in Flutter | Required |

### 11.2 Compatibility rules for Web work

| Rule | Statement |
|---|---|
| BC-01 | Web must not require owners to use Angular |
| BC-02 | Web must not reinterpret Personal Workspace `owner` as `builder-org-owner` or `super-admin` |
| BC-03 | Shared auth identity is allowed; shared **authorization** is not automatic |
| BC-04 | New Builder tables/types must not break existing Personal Workspace RLS assumptions |
| BC-05 | Deprecations (if any) require an explicit approved migration document — not silent |

### 11.3 Compatibility with A-series

P1 **narrows** owner-web ambiguity:

- A-001 “relevant web surfaces” for owners → **none** for authenticated owner product UX
- A-008 Owner Org Admin/Member “reserved” → remain reserved; **not** activated as a Web portal
- `portal:owner-web` in Angular RBAC registry → treat as **unused / do not route**

---

## 12. Implementation Roadmap

### 12.1 Phase gates

```
P1 Design (this doc) ──approval──► P1.1 Authz contract
                                   (claims / membership resolution design)
                                        │
                                        ▼
                                   P1.2 Backend Builder Org model
                                   (separate approval; SQL later)
                                        │
                                        ▼
                                   P1.3 Angular portal routing & RBAC wiring
                                        │
                                        ▼
                                   P1.4 Builder onboarding + staff invites
                                        │
                                        ▼
                                   P1.5 Owner invite → Flutter handoff
                                        │
                                        ▼
                                   Feature modules (Projects, Units, …)
```

### 12.2 Recommended work packages (post-approval)

| WP | Name | Deliverable type | Depends on |
|---|---|---|---|
| WP-0 | Approve P1 | Sign-off | — |
| WP-1 | Authz & portal grant contract | Design + ADR | P1 |
| WP-2 | Builder Organization data model | Design → later SQL | WP-1 |
| WP-3 | Super Admin onboarding UX/API | Implementation | WP-2 |
| WP-4 | Builder Portal shell + RBAC | Implementation | WP-1, WP-2 |
| WP-5 | Staff invitation Type A | Implementation | WP-4 |
| WP-6 | Owner invitation Type B → Flutter | Implementation | WP-4 + Flutter-compatible APIs (no Flutter app rewrite) |
| WP-7 | Projects / Units / Documents / White label | Feature delivery | WP-4 |

### 12.3 Explicitly deferred

| Item | Why deferred |
|---|---|
| SQL migrations | Design-only phase |
| Angular auth code changes | Awaiting WP-1 approval |
| Flutter changes | Out of scope |
| Owner Web Portal | Product decision: does not exist |
| Tenant Web / Tenant mobile redesign | Future |
| Builder ERP features | Permanently out of scope |

### 12.4 Success criteria for “Platform Foundation complete”

| Criterion | Measure |
|---|---|
| Role model approved | System + Builder + Personal `owner` coexistence documented and signed |
| Org types approved | `personal` vs `builder` separation accepted |
| No Owner Web Portal | Confirmed in product + route architecture |
| Flutter unbroken | Personal Workspace + `owner` remain authoritative for owners |
| Clear invite split | Type A (staff) vs Type B (owner→Flutter) accepted |
| Roadmap approved | WP-0 through WP-7 sequencing accepted |

---

## 13. Open Questions (require product/architecture decision before implementation)

| ID | Question | Default recommendation |
|---|---|---|
| OQ-1 | Exact Schema V2 column/enum for organization type (`personal` vs `builder`) | Prefer additive type discriminator; do not overload Personal Workspaces |
| OQ-2 | How platform operators are stored (flag vs membership in `platform` org) | Prefer explicit system role claim + audited provisioning |
| OQ-3 | Can one auth user be both `owner` (personal) and `builder-org-admin`? | Yes, allowed; Web uses builder membership only |
| OQ-4 | Messaging when Personal `owner` hits Angular login | Access denied + “use Owner App” CTA |
| OQ-5 | Support Access UX location | Super Admin only |

---

## 14. Approval Checklist

- [ ] Platform topology accepted (Super Admin + Builder Web + Owner Flutter only)
- [ ] Schema V2 `owner` / Personal Workspace backward compatibility accepted
- [ ] No Owner Web Portal confirmed
- [ ] Builder vs Owner invitation flows accepted
- [ ] RBAC portal keys accepted (`owner-web` unused)
- [ ] Migration strategy accepted as additive
- [ ] Implementation roadmap accepted
- [ ] Authorization to proceed to WP-1 (design of claims/membership resolution) granted

---

## 15. Summary

P1 establishes that MyPropertyAsset’s Angular Web platform serves **Public Website**, **Super Admin**, and **Builder Organizations** only. **Individual Owners remain on Flutter** under Schema V2 Personal Workspaces with role **`owner`**. Builder staff use distinct `builder-org-*` roles inside Builder Organizations. Owner property invitations resolve in Flutter; builder staff invitations resolve in Angular. No SQL, code, Flutter, or authentication implementation changes are authorized by this document until approval and a subsequent implementation phase.
