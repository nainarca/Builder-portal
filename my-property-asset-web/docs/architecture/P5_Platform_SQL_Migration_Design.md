---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P5 |
| **Document Name** | Platform SQL Migration Design |
| **Project** | MyPropertyAsset Web Platform |
| **Phase** | P5 – Platform SQL Migration Design |
| **Version** | 1.0 |
| **Status** | Draft — awaiting approval |
| **Prepared For** | `feature/platform-database` |
| **Repository** | `my-property-asset-web` only |
| **Created Date** | 2026-07-16 |
| **Last Updated** | 2026-07-16 |
| **Source of Truth** | P1, P2, P3, P4 — **FINAL; not redesigned here** |
| **Dependencies** | [`P1`](P1_Platform_Foundation.md), [`P2`](P2_Platform_Database_Authentication_Blueprint.md), [`P3`](P3_Builder_Business_Domain.md), [`P4`](P4_Platform_Database_Evolution.md) |
| **Approval Status** | **Pending approval — no SQL generation until approved** |

### Explicit non-goals

| Forbidden | Status |
|---|---|
| SQL / `.sql` migration scripts | **Not generated** |
| Flutter modifications | Not made |
| Angular modifications | Not made |
| Redesign of P1–P4 | Forbidden |

---

# P5 — Platform SQL Migration Design

## 0. Purpose

P5 defines the **SQL migration plan** to evolve Schema V2 into the Builder Platform database: migration files, execution order, dependencies, and rollback — **without writing SQL**.

### 0.1 Binding rules (from P4)

| Rule | Statement |
|---|---|
| Additive only | New tables / nullable columns with safe defaults |
| Flutter unbroken | Personal Workspace + role `owner` + financial tables unchanged in behavior |
| No property duplication | `properties` activates only after handover |
| Untouched Flutter-only | `loans`, `expenses`, `tenants`, `financial_history`, `reports` — **no redesign** |

### 0.2 Proposed migration file naming (convention only)

When SQL is later authorized, use ordered Supabase-style names:

```
YYYYMMDDHHMMSS_p5_b01_platform_foundation.sql
YYYYMMDDHHMMSS_p5_b02_builder_organizations.sql
…
YYYYMMDDHHMMSS_p5_b12_audit_logs.sql
```

One primary file per batch (split only if a batch exceeds operational size limits).

### 0.3 Existing Schema V2 baseline (do not break)

`organizations` · `organization_members` · `organization_settings` · `user_profiles` · `properties` · `loans` · `expenses` · `tenants` · `financial_history` · `notifications` · `documents` · `reports`

---

## 1. Migration Master Plan

### 1.1 Goal

Apply twelve additive batches so Builder Platform entities exist alongside Personal Workspaces, with safe rollback and zero required Flutter app changes for Batches 1–7 and 9–12. Batch 8 (handover accept → `properties`) requires a **coordinated accept API** (may be Edge Function / backend) — not a Flutter UI redesign.

### 1.2 Execution principles

| Principle | Detail |
|---|---|
| Expand-contract | Add first; never drop Flutter columns in the same release |
| Default-safe | New columns nullable or defaulted so existing rows remain valid |
| Batch atomicity | Each batch is one deployable migration unit |
| Feature flags | Angular features gated until required batches applied |
| Verify before next | Checklist (§9) green before advancing |

### 1.3 Out of scope for migrations

- Rewriting Personal Workspace data  
- Migrating owner financial history into Builder tables  
- Creating Owner Web schemas  
- Generating seed production owner data  

---

## 2. Batch List

### Batch 1 — Platform Foundation

| Field | Specification |
|---|---|
| **Purpose** | Introduce organization type discrimination and platform operator primitives without changing Personal Workspace behavior |
| **Tables Created** | `platform_operators` (optional if roles live only on members); placeholder for platform config if needed |
| **Tables Modified** | `organizations` — add `organization_type` (default `personal`); optional `status`; `user_profiles` — optional Web-only last-builder-org pointer (**must not replace** Flutter `default_organization_id`) |
| **Indexes** | Index on `organizations(organization_type)`; unique/check as designed later |
| **Foreign Keys** | `platform_operators.user_id` → `auth.users` |
| **Triggers** | Optional: prevent changing `organization_type` from `personal` → `builder` in place (prefer create new org) |
| **Functions** | Optional helper: `is_personal_org(id)`, `is_builder_org(id)` |
| **Views** | Optional `v_personal_organizations`, `v_builder_organizations` |
| **RLS** | No tightening that blocks Flutter personal org access; platform tables Super Admin only |
| **Seed Data** | Backfill `organization_type = 'personal'` for all existing orgs |
| **Dependencies** | None (first batch) |
| **Suggested file** | `*_p5_b01_platform_foundation.sql` |

