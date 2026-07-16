---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P6A |
| **Document Name** | Batch 1A — Platform Foundation SQL Implementation |
| **Phase** | P6A – Platform Foundation SQL Implementation |
| **Batch** | **1A only** |
| **Status** | Implemented — awaiting apply/approval to proceed |
| **Created** | 2026-07-16 |
| **Source of Truth** | P1–P5 (FINAL) |

---

# P6A — Batch 1A Implementation Notes

## 1. What was implemented

| Item | Detail |
|---|---|
| Migration | `supabase/migrations/20260716100000_p6a_b01a_platform_foundation.sql` |
| Verification | `supabase/migrations/verify/20260716100000_p6a_b01a_platform_foundation_verify.sql` |

### In scope (done)

1. **`organizations.organization_type`** — additive `text`, default `'personal'`
2. **`organizations.status`** — additive `text`, default `'active'`
3. **Backfill** — existing rows → `organization_type = 'personal'`, `status = 'active'`
4. **CHECK constraints** — type ∈ (`personal`,`builder`); status ∈ (`active`,`pending_approval`,`suspended`)
5. **Indexes** — `idx_organizations_organization_type`, `idx_organizations_status`
6. **Views** — `v_personal_organizations`, `v_builder_organizations`
7. **Functions** — `is_personal_org(uuid)`, `is_builder_org(uuid)`

### Explicitly NOT implemented (stop here)

- Platform roles / `platform_operators`
- Platform RLS policy changes
- Builder companies, projects, buildings, units
- Invitations, documents, branding, subscriptions, announcements
- Any SQL on `properties`, `loans`, `expenses`, `tenants`, `financial_history`
- `user_profiles` changes

---

## 2. Compatibility notes

| Concern | Result |
|---|---|
| Flutter Owner App | **Compatible** — new columns have defaults; Flutter clients may omit them on insert |
| Personal Workspace | **Unchanged semantically** — all existing orgs backfilled as `personal` |
| Role `owner` | **Untouched** — `organization_members` not modified |
| Owner financial data | **Untouched** — no DDL/DML on properties/loans/expenses/tenants/financial_history |
| Builder Orgs | **Not created yet** — `v_builder_organizations` will be empty until Batch 2 |

Flutter continues to treat organizations as Personal Workspaces. The type discriminator is additive metadata for future Builder Platform rows.

---

## 3. Rollback notes

Batch 1A is **expand-contract** safe. Prefer leaving columns in place if already applied in shared environments.

### Soft rollback (recommended)

1. Drop views:
   - `DROP VIEW IF EXISTS public.v_builder_organizations;`
   - `DROP VIEW IF EXISTS public.v_personal_organizations;`
2. Drop functions:
   - `DROP FUNCTION IF EXISTS public.is_builder_org(uuid);`
   - `DROP FUNCTION IF EXISTS public.is_personal_org(uuid);`
3. Leave `organization_type` / `status` columns in place (harmless to Flutter).

### Hard rollback (only on empty / disposable DB)

```sql
BEGIN;
DROP VIEW IF EXISTS public.v_builder_organizations;
DROP VIEW IF EXISTS public.v_personal_organizations;
DROP FUNCTION IF EXISTS public.is_builder_org(uuid);
DROP FUNCTION IF EXISTS public.is_personal_org(uuid);
DROP INDEX IF EXISTS public.idx_organizations_organization_type;
DROP INDEX IF EXISTS public.idx_organizations_status;
ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_organization_type_check;
ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS organizations_status_check;
ALTER TABLE public.organizations DROP COLUMN IF EXISTS organization_type;
ALTER TABLE public.organizations DROP COLUMN IF EXISTS status;
COMMIT;
```

**Do not** run hard rollback on production if later batches already depend on these columns.

### Irreversibility

| Action | Irreversible? |
|---|---|
| Adding columns | Soft — dropping later needs care if apps write them |
| Backfill to `personal` | Safe / idempotent |
| Creating builder orgs | **Not in 1A** |

---

## 4. How to apply (manual)

```bash
# Example — adjust to your Supabase project / psql target
psql "$DATABASE_URL" -f supabase/migrations/20260716100000_p6a_b01a_platform_foundation.sql
psql "$DATABASE_URL" -f supabase/migrations/verify/20260716100000_p6a_b01a_platform_foundation_verify.sql
```

Confirm `batch_1a_passed = true` in the verification summary.

---

## 5. Stop / wait

**Batch 1A complete.** Do not implement Batch 1B / Batch 2 until approval.
