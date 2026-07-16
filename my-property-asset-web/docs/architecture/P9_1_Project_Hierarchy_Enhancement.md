---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P9.1 |
| **Document Name** | Project Hierarchy Enhancement |
| **Phase** | P9.1 – Project Hierarchy Enhancement |
| **Depends On** | P1–P5 (FINAL), P6A, P6B, P7, P8, P9 |
| **Status** | Implemented — **STOP**; await approval before Units |
| **Created** | 2026-07-16 |
| **Branch** | `feature/project-hierarchy-enhancement` |
| **Source of Truth** | P8, P9 (enhance only — no redesign) |

---

# P9.1 — Project Hierarchy Enhancement

## Objective

Support two project structures without redesigning P9 Buildings or implementing Units:

1. **BUILDING_BASED** — Project → Building → Unit  
2. **DIRECT_UNITS** — Project → Unit (no Buildings screen)

Builder chooses hierarchy during project create (constrained by project type).

---

## Updated navigation

| Hierarchy | Project nav | Buildings | Units (future) |
|---|---|---|---|
| `building-based` | Detail + Buildings CTA | Visible / required or optional by type | Nested under Building |
| `direct-units` | Detail only (no Buildings CTA) | Hidden + route guard | Direct under Project |

**Touched UI surfaces**

- Project Create / Edit — Hierarchy field (filtered by type)
- Project Detail / Overview — Hierarchy KPI + Buildings card gated
- Project Header — Buildings button gated
- Building routes — `buildingHierarchyGuard` redirects when `direct-units`

---

## Updated business flow

```
Create Project
  → select Project Type
  → Hierarchy auto-defaults + options filtered
  → save project_hierarchy

If BUILDING_BASED:
  Project → Buildings module (P9 unchanged) → (future) Units under building

If DIRECT_UNITS:
  Project → (future) Units directly
  Building create blocked (service + RPC + guard)
```

### Type → hierarchy rules

| Project type | Hierarchy |
|---|---|
| Apartment | BUILDING_BASED only (buildings **required**) |
| Commercial Tower | BUILDING_BASED only (buildings **required**) |
| Mixed Development | Builder choice (buildings **optional** when building-based) |
| Villa Community | DIRECT_UNITS only |
| Residential Plot Layout | DIRECT_UNITS only |
| Farm Land Layout | DIRECT_UNITS only |

---

## Database impact (Batch 5 — additive)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716150000_p91_b05_project_hierarchy.sql` | Additive migration |
| `supabase/migrations/verify/20260716150000_p91_b05_project_hierarchy_verify.sql` | Verification |

**Changes**

- `builder_projects.project_hierarchy` (`building_based` \| `direct_units`) NOT NULL after backfill
- `project_type` CHECK expanded with `farm_land`
- Trigger `enforce_builder_project_hierarchy` — type ↔ hierarchy compatibility
- `create_builder_project` / `update_builder_project` — optional `p_project_hierarchy`
- Update blocks switch to `direct_units` while active buildings exist
- `create_builder_building` — rejects when project hierarchy is `direct_units`

**Apply order:** P6A → P6B → P7 → P8 → P9 → **P9.1 Batch 5** → (stop)

---

## Route flow

```
/builder-portal/projects
/builder-portal/projects/list
/builder-portal/projects/create          ← hierarchy on Basics step
/builder-portal/projects/:id
/builder-portal/projects/:id/edit
/builder-portal/projects/:id/buildings/* ← guarded; redirect if DIRECT_UNITS
```

Building module routes and pages are unchanged; only visibility + create validation + guard.

---

## UI flow

1. **Create** — Type change resets hierarchy to default; Mixed allows either option.  
2. **Edit** — Same validation; DB rejects incompatible type/hierarchy and unsafe hierarchy flip.  
3. **Detail / Dashboard** — Buildings CTA/card only when `buildingsAreSupported(project)`.  
4. **Deep-link** to buildings on DIRECT_UNITS → redirect to project detail.

---

## Compatibility report

| Area | P9 behavior | P9.1 behavior |
|---|---|---|
| Building CRUD UI | Unchanged | Unchanged (hidden when DIRECT_UNITS) |
| Compatibility helper | By `projectType` only | By `hierarchy` + type |
| Villa / Plot | Buildings optional (shown) | DIRECT_UNITS — buildings hidden |
| Apartment / Commercial | Buildings required | Unchanged (BUILDING_BASED required) |
| Mixed | Buildings required | BUILDING_BASED optional; may choose DIRECT_UNITS |
| Farm Land | N/A | New type → DIRECT_UNITS |

**Seed:** Villa / plot seeds now `hierarchy: 'direct-units'`; apartment / commercial / mixed → `building-based`.

---

## Unit module preparation (no implementation)

File: `src/features/builder-portal/projects/config/unit-inventory-prep.ts`

Prepared labels only:

- Apartment Flat, Villa, Residential Plot, Commercial Unit, Office, Warehouse

Helper `unitRequiresBuilding(project)` → `true` only for `building-based` (for future Units phase).

**Do not implement Unit module in this phase.**

---

## Migration impact

| Risk | Mitigation |
|---|---|
| Existing rows lack hierarchy | Backfill from `project_type` |
| Villa/plot projects with buildings | UI hides Buildings; existing building rows remain; create blocked; switch already DIRECT after backfill |
| RPC signature change | DROP + recreate create/update project with trailing optional hierarchy param |
| Mixed projects wanting DIRECT_UNITS | Allowed; must archive/remove active buildings before switch |

---

## Risk analysis

| Risk | Level | Notes |
|---|---|---|
| Accidental building create on DIRECT_UNITS | Low | Guard + service + RPC triple check |
| Hierarchy flip with live buildings | Low | Update RPC blocks |
| Units deep-link assumptions | Medium | Deferred until Units phase; prep helper documents rule |
| Label/type rename confusion | Low | Config labels updated; DB codes stable (`villa`, `commercial`, …) |
| P9 redesign creep | Controlled | Building pages/services untouched except create validation |

---

## Angular touch list

- `project.model.ts` — `hierarchy`, `farm-land`, DB mappers  
- `projects.config.ts` / seed / form / overview / header / detail  
- `project-building-compatibility.ts` — hierarchy-first  
- `building-hierarchy.guard.ts` + routes `canActivate`  
- `BuildingService.create` validation  
- `unit-inventory-prep.ts` — types only  

---

## Explicit non-goals

- Do **not** redesign P9 Building module  
- Do **not** implement Unit Management  
- Do **not** change Owner / Document modules  

**STOP — await approval before Units phase.**
