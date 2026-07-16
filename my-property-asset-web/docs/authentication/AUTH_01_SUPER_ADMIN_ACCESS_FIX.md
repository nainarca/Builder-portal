# AUTH-01 — Super Admin Portal Access Fix

| Field | Value |
|---|---|
| **Document ID** | AUTH-01 |
| **Status** | **FIXED (code) — verify login manually** |
| **Date** | 2026-07-16 |
| **Branch** | `feature/auth-01-super-admin-access-fix` |
| **Repository** | `my-property-asset-web` |
| **Scope** | Angular authorization / portal routing only |
| **Out of scope** | DB, SQL, Flutter, RBAC redesign |

---

## Root cause

Post-login routing uses `RoleService.resolveUserContext().portals`.

`AuthRedirectService.resolveHomeForPortals()`:

1. `portal:super-admin` → `/super-admin`
2. `portal:builder-portal` → `/builder-portal`
3. else → `/auth/portal-unavailable`

**Bug:** Role was resolved only from:

1. Active organization membership role (`CurrentOrganizationService.snapshot().role`), or
2. JWT `user_metadata.role` / `platformRole`

Schema V2 Super Admins are recorded in **`platform_operators`** (`operator_role = super_admin`, `is_active = true`). That table was **never queried**.

Typical Super Admin accounts also have Personal Workspace metadata / membership role **`owner`**.  
`RoleService` maps `owner` → `public-visitor` (no portals) → **Portal Unavailable**.

Organization context had a JWT-only short-circuit for `super-admin` metadata, which does not apply when the operator is DB-backed only.

---

## Authorization flow (after fix)

```
Login → Supabase Auth → Session → AuthContext user
  → AuthorizationService.resolveAuthorization()
       → PlatformOperatorService.refresh()  // SELECT platform_operators
       → OrganizationContext.resolve()
            → if isSuperAdmin → applyPlatformContext()
            → else memberships / builder / personal logic
       → RoleService.resolveUserContext()
            → if isSuperAdmin → role=super-admin, portals=[portal:super-admin]
            → else org role / JWT role mapping
  → AuthRedirectService.navigateAfterLogin()
       → /super-admin | /builder-portal | /auth/portal-unavailable
```

---

## Route flow

| Actor | Expected destination |
|---|---|
| Platform Operator (`platform_operators.super_admin`) | `/super-admin` |
| Builder Owner/Admin/Staff | `/builder-portal` |
| Personal Owner (`owner`) | `/auth/portal-unavailable` |
| Tenant | `/auth/portal-unavailable` |

---

## Files inspected

| Area | Files |
|---|---|
| Redirect / portal unavailable | `auth-session.service.ts`, `auth.constants.ts`, `portal-unavailable-page.*`, `authentication.routes.ts` |
| Guards | `auth.guards.ts`, `authorization.guards.ts` |
| Role / authz | `role.service.ts`, `authorization.service.ts`, `permission-matrix.registry.ts`, `permission.utils.ts` |
| Org context | `organization-context-manager.service.ts`, `organization-membership.service.ts`, `organization-store.service.ts` |
| Search | No prior `platform_operators` usage in Angular |

---

## Files modified / added

| File | Change |
|---|---|
| `src/core/rbac/services/platform-operator.service.ts` | **New** — query `platform_operators` for active `super_admin` |
| `src/core/rbac/services/role.service.ts` | Platform operator precedes org/JWT owner mapping |
| `src/core/organization-context/services/organization-context-manager.service.ts` | Refresh operators; apply platform context when Super Admin |
| `src/core/rbac/services/authorization.service.ts` | Refresh operators before resolve; clear on sign-out |
| `src/core/rbac/index.ts` | Export `PlatformOperatorService` |
| `src/core/rbac/services/role.service.auth01.spec.ts` | **New** — precedence unit tests |
| `docs/authentication/AUTH_01_SUPER_ADMIN_ACCESS_FIX.md` | This report |

**Not changed:** database, SQL, Flutter, RBAC matrix design, portal-unavailable copy.

---

## Before / After

| Before | After |
|---|---|
| Super Admin in `platform_operators` + JWT/`owner` → portals `[]` → `/auth/portal-unavailable` | `platform_operators` loaded → `super-admin` → `/super-admin` |
| `platform_operators` unused | Queried once per user (cached) during authz resolve |
| Org context ignored DB operators | Applies platform context when operator is Super Admin |

---

## Verification checklist

- [ ] Sign in as platform operator (`platform_operators` row active) → lands on **Super Admin Dashboard** (`/super-admin`)
- [ ] Sign in as Builder Owner/Admin → **Builder Portal** (`/builder-portal`)
- [ ] Sign in as Personal Workspace owner (no operator row) → **Portal Unavailable**
- [ ] Sign in as Tenant → **Portal Unavailable**
- [ ] Sign out clears operator cache (re-login still correct)
- [ ] Cross-check: operator without JWT `role=super-admin` still works

---

## STOP

Do not continue to Builder feature work in this task. Super Admin portal access fix is complete pending manual login verification.
