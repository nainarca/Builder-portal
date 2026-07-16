---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P2 |
| **Document Name** | Platform Database & Authentication Blueprint |
| **Project** | MyPropertyAsset Web Platform |
| **Phase** | P2 – Platform Database & Authentication Blueprint |
| **Version** | 1.0 |
| **Status** | Draft — awaiting approval |
| **Prepared For** | `feature/platform-foundation` |
| **Repository** | `my-property-asset-web` only |
| **Created Date** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Source of Truth** | [`P1_Platform_Foundation.md`](P1_Platform_Foundation.md) — **approved decisions are not redesigned here** |
| **Dependencies** | P1, A-001, A-002, A-007, A-008, NG-006, NG-007, NG-008 |
| **Approval Status** | **Pending approval — design only; no implementation until approved** |

### Explicit non-goals

| Forbidden | Status |
|---|---|
| SQL / migrations | Not generated |
| Angular implementation code | Not generated |
| Flutter repository changes | Not made |
| Redesign of P1 decisions | Forbidden |
| Owner Web Portal | Remains out of scope (P1) |

---

# P2 — Platform Database & Authentication Blueprint

## 0. Purpose

P2 converts the approved P1 Platform Foundation into an **implementation blueprint**: authentication/authorization flows, additive data model relationships, RBAC actions, Angular module layout, routes, navigation, ERD, API contracts, and expansion strategy.

P2 does **not** authorize coding, SQL, or Flutter changes.

### 0.1 P1 decisions carried forward unchanged

| P1 decision | P2 treatment |
|---|---|
| Web = Public + Super Admin + Builder only | Unchanged |
| Owners = Flutter only; no Owner Web Portal | Unchanged |
| Schema V2 Personal Workspace + role `owner` | Unchanged; additive Builder entities only |
| Distinct `builder-org-*` roles | Unchanged |
| Invitation Type A (staff) vs Type B (owner→Flutter) | Unchanged |
| Restricted-Financial (ID-13) never visible to Web roles | Unchanged |

### 0.2 Platform users (this repository)

| User | Portal | Responsibilities |
|---|---|---|
| **Super Admin** | Super Admin Portal | Manage builders, platform configuration, subscription plans, global announcements, platform analytics |
| **Builder** (Owner / Admin / Staff) | Builder Portal | Company profile, branding, projects, units, owner invitations, handover documents, builder notifications |
| **Owner** | **None (Web)** | Flutter mobile app only — never logs into this web portal |
| **Tenant** | **None (Web)** | Future / Flutter — not a Web portal user in P2 |

---

## 1. Authentication Blueprint

### 1.1 Design goal

Authenticate once via Supabase; authorize by **organization type + role**; route only Super Admin and Builder users into Web portals. All other authenticated identities receive a **friendly portal-unavailable** experience — not a generic Access Denied.

### 1.2 End-to-end flow

```
Public Website
      │
      ▼
   Sign In  (/auth/login)
      │
      ▼
Supabase Authentication  (email/password; future SSO reserved)
      │
      ▼
Load User Profile        (platform user_profiles / identity enrichment)
      │
      ▼
Load Organization        (memberships for this auth user)
      │
      ▼
Determine Organization Type
      │     personal | builder | platform (logical)
      ▼
Determine Role
      │     super-admin | support-user | builder-org-* | owner | …
      ▼
Route User
      │
      ├── System role (super-admin / support-user)
      │         → Super Admin Dashboard
      │
      ├── Builder Organization membership (builder-org-*)
      │         → Builder Dashboard
      │
      └── Any other role (incl. Schema V2 owner-only, tenant, unknown)
                → Friendly Portal Unavailable page
                   Message (exact copy):
                   "This portal is available only for Builder organizations
                    and Platform Administrators."
```

### 1.3 Step contracts

| Step | Input | Output | Failure behavior |
|---|---|---|---|
| Sign In | email, password | Supabase session | Inline credential error on login form |
| Supabase Auth | credentials | `auth.users` session + JWT | Stay on login |
| Load User Profile | `auth.uid` | Profile record (display name, defaults, flags) | Soft-fail → treat as incomplete; do not invent portal grants |
| Load Organization | `auth.uid` | Membership list (org id, type, role, status) | Empty list → Portal Unavailable |
| Determine Org Type | membership(s) | Prefer active Builder / platform over personal for **Web routing** | Personal-only → Portal Unavailable |
| Determine Role | membership + system flags | Canonical role ID (P1 §1) | Unknown → Portal Unavailable |
| Route User | type + role | Target URL | See §1.4 |

