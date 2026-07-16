---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P4 |
| **Document Name** | Platform Database Evolution (Schema V2 Extension) |
| **Project** | MyPropertyAsset Web Platform |
| **Phase** | P4 – Platform Database Evolution |
| **Version** | 1.0 |
| **Status** | Draft — awaiting approval |
| **Prepared For** | `feature/platform-foundation` |
| **Repository** | `my-property-asset-web` only |
| **Created Date** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Source of Truth** | P1, P2, P3 (approved design chain — **not redesigned here**) |
| **Dependencies** | [`P1_Platform_Foundation.md`](P1_Platform_Foundation.md), [`P2_Platform_Database_Authentication_Blueprint.md`](P2_Platform_Database_Authentication_Blueprint.md), [`P3_Builder_Business_Domain.md`](P3_Builder_Business_Domain.md) |
| **Approval Status** | **Pending approval — design only; no SQL / Flutter / Angular until approved** |

### Explicit non-goals

| Forbidden | Status |
|---|---|
| SQL / migrations scripts | Not generated |
| Flutter repository changes | Not made |
| Angular implementation | Not made |
| Redesign of P1 / P2 / P3 | Forbidden |
| Duplicating Flutter `properties` as a second owner property store | Forbidden |

---

# P4 — Platform Database Evolution (Schema V2 Extension)

## 0. Purpose and Binding Rules

P4 designs **how existing Schema V2 evolves** into the Builder Platform database.

| Binding rule | Statement |
|---|---|
| R-ADD-01 | **Everything is additive** — extend Schema V2; do not replace Flutter’s running model |
| R-ADD-02 | **Flutter must not break** — Personal Workspaces, role `owner`, and owner data remain valid |
| R-ADD-03 | **Do not redesign** existing Flutter tables unless absolutely necessary (prefer new columns or new tables) |
| R-ADD-04 | **Do not duplicate Property** — Flutter `properties` becomes active only after successful handover |
| R-ADD-05 | Builder inventory lives in **Builder hierarchy** (`projects` → `buildings` → `units`) until handover links to `properties` |

### 0.1 Current Schema V2 baseline (preserve)

| Existing table (conceptual) | Role today | Evolution stance |
|---|---|---|
| `organizations` | Personal Workspaces (and future types) | **Reuse + extend** (type discriminator) |
| `organization_members` | Membership + role `owner` | **Reuse + extend** (builder roles) |
| `organization_settings` | Org preferences | **Reuse**; builder-specific settings may add keys or companion table |
| `user_profiles` | Profile / defaults | **Reuse + minimal extend** |
| `properties` | Owner-managed properties (Flutter) | **Flutter primary**; activate via handover link only |
| `loans` | Owner financial | **Flutter-only** |
| `expenses` | Owner financial | **Flutter-only** |
| `tenants` | Owner tenancy | **Flutter-only** |
| `documents` | Existing document store | **Shared carefully** — see §2 / §3 |
| `notifications` | Existing notifications | **Shared carefully** — typed audiences |
| `reports` | Owner/reporting artifacts | **Flutter-only** unless proven shared later |

---

## 1. Complete Platform ER Diagram

Logical ERD (no physical SQL types). Shows Platform → Builder → Project hierarchy → Owner Assignment → Flutter Property.