---

### Batch 2 — Builder Organizations

| Field | Specification |
|---|---|
| **Purpose** | Enable Builder Organization tenancy + company profile + staff invitation skeleton |
| **Tables Created** | `builder_companies` (1:1 builder org); `builder_staff_invitations` |
| **Tables Modified** | `organization_members` — allow builder role values; optional `status`, `invited_by`; `organization_settings` — no forced redesign |
| **Indexes** | Unique `(organization_id)` on `builder_companies`; indexes on staff invitation email/token |
| **Foreign Keys** | `builder_companies.organization_id` → `organizations`; staff invite → org + inviter user |
| **Triggers** | Enforce: `builder_companies` only when `organization_type = builder`; member role `owner` only on `personal` |
| **Functions** | Validation helpers for role↔type compatibility |
| **Views** | Optional builder org directory view for Super Admin |
| **RLS** | Builder members see own builder org; Flutter personal policies unchanged |
| **Seed Data** | None required in production; QA may seed one demo builder |
| **Dependencies** | Batch 1 |
| **Suggested file** | `*_p5_b02_builder_organizations.sql` |

---

### Batch 3 — Projects

| Field | Specification |
|---|---|
| **Purpose** | Builder project container under Builder Organization |
| **Tables Created** | `builder_projects` |
| **Tables Modified** | None required on Schema V2 core |
| **Indexes** | `(organization_id, status)`, `(organization_id, name)` |
| **Foreign Keys** | `organization_id` → `organizations` (builder only via check/trigger) |
| **Triggers** | Reject insert if org not `builder` |
| **Functions** | Optional slug generator |
| **Views** | None required |
| **RLS** | Org-scoped to builder membership |
| **Seed Data** | Optional QA |
| **Dependencies** | Batch 2 |
| **Suggested file** | `*_p5_b03_projects.sql` |

---

### Batch 4 — Buildings

| Field | Specification |
|---|---|
| **Purpose** | Optional building/tower level under project |
| **Tables Created** | `builder_buildings` |
| **Tables Modified** | None |
| **Indexes** | `(project_id, name)` |
| **Foreign Keys** | `project_id` → `builder_projects` |
| **Triggers** | Cascade rules soft-delete aware |
| **Functions** | None required |
| **Views** | None required |
| **RLS** | Inherit project org scope |
| **Seed Data** | Optional QA |
| **Dependencies** | Batch 3 |
| **Suggested file** | `*_p5_b04_buildings.sql` |

---

### Batch 5 — Units

| Field | Specification |
|---|---|
| **Purpose** | Handoverable inventory units (direct under project or under building) |
| **Tables Created** | `builder_units` |
| **Tables Modified** | None on Flutter tables |
| **Indexes** | `(project_id)`, `(building_id)`, unique unit code per project |
| **Foreign Keys** | `project_id` → `builder_projects`; optional `building_id` → `builder_buildings` |
| **Triggers** | Ensure building belongs to same project when set |
| **Functions** | Optional unit code normalization |
| **Views** | Optional unit inventory view |
| **RLS** | Builder org scope |
| **Seed Data** | Optional QA |
| **Dependencies** | Batch 3; Batch 4 if buildings used (buildings nullable FK → Batch 4 still recommended before production use) |
| **Suggested file** | `*_p5_b05_units.sql` |

---

### Batch 6 — Owner Assignment

| Field | Specification |
|---|---|
| **Purpose** | Link prospect owner identity to a unit (pre-invite / pre-accept) |
| **Tables Created** | `owner_assignments` |
| **Tables Modified** | None |
| **Indexes** | Unique active assignment per unit (partial unique index) |
| **Foreign Keys** | `unit_id` → `builder_units`; optional `prospect_user_id` → `auth.users` |
| **Triggers** | Enforce single active assignment (P3 BW-01) |
| **Functions** | `activate_assignment` / status transitions (design only) |
| **Views** | None required |
| **RLS** | Builder org via unit→project→org |
| **Seed Data** | None |
| **Dependencies** | Batch 5 |
| **Suggested file** | `*_p5_b06_owner_assignment.sql` |

---

### Batch 7 — Invitations