### 1.4 Routing outcomes

| Condition | Destination | UX |
|---|---|---|
| `super-admin` or `support-user` | `/super-admin` (dashboard) | Super Admin shell |
| Active `builder` org + `builder-org-*` | `/builder-portal` (dashboard) | Builder shell |
| Authenticated but no Web portal grant | `/auth/portal-unavailable` (name TBD; see §6) | Friendly message only |
| Unauthenticated accessing protected route | `/auth/login?returnUrl=…` | Standard login |

### 1.5 Friendly Portal Unavailable (mandatory UX rule)

| Rule | Statement |
|---|---|
| AUTH-UX-01 | Do **not** show generic “Access Denied” / `deniedReason=denied` for Personal Workspace `owner` or other non-Web roles after successful login |
| AUTH-UX-02 | Copy must state availability is limited to **Builder organizations** and **Platform Administrators** |
| AUTH-UX-03 | Optional CTA: open / download Flutter Owner App (owners); contact support (others) |
| AUTH-UX-04 | Sign-out control must remain available |

> **Note:** Existing `/auth/access-denied` may remain for **authorization failures inside an allowed portal** (missing permission on a specific resource). Post-login “wrong audience” uses the friendly portal-unavailable experience.

### 1.6 Session & identity rules

| Rule | Statement |
|---|---|
| AUTH-01 | Supabase Auth is the exclusive identity provider (NG-006 / P1) |
| AUTH-02 | Auth Context holds identity only (user id, email, session) — not portal grants |
| AUTH-03 | Organization Context holds active org id, type, membership role |
| AUTH-04 | RBAC Context derives permissions from role + org type |
| AUTH-05 | Web routing must complete only after profile + membership resolution (or explicit empty membership → Portal Unavailable) |
| AUTH-06 | Personal Workspace membership must never imply Builder or Super Admin portal grant |

### 1.7 Multi-membership

If a user has both Personal Workspace (`owner`) and Builder membership:

1. Web login selects Builder membership for portal routing.
2. Personal Workspace remains Flutter-only.
3. Org switcher (Builder Portal) lists Builder orgs only.

### 1.8 Out of scope for this blueprint’s implementation phase (until approved)

- Changing Flutter auth
- Implementing SQL hooks
- Writing Angular guard code in this phase

---

## 2. Authorization Blueprint

### 2.1 Layers

```
Authentication (who are you?)
        ↓
Organization Context (which tenancy? what type?)
        ↓
Role Resolution (which role in that tenancy / system?)
        ↓
Permission Evaluation (CRUD / Approve / Invite / …)
        ↓
Route + UI + API enforcement
```

### 2.2 Enforcement surfaces

| Surface | Responsibility |
|---|---|
| Route guards | Portal grant + role allow-list + optional permission keys |
| UI directives/pipes | Hide/disable actions without permission |
| API / RLS (backend) | Source of truth; client never trusted alone |
| Support Access | Time-boxed Super Admin exception into Builder Confidential data (A-008); never ID-13 |

### 2.3 Portal grants

| Portal key | Who receives it |
|---|---|
| `portal:super-admin` | `super-admin`, `support-user` (limited) |
| `portal:builder-portal` | `builder-org-owner`, `builder-org-admin`, `builder-org-member`; Support via delegation only |
| `portal:owner-web` | **Unused** (P1) — never grant |

### 2.4 Authorization decision order

1. Authenticated?
2. Memberships loaded?
3. Has Web portal grant for requested shell?
4. Role allowed for route?
5. Resource action permitted?
6. Feature flag enabled (if any)?

Fail closed. Wrong audience after login → Portal Unavailable (friendly). In-portal permission miss → scoped access-denied / toast.

### 2.5 Builder role hierarchy (unchanged from P1)

```
builder-org-owner ⊃ builder-org-admin ⊃ builder-org-member
```

Alias used in product language:

| Product term | Role ID |
|---|---|
| Builder Owner | `builder-org-owner` |
| Builder Admin | `builder-org-admin` |
| Builder Staff | `builder-org-member` |

---

## 3. Platform Database Blueprint

### 3.1 Principles

