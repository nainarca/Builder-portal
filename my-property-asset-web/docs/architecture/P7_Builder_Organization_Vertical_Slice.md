---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P7 |
| **Document Name** | Builder Organization Vertical Slice |
| **Phase** | P7 – Builder Organization Vertical Slice |
| **Depends On** | P1–P5 (FINAL), P6A, P6B |
| **Status** | Implemented — **STOP**; await approval before Projects |
| **Created** | 2026-07-16 |
| **Branch** | `feature/builder-organization` |
| **Source of Truth** | P1–P5, P6A, P6B |

---

# P7 — Builder Organization Vertical Slice

## 1. Database summary (Batch 2 only)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716120000_p7_b02_builder_organization.sql` | Batch 2 migration |
| `supabase/migrations/verify/20260716120000_p7_b02_builder_organization_verify.sql` | Verification |

**Apply order:** P6A → P6B → **P7 Batch 2** → (stop)

### Tables

| Table | Purpose |
|---|---|
| `builder_companies` | 1:1 company profile for `organizations` with type `builder` |
| `builder_staff_invitations` | Invite Builder Owner / Admin / Staff (token, expiry, resend) |

### RPCs (API contracts)

| RPC | Caller | Behavior |
|---|---|---|
| `create_builder_organization` | Super Admin | Creates builder org + company + optional owner invitation |
| `accept_builder_invitation` | Authenticated invitee | Accepts token → membership + activates company |
| `resend_builder_invitation` | Super Admin / Builder Admin | New token; invalidates prior pending token |

### Explicitly NOT in Batch 2

- Projects, buildings, units
- Documents, branding tables, handovers
- Owner assignment domain SQL

---

## 2. Angular structure

```
src/features/builder-portal/organization/
  models/builder-organization.model.ts
  services/builder-organization.service.ts          # in-memory ↔ Batch 2 contracts
  pages/
    builder-company-page.component.*                # company profile
    builder-settings-page.component.*               # org settings summary
    builder-invitation-page.component.ts            # redirects to /auth/builder-invitation

src/features/authentication/pages/
  portal-unavailable/                               # Owner/non-builder message
  builder-invitation-accept/                        # accept invitation → dashboard

src/core/organization-context/services/
  builder-session-bridge.service.ts                 # post-accept membership until JWT live

src/features/super-admin/builders/                  # List / Create / Detail / Edit / Deactivate / Invite / Resend
```

Dashboard remains `BuilderDashboardComponent` at `/builder-portal`.

---

## 3. Routes

| Path | Portal | Purpose |
|---|---|---|
| `/super-admin/builders` | Super Admin | Builder list |
| `/super-admin/builders/create` | Super Admin | Create builder + owner invite |
| `/super-admin/builders/:id` | Super Admin | Detail, invite, resend, deactivate |
| `/super-admin/builders/:id/edit` | Super Admin | Edit |
| `/auth/builder-invitation` | Auth | Accept Builder Owner invitation |
| `/auth/portal-unavailable` | Auth | Friendly denial for Owner / non-portal users |
| `/builder-portal` | Builder | Dashboard |
| `/builder-portal/company` | Builder | Company profile |
| `/builder-portal/settings` | Builder | Organization settings |
| `/builder-portal/invitation` | Builder | Redirect to auth accept flow |

---

## 4. Services

| Service | Role |
|---|---|
| `BuilderOrganizationService` | Create org/company, invite, resend, accept, deactivate (mock ↔ RPC) |
| `BuilderAdminStoreService` | Super Admin list/CRUD/status/invite counters |
| `BuilderSessionBridgeService` | Session membership after accept |
| `OrganizationMembershipService` | Merges bridged membership into resolved memberships |
| `AuthRedirectService` | Post-login: Super Admin → Builder → portal-unavailable |
| `RoleService` + `normalizeRole` | Maps `builder_owner` ↔ `builder-org-owner`; Owner/tenant → no Web portal |

---

## 5. Components / UI (this phase)

| UI | Location |
|---|---|
| Builder List / Create / Detail / Edit / Status | Super Admin builders module |
| Invite Owner / Resend / Deactivate | Builder detail header actions |
| Builder Company profile | `/builder-portal/company` |
| Builder Settings | `/builder-portal/settings` |
| Builder Dashboard | `/builder-portal` (existing) |
| Portal unavailable | `/auth/portal-unavailable` |
| Invitation accept | `/auth/builder-invitation` |

---

## 6. Authentication flow (complete for Builder)

```
Login
  → resolve portals/role (RoleService)
  → Super Admin → /super-admin
  → Builder → /builder-portal
  → Owner / other → /auth/portal-unavailable
       message: "This portal is available only for Builder organizations and Platform Administrators."

Invitation:
  Super Admin creates builder
  → token shared
  → /auth/builder-invitation?token=…
  → accept (must be authenticated)
  → BuilderSessionBridge membership
  → /builder-portal
```

---

## 7. API contracts (frontend ↔ Batch 2)

### `create_builder_organization` / `createBuilderOrganization`

**Input:** legal name, trading name, primary contact, region, plan, `inviteOwner?`

**Output:** `organizationId`, `builderCompanyId`, `invitationId?`, `invitationToken?`

### `accept_builder_invitation` / `acceptInvitation`

**Input:** `token`

**Output:** accepted invitation (or failure if expired/used)

### `resend_builder_invitation` / `resendInvitation`

**Input:** `invitationId`

**Output:** invitation with new `token`, incremented `resend_count`

---

## 8. Testing

| Kind | Location |
|---|---|
| Unit | `permission.utils.spec.ts` (`normalizeRole`) |
| Unit / service | `builder-organization.service.spec.ts` |
| Integration contract | `auth-redirect.p7.spec.ts` |
| Smoke checklist | `organization/p7-smoke.spec.ts` (+ manual steps in comments) |

Run: `npm test`

---

## 9. Verification checklist

- [ ] Apply P6A → P6B → P7 Batch 2 SQL; run verify script
- [ ] Super Admin can list / create / edit / deactivate builders
- [ ] Create generates owner invitation token
- [ ] Resend invalidates prior token
- [ ] Accept invitation opens Builder Dashboard
- [ ] `/builder-portal/company` and `/settings` load for builder session
- [ ] Owner JWT lands on portal-unavailable with Builder-only message
- [ ] No new Projects / Buildings / Units SQL or domain work in this phase

---

## 10. Known limitations

1. **Frontend still uses in-memory** `BuilderOrganizationService` until Supabase RPC wiring replaces it.
2. **`BuilderSessionBridgeService`** is a temporary membership source until JWT/`organization_members` are authoritative.
3. **Email delivery** for invitations is not implemented — tokens are shown in UI for handoff.
4. **Existing mock** Projects/Owners/Documents/Handovers routes remain from prior BUILDER-* work; P7 did not add Projects domain SQL or new Projects features.
5. **`organizations` INSERT** inside SQL RPC may need Schema V2 column alignment on target DB (see migration comments).
6. Invitation page under `/builder-portal/invitation` only redirects — acceptance is on `/auth/builder-invitation` (correct chicken-and-egg for portal grant).

---

## 11. STOP

**Do not implement Projects next.** Await approval.