```
                         ┌─────────────────────────┐
                         │      auth.users         │
                         └───────────┬─────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌────────────────┐    ┌─────────────────┐    ┌──────────────────────┐
     │ user_profiles  │    │ platform_       │    │ organization_members │
     │ (extend)       │    │ operators       │    │ (extend roles)       │
     └───────┬────────┘    └─────────────────┘    └──────────┬───────────┘
             │                                               │
             │ default_organization_id                       │
             ▼                                               ▼
     ┌───────────────────────────────────────────────────────────────┐
     │                      organizations (extend)                     │
     │           type: personal | builder | (future…)                  │
     └───────────────┬───────────────────────────┬─────────────────────┘
                     │                           │
        PERSONAL     │                           │  BUILDER
        (Flutter)    │                           │
                     │                           ▼
                     │              ┌────────────────────────────┐
                     │              │ builder_companies          │
                     │              │ organization_branding      │
                     │              │ builder_staff_invitations  │
                     │              │ organization_subscriptions │──► subscription_plans
                     │              │ builder_activity_logs      │
                     │              └─────────────┬──────────────┘
                     │                            │
                     │                            ▼
                     │              ┌────────────────────────────┐
                     │              │ builder_projects           │
                     │              └─────────────┬──────────────┘
                     │                            │
                     │                            ▼
                     │              ┌────────────────────────────┐
                     │              │ builder_buildings (opt)    │
                     │              └─────────────┬──────────────┘
                     │                            │
                     │                            ▼
                     │              ┌────────────────────────────┐
                     │              │ builder_units              │
                     │              │  └── handover_status       │
                     │              └──────┬──────────┬──────────┘
                     │                    │          │
                     │                    │          ├──────────────┐
                     │                    │          │              │
                     │                    ▼          ▼              ▼
                     │         ┌──────────────┐ ┌────────────┐ ┌──────────────────┐
                     │         │ owner_       │ │ unit_      │ │ document_        │
                     │         │ assignments  │ │ handovers  │ │ templates        │
                     │         └──────┬───────┘ │ (process)  │ │ unit_handover_   │
                     │                │         └────────────┘ │ documents        │
                     │                ▼                        └────────┬─────────┘
                     │         ┌──────────────┐                         │
                     │         │ owner_       │                         │
                     │         │ invitations  │                         │ on accept
                     │         └──────┬───────┘                         │ copy/link
                     │                │                                 │
                     │   accept (Flutter)                               │
                     │                │                                 │
                     │                ▼                                 ▼
                     │         ┌──────────────────────────────────────────────┐
                     └────────►│ properties  (Flutter)                        │
                               │  active only after successful handover       │
                               │  linked from unit_handover / assignment      │
                               └───────┬──────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
              ┌──────────┐      ┌──────────┐      ┌──────────────┐
              │ loans    │      │ expenses │      │ tenants      │
              │ (Flutter)│      │ (Flutter)│      │ (Flutter)    │
              └──────────┘      └──────────┘      └──────────────┘

     Platform-only (examples):
     subscription_plans · global_announcements · audit_logs · support_access_grants
     announcement_campaigns (builder-scoped) · reports (Flutter-only)
```

### 1.1 Critical non-duplication rule

```
builder_units  ──(handover accept)──►  properties
                     │
                     └── ONE Flutter property row per successful handover
                         (create or activate — never a parallel “web property” table)
```

---

## 2. Shared Table Matrix

| Table | Classification | Flutter | Builder Portal | Super Admin | Notes |
|---|---|---|---|---|---|
| `auth.users` | **Shared** | Y | Y | Y | Identity only |
| `user_profiles` | **Shared** | Y | Y | Y | Additive columns only |
| `organizations` | **Shared** | Y (personal) | Y (builder) | Y | Discriminate by `type` |
| `organization_members` | **Shared** | Y (`owner`) | Y (`builder-org-*`) | Y | Role vocabulary extended |
| `organization_settings` | **Shared** | Y | Y | limited | Prefer additive keys |
| `properties` | **Shared link / Flutter-owned** | **Primary** | Read post-link (history) | Support only | Active after handover |
| `documents` | **Shared (typed)** | Owner docs | Handover docs may land here post-transfer **or** via link table | Support | See §3 strategy |
| `notifications` | **Shared (typed)** | Owner | Builder staff | Platform | Audience + type required |
| `loans` | **Flutter-only** | Y | **No** | **No** | Restricted-Financial |
| `expenses` | **Flutter-only** | Y | **No** | **No** | Restricted-Financial |
| `tenants` | **Flutter-only** | Y | **No** | **No** | Owner domain |
| `reports` | **Flutter-only** | Y | **No** | **No** | Unless later platform reports (separate) |