| Principle | Statement |
|---|---|
| Additive | Extend Schema V2; do not replace Personal Workspaces |
| Type-discriminated orgs | `personal` vs `builder` (and logical platform operators) |
| No Owner Web tables required | Owner product data remains Flutter / existing Schema V2 |
| No SQL in this document | Relationships and attributes only |

### 3.2 Schema V2 baseline (existing — preserve)

Conceptual entities already used / expected for Flutter:

| Entity (conceptual) | Purpose | Web impact |
|---|---|---|
| `auth.users` | Identity | Shared |
| User profile | Display / defaults | Shared read for Web |
| Organizations (Personal Workspaces) | Owner tenancy | Web must recognize type `personal` and **deny portal** |
| Organization members with role `owner` | Owner membership | Not a Web portal grant |
| Owner financial / property domains | Expense, loan, etc. | **Web has no access** |

### 3.3 Additional entities required for Web platform

| Entity (logical name) | Purpose | Primary consumer |
|---|---|---|
| **Platform Operator Profile** | Flags/roles for Super Admin / Support | Super Admin |
| **Builder Organization** | Org typed `builder` (may be specialization of organizations) | Builder + Super Admin |
| **Builder Profile** | Company profile (legal name, GST/tax, contacts, address) | Builder |
| **Organization Branding** | Logo, colors, short name, white-label tokens | Builder + Super Admin policy |
| **Builder Staff Membership** | User ↔ Builder org with `builder-org-*` role | Builder |
| **Builder Staff Invitation** | Type A invites | Builder |
| **Project** | Builder project | Builder |
| **Unit** | Unit within project | Builder |
| **Owner Prospect / Assignment** | Builder-side owner record before/during invite | Builder |
| **Owner Invitation** | Type B invite to Flutter owner | Builder → Flutter |
| **Handover Document** | Document packages for units | Builder → Flutter on accept |
| **Builder Notification** | In-portal notifications for builder staff | Builder |
| **Subscription Plan** | Commercial plan catalog | Super Admin |
| **Organization Subscription** | Plan attached to Builder org | Super Admin + Builder read |
| **Global Announcement** | Platform-wide messages | Super Admin write; portals read |
| **Platform Analytics Snapshot** | Aggregated metrics (non-financial-owner) | Super Admin |
| **Audit Log** | Security/admin events | Super Admin |
| **Permission / Role Catalog** | Optional DB-backed matrix; may start code-defined | Platform |
| **Support Access Grant** | Time-boxed delegated access | Super Admin |

### 3.4 Relationship summary (logical)

```
auth.users 1──* user_profiles
auth.users 1──* organization_members *──1 organizations
organizations.type ∈ { personal, builder, … }

organizations (builder)
    1──1 builder_profiles
    1──0..1 organization_branding
    1──* projects
    1──* builder_staff_invitations
    1──0..1 organization_subscriptions *──1 subscription_plans
    1──* audit_log_entries (also platform-scoped)

projects 1──* units
units 1──0..1 owner_assignments
owner_assignments 1──0..* owner_invitations
units 1──* handover_documents

auth.users 1──* platform_operator_profiles   (system roles)
platform ──* global_announcements
platform ──* support_access_grants ──> organizations (builder)
```

### 3.5 Cardinality notes

| Relationship | Cardinality | Rule |
|---|---|---|
| User → Personal Workspace | 0..1 typical | Flutter default |
| User → Builder memberships | 0..n | Staff may join multiple builders over time |
| Builder Org → Projects | 1..n | Org-scoped |
| Project → Units | 1..n | Project-scoped |
| Unit → Active owner invitation | 0..1 | P1 / A-002 |
| Builder Org → Subscription | 0..1 active | Commercial |
| Support Access → Builder Org | n time-boxed | Audited |

### 3.6 Isolation rules (data)

| Rule | Statement |
|---|---|
| DB-01 | Queries for Builder Portal always filter by active Builder Organization id |
| DB-02 | Personal Workspace rows never appear in Builder Portal lists |
| DB-03 | Owner Restricted-Financial entities have no Web repository contracts |
| DB-04 | Super Admin list APIs return Builder metadata, not owner financials |

---

## 4. RBAC Matrix

### 4.1 Actions

