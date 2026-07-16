---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P3 |
| **Document Name** | Builder Business Domain Design |
| **Project** | MyPropertyAsset Web Platform |
| **Phase** | P3 – Builder Business Domain Design |
| **Version** | 1.0 |
| **Status** | Draft — awaiting approval |
| **Prepared For** | `feature/platform-foundation` |
| **Repository** | `my-property-asset-web` only |
| **Created Date** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Source of Truth** | [`P1_Platform_Foundation.md`](P1_Platform_Foundation.md), [`P2_Platform_Database_Authentication_Blueprint.md`](P2_Platform_Database_Authentication_Blueprint.md) |
| **Dependencies** | P1, P2, A-001 §12 (Builder Portal philosophy), A-002 |
| **Approval Status** | **Pending approval — design only; no SQL / Angular / Flutter until approved** |

### Explicit non-goals

| Forbidden | Status |
|---|---|
| SQL / migrations | Not generated |
| Angular implementation | Not generated |
| Flutter changes | Not made |
| Redesign of P1 or P2 | Forbidden |
| Builder ERP capabilities | Permanently excluded |

---

# P3 — Builder Business Domain Design

## 0. Purpose

P3 defines the **Builder business domain** before any database tables are created. The database must follow this business model.

P3 does **not** redesign P1 (platform foundation) or P2 (auth / data / RBAC blueprints). It specializes them into a complete Builder-to-Owner handover domain.

### 0.1 Product identity

> **Builder-to-Owner Digital Property Platform**

The Builder Portal exists **only** to manage the property handover process. It is **not** a Builder ERP.

### 0.2 Permanent exclusions (A-001 §12 / P1)

Do **not** include now or later without a new explicit product decision:

| Excluded | Why |
|---|---|
| CRM | Lead/pipeline tooling is ERP |
| Sales / booking / pricing pipelines | ERP |
| Marketing automation suites | ERP (project announcements/promotions below are **narrow**, not a marketing product) |
| HR / payroll / employee management systems | ERP |
| Accounting / procurement / inventory | ERP |
| Society / RWA management | Post-handover community product — out of Builder Portal scope |

### 0.3 Binding continuity from P1 / P2

| Decision | Remains |
|---|---|
| Owners never use this Web portal | Flutter only |
| Schema V2 Personal Workspace + role `owner` | Flutter |
| Builder roles `builder-org-*` | Web Builder Portal |
| Super Admin creates/approves builders | Super Admin Portal |
| Restricted-Financial never visible to builders | Absolute |

---

## 1. Builder Business Model

### 1.1 Domain statement

A **Builder Organization** prepares residential (or similar) inventory, attaches handover documents, assigns a future property owner, invites that owner into the Flutter Owner App, and tracks handover progress until the owner can manage the property independently.

After acceptance, **day-to-day property life belongs entirely to the Owner (Flutter)**. The Builder retains historical visibility of handover artifacts for their own organization — not owner financials.

### 1.2 Core business objects

| Object | Definition |
|---|---|
| **Builder Organization** | Legal/business tenancy for the builder company |
| **Company Profile** | Public/operational identity of the builder (name, contacts, address, registration details) |
| **Branding (White Label)** | Visual identity applied to builder-facing surfaces and owner-facing branded touchpoints where product policy allows |
| **Project** | A development / scheme under the builder (e.g., a residential complex) |
| **Building** | Optional physical structure within a project (tower/block). Used when a project has multiple buildings; may be omitted for single-building or plot projects |
| **Unit** | Sellable / handoverable inventory item (apartment, villa, plot, etc.) |
| **Handover Document** | File or package attached to project/building/unit for transfer to the owner |
| **Owner Prospect / Assignment** | Builder-side record linking a person to a unit before/during invitation |
| **Owner Invitation** | Secure invite for the owner to join Flutter and claim the unit |
| **Handover Progress** | Lifecycle state from preparation → invitation → acceptance → complete |
| **Announcement** | Builder → assigned owners (or project audience) operational message |
| **Promotion** | Builder → invited/prospect owners message about a **new project** (lightweight; not a marketing suite) |
| **Builder Staff** | Members of the Builder Organization (`builder-org-owner/admin/member`) |
| **Subscription** | Commercial plan governing Builder Portal capacity/features |

### 1.3 Object hierarchy