### 2.1 Classification legend

| Class | Meaning |
|---|---|
| **Flutter-only** | Web clients must not read/write |
| **Shared** | Same table; RLS/policies enforce audience |
| **Builder-only** | New tables; Flutter ignores |
| **Platform-only** | Super Admin / platform operators |

---

## 3. New Tables

All names are **logical**. Physical naming can match existing conventions at SQL phase.

### 3.1 Platform-only

| Logical table | Purpose |
|---|---|
| `platform_operators` | Super Admin / Support identity flags or profile beyond org membership |
| `subscription_plans` | Plan catalog |
| `global_announcements` | Platform-wide announcements |
| `audit_logs` | Security/admin audit trail |
| `support_access_grants` | Time-boxed Support Access into a Builder org |

### 3.2 Builder-only (core domain)

| Logical table | Maps to P3 entity |
|---|---|
| `builder_companies` | Builder Company / company profile (1:1 with builder `organizations`) |
| `organization_branding` | Builder Branding / White Label |
| `builder_staff_invitations` | Builder Staff invites (Type A) |
| `builder_projects` | Projects |
| `builder_buildings` | Buildings (optional) |
| `builder_units` | Units |
| `owner_assignments` | Owner Assignment |
| `owner_invitations` | Owner Invitations (Type B) |
| `document_templates` | Document Templates |
| `unit_handovers` | Unit Handover process / status |
| `unit_handover_documents` | Docs attached to a handover (pre-transfer) |
| `announcement_campaigns` | Announcement / Promotion campaigns |
| `announcement_deliveries` | Per-recipient delivery state (optional MVP+) |
| `organization_subscriptions` | Builder ↔ plan |
| `builder_activity_logs` | Builder operational activity (non-security) |

### 3.3 Bridge / link tables (handover → Flutter)

| Logical table | Purpose |
|---|---|
| `unit_property_links` | Maps `builder_units.id` → `properties.id` after successful handover (**no property duplication**) |

> If product prefers, `unit_handovers.property_id` nullable FK can serve the same role instead of a separate link table — choose one at SQL phase; P4 requires **exactly one** linkage mechanism.

---

## 4. Existing Tables to Extend

Prefer **nullable new columns** with safe defaults so Flutter ignores unknown fields.

### 4.1 `organizations`

| Additive concept | Why |
|---|---|
| `organization_type` (`personal` \| `builder` \| …) | Discriminate Personal Workspace vs Builder Org (P1) |
| Optional status (`active` \| `suspended` \| `pending_approval`) | Builder onboarding |
| Optional commercial pointers | Soft link to subscription |

**Default for all existing rows:** `organization_type = personal` (backward compatible).

### 4.2 `organization_members`

| Additive concept | Why |
|---|---|
| Extended role vocabulary | Allow `builder-org-owner`, `builder-org-admin`, `builder-org-member` alongside `owner` |
| Optional `status` for invited/suspended staff | Staff lifecycle |
| Optional `invited_by` | Auditability |

**Constraint (logical):** role `owner` only with `organization_type = personal`; `builder-org-*` only with `type = builder`.

### 4.3 `user_profiles`

| Additive concept | Why |
|---|---|
| Keep `default_organization_id` | Flutter Personal Workspace default unchanged |
| Optional last-used builder org (Web) | Builder multi-org sessions — **must not overwrite** Flutter default personal org |
| Optional platform flags | Only if not using `platform_operators` |

### 4.4 `organization_settings`

| Additive concept | Why |
|---|---|
| Additional setting keys for builder prefs | Avoid forced redesign |
| Or companion `builder_companies` holds company fields | Preferred for company profile richness |

### 4.5 `properties`