| Action | Meaning |
|---|---|
| **Create** | Insert new records |
| **Read** | View |
| **Update** | Edit existing |
| **Delete** | Archive/delete (destructive) |
| **Approve** | Decide accept/reject (onboarding, handover stages, etc.) |
| **Invite** | Send staff or owner invitations |
| **Branding** | Configure white-label / brand tokens |
| **Configure** | Platform or org settings beyond branding |

### 4.2 Resources (Web-relevant)

Platform config · Builders (onboarding) · Subscriptions · Announcements · Analytics · Audit · Company profile · Branding · Projects · Units · Owners (prospects) · Owner invitations · Documents · Builder notifications · Builder staff · Support access

### 4.3 Matrix

Legend: **Y** = allowed · **O** = own-org / own-record only · **D** = delegated Support Access only · **R** = read-only · **—** = never · **F** = Flutter only (not Web)

| Resource / Action | Super Admin | Builder Owner | Builder Admin | Builder Staff | Owner | Tenant |
|---|---|---|---|---|---|---|
| **Portal: Super Admin** | Y | — | — | — | — | — |
| **Portal: Builder** | D | Y | Y | Y | — | — |
| **Portal: Owner Web** | — | — | — | — | — | — |
| **Flutter Owner App** | — | — | — | — | **F** | **F*** |
| Platform configuration | Y | — | — | — | — | — |
| Manage builders (approve/onboard) | Y (Approve) | — | — | — | — | — |
| Subscription plans | Y | R (own) | R (own) | — | — | — |
| Global announcements | Y | R | R | R | — | — |
| Platform analytics | Y | — | — | — | — | — |
| Audit logs | Y | — | — | — | — | — |
| Company profile | D | Y | Y | R | — | — |
| Branding | Y† / D | Y | R / limited‡ | — | — | — |
| Projects CRUD | D | Y | Y | Create/Read/Update (no Delete) | — | — |
| Units CRUD | D | Y | Y | Create/Read/Update (no Delete) | — | — |
| Owners (prospects) | D | Y | Y | Create/Read/Update | — | — |
| Invite owners (Type B) | D | Y | Y | Invite (no cancel‡) | Decide **F** | — |
| Invite builder staff (Type A) | — | Y | Y | — | — | — |
| Handover documents | D | Y | Y | Create/Read/Update | Full post-handover **F** | — |
| Builder notifications | — | O | O | O | — | — |
| Restricted-Financial | — | — | — | — | **F** | — |

\* Tenant access remains Flutter / future — not designed as Web.  
† Platform-level branding policy may be Super Admin; org brand tokens edited by Builder Owner per product policy.  
‡ Aligns with A-008: Member contribute without cancel/settings authority where previously specified.

### 4.4 Permission key examples (for route metadata)

| Key | Intent |
|---|---|
| `portal:super-admin` | Enter Super Admin shell |
| `portal:builder-portal` | Enter Builder shell |
| `id-07-project-unit:full` | Full project/unit control |
| `id-07-project-unit:contribute` | Staff contribution |
| `id-08-owner-assignment-prospect:contribute` | Owner prospect work |
| `id-09-handover-document:full` | Document management |
| `id-04-white-label-branding:full` | Branding configure |
| `id-05-subscription-commercial:read` | View own subscription |

---

## 5. Angular Module Architecture

### 5.1 Design stance

Blueprint targets the **current monorepo layout** under `src/` (feature folders), consistent with existing Public / Auth / Super Admin / Builder Portal work. Future Nx `apps/`+`libs/` split (NG-008) remains a longer-term option and is not required to implement P2.

### 5.2 Target folder architecture (design)

```
src/
├── app/                          # bootstrap, root routes
├── core/
│   ├── auth/                     # session, login orchestration (no redesign of P1 rules here)
│   ├── organization-context/     # membership, active org, type
│   ├── rbac/                     # permissions, guards, matrix
│   ├── constants/
│   └── …
├── shared/
│   └── ui/                       # primitives/composites
├── layouts/
│   ├── public/
│   ├── auth/
│   ├── super-admin/
│   └── builder-portal/
├── features/
│   ├── public-website/           # public
│   ├── authentication/           # auth (+ portal-unavailable page)
│   ├── super-admin/
│   │   ├── dashboard/
│   │   ├── builders/
│   │   ├── organizations/
│   │   ├── billing/              # subscriptions
│   │   ├── branding/             # platform / WL oversight
│   │   ├── operations/           # analytics, announcements hooks
│   │   ├── iam/
│   │   └── settings/
│   └── builder-portal/
│       ├── (dashboard)
│       ├── branding/             # company branding
│       ├── projects/
│       │   └── units/
│       ├── owners/               # prospects + invitations
│       ├── documents/            # handover documents
│       ├── notifications/
│       ├── settings/             # company profile, staff
│       └── handovers/            # workflow stages (existing)
├── infrastructure/               # supabase, config, logging
├── navigation/
├── theme/
└── environments/
```