```
Builder Organization
├── Company Profile
├── Branding
├── Subscription
├── Staff[]
├── Announcements[] / Promotions[]
└── Projects[]
      ├── Buildings[]          (optional level)
      │     └── Units[]
      └── Units[]              (directly under project when no buildings)
            ├── Documents[]
            ├── Owner Assignment (0..1 active)
            ├── Invitations[]
            └── Handover Progress
```

### 1.4 Builder responsibilities (complete in-scope list)

The Builder **can**:

1. Maintain company profile  
2. Configure White Label branding  
3. Create projects  
4. Create buildings (if applicable)  
5. Create units  
6. Upload handover documents  
7. Assign owners  
8. Send owner invitations  
9. Send project announcements  
10. Send new project promotions  
11. View handover progress  
12. Manage builder staff  
13. Manage subscription  

**Nothing else.**

### 1.5 Owner responsibilities (Flutter only — not Web)

After handover, the Owner uses **only** the Flutter app for:

| Owner feature | Surface |
|---|---|
| Property Management | Flutter |
| Loan | Flutter |
| Expense | Flutter |
| Tenant | Flutter |
| Documents (owner-side) | Flutter |
| Reports | Flutter |
| Dashboard | Flutter |
| Notifications | Flutter |

Do **not** move these into the web portal.

### 1.6 Value exchange

```
Builder prepares inventory + documents + invitation
        ↓
Owner accepts in Flutter
        ↓
Property + handover documents appear in Owner Personal Workspace
        ↓
Owner manages property life (financial, tenants, ops) in Flutter
Builder retains handover history only (no owner financials)
```

---

## 2. Business Workflow

### 2.1 Master workflow (required sequence)

```
Super Admin
      │
      ▼
Create / Approve Builder
      │
      ▼
Builder Registration (activation)
      │
      ▼
Builder Dashboard
      │
      ▼
Create Project
      │
      ▼
Create Building          ← optional (skip if N/A)
      │
      ▼
Create Unit
      │
      ▼
Upload Documents
      │
      ▼
Assign Owner
      │
      ▼
Send Invitation
      │
      ▼
Owner installs Flutter App
      │
      ▼
Owner accepts invitation
      │
      ▼
Property appears automatically (Owner Personal Workspace)
      │
      ▼
Owner manages property (Flutter)
```

### 2.2 Stage definitions

| Stage | Actor | Outcome |
|---|---|---|
| S0 Provision | Super Admin | Builder Organization exists / approved |
| S1 Activate | Builder Owner | Can sign in to Builder Portal |
| S2 Structure | Builder | Project (± Building) + Units exist |
| S3 Document | Builder | Required handover docs attached |
| S4 Assign | Builder | Owner linked to unit |
| S5 Invite | Builder | Invitation sent |
| S6 Accept | Owner (Flutter) | Identity + Personal Workspace linked to unit |
| S7 Live | Owner (Flutter) | Property manageable; Builder sees handover complete |

### 2.3 Parallel supporting workflows

| Workflow | When | Notes |
|---|---|---|
| Staff management | Any time after S1 | Type A invitations (P1/P2) |
| Branding setup | Early after S1 | White Label journey (§9) |
| Subscription management | Continuous | Subscription journey (§8) |
| Announcements | After owners exist / are invited | Notification journey (§7) |
| Promotions | When launching a new project | Lightweight; not CRM |

### 2.4 Business rules

| ID | Rule |
|---|---|
| BW-01 | A unit has at most one **active** owner assignment / invitation at a time |
| BW-02 | Invitation acceptance happens **only** in Flutter |
| BW-03 | Property “appearing automatically” means Owner Personal Workspace gains the unit + transferred handover docs — not a Web owner shell |
| BW-04 | Buildings are optional; units may hang directly under a project |
| BW-05 | Documents should be attachable at unit level (required for handover); project/building-level docs are optional shared packs |
| BW-06 | Builder never gains Loan/Expense/Tenant access |
| BW-07 | Super Admin does not create projects/units for builders in the normal path (support exception only via Support Access, P2) |

---

## 3. Module Definitions

### 3.1 Builder Portal modules