| Field | Specification |
|---|---|
| **Purpose** | Type B owner invitations to Flutter acceptance |
| **Tables Created** | `owner_invitations` |
| **Tables Modified** | None required (`notifications` typing deferred to Batch 11 if needed) |
| **Indexes** | Token unique; `(assignment_id, status)`; email lookup |
| **Foreign Keys** | `assignment_id` → `owner_assignments`; optional invited user |
| **Triggers** | Expire previous active invite on resend; block invite without assignment |
| **Functions** | Token mint/verify helpers (or Edge Function later) |
| **Views** | None required |
| **RLS** | Builder manage; invitee redeem path via security definer function later |
| **Seed Data** | None |
| **Dependencies** | Batch 6 |
| **Suggested file** | `*_p5_b07_invitations.sql` |

---

### Batch 8 — Document Handover

| Field | Specification |
|---|---|
| **Purpose** | Templates, handover process, pre-transfer docs, link to Flutter `properties` without duplication |
| **Tables Created** | `document_templates`; `unit_handovers`; `unit_handover_documents`; `unit_property_links` |
| **Tables Modified** | `properties` — **additive nullable** provenance columns only (`source_unit_id` or rely solely on link table; `handover_completed_at`; `origin_builder_organization_id`); optional typing columns on `documents` **only if required** |
| **Indexes** | Unique `(unit_id)` on links post-handover; handover status indexes |
| **Foreign Keys** | Handover → unit; documents → handover; `unit_property_links.property_id` → `properties`; `unit_id` → `builder_units` |
| **Triggers** | Idempotent link creation; **forbid** deleting `properties` when unlinking |
| **Functions** | `complete_unit_handover(...)` (design) — creates/activates property + link + doc transfer |
| **Views** | Optional handover progress view |
| **RLS** | Builder sees pre-handover docs; owner sees post-transfer docs via existing Flutter policies; builders **never** gain `loans`/`expenses` |
| **Seed Data** | Optional document templates for QA |
| **Dependencies** | Batches 5–7; existing `properties` table |
| **Suggested file** | `*_p5_b08_document_handover.sql` |
| **Irreversibility note** | Once live handovers create `properties`, schema rollback must **not** delete those rows |

---

### Batch 9 — White Label

| Field | Specification |
|---|---|
| **Purpose** | Organization branding tokens |
| **Tables Created** | `organization_branding` |
| **Tables Modified** | None required |
| **Indexes** | Unique `organization_id` |
| **Foreign Keys** | → `organizations` (builder) |
| **Triggers** | Builder-type only |
| **Functions** | None required |
| **Views** | None required |
| **RLS** | Builder owner/admin write; read for portal |
| **Seed Data** | None |
| **Dependencies** | Batch 2 |
| **Suggested file** | `*_p5_b09_white_label.sql` |

---

### Batch 10 — Subscriptions

| Field | Specification |
|---|---|
| **Purpose** | Plan catalog + builder subscription entitlement |
| **Tables Created** | `subscription_plans`; `organization_subscriptions` |
| **Tables Modified** | None required |
| **Indexes** | Active subscription per org (partial unique) |
| **Foreign Keys** | Plan ↔ subscription ↔ organization |
| **Triggers** | One active subscription per builder org |
| **Functions** | Optional entitlement check helper |
| **Views** | Optional usage vs plan view (later) |
| **RLS** | Super Admin write plans; builder read own subscription |
| **Seed Data** | Seed default plans (Free/Starter/Pro) in non-prod; controlled prod seed |
| **Dependencies** | Batch 2 |
| **Suggested file** | `*_p5_b10_subscriptions.sql` |

---

### Batch 11 — Announcements

| Field | Specification |
|---|---|
| **Purpose** | Announcement / promotion campaigns + delivery tracking |
| **Tables Created** | `announcement_campaigns`; `announcement_deliveries` (optional MVP+) |
| **Tables Modified** | `notifications` — additive `audience` / `source` / `campaign_id` **only if** existing shape cannot isolate builder vs owner safely |
| **Indexes** | `(organization_id, status)`, campaign delivery indexes |
| **Foreign Keys** | Campaign → builder org; optional → project; delivery → user/notification |
| **Triggers** | None critical |
| **Functions** | Fan-out job hook (later) |
| **Views** | None required |
| **RLS** | Builder manage campaigns; owners receive via Flutter notification policies |
| **Seed Data** | None |
| **Dependencies** | Batch 2; ideally Batch 5+ if scoped to projects/units; Batch 8 if targeting handed-over owners |
| **Suggested file** | `*_p5_b11_announcements.sql` |