### 5.3 Cross-cutting modules

| Concern | Location |
|---|---|
| Guards | `core/auth/guards`, `core/rbac/guards` |
| Services (auth/org/rbac) | `core/*` |
| Feature stores | Feature-local `services/` |
| Layout shells | `layouts/*` |

### 5.4 Module ownership rules

| Rule | Statement |
|---|---|
| MOD-01 | `public-website` has no auth/RBAC dependency beyond links to `/auth` |
| MOD-02 | `super-admin/*` never imports `builder-portal/*` feature internals |
| MOD-03 | `builder-portal/*` never imports `super-admin/*` feature internals |
| MOD-04 | Shared contracts live in `core` / `shared` / `infrastructure` only |

---

## 6. Route Map

### 6.1 Public Website

| Path | Purpose |
|---|---|
| `/` | Home |
| `/features`, `/pricing`, `/about`, `/contact`, … | Marketing |
| `/get-started`, demo/register CTAs | Conversion → auth / builder registration |

### 6.2 Authentication

| Path | Purpose |
|---|---|
| `/auth/login` | Sign in |
| `/auth/forgot-password` | Recovery request |
| `/auth/reset-password` | Recovery completion |
| `/auth/session-expired` | Re-auth |
| `/auth/portal-unavailable` | **Friendly message for non-Builder / non-Admin audiences** |
| `/auth/access-denied` | In-portal authorization failure (resource-level) |

### 6.3 Super Admin

| Path | Purpose |
|---|---|
| `/super-admin` | Dashboard |
| `/super-admin/builders/*` | Manage builders / onboarding |
| `/super-admin/organizations/*` | Tenancy oversight |
| `/super-admin/billing/*` | Subscription plans |
| `/super-admin/branding/*` | Platform / WL oversight |
| `/super-admin/operations/*` | Analytics, alerts, announcements |
| `/super-admin/iam/*` | Platform users / roles |
| `/super-admin/settings/*` | Platform configuration |

### 6.4 Builder Portal

| Path | Purpose |
|---|---|
| `/builder-portal` | Dashboard |
| `/builder-portal/projects/*` | Projects |
| `/builder-portal/projects/:id/units/*` | Units |
| `/builder-portal/owners/*` | Owner prospects / assign / invite |
| `/builder-portal/documents/*` | Handover documents |
| `/builder-portal/handovers/*` | Handover workflows |
| `/builder-portal/settings/*` | Company profile, staff, notifications prefs |
| Branding routes | Under settings or dedicated branding segment (product choice) |

### 6.5 Explicit non-routes

| Path | Status |
|---|---|
| `/owner-portal/**` | **Must not exist** |
| Any Owner financial Web routes | **Must not exist** |

### 6.6 Guard attachment (design)

| Route family | Guards (logical) |
|---|---|
| `/super-admin/**` | Authenticated → Portal (`super-admin`) → Role/Permission |
| `/builder-portal/**` | Authenticated → Portal (`builder-portal`) → Org context → Role/Permission |
| `/auth/login` | Guest (redirect if already Web-eligible) |

---

## 7. Navigation Structure

### 7.1 Public Website

Top nav: Home · Features · Pricing · About · Contact · Sign in · Register / Request demo  
Footer: legal, support, social — unauthenticated only.

### 7.2 Super Admin

```
Dashboard
Builders
Organizations
Billing / Subscriptions
Branding
Operations (Analytics, Announcements, Alerts)
IAM
Settings
```

Header: platform name, operator identity, sign out.  
No Builder project tree in Super Admin global nav.

### 7.3 Builder Portal

```
Dashboard
Projects
  └─ (project context) Units
Owners
Documents
Handovers
Notifications
Settings
  ├─ Company profile
  ├─ Branding
  └─ Staff
```

Header: org switcher (if multi-builder), branding mark, user menu, sign out.