| Additive concept | Why |
|---|---|
| Optional `source_unit_id` / link via `unit_property_links` | Traceability to builder unit |
| Optional `handover_completed_at` | Activate semantics |
| Optional `origin_builder_organization_id` | Provenance |

**Do not** require these columns for pre-existing owner-created properties; leave null.

### 4.6 `documents` / `notifications`

| Additive concept | Why |
|---|---|
| Stronger `audience` / `source` / `organization_type` typing | Prevent builder/owner bleed |
| Optional FK to handover / campaign | Traceability |

Only if existing shape cannot express types without ambiguity; otherwise use new builder document tables until transfer, then write into `documents` for owner.

### 4.7 Tables that should **not** be redesigned

`loans`, `expenses`, `tenants`, `reports` — **no structural change** for Builder Platform.

---

## 5. Relationship Diagram

### 5.1 Platform hierarchy (business → data)

```
Platform
  │
  ├── platform_operators / audit / plans / global announcements
  │
  └── Builder Organization  (organizations.type = builder)
        │
        ├── builder_companies
        ├── organization_branding
        ├── organization_members (builder-org-*)
        ├── builder_staff_invitations
        ├── organization_subscriptions
        ├── announcement_campaigns
        ├── builder_activity_logs
        │
        └── builder_projects
              │
              ├── builder_buildings (optional)
              │     └── builder_units
              └── builder_units (direct)
                    │
                    ├── unit_handovers
                    ├── unit_handover_documents / templates use
                    ├── owner_assignments
                    │     └── owner_invitations
                    │
                    └── [on accept] → properties (Flutter)
                                      └── loans / expenses / tenants / owner docs
```

### 5.2 Handover linkage (no duplicate property)

```
owner_invitations (pending)
        │ accept in Flutter
        ▼
unit_handovers.status = handover_complete
        │
        ├── CREATE or ACTIVATE properties row in owner's Personal Workspace
        ├── WRITE unit_property_links (unit_id ↔ property_id)
        ├── TRANSFER or COPY handover docs into owner-accessible documents
        └── Builder retains unit + historical handover rows (read)
```

### 5.3 Cardinality

| From | To | Cardinality |
|---|---|---|
| Builder org | Projects | 1 : n |
| Project | Buildings | 1 : 0..n |
| Project | Units (direct) | 1 : 0..n |
| Building | Units | 1 : n |
| Unit | Active owner assignment | 1 : 0..1 |
| Assignment | Invitations | 1 : n (history); 0..1 active |
| Unit | Property (post-handover) | 1 : 0..1 |
| Property | Loans/Expenses/Tenants | 1 : n (Flutter) |

---

## 6. Migration Stages

Ordered, additive stages. Each stage is releasable without breaking Flutter.

| Stage | Name | Adds / changes | Flutter impact |
|---|---|---|---|
| **Stage 1** | Platform entities | `platform_operators`, `audit_logs`, `support_access_grants`; extend `organizations` with `type` default `personal` | None if defaulted |
| **Stage 2** | Builder entities | `builder_companies`, staff invitations; extend `organization_members` roles; create builder orgs | None (new type) |
| **Stage 3** | Project hierarchy | `builder_projects`, `builder_buildings`, `builder_units` | None |
| **Stage 4** | Owner assignment | `owner_assignments`, `owner_invitations` | None until invites accepted |
| **Stage 5** | Document handover | `document_templates`, `unit_handovers`, `unit_handover_documents`, `unit_property_links`; additive `properties` provenance cols | Accept path writes `properties` |
| **Stage 6** | Branding | `organization_branding` | None (optional display later) |
| **Stage 7** | Subscriptions | `subscription_plans`, `organization_subscriptions` | None |
| **Stage 8** | Announcements | `announcement_campaigns`, deliveries; typed `notifications` if needed | Owner may receive new notification types |
| **Stage 9** | Future tenant integration | Reserved — no Builder ERP; tenant remains Flutter / future app | Out of P4 scope detail |

