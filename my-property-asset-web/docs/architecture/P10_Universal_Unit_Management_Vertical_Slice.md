---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P10 |
| **Document Name** | Universal Unit Management Vertical Slice |
| **Phase** | P10 – Universal Unit Management |
| **Depends On** | P1–P5 (FINAL), P6A, P6B, P7, P8, P9, P9.1 |
| **Status** | **Design — await approval before implementation** |
| **Created** | 2026-07-16 |
| **Branch** | `feature/unit-management` |
| **Source of Truth** | P1–P5, P8, P9, P9.1, BUILDER-003 (evolve — do not redesign P8/P9) |

---

# P10 — Universal Unit Management Vertical Slice

## Objective

Implement **Universal Unit Management** — the final pre-handover inventory asset under a Builder Project. A Unit supports every project type and hierarchy, uses **type-specific dynamic forms**, and is production-ready for future Owner Assignment, Documents, and Handover phases.

**Explicitly out of scope:** Owner Assignment, Invitations, Documents, Handover, Snag, Appointments.

---

## 1. Database Summary (Batch 6)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716160000_p10_b06_builder_units.sql` | Batch 6 migration |
| `supabase/migrations/verify/20260716160000_p10_b06_builder_units_verify.sql` | Verification |

**Apply order:** P6A → P6B → P7 → P8 → P9 → P9.1 → **P10 Batch 6** → (stop)