### 7.4 Auth / Portal Unavailable

Minimal chrome: brand, message, optional Owner App CTA, Sign out, link to public home.

### 7.5 Navigation isolation

| Rule | Statement |
|---|---|
| NAV-01 | Super Admin and Builder never share one menu tree |
| NAV-02 | Owner Flutter navigation is out of this repository |
| NAV-03 | Menu items hide when permission missing (not only disable) |

---

## 8. Entity Relationship Diagram

Logical ERD (no physical SQL types):

```
┌──────────────┐       ┌─────────────────┐       ┌──────────────────┐
│  auth.users  │───1:*─│  user_profiles  │       │ subscription_    │
└──────┬───────┘       └────────┬────────┘       │ plans            │
       │                        │                └────────▲─────────┘
       │                        │                         │
       │                   default_org                    │
       │                        │                         │
       │         ┌──────────────▼──────────────┐          │
       │         │       organizations         │          │
       │         │  type: personal | builder   │          │
       │         └───────┬──────────┬──────────┘          │
       │                 │          │                     │
       │        ┌────────┘          └────────┐            │
       │        │                            │            │
       │  ┌─────▼──────────┐      ┌──────────▼─────────┐  │
       │  │ personal       │      │ builder_profiles   │  │
       │  │ (Flutter only) │      │ organization_      │  │
       │  └────────────────┘      │ branding           │  │
       │                          │ organization_      │  │
       │                          │ subscriptions ─────┘  │
       │                          └──────────┬────────────┘
       │                                     │
┌──────▼──────────────┐                      │
│ organization_       │                      │
│ members             │                      │
│ role: owner |       │              ┌───────▼────────┐
│ builder-org-* | …   │              │ projects       │
└─────────────────────┘              └───────┬────────┘
                                             │
                                     ┌───────▼────────┐
                                     │ units          │
                                     └───────┬────────┘
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                 ┌────────▼───────┐  ┌───────▼────────┐ ┌──────▼──────────┐
                 │ owner_         │  │ owner_         │ │ handover_       │
                 │ assignments    │  │ invitations    │ │ documents       │
                 └────────────────┘  └────────────────┘ └─────────────────┘

┌────────────────────────┐     ┌─────────────────────┐
│ platform_operator_     │     │ global_announcements│
│ profiles (system roles)│     │ audit_logs          │
└────────────────────────┘     │ support_access_     │
                               │ grants              │
                               └─────────────────────┘
```

### 8.1 Key integrity rules

| Rule | Statement |
|---|---|
| ERD-01 | `organization_members.role = owner` only valid for `organizations.type = personal` |
| ERD-02 | `builder-org-*` roles only valid for `organizations.type = builder` |
| ERD-03 | Unit belongs to exactly one project; project to exactly one builder org |
| ERD-04 | Owner invitation references unit + invitee email/identity; acceptance resolves in Flutter |

---

## 9. API Contract List

Design-level contracts (Supabase table/RPC/Edge — implementation TBD). No payloads generated here beyond purpose.

### 9.1 Auth & session

| Contract | Method style | Purpose |
|---|---|---|
| Sign in | Auth | Email/password session |
| Sign out | Auth | End session |
| Restore session | Auth | Bootstrap |
| Password reset request/update | Auth | Recovery |

### 9.2 Profile & organization context

| Contract | Purpose |
|---|---|
| Get current user profile | Load profile after auth |
| List my memberships | Org id, type, role, status |
| Get organization summary | Name, type, branding refs |
| Set active organization | Builder multi-org sessions |

### 9.3 Super Admin

| Contract | Purpose |
|---|---|
| List builder applications / builders | Manage builders |
| Approve / reject builder onboarding | Decide |
| List organizations (admin) | Tenancy oversight |
| CRUD subscription plans | Plans catalog |
| Assign / update org subscription | Commercial |
| CRUD global announcements | Announcements |
| Get platform analytics summary | Analytics |
| Query audit logs | Audit |
| Manage platform operators | IAM |
| Create / revoke support access grant | Support Access |

### 9.4 Builder Portal

| Contract | Purpose |
|---|---|
| Get / update company profile | Company profile |
| Get / update branding | Branding |
| CRUD projects | Projects |
| CRUD units | Units |
| CRUD owner prospects / assignments | Owners |
| Create / resend / cancel owner invitations | Type B invites |
| CRUD / upload handover documents | Documents |
| List builder notifications / mark read | Notifications |
| Invite / list / update builder staff | Type A staff |
| Get own subscription (read) | Billing visibility |