---

### Batch 12 — Audit Logs

| Field | Specification |
|---|---|
| **Purpose** | Platform audit + builder activity + support access grants |
| **Tables Created** | `audit_logs`; `builder_activity_logs`; `support_access_grants`; `global_announcements` (if not earlier) |
| **Tables Modified** | None on Flutter financial tables |
| **Indexes** | `(actor_user_id, created_at)`; `(organization_id, created_at)` |
| **Foreign Keys** | Soft references to actors/orgs (prefer stable UUIDs; restrict deletes) |
| **Triggers** | Immutable audit insert-only (no update/delete for normal roles) |
| **Functions** | `write_audit_event(...)` |
| **Views** | Super Admin audit browse view |
| **RLS** | Super Admin read audit; builders read own activity logs only |
| **Seed Data** | None |
| **Dependencies** | Batch 1 (platform), Batch 2 (org scope for activity/support) |
| **Suggested file** | `*_p5_b12_audit_logs.sql` |

> **Note:** P4 placed some audit objects in Stage 1. P5 follows the requested **Batch 12** placement for audit/activity/support while Batch 1 remains foundation discrimination. If operational preference is to create `audit_logs` earlier, Batch 12 may be split — do not redesign P4 semantics, only file timing.

---

## 3. Dependency Diagram

### 3.1 Batch dependency order

```
Batch 1  Platform Foundation
   │
   ▼
Batch 2  Builder Organizations
   │
   ├───────────────┬────────────────┬─────────────────┐
   ▼               ▼                ▼                 ▼
Batch 3         Batch 9          Batch 10          Batch 12*
Projects        White Label      Subscriptions     Audit Logs
   │
   ▼
Batch 4  Buildings
   │
   ▼
Batch 5  Units
   │
   ▼
Batch 6  Owner Assignment
   │
   ▼
Batch 7  Invitations
   │
   ▼
Batch 8  Document Handover  ←── links to existing properties
   │
   ▼
Batch 11 Announcements (preferred after 5/8 when targeting units/owners)
```

\*Batch 12 can run after Batch 2 (parallel with 9/10); shown after foundation for clarity.

### 3.2 Table-level chain (core handover path)

```
organizations
      ↓
builder_companies
      ↓
builder_projects
      ↓
builder_buildings          (optional)
      ↓
builder_units
      ↓
owner_assignments
      ↓
owner_invitations
      ↓
unit_handovers + unit_handover_documents
      ↓
unit_property_links → properties (Flutter)
      ↓
loans / expenses / tenants / financial_history  (unchanged, Flutter-only)
```

### 3.3 Exact apply order (recommended production)

1. B01 → 2. B02 → 3. B03 → 4. B04 → 5. B05 → 6. B06 → 7. B07 → 8. B08 → 9. B09 → 10. B10 → 11. B11 → 12. B12  

**Allowed parallelization after B02:** B09 ∥ B10 ∥ B12 (B12 after B01 minimum).  
**B11:** after B02 minimum; after B08 recommended for handed-over audiences.

---

## 4. Rollback Matrix

| Batch | Rollback method | Impact | Irreversible? |
|---|---|---|---|
| B01 | Drop new platform tables; keep `organization_type` column (safe) or leave unused | Low | Column add is soft-irreversible in expand-contract (dropping column later needs care) |
| B02 | Drop `builder_companies`, staff invites; remove builder orgs only if unused | Medium if live builders exist | **Live builder orgs with members = high cost** |
| B03 | Drop `builder_projects` (cascade children if empty) | Medium | High if projects in use |
| B04 | Drop `builder_buildings` | Low–Med | Med if units reference buildings |
| B05 | Drop `builder_units` | Medium | High if assignments exist |
| B06 | Drop `owner_assignments` | Medium | Med |
| B07 | Drop `owner_invitations` / expire tokens | Low–Med | Low if none accepted |
| B08 | Drop handover tables **only if no links**; **never delete** linked `properties` | **High** | **Yes — after successful handovers create owner properties** |
| B09 | Drop `organization_branding` | Low | Low |
| B10 | Drop subscriptions/plans | Medium commercially | Med if billed |
| B11 | Drop campaigns; stop new notification types | Low–Med | Low |
| B12 | Drop audit/activity (lose history) | Medium compliance | **Audit history loss is operationally irreversible** |

### 4.1 Irreversible migrations (identify clearly)