| Module | Purpose | Primary objects |
|---|---|---|
| **Dashboard** | Handover-oriented overview: counts, progress, attention items | Aggregates |
| **Company** | Maintain company profile | Company Profile |
| **Branding** | Configure White Label tokens/logo/colors | Branding |
| **Projects** | Create and manage projects | Project |
| **Buildings** | Create buildings under a project when applicable | Building |
| **Units** | Create and manage units | Unit |
| **Owners** | Assign owners to units; manage prospects | Owner Assignment |
| **Invitations** | Send/track owner invitations | Owner Invitation |
| **Documents** | Upload/organize handover documents | Handover Document |
| **Announcements** | Project/operational announcements to relevant owners | Announcement |
| **Promotions** | New project promotions to prospects/invited audiences | Promotion |
| **Handover Progress** | View status across units/projects | Progress states |
| **Subscriptions** | View plan, limits, upgrade/request changes | Subscription |
| **Settings** | Staff, preferences, security basics for the org | Staff, prefs |
| **Support** | Help / contact platform support | Tickets or contact (lightweight) |

> **Note:** “Promotions” is a **handover-platform messaging** capability for new projects — not a marketing automation, ad, or CRM module.

### 3.2 Module → responsibility mapping

| Builder responsibility | Module(s) |
|---|---|
| Maintain company profile | Company |
| Configure White Label | Branding |
| Create projects | Projects |
| Create buildings | Buildings |
| Create units | Units |
| Upload handover documents | Documents |
| Assign owners | Owners |
| Send owner invitations | Invitations |
| Send project announcements | Announcements |
| Send new project promotions | Promotions |
| View handover progress | Dashboard + Handover Progress |
| Manage builder staff | Settings (Staff) |
| Manage subscription | Subscriptions |

### 3.3 Super Admin modules touching Builder domain

| Module | Builder-domain role |
|---|---|
| Builders | Create / approve / suspend Builder Organizations |
| Organizations | Tenancy oversight |
| Billing / Subscriptions | Plan catalog + assign plans |
| Branding (platform) | Platform policy / templates (not builder day-to-day) |
| Operations | Announcements (global), analytics |
| Support Access | Exceptional Builder data access |
| IAM | Platform operators only |

### 3.4 Flutter Owner modules (unchanged ownership)

Dashboard · Property · Loan · Expense · Tenant · Documents · Reports · Notifications — **all Flutter**.

---

## 4. Module Boundaries

### 4.1 What belongs in Builder Portal

| In | Out |
|---|---|
| Company profile & branding | Owner loan/expense/tenant |
| Projects / buildings / units | Sales CRM / lead scoring |
| Handover documents (pre-transfer) | Builder corporate accounting |
| Owner assign + invite | Society/RWA management |
| Handover progress tracking | HR / payroll / employee ERP |
| Staff invite for builder org | Full marketing cloud |
| Builder announcements & new-project promotions | Owner reports/dashboard |
| Subscription view/manage (builder side) | Cross-builder marketplace admin (Super Admin) |

### 4.2 What belongs in Flutter Owner App

| In | Never in Builder Portal |
|---|---|
| Accept invitation | — |
| Property appears & is managed | Property financial ops |
| Loan / Expense / Tenant | — |
| Owner documents library (post-handover) | — |
| Owner dashboard / reports / notifications | — |

### 4.3 What belongs in Super Admin

| In | Not in Builder Portal |
|---|---|
| Create/approve builders | Creating arbitrary owner financial records |
| Platform subscription catalog | Day-to-day unit document upload (normal path) |
| Global announcements | Builder staff hiring ERP |
| Platform analytics | — |
| Support Access grants | Standing access to all builder data |

### 4.4 Boundary diagram

```
┌────────────────────┐     invite/handover      ┌────────────────────┐
│  Builder Portal    │ ───────────────────────► │  Flutter Owner App │
│  (Angular Web)     │                          │  (mobile)          │
│  structure+docs+   │ ◄── status only ───────  │  property life     │
│  invite+progress   │     (no financials)      │  loan/expense/etc  │
└─────────▲──────────┘                          └────────────────────┘
          │ approve / plans / support
┌─────────┴──────────┐
│  Super Admin       │
│  (Angular Web)     │
└────────────────────┘
```

### 4.5 Shared vs exclusive data (business view)

| Data | Builder | Owner Flutter | Super Admin |
|---|---|---|---|
| Unit master (identity, address meta) | Create/edit pre-handover | Read as owned property | Oversight / support |
| Handover documents | Upload/manage | Receive post-accept | Support Access only |
| Invitation state | Manage | Accept | Audit/support |
| Expense / loan / tenant | **No** | **Yes** | **No** |
| Subscription plan | Read/manage own | N/A | Catalog + assign |

---

## 5. User Journey

### 5.1 Super Admin — onboard a builder