### 9.5 Explicit non-contracts (Web)

| Contract | Status |
|---|---|
| Owner expense / loan / tenant financial APIs | **Not exposed to Web clients** |
| Owner Web dashboard APIs | **Do not exist** |

### 9.6 Error contract (authz)

| Case | Client UX |
|---|---|
| Not authenticated | Login |
| Authenticated, no Web portal | Portal Unavailable friendly page |
| Authenticated, wrong portal shell | Redirect to correct portal or Portal Unavailable |
| Missing resource permission | In-portal denied / toast — not the friendly “Builder/Admin only” page |

---

## 10. Future Expansion Strategy

### 10.1 Allowed expansions (with new design approval)

| Expansion | Notes |
|---|---|
| Partner / marketplace org types | New type + roles; do not overload `personal` / `builder` |
| Support Access UX polish | Remains Super Admin–owned |
| SSO / MFA | Auth Context only; org/RBAC unchanged (NG-006) |
| Richer platform analytics | Still no ID-13 |
| Nx multi-app split | Per NG-008 when approved |

### 10.2 Disallowed without explicit product decision

| Expansion | Reason |
|---|---|
| Owner Web Portal | Contradicts P1 |
| Builder ERP (CRM/HR/payroll/…) | A-001 permanent exclusion |
| Super Admin standing access to owner financials | A-008 absolute rule |
| Reinterpreting `owner` as Builder role | Breaks Flutter Schema V2 |

### 10.3 Expansion principles

1. **Additive schema** — extend, don’t rewrite Personal Workspaces.  
2. **Client isolation** — Flutter and Angular share identity, not authorization shortcuts.  
3. **Design before SQL** — each new entity gets a blueprint approval before migrations.  
4. **Feature flags** — gate Builder backend domains until APIs exist (existing NG practice).

### 10.4 Suggested post-P2 implementation sequence (after approval)

| Step | Work | Depends on |
|---|---|---|
| P2 approval | Sign-off | — |
| P3 | Claims / membership resolution design + friendly Portal Unavailable UX | P2 |
| P4 | Additive database design → SQL (separate phase) | P2 §3 |
| P5 | Wire Angular auth routing to P2 flow | P3 |
| P6 | Super Admin builder + subscription APIs | P4 |
| P7 | Builder profile/branding/projects/units/owners/docs | P4–P5 |

---

## 11. Traceability to P1

| P1 section | P2 extension |
|---|---|
| §1 Platform Roles | §2 Authz + §4 RBAC |
| §2 Organization Types | §3 Database + §8 ERD |
| §3 Builder Organization Model | §3 entities + §9 Builder APIs |
| §4 Super Admin Model | §9 Super Admin APIs + §7 nav |
| §5 Invitation Flow | Type A/B in §3 + §4 + §9 |
| §6 Authentication Flow | §1 Authentication Blueprint (friendly UX refined) |
| §7 Route Flow | §6 Route Map |
| §8 Portal Architecture | §5 Modules + §7 Navigation |
| §9 RBAC Matrix | §4 expanded action matrix |
| §10–12 Migration / BC / Roadmap | §3 additive model + §10 Future Expansion |

---

## 12. Approval Checklist

- [ ] Authentication flow accepted (including friendly Portal Unavailable copy)
- [ ] Authorization layers accepted
- [ ] Additive database entity list accepted (no SQL yet)
- [ ] RBAC matrix accepted
- [ ] Angular module architecture accepted
- [ ] Route map accepted (no Owner Web routes)
- [ ] Navigation structure accepted
- [ ] ERD relationships accepted
- [ ] API contract list accepted
- [ ] Future expansion boundaries accepted
- [ ] Authorization to proceed to next implementation-design phase (P3) granted

---

## 13. Summary

P2 specifies how Public Website, Super Admin, and Builder Portal authenticate, authorize, and map to an **additive** Schema V2 data model — while Owners remain on Flutter. Post-login routing sends Super Admins and Builders to their dashboards; every other role sees a **friendly portal-unavailable** message, not generic Access Denied. This document is **design-only** and awaits approval before any code, SQL, or Flutter work.