| Item | Why irreversible in practice |
|---|---|
| B08 completed handovers | Owner `properties` (and downstream financials) must survive |
| B12 audit trail deletion | Compliance / forensics |
| Production builder orgs with real staff (B02+) | Business data loss |

---

## 5. Compatibility Matrix

| Concern | Compatible? | Explanation |
|---|---|---|
| Flutter Owner App continues | **Yes** | Additive schema; financial tables untouched; personal orgs default `type=personal` |
| Personal Workspace continues | **Yes** | Existing rows backfilled `personal`; role `owner` unchanged |
| Builder Orgs coexist | **Yes** | Same `organizations` table, different `type`; separate memberships |
| `financial_history` | **Yes** | Not modified |
| `loans` / `expenses` / `tenants` | **Yes** | Flutter-only; no Builder RLS grants |
| `properties` pre-existing | **Yes** | New columns nullable; no mandatory rewrite |
| Web login for owners | Per P2 UX | Portal Unavailable — not a DB break |

### 5.1 Backward compatibility narrative

1. **Flutter continues working** because Batches 1–7, 9–12 introduce tables/columns Flutter does not query; defaults keep existing reads valid.  
2. **Personal Workspace remains valid** because every existing organization is typed `personal` and membership role `owner` stays legal only there.  
3. **Builder Organizations coexist safely** as additional rows with `type=builder` and `builder-org-*` members — never by converting personal orgs in place.

---

## 6. Risk Matrix

### High Risk

| Risk | Batch | Mitigation |
|---|---|---|
| Non-null column without default breaks Flutter inserts | B01, B08 | Nullable + defaults; expand-contract |
| Using `properties` as builder inventory | B05–B08 | Enforce `builder_units`; code review |
| Handover creates duplicate properties | B08 | Unique unit↔property link; idempotent function |
| Builder policies accidentally read financial tables | Any | Explicit deny; no grants; tests |
| Rollback deletes owner properties | B08 | Rollback runbook forbids it |

### Medium Risk

| Risk | Batch | Mitigation |
|---|---|---|
| Role `owner` on builder org | B02 | Check constraints / triggers |
| Partial unique “one active assignment” wrong | B06–B07 | Partial indexes + tests |
| `documents`/`notifications` typing breaks old clients | B08, B11 | Additive columns only; old rows null-ok |
| Subscription seed wrong in prod | B10 | Env-specific seeds |
| Announcement fan-out load | B11 | Async later; start send-only |

### Low Risk

| Risk | Batch | Mitigation |
|---|---|---|
| Branding table unused | B09 | Feature flag |
| Extra views/helpers | B01+ | Optional |
| Activity log volume | B12 | Retention policy later |

---

## 7. Estimated Implementation Order

| Order | Work item | Notes |
|---|---|---|
| 1 | Approve P5 | Gate |
| 2 | Author B01 SQL + QA apply | Independent DB |
| 3 | B02 SQL + constraint tests | Independent of apps if unused |
| 4 | B03–B05 hierarchy | Angular Builder modules can follow |
| 5 | B06–B07 assignment/invite | Needs invite redeem API design |
| 6 | B08 handover + property link | **Coordinate accept path** |
| 7 | B09 branding | Angular Branding module |
| 8 | B10 subscriptions | Super Admin + Builder billing UI |
| 9 | B11 announcements | After owners exist |
| 10 | B12 audit hardening | Super Admin operations |

---

## 8. Implementation Timeline (indicative)

| Week | Focus | Batches | App coupling |
|---|---|---|---|
| W1 | Foundation + Builder org | B01–B02 | DB only / Super Admin provision |
| W2 | Project hierarchy | B03–B05 | Angular Projects/Units can start against flags |
| W3 | Assignment + invitations | B06–B07 | Angular Owners; invite API |
| W4 | Handover + property link | B08 | Accept API; Flutter **no UI change** if deep link already generic |
| W5 | Branding + subscriptions | B09–B10 | Angular modules |
| W6 | Announcements + audit | B11–B12 | Angular + notification types |
| W7 | Hardening / Go-Live checklist | All | Verification §9–§10 |

Timeline assumes one experienced DB engineer + parallel Angular work after B02. Adjust to team velocity.

---

## 9. Verification Checklist

### Per-batch verification

- [ ] Migration applies cleanly on empty QA copy of Schema V2  
- [ ] Migration applies cleanly on DB **with existing personal orgs + owner data**  
- [ ] Flutter smoke: login, list properties, expense/loan/tenant read/write  
- [ ] `organization_type` backfill = `personal` for legacy rows  
- [ ] RLS: builder cannot `SELECT` loans/expenses/tenants/financial_history  
- [ ] RLS: personal owner cannot read other builders’ projects/units  
- [ ] Rollback rehearsal documented for that batch  