1. Sign in to Super Admin Portal.  
2. Create or review Builder registration.  
3. Approve Builder Organization.  
4. Assign subscription plan (if required).  
5. Builder Owner receives access / completes activation.  
6. Admin can later suspend, support-access, or adjust plan.

### 5.2 Builder Owner / Admin — operate the portal

1. Sign in → Builder Dashboard.  
2. Complete Company + Branding (first-run).  
3. Invite staff as needed.  
4. Create Project → optional Buildings → Units.  
5. Upload documents.  
6. Assign owner → send invitation.  
7. Monitor handover progress.  
8. Send announcements / promotions when appropriate.  
9. Manage subscription.

### 5.3 Builder Staff — contribute

1. Sign in with staff role.  
2. Work on assigned projects/units/documents within permission limits.  
3. May send invitations if permitted (P2 RBAC).  
4. Cannot manage irreversible org settings / subscription (per role).

### 5.4 Owner — receive property (Flutter)

1. Receives invitation (email/SMS/deep link — channel TBD in implementation).  
2. Installs / opens Flutter Owner App.  
3. Accepts invitation.  
4. Property appears in Personal Workspace.  
5. Manages property using Owner modules (not Web).

### 5.5 Non-audience Web user

Per P2: friendly portal-unavailable message — not part of Builder domain success path.

---

## 6. Handover Journey

### 6.1 Definition

**Handover** is the controlled transfer of unit identity + documents from Builder Organization context into the Owner’s Personal Workspace, culminating in the owner’s ability to manage the property in Flutter.

### 6.2 States (business)

| State | Meaning |
|---|---|
| `draft` | Unit exists; not ready |
| `preparing` | Docs/structure in progress |
| `ready_to_assign` | Docs sufficient; awaiting owner |
| `owner_assigned` | Prospect linked; not yet invited or invite pending |
| `invitation_sent` | Invite outstanding |
| `invitation_accepted` | Owner accepted in Flutter |
| `handover_complete` | Property live for owner; builder retains history |
| `invitation_expired` / `declined` | Needs reassignment |

Exact enum names are business labels for a later data phase — not SQL.

### 6.3 Happy path

```
preparing → ready_to_assign → owner_assigned → invitation_sent
        → invitation_accepted → handover_complete
```

### 6.4 Exception paths

| Event | Business response |
|---|---|
| Invite expires | Builder resends or reassigns owner |
| Owner declines | Clear assignment; allow new owner |
| Docs incomplete at invite | Block invite or warn (product rule: prefer block required docs) |
| Wrong unit assigned | Builder corrects before accept; after accept requires controlled correction process (future) |

### 6.5 What transfers at acceptance

| Transfers to Owner | Does not transfer |
|---|---|
| Unit as owned property | Builder staff accounts |
| Handover document package | Other units in the project |
| Builder identity metadata (who handed over) | Other owners’ data |
| — | Builder subscription |

### 6.6 Builder post-handover rights

- Read historical handover record and documents they uploaded.  
- No edit of owner’s financial/tenant life.  
- Optional: limited “re-share document” flows in later versions (see §10).

---

## 7. Notification Journey

### 7.1 Channels (business, not implementation)

| Audience | Examples | Channel owner |
|---|---|---|
| Builder staff | Invite accepted, docs missing, subscription expiring | Builder Portal notifications |
| Owner (Flutter) | Invitation received, handover complete, builder announcement | Flutter notifications |
| Super Admin | Builder approved, support events | Super Admin operations |

### 7.2 Announcement journey

```
Builder creates Announcement
      │  scope: project / building / unit set / assigned owners
      ▼
System delivers to eligible Owners (Flutter)
      │
      ▼
Owner reads in Flutter Notifications
Builder sees delivery/read summary (MVP may be send-only)
```

### 7.3 Promotion journey (new project)

```
Builder creates Promotion for a new Project
      │  audience: prospects / previously invited owners / opted-in list (policy)
      ▼
Message delivered (Flutter / email as available)
      │
      ▼
Owner may view project highlight — still cannot use Web Builder tools as owner
```

### 7.4 Rules

| ID | Rule |
|---|---|
| N-01 | Announcements/promotions are **not** a CRM campaign builder |
| N-02 | Owners never receive builder-internal staff notifications |
| N-03 | Builders never receive owner expense/loan alerts |
| N-04 | Global platform announcements are Super Admin’s domain |

---

## 8. Subscription Journey

### 8.1 Purpose

Commercial entitlement for Builder Portal usage (seats, projects, storage, branding tier, etc. — exact limits defined in commercial design later).