### Table: `builder_units`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `project_id` | uuid NOT NULL FK → `builder_projects` | Cascade delete |
| `organization_id` | uuid NOT NULL FK → `organizations` | Mirrored from project via trigger |
| `building_id` | uuid NULL FK → `builder_buildings` | **Required** when project `project_hierarchy = building_based`; **NULL** when `direct_units` |
| `unit_number` | text NOT NULL | Display number / name |
| `code` | text NOT NULL | Builder inventory code; unique per project |
| `unit_type` | text NOT NULL | See §1.1 — extensible CHECK |
| `status` | text NOT NULL DEFAULT `draft` | `draft` \| `active` \| `archived` |
| `booking_status` | text NOT NULL DEFAULT `available` | `available` \| `reserved` \| `sold` \| `blocked` |
| `availability` | text NOT NULL DEFAULT `for-sale` | `for-sale` \| `not-for-sale` \| `hold` |
| `area_sqft` | numeric(12,2) | Common area (nullable) |
| `built_up_area_sqft` | numeric(12,2) | Built-up area (nullable) |
| `land_area_sqft` | numeric(12,2) | Land area (nullable) |
| `facing_direction` | text | `north` \| `south` \| `east` \| `west` \| `north-east` \| … |
| `floor_number` | integer | Nullable (plots / land) |
| `block_name` | text | Optional block label |
| `price` | numeric(14,2) | List / base price (nullable) |
| `description` | text | |
| `image_urls` | jsonb NOT NULL DEFAULT `[]` | Array of URL strings |
| `type_attributes` | jsonb NOT NULL DEFAULT `{}` | Type-specific payload (§8) — extensible without schema change |
| `construction_stage` | text DEFAULT `not-started` | Prep for handover tracking |
| `progress` | integer DEFAULT 0 CHECK 0–100 | Construction % |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` | uuid FK → `auth.users` | |
| `archived_at` | timestamptz | Set when `status = archived` |

### 1.1 Unit types (`unit_type`)

| Value | Label |
|---|---|
| `apartment_flat` | Apartment Flat |
| `villa` | Villa |
| `residential_plot` | Residential Plot |
| `commercial_shop` | Commercial Shop |
| `office` | Office |
| `warehouse` | Warehouse |
| `industrial_unit` | Industrial Unit |
| `farm_land_plot` | Farm Land Plot |

**Extensibility:** New types are added by extending the CHECK constraint (or a lookup table in a future phase). Type-specific fields live in `type_attributes` JSONB — no column-per-type redesign.

### Indexes

| Index | Purpose |
|---|---|
| `(project_id, status)` | List / filter |
| `(building_id)` WHERE `building_id IS NOT NULL` | Building-scoped lists |
| `(organization_id)` | Org RLS / reporting |
| **UNIQUE** `(project_id, code)` | Duplicate code prevention |
| **UNIQUE** `(project_id, unit_number)` WHERE `building_id IS NULL` | Direct-units scope |
| **UNIQUE** `(building_id, unit_number)` WHERE `building_id IS NOT NULL` | Building-based scope |

### Triggers

| Trigger | Behavior |
|---|---|
| `enforce_builder_unit_project_scope` | Mirror `organization_id` from project; block cross-project moves |
| `enforce_builder_unit_building_scope` | When `building_id` set: building must belong to same `project_id`; reject when project hierarchy is `direct_units` |
| `enforce_builder_unit_hierarchy` | When hierarchy is `building_based`: `building_id` required on INSERT; when `direct_units`: `building_id` must be NULL |

### RPCs

| RPC | Behavior |
|---|---|
| `list_builder_units` | Search / filter / sort / page by `project_id`; optional `building_id` |
| `get_builder_unit` | Details by id |
| `create_builder_unit` | Create with hierarchy + uniqueness validation |
| `update_builder_unit` | Update (building_id immutable after create) |
| `archive_builder_unit` | Soft archive (`status = archived`) |
| `restore_builder_unit` | Restore from archived |
| `bulk_update_builder_units` | Status / booking_status / price / availability batch update |
| `bulk_archive_builder_units` | Batch archive |
| `bulk_restore_builder_units` | Batch restore |
| `import_builder_units` | CSV/JSON bulk import with row-level error report |

### Explicitly NOT in Batch 6

- `owner_assignments`, `owner_invitations`
- `document_*`, `unit_handovers`, `unit_property_links`
- Flutter `properties` mutations

### Readiness columns (future phases — nullable placeholders)

No separate tables; Angular `UnitSummaryPlaceholders` remains UI-only until P11+. DB stores only inventory fields.

---

## 2. Angular Folder Structure

Evolve existing `src/features/builder-portal/projects/units/` — **do not relocate**; align with P8/P9 repository pattern.

```
src/features/builder-portal/projects/units/
├── units.routes.ts
├── index.ts
├── p10-smoke.spec.ts
├── models/
│   ├── unit.model.ts              (evolve — universal Unit + form models)
│   └── unit-type-attributes.model.ts
├── config/
│   ├── units.config.ts            (options, columns, filters)
│   ├── units.seed.ts              (seed data — replaces MOCK_* in config)
│   └── unit-form.config.ts        (dynamic field map per unit_type)
├── utils/
│   ├── project-unit-compatibility.ts
│   └── unit-import-parser.ts      (CSV + Excel → ImportRow[])
├── repositories/
│   ├── builder-unit.repository.ts
│   ├── in-memory-builder-unit.repository.ts
│   └── builder-unit.api.spec.ts
├── providers/unit.providers.ts
├── services/
│   ├── unit.service.ts            (replaces UnitStoreService)
│   ├── unit-list-state.service.ts (evolve)
│   ├── unit-form-state.service.ts (evolve — dynamic validation)
│   └── unit-import.service.ts
├── resolvers/
│   ├── unit.resolver.ts
│   └── building-units.resolver.ts   (building-scoped preload)
├── guards/
│   ├── unit-unsaved-changes.guard.ts
│   └── unit-hierarchy.guard.ts    (redirect building routes when direct-units)
├── pages/
│   ├── unit-list-page.component.*       (NEW — dedicated list route)
│   ├── unit-workspace-page.component.*  (dashboard + viz — evolve)
│   ├── unit-create-page.component.*
│   ├── unit-detail-page.component.*
│   ├── unit-edit-page.component.*
│   └── unit-import-page.component.*     (NEW — bulk import wizard)
├── components/
│   ├── shared/    (evolve badges for universal types)
│   ├── list/      (data-grid, filters, bulk-actions, import CTA)
│   ├── detail/    (overview, type-specific panel, placeholders)
│   ├── form/      (dynamic sections via unit-form.config)
│   ├── workspace/ (building/floor viz — derive from buildings not mock towers)
│   └── import/    (file upload, column mapping, preview, results)
└── styles/_units.scss
```

**Provider registration:** `provideBuilderUnits()` in `app.config.ts` (alongside projects + buildings).

**Deprecate:** `UnitStoreService` — migrate callers to `UnitService`; remove after cutover.

**Tower mock data:** Replaced by `BuildingService.listForProject()` for building-based hierarchy. `Tower` interface removed; floor visualization groups by `building_id` + `floor_number`.

---

## 3. Routes

### 3.1 Direct-units hierarchy (`project_hierarchy = direct_units`)

| Path | Component | Guard / Resolver |
|---|---|---|
| `/builder-portal/projects/:id/units` | `UnitWorkspacePageComponent` | — |
| `/builder-portal/projects/:id/units/list` | `UnitListPageComponent` | — |
| `/builder-portal/projects/:id/units/create` | `UnitCreatePageComponent` | `unitUnsavedChangesGuard` |
| `/builder-portal/projects/:id/units/import` | `UnitImportPageComponent` | — |
| `/builder-portal/projects/:id/units/:unitId` | `UnitDetailPageComponent` | `unitResolver` |
| `/builder-portal/projects/:id/units/:unitId/edit` | `UnitEditPageComponent` | resolver + guard |

### 3.2 Building-based hierarchy (`project_hierarchy = building_based`)

| Path | Component | Guard / Resolver |
|---|---|---|
| `/builder-portal/projects/:id/buildings/:buildingId/units` | `UnitWorkspacePageComponent` | `buildingResolver` |
| `/builder-portal/projects/:id/buildings/:buildingId/units/list` | `UnitListPageComponent` | `buildingResolver` |
| `/builder-portal/projects/:id/buildings/:buildingId/units/create` | `UnitCreatePageComponent` | resolver + guard |
| `/builder-portal/projects/:id/buildings/:buildingId/units/import` | `UnitImportPageComponent` | `buildingResolver` |
| `/builder-portal/projects/:id/buildings/:buildingId/units/:unitId` | `UnitDetailPageComponent` | `unitResolver` |
| `/builder-portal/projects/:id/buildings/:buildingId/units/:unitId/edit` | `UnitEditPageComponent` | resolver + guard |

**Cross-hierarchy guard:** `unitHierarchyGuard` on building-scoped unit routes redirects to project-scoped units when `direct_units`.

**Navigation CTAs (additive only — no P8/P9 redesign):**

- Project detail → Units (direct-units projects)
- Building detail → Units (building-based projects)
- Building list row action → View units

**Route metadata:** Extend `route-metadata.constants.ts` with `BUILDER_PORTAL_UNIT_IMPORT_METADATA`, building-scoped unit metadata variants.

---

## 4. Components

| Area | Component | Responsibility |
|---|---|---|
| **List** | `UnitDataGridComponent` | Sortable table, row selection, column picker |
| | `UnitQuickFiltersComponent` | Status, type, booking, availability |
| | `UnitAdvancedFiltersComponent` | Building, floor, block, price range |
| | `UnitBulkActionsComponent` | Archive, restore, bulk status/price, export |
| | `UnitColumnSelectorComponent` | Persisted visible columns |
| | `UnitSavedViewsComponent` | Saved filter presets |
| **Form** | `UnitFormComponent` | Stepper: Basics → Placement → Type-specific → Pricing & status → Review |
| | `UnitTypeFieldsComponent` | Renders fields from `unit-form.config` for selected `unit_type` |
| **Detail** | `UnitOverviewComponent` | Common + type-specific read-only panels |
| | `UnitSummaryRowComponent` | Owner/Documents/Handover placeholders (read-only counts) |
| | `UnitGalleryComponent` | Image list (URL-based; storage integration deferred) |
| **Workspace** | `BuildingFloorSelectorComponent` | Replaces tower/floor selector |
| | `UnitGridVisualizationComponent` | Floor-plan tiles by building + floor |
| | `UnitQuickStatsComponent` | KPI cards by status / booking |
| **Import** | `UnitImportUploadComponent` | CSV / Excel file pick |
| | `UnitImportMappingComponent` | Column → field mapping |
| | `UnitImportPreviewComponent` | Valid/invalid row preview |
| | `UnitImportResultsComponent` | Success / error report |

All standalone, `OnPush`, signal APIs — consistent with P8/P9.

---

## 5. Services

| Service | Role |
|---|---|
| `UnitService` | Project/building-scoped CRUD, dashboard stats, bulk ops; enforces hierarchy rules |
| `UnitListStateService` | Search, filters, sort, pagination, selection, `setProjectId` / `setBuildingId` |
| `UnitFormStateService` | Signals model, dynamic errors from `unit-form.config`, duplicate checks |
| `UnitImportService` | Parse file → validate rows → call `import_builder_units` RPC |
| `BuildingService` | Parent building list (existing P9) |
| `ProjectStoreService` | Parent project context (existing P8) |

---

## 6. Repository

```typescript
abstract class BuilderUnitRepository {
  abstract list(query: UnitListQuery): UnitListResult;
  abstract getById(id: string): Unit | undefined;
  abstract getByProjectId(projectId: string, includeArchived?: boolean): readonly Unit[];
  abstract getByBuildingId(buildingId: string, includeArchived?: boolean): readonly Unit[];
  abstract create(projectId: string, organizationId: string, model: UnitFormModel): Unit;
  abstract update(id: string, model: UnitFormModel): Unit | undefined;
  abstract archive(id: string): Unit | undefined;
  abstract restore(id: string): Unit | undefined;
  abstract bulkUpdate(ids: string[], patch: UnitBulkUpdatePatch): number;
  abstract bulkArchive(ids: string[]): number;
  abstract bulkRestore(ids: string[]): number;
  abstract import(projectId: string, rows: UnitImportRow[], buildingId?: string): UnitImportResult;
  abstract unitNumberExists(scope: UnitUniquenessScope, unitNumber: string, excludeId?: string): boolean;
  abstract codeExists(projectId: string, code: string, excludeId?: string): boolean;
}
```

`InMemoryBuilderUnitRepository` mirrors Batch 6 RPC contracts and seeds from `units.seed.ts`.

---

## 7. API Contracts

### 7.1 `list_builder_units`

| Param | Type | Notes |
|---|---|---|
| `p_project_id` | uuid | Required |
| `p_building_id` | uuid | Optional filter |
| `p_search` | text | Matches unit_number, code, block |
| `p_unit_type` | text | Filter |
| `p_status` | text | Filter |
| `p_booking_status` | text | Filter |
| `p_availability` | text | Filter |
| `p_include_archived` | boolean | Default false |
| `p_sort_field` | text | `unit_number`, `code`, `price`, `updated_at`, … |
| `p_sort_direction` | text | `asc` \| `desc` |
| `p_page` / `p_page_size` | integer | Pagination |

**Returns:** `{ items: Unit[], total, page, page_size }`

### 7.2 `create_builder_unit` / `update_builder_unit`

**Payload (common):**

```json
{
  "unit_number": "A-1204",
  "code": "HT-A1204",
  "unit_type": "apartment_flat",
  "building_id": "uuid-or-null",
  "floor_number": 12,
  "block_name": "Tower A",
  "area_sqft": 1250,
  "built_up_area_sqft": 1100,
  "land_area_sqft": null,
  "facing_direction": "east",
  "price": 8500000,
  "booking_status": "available",
  "availability": "for-sale",
  "description": "...",
  "image_urls": ["https://..."],
  "type_attributes": { "bedrooms": 3, "bathrooms": 2 },
  "construction_stage": "structure",
  "progress": 45
}
```

**Errors:**

| Code | Condition |
|---|---|
| `duplicate_code` | `(project_id, code)` exists |
| `duplicate_unit_number` | Same scope (§9) |
| `building_required` | `building_based` project without `building_id` |
| `building_not_allowed` | `direct_units` project with `building_id` |
| `building_project_mismatch` | Building not in project |
| `invalid_unit_type` | Unknown type |
| `not_authorized` | RLS / org access |

### 7.3 `bulk_update_builder_units`

```json
{
  "unit_ids": ["uuid", "..."],
  "patch": {
    "booking_status": "sold",
    "price": 9000000,
    "availability": "not-for-sale"
  }
}
```

### 7.4 `import_builder_units`

```json
{
  "project_id": "uuid",
  "building_id": "uuid-or-null",
  "format": "csv",
  "rows": [ { "...mapped fields..." } ],
  "dry_run": false
}
```

**Returns:** `{ created: n, updated: n, failed: n, errors: [{ row, field, message }] }`

---

## 8. Dynamic Form Mapping

Config file: `config/unit-form.config.ts`

### 8.1 Pattern

```typescript
interface UnitFormFieldDef {
  key: string;                    // common column or type_attributes path
  label: string;
  control: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: SelectOption[];
  section: 'common' | 'placement' | 'type-specific' | 'pricing';
  visibleFor?: UnitType[];        // omit = all types
  validators?: ValidatorFn[];
}
```

`UnitFormStateService.validate()` merges:

1. **Common validators** — unit_number, code, unit_type, price ≥ 0
2. **Hierarchy validators** — building_id required/ forbidden per project
3. **Type-specific validators** — from config for active `unit_type`

### 8.2 Field map by unit type

| Field | apartment_flat | villa | residential_plot | commercial_shop | office | warehouse | industrial_unit | farm_land_plot |
|---|---|---|---|---|---|---|---|---|
| floor_number | ✓ | — | — | ✓ | ✓ | — | — | — |
| door_number | ✓ | — | — | — | — | — | — | — |
| block_name | ✓ | — | — | — | — | — | — | — |
| parking | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — |
| bedrooms / bathrooms / balcony | ✓ | — | — | — | — | — | — | — |
| villa_number | — | ✓ | — | — | — | — | — | — |
| garden | — | ✓ | — | — | — | — | — | — |
| survey / subdivision / patta / FMB | — | — | ✓ | — | — | — | — | ✓ |
| extent / four_side_dimensions | — | — | ✓ | — | — | — | — | ✓ |
| N/S/E/W boundaries | — | — | ✓ | — | — | — | — | ✓ |
| road_width / road_type | — | — | ✓ | — | — | — | — | ✓ |
| soil_type / shape / slope | — | — | ✓ | — | — | — | — | ✓ |
| approval_number / authority | — | — | ✓ | — | — | — | — | ✓ |
| shop_number | — | — | — | ✓ | — | — | — | — |
| office_number | — | — | — | — | ✓ | — | — | — |
| built_up_area / land_area | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Type-specific keys are stored under `type_attributes` (e.g. `type_attributes.bedrooms`).

### 8.3 Suggested unit types by project type

Reuse / extend `unit-inventory-prep.ts` → `SUGGESTED_UNIT_TYPES_BY_PROJECT` (add `farm_land_plot`, `commercial_shop`, `industrial_unit`; align naming with DB enums).

---

## 9. Validation Rules

| Rule | Enforcement |
|---|---|
| **Duplicate code** | Unique `(project_id, code)` — DB + repository + form async check |
| **Duplicate unit number** | Unique per scope: `(building_id, unit_number)` when building-based; `(project_id, unit_number)` when direct-units (where `building_id IS NULL`) |
| **Hierarchy** | `building_id` required iff `building_based`; NULL iff `direct_units` |
| **Building immutability** | `building_id` cannot change after create |
| **Cross-project** | Unit cannot move to another project |
| **Referential integrity** | `building_id` must reference building in same `project_id` |
| **Soft delete** | Archive only (`status = archived`); restore clears archive |
| **Price** | ≥ 0 when provided |
| **Progress** | 0–100 |
| **Import** | Row-level validation; partial success allowed with error report |
| **Bulk update** | All ids must belong to same `project_id`; caller must have org access |

---

## 10. Bulk Operations

| Operation | UI entry | Backend |
|---|---|---|
| CSV import | Import page + list dialog | `import_builder_units` |
| Excel import | Same (parsed client-side via `xlsx` or CSV fallback) | Same RPC |
| Bulk status update | Bulk actions toolbar | `bulk_update_builder_units` (`booking_status`, `availability`) |
| Bulk price update | Bulk actions dialog | `bulk_update_builder_units` (`price`) |
| Bulk archive | Bulk actions | `bulk_archive_builder_units` |
| Bulk restore | Bulk actions (archived view) | `bulk_restore_builder_units` |
| Export | Bulk actions | Client-side CSV from list query (no RPC) |

**Import template:** Downloadable CSV with columns = common fields + flattened type_attributes keys for selected unit_type.

---

## 11. Migration from BUILDER-003 Mock Module

| Current (mock) | P10 target |
|---|---|
| `UnitStoreService` | `UnitService` + `BuilderUnitRepository` |
| `UnitTypeCategory` (6 types) | `UnitType` (8 universal types) |
| `towerId` / `Tower` mock | `buildingId` / `BuildingService` |
| `status` = sales only | `status` (lifecycle) + `booking_status` + `availability` |
| `configuration` free text | `type_attributes` structured fields |
| Construction wizard focus | Universal form + optional construction section |
| No SQL | Batch 6 migration + in-memory parity |
| No tests | Full test suite (§12) |
| Placeholder CSV dialog | Real import flow |

**Seed migration:** Remap `MOCK_UNITS` → `units.seed.ts` with `building_id` references to P9 building seeds.

---

## 12. Testing

| File | Type |
|---|---|
| `services/unit.service.spec.ts` | Unit — CRUD, hierarchy enforcement, duplicate rejection |
| `services/unit-form-state.service.spec.ts` | Unit — dynamic validation per type |
| `utils/project-unit-compatibility.spec.ts` | Unit — hierarchy + route resolution |
| `utils/unit-import-parser.spec.ts` | Unit — CSV/Excel parsing |
| `repositories/in-memory-builder-unit.repository.spec.ts` | Repository — mirrors RPC semantics |
| `repositories/builder-unit.api.spec.ts` | API contract documentation |
| `p10-smoke.spec.ts` | Smoke checklist |
| `e2e/builder-units.spec.ts` (if e2e exists) | Integration — create → list → archive |

**Bulk import tests:** Valid rows, duplicate rows, mixed valid/invalid, building-required project, direct-units project.

---

## 13. Verification Checklist

- [ ] Migration applies cleanly after P9.1
- [ ] Verify SQL passes (`*_verify.sql`)
- [ ] `building_based` project: cannot create unit without `building_id`
- [ ] `direct_units` project: cannot create unit with `building_id`
- [ ] Duplicate `code` rejected within project
- [ ] Duplicate `unit_number` rejected within scope
- [ ] Archive / restore round-trip
- [ ] Bulk update status + price
- [ ] CSV import with error report
- [ ] Dynamic form shows only relevant fields per unit type
- [ ] Building detail → Units navigation works
- [ ] Project detail → Units navigation (direct-units only)
- [ ] `unitHierarchyGuard` blocks building routes on direct-units
- [ ] `npm run build` + `npm run lint` + `npm test` pass
- [ ] No changes to Owner/Documents/Handover modules

---

## 14. Known Limitations

| Limitation | Notes |
|---|---|
| **No Supabase wire-up in Angular** | Repository abstraction ready; in-memory default until API client phase |
| **Image upload** | URL array only; storage bucket integration deferred |
| **Excel import** | Client-side parse; large files capped (e.g. 5 MB / 2000 rows) |
| **No floor-plan CAD viewer** | Grid visualization only (status tiles) |
| **Construction milestones** | Simplified `construction_stage` + `progress`; full milestone CRUD deferred |
| **Unit type extensibility** | New types require CHECK migration + config entry (by design — controlled extensibility) |
| **Mixed-development type filtering** | All 8 types available; UI suggests subset by project type but does not hard-block |
| **Owner/Documents/Handover** | Placeholder UI counts only — intentionally non-functional |
| **Flutter property link** | No `unit_property_links` table until Handover phase |

---

## 15. Implementation Sequence (post-approval)

1. **SQL** — Batch 6 migration + verify
2. **Models + config** — `unit.model.ts`, `unit-form.config.ts`, seeds
3. **Repository + service** — replace `UnitStoreService`
4. **Routes** — building-scoped paths + guards + resolvers
5. **Form** — dynamic type fields
6. **List / workspace / detail** — evolve existing components
7. **Import** — upload + mapping + RPC stub
8. **Tests** — unit, repository, API contract, smoke
9. **Docs** — update `BUILDER-003_Unit_Management.md` status

---

**STOP — Await approval before implementation.**