### Cross-batch verification

- [ ] Create builder org without touching personal orgs  
- [ ] Project → building → unit hierarchy integrity  
- [ ] One active assignment / invitation enforced  
- [ ] Handover accept idempotent; single `properties` link  
- [ ] Pre-existing properties remain queryable by Flutter unchanged  

### Automation (recommended)

- [ ] CI migration up on ephemeral DB  
- [ ] Policy tests for financial isolation  
- [ ] Contract tests for handover function  

---

## 10. Go / No-Go Checklist

### Go only if all are true

- [ ] P1–P5 approved  
- [ ] B01–B02 applied on QA with Flutter regression **pass**  
- [ ] Financial table isolation tests **pass**  
- [ ] Handover rollback runbook reviewed (no property deletion)  
- [ ] Feature flags ready for Angular Builder modules  
- [ ] Backup / PITR confirmed on target Supabase project  
- [ ] On-call owner named for migration window  

### No-Go if any are true

- [ ] Any migration requires non-null backfill that Flutter does not send  
- [ ] Any policy grants Builder roles access to Restricted-Financial tables  
- [ ] Handover path would create a second property store  
- [ ] Cannot restore from backup within RTO  
- [ ] Flutter regression suite failing on QA post-migration  

---

## 11. Implementation Readiness (Task 7)

| Batch | Apply independently? | Needs app deploy? | Needs Flutter changes? | Needs Angular changes? |
|---|---|---|---|---|
| B01 | **Yes** | No | **No** | No |
| B02 | **Yes** | Super Admin provision helpful | **No** | Optional (builders admin) |
| B03 | Yes (after B02) | To use UI | **No** | Yes (Projects) to utilize |
| B04 | Yes (after B03) | To use UI | **No** | Yes (Buildings) |
| B05 | Yes (after B03/4) | To use UI | **No** | Yes (Units) |
| B06 | Yes (after B05) | To use UI | **No** | Yes (Owners) |
| B07 | Yes (after B06) | Invite send UI + redeem API | **No\*** | Yes (Invitations) |
| B08 | After B07 | **Yes — accept/handover API** | **No\*** (accept via existing app/deep link if API compatible) | Yes (Documents/Handover) |
| B09 | After B02 | To use UI | **No** | Yes (Branding) |
| B10 | After B02 | To use UI | **No** | Yes (Subscriptions) |
| B11 | After B02 (/B08 preferred) | To use UI | **Maybe** if new notification types need client rendering | Yes (Announcements) |
| B12 | After B01/B02 | Super Admin ops UI | **No** | Yes (Audit/Support) |

\*Flutter **app store release** not required if invitation/handover APIs remain compatible with current Flutter invitation handling. If Flutter cannot redeem new invite tokens, a **minimal Flutter change** becomes a dependency — treat as No-Go for B07/B08 production until confirmed.

---

## 12. Traceability to P4 Stages

| P4 Stage | P5 Batches |
|---|---|
| Stage 1 Platform entities | B01 (+ parts of B12) |
| Stage 2 Builder entities | B02 |
| Stage 3 Project hierarchy | B03–B05 |
| Stage 4 Owner assignment | B06–B07 |
| Stage 5 Document handover | B08 |
| Stage 6 Branding | B09 |
| Stage 7 Subscriptions | B10 |
| Stage 8 Announcements | B11 |
| Stage 9 Future tenant | Deferred — not in B01–B12 SQL plan |

---

## 13. Approval Checklist

- [ ] Migration master plan accepted  
- [ ] All 12 batches specified and accepted  
- [ ] Dependency / apply order accepted  
- [ ] Rollback matrix + irreversibles accepted  
- [ ] Compatibility matrix accepted  
- [ ] Risk matrix accepted  
- [ ] Implementation order + timeline accepted  
- [ ] Verification + Go/No-Go checklists accepted  
- [ ] **Authorization to generate SQL** (next phase) granted  

---

## 14. Summary

P5 defines twelve additive migration batches that extend Schema V2 into the Builder Platform **without breaking Flutter**. Core chain: `organizations` → builder company → projects → buildings → units → assignments → invitations → handover → **link to existing `properties`**. Batches 9–10–12 can parallelize after Builder orgs exist. **No SQL is generated in this phase.** Await approval before authoring migration files.
