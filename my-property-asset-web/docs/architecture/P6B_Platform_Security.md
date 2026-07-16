---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P6B |
| **Document Name** | Platform Security SQL Implementation |
| **Phase** | P6B – Platform Security SQL Implementation |
| **Depends On** | P6A Batch 1A |
| **Status** | Implemented — **STOP**; await approval before Builder Organization |
| **Created** | 2026-07-16 |
| **Source of Truth** | P1–P5, P6A (FINAL) |

---

# P6B — Platform Security Implementation Report

## 1. Migration filename

| File | Purpose |
|---|---|
| `supabase/migrations/20260716110000_p6b_platform_security.sql` | Security migration |
| `supabase/migrations/verify/20260716110000_p6b_platform_security_verify.sql` | Verification |
| `docs/architecture/P6B_Platform_Security.md` | This report |

**Apply order:** P6A → **P6B** → (stop)

---

## 2. Platform roles

Canonical DB role codes (seeded in `platform_role_catalog`):

| Role code | Family | Web portal | Flutter |
|---|---|---|---|
| `super_admin` | system | Yes | No |
| `builder_owner` | builder | Yes | No |
| `builder_admin` | builder | Yes | No |
| `builder_staff` | builder | Yes | No |
| `owner` | personal | No | **Yes — preserved** |
| `tenant` | tenant | No | Yes (future / Flutter) |

### Alias compatibility (`normalize_platform_role`)

| Input alias | Canonical |
|---|---|
| `super-admin` | `super_admin` |
| `builder-org-owner` | `builder_owner` |
| `builder-org-admin` | `builder_admin` |
| `builder-org-member` / `builder_member` | `builder_staff` |
| `owner` | `owner` |

Existing Schema V2 memberships with role **`owner`** remain valid. No rewrite of `organization_members` rows.

---

## 3. Functions created

| Function | Purpose |
|---|---|
| `normalize_platform_role(text)` | Alias → canonical role |
| `is_valid_platform_role(text)` | Catalog membership check |
| `is_builder_platform_role(text)` | builder_owner/admin/staff |
| `is_personal_owner_role(text)` | owner |
| `current_user_id()` | `auth.uid()` |
| `is_super_admin()` | Active row in `platform_operators` |
| `is_platform_operator()` | Currently = `is_super_admin()` |
| `jwt_organization_id()` | Optional JWT `organization_id` claim |
| `get_current_organization()` | JWT → else personal membership |
| `get_current_builder()` | JWT builder org → else builder membership |
| `is_org_member(uuid)` | Any membership |
| `is_builder_member(uuid)` | Builder role membership |
| `is_builder_owner(uuid)` | builder_owner |
| `is_builder_admin(uuid)` | builder_owner or builder_admin |
| `has_builder_role(uuid, VARIADIC text[])` | Role allow-list |
| `can_access_builder_org(uuid)` | Super admin OR builder member |
| `can_access_personal_org(uuid)` | Personal org member only |
| `has_platform_permission_scope(uuid, text[])` | Future Builder Portal helper |

Plus P6A: `is_personal_org`, `is_builder_org`.

---

## 4. Views created

| View | Purpose |
|---|---|
| `v_platform_users` | auth users + optional operator flags |
| `v_super_admin_users` | Active super_admin operators |
| `v_builder_members` | Builder org memberships only (empty until Batch 2) |

(P6A views retained: `v_personal_organizations`, `v_builder_organizations`.)

---

## 5. Tables created

| Table | Purpose |
|---|---|
| `platform_role_catalog` | Role seed / documentation |
| `platform_operators` | Super Admin identities (`user_id`, `operator_role`) |

---

## 6. Policies created (foundation only)

| Table | Policy | Effect |
|---|---|---|
| `platform_role_catalog` | `platform_role_catalog_select_authenticated` | Authenticated SELECT |
| `platform_role_catalog` | `platform_role_catalog_write_super_admin` | Super Admin ALL |
| `platform_operators` | `platform_operators_select_self_or_admin` | Self or Super Admin SELECT |
| `platform_operators` | `platform_operators_write_super_admin` | Super Admin ALL |