### 6.1 Stage dependencies

```
1 → 2 → 3 → 4 → 5
         ↘ 6
         ↘ 7
              5 → 8
                   → 9 (future)
```

Stages 6–7 may parallelize after Stage 2. Stage 8 should follow Stage 5 if announcements target handed-over/assigned owners.

---

## 7. Rollback Strategy

### 7.1 Principles

| Principle | Statement |
|---|---|
| Expand-contract | Add nullable columns / new tables first; never drop Flutter columns in same release |
| Feature flags | Gate Builder Portal features until stage verified |
| Soft delete | Prefer status flags over hard deletes of handover-linked rows |
| Link isolation | Rollback of Builder tables must not delete existing `properties` / financial rows |

### 7.2 Per-stage rollback

| Stage | Rollback approach |
|---|---|
| 1 | Remove platform-only tables; keep `organizations.type` defaulted (harmless) or leave column |
| 2–3 | Drop/disable builder-only tables; Flutter unchanged |
| 4 | Cancel invitations; no property rows created yet |
| 5 | If handover already created properties: **do not delete** owner properties on rollback; only disable new handovers |
| 6–8 | Drop builder-only tables; stop emitting new notification types |

### 7.3 Forbidden rollback actions

- Truncating `properties`, `loans`, `expenses`, `tenants`  
- Changing existing Personal Workspace members’ role away from `owner`  
- Requiring Flutter app update to continue basic owner flows  

---

## 8. Data Ownership Rules

| Data | Owner | Writer | Reader exceptions |
|---|---|---|---|
| Personal Workspace org | Owning user | Flutter | Super Admin: metadata only |
| Builder Organization | Builder org | Builder Portal / Super Admin (provision) | Support Access |
| Projects / Buildings / Units | Builder org | Builder roles | Support Access |
| Owner assignment / invitation | Builder org | Builder roles | Invitee sees invite payload |
| Unit handover package (pre-accept) | Builder org | Builder | — |
| `properties` post-handover | **Owner Personal Workspace** | Flutter (+ system on accept) | Builder: linked unit history only |
| Loans / Expenses / Tenants | Owner | Flutter | **Nobody else** |
| Subscription plans | Platform | Super Admin | Builders read own |
| Audit logs | Platform | System | Super Admin |
| Branding | Builder org | Builder Owner (+ policy) | Public invite surfaces as allowed |

### 8.1 Ownership transfer moment

Ownership of the **property record and owner-facing documents** transfers at **invitation acceptance / handover_complete** — not at assignment, not at document upload (P3 / A-002).

---

## 9. Multi-tenant Strategy

### 9.1 Tenant kinds

| Tenant kind | `organizations.type` | Client |
|---|---|---|
| Personal Workspace | `personal` | Flutter Owner App |
| Builder Organization | `builder` | Angular Builder Portal |
| Platform operators | N/A or logical `platform` | Super Admin Portal |

### 9.2 Isolation rules

| Rule | Statement |
|---|---|
| MT-01 | Every Builder query is scoped by `organization_id` of type `builder` |
| MT-02 | Personal Workspace data never appears in Builder list APIs |
| MT-03 | Builder A cannot read Builder B |
| MT-04 | RLS (future SQL phase) must encode MT-01–03; clients are not trusted |
| MT-05 | One `auth.users` may hold both a personal membership and builder memberships; contexts do not merge permissions |
| MT-06 | `user_profiles.default_organization_id` remains the Flutter personal default; Web active builder org is separate session state |

### 9.3 Coexistence model

```
User U
├── membership: Org P (type=personal, role=owner)     → Flutter
└── membership: Org B (type=builder, role=builder-org-admin) → Web Builder Portal
```

No conversion of P into B. No deletion of P when B is created.

---

## 10. Future Scalability

