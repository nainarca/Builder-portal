# AUTH-02 — Login Loading Forever Fix

| Field | Value |
|---|---|
| **Document ID** | AUTH-02 |
| **Status** | **FIXED (code) — verify Super Admin login manually** |
| **Date** | 2026-07-16 |
| **Branch** | `feature/auth-02-login-loading-fix` |
| **Repository** | `my-property-asset-web` |
| **Scope** | Hang after successful sign-in (loading never clears / no redirect) |
| **Out of scope** | Auth redesign, routing redesign, RBAC redesign, DB/SQL/Flutter |

---

## Symptom

1. Authentication succeeds (Supabase session established).
2. No console errors.
3. No network errors.
4. Login button stays in loading state forever.
5. Application never redirects.

---

## Root cause

AUTH-01 made Super Admin resolution publish organization `contextChanged` on every successful platform resolve:

```
AuthorizationService.executeResolve()
  → organizationContext.resolve()
       → applyPlatformContext()
       → publishResolved() → ORGANIZATION_EVENT_TYPES.contextChanged
  → AuthorizationService handler on contextChanged
       → resolveAuthorization() again
```

`PlatformOperatorService.refresh()` is cached after the first hit, so each re-entry returned immediately. That produced a **tight synchronous / microtask re-entry loop**:

- `resolveAuthorization` never effectively finished for callers waiting on navigation.
- `LoginPageComponent.onSubmit` awaits `navigateAfterLogin` → `resolveAuthorization`.
- `submitting` is only cleared in `finally` after that await returns → **button stuck loading**.

This was not an open Observable / NEVER stream. It was **re-entrant await + event feedback** starving completion of the login `finally` block.

Before AUTH-01, personal `owner` often hit `setError` without `publishResolved`, so the loop did not start and users reached portal-unavailable quickly.

---

## Timeline (pre-fix)

| Step | Status | File | Method | Reason |
|---|---|---|---|---|
| 1. Login `onSubmit` → `submitting=true` | completed | `login-page.component.ts` | `onSubmit` | UI loading set |
| 2. `AuthenticationService.signIn` | completed | auth services | `signIn` | Session OK |
| 3. `navigateAfterLogin` | started | `auth-session.service.ts` | `navigateAfterLogin` | Awaits authz |
| 4. `resolveAuthorization` | started | `authorization.service.ts` | `executeResolve` | Sets loading |
| 5. `PlatformOperatorService.refresh` | completed | `platform-operator.service.ts` | `refresh` | Emits / caches `super_admin` |
| 6. `OrganizationContext.resolve` | completed once | `organization-context-manager.service.ts` | `resolve` | Platform context + **publishResolved** |
| 7. `contextChanged` handler | **re-entered forever** | `authorization.service.ts` | `initialize` handler | Called `resolveAuthorization` while still resolving |
| 8. Cached `platformOperators.refresh` | completed instantly | same | `refresh` | Cache hit → tight loop |
| 9. `Router.navigate` | **never reached** | `auth-session.service.ts` | `navigateAfterLogin` | Blocked on step 3 await |
| 10. `submitting=false` | **never** | `login-page.component.ts` | `finally` | Await never settled |

**Hanging point:** not a single stuck Promise from Supabase — **Step 7** (`contextChanged` → `resolveAuthorization` feedback loop).

---

## Timeline (post-fix)

| Step | Status |
|---|---|
| 1–5 | completed |
| 6. Org resolve publishes `contextChanged` once | completed |
| 7. Handler sees `isResolving` → **no re-entry** | completed |
| 8. Concurrent callers share `resolveInflight` | completed |
| 9. Re-resolve when already platform → **skip re-publish** | completed |
| 10. `navigateAfterLogin` → `/super-admin` (or other portal home) | completed |
| 11. `submitting=false` | completed |

---

## Why loading never ended

```
submitting.set(true)
  → await signIn()                          // OK
  → await navigateAfterLogin()
       → await resolveAuthorization()       // never settled while looping
  → finally { submitting.set(false) }       // never ran
```

Login UI loading is **not** tied to `AuthorizationContext.loading` directly; it stays true because the page awaits navigation, which awaits authorization resolve.

---

## How fixed

### 1. `AuthorizationService` — break re-entry

- `resolveInflight`: coalesce concurrent `resolveAuthorization()` callers onto one promise.
- `isResolving`: while `executeResolve` runs, ignore `organization.contextChanged` / `switched` handlers that would call resolve again.
- `clear()` resets mutex / flag.

### 2. `OrganizationContextManagerService` — skip redundant publish

- If already resolved as platform (no active org) and Super Admin / JWT platform role path would only re-apply the same context, **return without `publishResolved`**.
- Prevents a second storm if a deferred handler runs after `isResolving` clears.

### 3. `PlatformOperatorService` — always settle

- Query wrapped in `Promise.race` with 8s timeout.
- Errors / timeout → status `none` (fail closed for platform ops, but login continues).
- Inflight coalescing preserved.

---

## Files modified / added

| File | Change |
|---|---|
| `src/core/rbac/services/authorization.service.ts` | Inflight mutex + `isResolving` event guard |
| `src/core/organization-context/services/organization-context-manager.service.ts` | Skip re-publish when platform context already applied |
| `src/core/rbac/services/platform-operator.service.ts` | Timeout + always settle |
| `src/core/rbac/services/authorization.service.auth02.spec.ts` | Coalesce / re-entry unit coverage |
| `docs/authentication/AUTH_02_LOGIN_LOADING_FIX.md` | This document |

---

## Inspected (no redesign)

Searched / traced: `loading`, `isLoading`, subjects/signals/effects, RxJS operators (`switchMap`, `forkJoin`, `take(1)`, `shareReplay`, …), `firstValueFrom` / `lastValueFrom`, `await`, `Promise.all`, `PlatformOperatorService`, `RoleService`, portal home via `AuthRedirectService` / guards.

**PlatformOperatorService:** emits and completes (async method returns). Does **not** return `NEVER`. Hang was **not** an open subscription on this service; timeout added as defense-in-depth.

---

## Verification

```bash
# Unit
npx ng test --include=**/authorization.service.auth02.spec.ts --include=**/role.service.auth01.spec.ts --browsers=ChromeHeadless --watch=false
```

Manual:

1. Sign in as platform Super Admin (`platform_operators.super_admin`).
2. Confirm login button loading clears.
3. Confirm redirect to `/super-admin` (not portal-unavailable).
4. Confirm DevTools Network: `platform_operators` query succeeds or times out cleanly (no infinite repeat storm).
5. Sign in as builder → `/builder-portal`; personal owner → portal-unavailable (unchanged intent).

---

## STOP

Login path completes: authz resolve settles → navigate → `submitting` cleared. No further auth/RBAC redesign in AUTH-02.