### 8.2 Journey

```
Super Admin defines Subscription Plans
      │
      ▼
Plan assigned at Builder approval (or trial)
      │
      ▼
Builder uses Portal within plan limits
      │
      ├── Approaching limit → Builder notified
      ├── Upgrade request → Super Admin / billing flow
      └── Lapse / suspend → Portal restricted (read-only or lock — policy TBD)
```

### 8.3 Builder vs Super Admin duties

| Actor | Can |
|---|---|
| Super Admin | Create plans, assign/change, suspend for non-payment |
| Builder Owner | View current plan, usage, request upgrade |
| Builder Staff | Typically read-only or none |

### 8.4 Non-goals

- Full accounting ERP inside Builder Portal  
- Owner-facing billing for property (Flutter/other products)

---

## 9. White Label Journey

### 9.1 Purpose

Allow a Builder Organization to present branded experiences (portal chrome, emails, invitation touchpoints) under their identity, within platform policy.

### 9.2 Journey

```
Builder opens Branding module
      │
      ▼
Upload logo / set colors / short name
      │
      ▼
Preview
      │
      ▼
Publish branding
      │
      ▼
Applied to Builder Portal shell
      + invitation / announcement surfaces (as policy allows)
```

### 9.3 Super Admin role

- Platform default theme  
- Policy limits (required disclaimers, blocked impersonation of MyPropertyAsset mark)  
- Optional template library  

### 9.4 Rules

| ID | Rule |
|---|---|
| WL-01 | Branding is org-scoped — never leaks across builders |
| WL-02 | Owner Flutter may show builder mark on handover content; full Flutter white-label depth is a later decision |
| WL-03 | Branding is not a website CMS / marketing site builder |

---

## 10. Future Expansion

### 10.1 Version roadmap

| Horizon | Scope |
|---|---|
| **MVP** | Super Admin create/approve builder · Builder dashboard · Company · Projects · Units · Documents · Assign owner · Invitations · Handover progress · Basic staff · Subscription view · Friendly auth routing (P2) |
| **Version 1.1** | Buildings (optional hierarchy) · Branding publish · Announcements · Invitation resend/expire UX · Usage limits enforcement · Support contact module |
| **Version 2.0** | Promotions · Richer handover progress analytics · Document versioning · Multi-building portfolio UX · Deeper white-label on owner-facing messages · Support Access UX polish |
| **Future** | Advanced promotion audiences · Controlled post-handover document re-share · Partner org type · SSO/MFA (auth platform) · Marketplace features — **only with new product approval** |

### 10.2 Explicitly not on the roadmap (without new ADR)

CRM · Sales ERP · HR/Payroll · Accounting · Society management · Owner Web Portal · Builder access to owner Restricted-Financial data.

### 10.3 Expansion principles

1. Every new module must map to **handover** or **builder tenancy** — not ERP.  
2. Owner life-cycle features stay in Flutter.  
3. Database follows this business model (P3 → later data phase).  
4. P1/P2 auth and portal boundaries remain binding.

---

## 11. Traceability

| This document | Extends |
|---|---|
| §1 Business Model | P1 §3 Builder Organization Model |
| §2 Workflow | P1 §5 invitations + P2 auth routing outcomes |
| §3–4 Modules / Boundaries | P2 §5–7 portals/routes/nav |
| §5–9 Journeys | A-002 business flow + P1/P2 |
| §10 Roadmap | P1 §12 / P2 §10 — specialized to Builder domain |

---

## 12. Approval Checklist

- [ ] Builder business model accepted (handover-only, not ERP)  
- [ ] Master workflow accepted (incl. optional Buildings)  
- [ ] Module list accepted  
- [ ] Module boundaries accepted (Builder / Flutter / Super Admin)  
- [ ] User / Handover / Notification / Subscription / White Label journeys accepted  
- [ ] MVP → 1.1 → 2.0 → Future roadmap accepted  
- [ ] Authorization granted to proceed to next phase (data model / tables design — still no SQL until that phase is approved)

---

## 13. Summary

P3 defines the Builder Portal as a **lightweight Builder-to-Owner digital handover product**: company, branding, projects, optional buildings, units, documents, owner assign/invite, progress, announcements/promotions, staff, and subscription — and nothing that belongs in a Builder ERP or in the Flutter Owner App. Owners accept invitations and manage property life exclusively in Flutter. This is **documentation only**; await approval before database or implementation work.