| Concern | Strategy |
|---|---|
| Many units per project | Paginated APIs; hierarchical filters (project → building → unit) |
| Document volume | Storage buckets + metadata tables; templates to reduce duplication |
| Announcement fan-out | Campaign + delivery rows; async workers later |
| Multi-builder staff | Membership table already n:n user↔org |
| Analytics | Materialized snapshots (platform-only); never scan owner financial tables |
| New org types | Additive `organization_type` values — do not overload `personal`/`builder` |
| Tenant mobile app | Stage 9 placeholder; does not alter Builder hierarchy |

---

## 11. Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Flutter breaks due to non-null new columns without defaults | High | Medium | Nullable + defaults; expand-contract |
| Accidental reuse of `properties` as builder inventory | High | Medium | Enforce builder_units until handover; code reviews + docs |
| Role `owner` granted on builder org | High | Low–Med | Logical constraints + validation |
| Builder reads `loans`/`expenses` | Critical | Low | No Web contracts; RLS deny |
| Duplicate property rows on re-accept | High | Medium | Unique `unit_property_links`; idempotent accept |
| Migration Stage 5 partial failure | Medium | Medium | Transactional accept; rollback forbids deleting owner data |
| `documents` table ambiguity | Medium | Medium | Prefer builder handover docs tables until transfer |
| Announcements spamming owners | Low–Med | Med | Audience rules; opt-out later |
| Subscription limits not enforced | Med | Med | Enforce in Stage 7+ with flags |
| Over-scoped “redesign” of Schema V2 | High | Med | P4 rule R-ADD-03; reject non-additive PRs |

---

## 12. Builder Domain → Table Map (P3 alignment)

| P3 / prompt entity | P4 table strategy |
|---|---|
| Builder Company | `builder_companies` (+ `organizations` type=builder) |
| Builder Branding | `organization_branding` |
| Builder Staff | `organization_members` + `builder_staff_invitations` |
| Projects | `builder_projects` |
| Buildings | `builder_buildings` |
| Units | `builder_units` |
| Owner Invitations | `owner_invitations` |
| Owner Assignment | `owner_assignments` |
| Document Templates | `document_templates` |
| Unit Handover | `unit_handovers` + `unit_handover_documents` + link to `properties` |
| Announcement Campaigns | `announcement_campaigns` (+ deliveries) |
| Subscriptions | `subscription_plans` + `organization_subscriptions` |
| Activity Logs | `builder_activity_logs` |
| Audit Logs | `audit_logs` (platform) |

---

## 13. Backward Compatibility Summary

| Question | Answer |
|---|---|
| Why existing Flutter users continue working | Additive tables/columns; existing personal orgs default `type=personal`; no required Flutter release for Stages 1–4 |
| Why Personal Workspace remains valid | Still the owner tenancy; role `owner` unchanged |
| Why no existing owner data changes | `loans` / `expenses` / `tenants` / existing `properties` untouched; new handovers only create/link new property rows |
| How Builder Orgs coexist | Same `organizations` table, different `type`; separate memberships; separate clients |

---

## 14. Approval Checklist

- [ ] ER diagram accepted (incl. no duplicate Property)  
- [ ] Shared table matrix accepted  
- [ ] New tables list accepted  
- [ ] Existing table extensions accepted (additive only)  
- [ ] Relationship / hierarchy accepted  
- [ ] Migration stages 1–9 accepted  
- [ ] Rollback strategy accepted  
- [ ] Data ownership rules accepted  
- [ ] Multi-tenant strategy accepted  
- [ ] Scalability + risk analysis accepted  
- [ ] Authorization to proceed to SQL migration design (separate phase) granted  

---

## 15. Summary

P4 evolves Schema V2 **additively**: reuse `organizations` / members / profiles; keep Flutter financial tables untouched; introduce Builder hierarchy tables; and activate a single Flutter `properties` row only after successful handover via an explicit unit↔property link — **never a duplicated property store**. Migration is staged and rollback-safe for owner data. **No SQL or code in this phase — await approval.**