**Not touched:** RLS on `organizations`, `organization_members`, `properties`, `loans`, `expenses`, `tenants`, `financial_history`.

---

## 7. Verification queries

See: `supabase/migrations/verify/20260716110000_p6b_platform_security_verify.sql`

Confirm `batch_p6b_passed = true`.

---

## 8. Rollback notes

### Soft rollback (recommended)

```sql
BEGIN;
DROP VIEW IF EXISTS public.v_builder_members;
DROP VIEW IF EXISTS public.v_super_admin_users;
DROP VIEW IF EXISTS public.v_platform_users;

DROP FUNCTION IF EXISTS public.has_platform_permission_scope(uuid, text[]);
DROP FUNCTION IF EXISTS public.can_access_personal_org(uuid);
DROP FUNCTION IF EXISTS public.can_access_builder_org(uuid);
DROP FUNCTION IF EXISTS public.has_builder_role(uuid, text[]);
DROP FUNCTION IF EXISTS public.is_builder_admin(uuid);
DROP FUNCTION IF EXISTS public.is_builder_owner(uuid);
DROP FUNCTION IF EXISTS public.is_builder_member(uuid);
DROP FUNCTION IF EXISTS public.is_org_member(uuid);
DROP FUNCTION IF EXISTS public.get_current_builder();
DROP FUNCTION IF EXISTS public.get_current_organization();
DROP FUNCTION IF EXISTS public.jwt_organization_id();
DROP FUNCTION IF EXISTS public.is_platform_operator();
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.current_user_id();
DROP FUNCTION IF EXISTS public.is_personal_owner_role(text);
DROP FUNCTION IF EXISTS public.is_builder_platform_role(text);
DROP FUNCTION IF EXISTS public.is_valid_platform_role(text);
DROP FUNCTION IF EXISTS public.normalize_platform_role(text);

DROP TABLE IF EXISTS public.platform_operators;
DROP TABLE IF EXISTS public.platform_role_catalog;
COMMIT;
```

Does **not** affect P6A columns/views/functions or Flutter tables.

### Irreversible

| Item | Note |
|---|---|
| Seeded `platform_operators` in prod | Removing loses Super Admin registry — re-seed required |
| Nothing in P6B rewrites owner data | Safe relative to Flutter |

---

## 9. Compatibility report

| Area | Status |
|---|---|
| Flutter Personal Workspace | **Compatible** — no org/member DML; `owner` preserved |
| Role `owner` | **Preserved** as canonical personal role |
| `properties` / `loans` / `expenses` / `tenants` / `financial_history` | **Untouched** |
| Existing org RLS | **Unchanged** |
| Builder Portal modules | **Not implemented** (as required) |
| Super Admin visibility | Via `platform_operators` + helpers; no standing financial access helper |

---

## 10. Risk assessment

| Risk | Level | Mitigation |
|---|---|---|
| `organization_members.user_id` / `role` / `id` naming differs in Schema V2 | High | Confirm column names before apply; migration assumes common V2 shape |
| `v_platform_users` exposes emails to all authenticated | Medium | Tighten grants / replace with security_invoker view before prod hard launch |
| SECURITY DEFINER helpers misused | Medium | Fixed `search_path`; limited to membership checks |
| Calling `is_super_admin()` before any operator seeded | Low | Returns false — expected |
| Alias mismatch with Angular hyphen roles | Low | `normalize_platform_role` maps P1 aliases |

---

## 11. Explicitly NOT implemented (stop)

Projects · Buildings · Units · Invitations · Documents · Branding · Subscriptions · Announcements · Notifications · Builder Portal tables · Builder module RLS

---

## 12. Stop / wait

**P6B complete. Do not start Builder Organization (Batch 2) until approval.**
