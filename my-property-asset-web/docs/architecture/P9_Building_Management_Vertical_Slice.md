---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P9 |
| **Document Name** | Building Management Vertical Slice |
| **Phase** | P9 – Building Management Vertical Slice |
| **Depends On** | P1–P5 (FINAL), P6A, P6B, P7, P8 |
| **Status** | Implemented — **STOP**; await approval before Units |
| **Created** | 2026-07-16 |
| **Branch** | `feature/building-management` |
| **Source of Truth** | P1–P5, P8 |

---

# P9 — Building Management Vertical Slice

## 1. Database summary (Batch 4 only)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716140000_p9_b04_builder_buildings.sql` | Batch 4 migration |
| `supabase/migrations/verify/20260716140000_p9_b04_builder_buildings_verify.sql` | Verification |

**Apply order:** P6A → P6B → P7 → P8 → **P9 Batch 4** → (stop)

### Table: `builder_buildings`

| Column | Notes |
|---|---|
| `project_id` | FK → `builder_projects` (cannot move across projects) |
| `organization_id` | Mirrored from project via trigger |
| `name`, `code` | Required; unique `(project_id, code)` |
| `tower_name`, `block_name` | Optional labels |
| `display_order` | Sort order within project |
| `floors_count`, `units_count` | Planned capacity (units domain deferred) |
| `status` | `planning` \| `construction` \| `completed` \| `archived` |
| `description`, `image_url`, `address_line` | Optional |

### RPCs

| RPC | Behavior |
|---|---|
| `list_builder_buildings` | Search / filter / sort / page by project |
| `get_builder_building` | Details |
| `create_builder_building` | Create (duplicate code → error) |
| `update_builder_building` | Update |
| `archive_builder_building` | Soft archive |

### Explicitly NOT in Batch 4

- Units, Owners, Documents

---

## 2. Angular folder structure

```
src/features/builder-portal/projects/buildings/
  models/building.model.ts
  config/buildings.config.ts
  config/buildings.seed.ts
  utils/project-building-compatibility.ts
  repositories/
  providers/building.providers.ts
  resolvers/building.resolver.ts
  guards/building-unsaved-changes.guard.ts
  services/building.service.ts (+ list/form state)
  pages/ list | create | detail | edit
  components/ form | shared
  buildings.routes.ts
```

---

## 3. Routes

| Path | Purpose |
|---|---|
| `/builder-portal/projects/:id/buildings` | List + stats + recent |
| `/builder-portal/projects/:id/buildings/create` | Create |
| `/builder-portal/projects/:id/buildings/:buildingId` | Details + archive/restore |
| `/builder-portal/projects/:id/buildings/:buildingId/edit` | Edit |

Resolver: `buildingResolver` (rejects cross-project ids). Guard: unsaved-changes on create/edit.

---

## 4. Project compatibility

| Project type | Buildings |
|---|---|
| Apartment, Commercial, Mixed Development | **Required** |
| Villa, Residential Plot | **Optional** (still supported) |

UI: project header + detail show Buildings when supported; list copy reflects required vs optional.

---

## 5. Services / Repository / Provider

| Piece | Role |
|---|---|
| `BuilderBuildingRepository` | Abstract CRUD + list |
| `InMemoryBuilderBuildingRepository` | Mirrors Batch 4 RPCs |
| `BuildingService` | Project-scoped API + dashboard stats |
| `provideBuilderBuildings()` | Registered in `app.config` |

---

## 6. API contracts

**Create/Update:** name, code, tower/block, displayOrder, floors, units (planned), status, description, imageUrl, addressLine

**List query:** projectId, search, status, includeArchived, sort, page

**Validation:** duplicate code within project rejected; soft delete only via archive

---

## 7. Test coverage

| Kind | File |
|---|---|
| Unit (compatibility) | `project-building-compatibility.spec.ts` |
| Unit / repository / service | `building.service.spec.ts` |
| API contracts | `builder-building.api.spec.ts` |
| Smoke | `p9-smoke.spec.ts` |

---

## 8. Verification checklist

- [ ] Apply Batch 4 SQL; run verify script
- [ ] Apartment project → Buildings entry + create/list/detail/edit/archive
- [ ] Duplicate building code blocked
- [ ] Villa project still opens Buildings (optional)
- [ ] Building cannot resolve under wrong project id
- [ ] No Units / Owners / Documents work in this phase

---

## 9. Known limitations

1. In-memory repository until Supabase RPC wiring
2. Image is URL field only (no Storage upload)
3. `units_count` is planned capacity — not linked to a Units table
4. Existing Units mock route remains but is out of P9 scope

---

## 10. STOP

**Do not implement Units next.** Await approval.
