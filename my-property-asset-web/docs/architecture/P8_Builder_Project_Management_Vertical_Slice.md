---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P8 |
| **Document Name** | Builder Project Management Vertical Slice |
| **Phase** | P8 – Builder Project Management Vertical Slice |
| **Depends On** | P1–P5 (FINAL), P6A, P6B, P7 |
| **Status** | Implemented — **STOP**; await approval before Buildings/Units |
| **Created** | 2026-07-16 |
| **Branch** | `feature/project-management` |
| **Source of Truth** | P1–P5, P7 |

---

# P8 — Builder Project Management Vertical Slice

## 1. Database summary (Batch 3 only)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716130000_p8_b03_builder_projects.sql` | Batch 3 migration |
| `supabase/migrations/verify/20260716130000_p8_b03_builder_projects_verify.sql` | Verification |

**Apply order:** P6A → P6B → P7 Batch 2 → **P8 Batch 3** → (stop)

### Table: `builder_projects`

| Column | Notes |
|---|---|
| `name`, `code` | Required; unique `(organization_id, code)` |
| `project_type` | `apartment` \| `villa` \| `residential_plot` \| `commercial` \| `mixed_development` |
| `status` | `upcoming` \| `planning` \| `construction` \| `completed` \| `archived` |
| `description` | Optional |
| `launch_date`, `expected_completion_date` | Dates |
| `address_line`, `city`, `state`, `pincode` | Address |
| `latitude`, `longitude` | Coordinates |
| `banner_url`, `logo_url` | Media URLs |
| `organization_id` | FK → `organizations` (builder-only via trigger) |

### RPCs (API contracts)

| RPC | Behavior |
|---|---|
| `list_builder_projects` | Search / filter / sort / page |
| `get_builder_project` | Details by id |
| `create_builder_project` | Create |
| `update_builder_project` | Update |
| `archive_builder_project` | Soft-archive (`status = archived`) |

### Explicitly NOT in Batch 3

- Buildings, Units, Owners, Documents

---

## 2. Angular folder structure

```
src/features/builder-portal/projects/
  models/project.model.ts
  config/projects.config.ts
  config/projects.seed.ts
  repositories/
    builder-project.repository.ts          # abstract contract
    in-memory-builder-project.repository.ts
  providers/project.providers.ts           # provideBuilderProjects()
  resolvers/project.resolver.ts
  guards/project-unsaved-changes.guard.ts
  services/
    project.service.ts                     # application service
    project-store.service.ts               # facade for existing pages
    project-list-state.service.ts
    project-form-state.service.ts
  pages/   workspace | list | create | detail | edit
  components/  form | list | detail | shared
  units/   # pre-existing mock only — not part of P8 scope
```

---

## 3. Routes

| Path | Purpose |
|---|---|
| `/builder-portal` | Dashboard (live project KPIs) |
| `/builder-portal/projects` | Project workspace + stats |
| `/builder-portal/projects/list` | Search / filter / sort list |
| `/builder-portal/projects/create` | Create |
| `/builder-portal/projects/:id` | Details (+ archive/restore) |
| `/builder-portal/projects/:id/edit` | Edit |

Resolver: `projectResolver` on detail/edit. Guard: `projectUnsavedChangesGuard` on create/edit.

---

## 4. Components / UI

- Project list (table + cards), quick status chips, type/city filters, sort
- Create / Edit wizard (basics → location/timeline → status/media → review)
- Detail overview card + location + placeholder statistics
- Dashboard: total projects, by status, recent projects, quick actions

---

## 5. Services / Repository / Provider

| Piece | Role |
|---|---|
| `BuilderProjectRepository` | Abstract CRUD + list API |
| `InMemoryBuilderProjectRepository` | Mirrors Batch 3 RPCs until Supabase wired |
| `ProjectService` | Org-scoped business API + dashboard stats |
| `ProjectStoreService` | Compatibility facade |
| `provideBuilderProjects()` | Registers repository binding in `app.config` |

---

## 6. API contracts (frontend ↔ Batch 3)

**Create / Update payload:** name, code, projectType, status, description, launchDate, expectedCompletionDate, address, city, state, pincode, lat/lng, bannerUrl, logoUrl

**List query:** search, status, projectType, city, includeArchived, sortField/direction, page, pageSize

**Archive:** sets `status = archived`

---

## 7. Test coverage

| Kind | File |
|---|---|
| Unit (model helpers) | `project.model.spec.ts` |
| Unit / integration (service + repository) | `project.service.spec.ts` |
| API contract | `builder-project.api.spec.ts` |
| Smoke checklist | `p8-smoke.spec.ts` |

Run: `npm test -- --include="**/project*.spec.ts" --include="**/p8-smoke.spec.ts" --include="**/builder-project.api.spec.ts"`

---

## 8. Verification checklist

- [ ] Apply Batch 3 SQL; run verify script
- [ ] Dashboard shows live project totals by status
- [ ] List search / status / type / sort works
- [ ] Create → Detail → Edit → Archive → Restore
- [ ] Form validates name, city, date order, coordinates
- [ ] No Buildings / Units / Owners / Documents SQL or new domain features in this phase

---

## 9. Known limitations

1. Repository is **in-memory**; swap to Supabase RPC client when DB is applied.
2. Banner/logo are URL fields only (no Storage upload UI).
3. Pre-existing `/projects/:id/units` mock route remains but is **out of P8 scope**.
4. Related-module stats on detail are placeholders (Units/Owners/Documents future).
5. Org filter falls back to seed org `org-builder-demo` when JWT org context is empty.

---

## 10. STOP

**Do not implement Buildings or Units next.** Await approval.
