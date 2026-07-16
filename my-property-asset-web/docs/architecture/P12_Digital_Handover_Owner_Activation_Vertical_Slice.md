---

## Document Information

| Field | Value |
|---|---|
| **Document ID** | P12 |
| **Document Name** | Digital Handover & Owner Activation Vertical Slice |
| **Phase** | P12 – Digital Handover & Owner Activation |
| **Depends On** | P1–P5 (FINAL), P6A, P6B, P7, P8, P9, P9.1, P10, P11 |
| **Status** | **Design — await approval before implementation** |
| **Created** | 2026-07-16 |
| **Branch** | `feature/digital-handover` |
| **Source of Truth** | P1–P5, P3 lifecycle, P10 units, P11 owner assignment, BUILDER-006A/B/C/D (evolve, do not redesign) |

---

# P12 — Digital Handover & Owner Activation Vertical Slice

## Objective

Implement the complete **Digital Handover** lifecycle from assigned buyer to owner activation. This phase is the core differentiator: secure invitation, buyer acceptance, owner activation, and automatic property visibility in Flutter using existing Schema V2 without duplicate property creation.

**Scope focus:** handover documents, checklist, invitation, acceptance, owner activation, timeline/audit.

**Explicitly out of scope:** White Label, Builder Notifications platform, Subscription features.

---

## 1. Database Summary (Batch 8)

| File | Purpose |
|---|---|
| `supabase/migrations/20260716180000_p12_b08_digital_handover_owner_activation.sql` | Batch 8 migration |
| `supabase/migrations/verify/20260716180000_p12_b08_digital_handover_owner_activation_verify.sql` | Verification |

**Apply order:** P6A → P6B → P7 → P8 → P9 → P9.1 → P10 → P11 → **P12 Batch 8** → (stop)

### Tables

#### 1.1 `unit_handovers`

Master handover record per unit assignment.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `organization_id` | uuid NOT NULL | mirrored from unit/project |
| `project_id` | uuid NOT NULL FK | |
| `building_id` | uuid NULL FK | optional (direct-units support) |
| `unit_id` | uuid NOT NULL FK → `builder_units` | one active handover per unit |
| `owner_assignment_id` | uuid NOT NULL FK → `builder_owner_assignments` | active assignment at initiation |
| `status` | text NOT NULL | `draft` \| `in_progress` \| `invited` \| `accepted` \| `activated` \| `completed` \| `cancelled` |
| `invitation_status` | text NOT NULL | `not_generated` \| `pending` \| `accepted` \| `expired` \| `cancelled` \| `resent` |
| `invitation_expires_at` | timestamptz | |
| `accepted_at` | timestamptz | buyer accepted invite |
| `activated_at` | timestamptz | owner activation completed |
| `completed_at` | timestamptz | final handover closure |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` | uuid FK auth.users | |
| `cancelled_at` | timestamptz | soft close |

#### 1.2 `unit_handover_documents`

Unit-level handover package attachment map (many docs per unit).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `handover_id` | uuid NOT NULL FK → `unit_handovers` | |
| `document_id` | uuid NOT NULL FK → handover document master | |
| `document_type` | text NOT NULL | see §8 document model |
| `is_required` | boolean NOT NULL DEFAULT true | |
| `is_verified` | boolean NOT NULL DEFAULT false | |
| `verified_at` | timestamptz | |
| `verified_by` | uuid FK auth.users | |
| `notes` | text | |
| `created_at` / `updated_at` | timestamptz | |

#### 1.3 `unit_handover_checklists`

Configurable checklist template snapshots at handover level.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `handover_id` | uuid NOT NULL FK → `unit_handovers` | |
| `item_code` | text NOT NULL | stable key |
| `item_label` | text NOT NULL | configurable label |
| `is_mandatory` | boolean NOT NULL DEFAULT true | |
| `status` | text NOT NULL DEFAULT `pending` | `pending` \| `completed` \| `blocked` |
| `completed_at` | timestamptz | |
| `completed_by` | uuid FK auth.users | |
| `remarks` | text | |
| `display_order` | integer NOT NULL DEFAULT 0 | |

#### 1.4 `owner_invitations` (Type B)

Secure invitation for buyer-to-owner activation.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `organization_id` | uuid NOT NULL | |
| `handover_id` | uuid NOT NULL FK → `unit_handovers` | |
| `assignment_id` | uuid NOT NULL FK → `builder_owner_assignments` | |
| `prospect_id` | uuid NOT NULL FK → `builder_owner_prospects` | |
| `channel` | text NOT NULL DEFAULT `email` | `email` only in P12; sms/whatsapp future |
| `token_hash` | text NOT NULL | hashed token only |
| `status` | text NOT NULL DEFAULT `pending` | `pending` \| `accepted` \| `expired` \| `cancelled` \| `resent` |
| `expires_at` | timestamptz NOT NULL | |
| `accepted_at` | timestamptz | |
| `cancelled_at` | timestamptz | |
| `resent_count` | integer NOT NULL DEFAULT 0 | |
| `created_at` / `updated_at` | timestamptz | |
| `created_by` | uuid FK auth.users | |

#### 1.5 `unit_property_links`

Canonical link between handover unit and Flutter property.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `organization_id` | uuid NOT NULL | |
| `unit_id` | uuid NOT NULL FK → `builder_units` | |
| `handover_id` | uuid NOT NULL FK → `unit_handovers` | |
| `assignment_id` | uuid NOT NULL FK → `builder_owner_assignments` | |
| `owner_user_id` | uuid NOT NULL FK auth.users | Flutter owner user |
| `property_id` | uuid NOT NULL FK → existing `properties` | reuse existing schema |
| `link_status` | text NOT NULL DEFAULT `active` | `active` \| `superseded` |
| `activated_at` | timestamptz NOT NULL | |
| `created_at` | timestamptz NOT NULL DEFAULT now() | |

**Critical uniqueness (no duplication):**

- `UNIQUE (unit_id)` where `link_status = 'active'`
- `UNIQUE (property_id)` where `link_status = 'active'`

#### 1.6 `unit_handover_timeline_events`

Full audit timeline for actions and transitions.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `handover_id` | uuid NOT NULL FK | |
| `event_type` | text NOT NULL | see §11 timeline flow |
| `event_title` | text NOT NULL | |
| `event_description` | text | |
| `metadata` | jsonb NOT NULL DEFAULT '{}' | token/channel/status snapshots |
| `acted_by` | uuid FK auth.users | nullable for system events |
| `created_at` | timestamptz NOT NULL DEFAULT now() | |

### Indexes

- `unit_handovers`: `(organization_id, status)`, `(project_id, status)`, `(unit_id)`
- `unit_handover_documents`: `(handover_id, is_verified)`, `(document_type)`
- `unit_handover_checklists`: `(handover_id, status)`, `(handover_id, display_order)`
- `owner_invitations`: `(handover_id, status)`, `(assignment_id, status)`, `(expires_at)`, unique active token hash
- `unit_property_links`: unique active unit link + unique active property link
- `unit_handover_timeline_events`: `(handover_id, created_at desc)`

### Triggers / Security

| Trigger / rule | Behavior |
|---|---|
| `enforce_handover_scope` | project/building/unit/assignment must align within same org |
| `enforce_single_active_handover_per_unit` | only one non-cancelled active lifecycle handover per unit |
| `owner_invitation_token_security` | store hash only, reject plain-token persistence |
| `owner_invitation_one_time_use` | `accept` transition valid only from `pending` and before expiry |
| `prevent_duplicate_active_property_link` | reject duplicate active `unit_id` or `property_id` |
| `append_handover_timeline_event` | auto audit insertion on status/invitation/activation changes |

### Explicitly NOT in Batch 8

- SMS gateway integration
- WhatsApp delivery integration
- Builder broadcast notifications
- White label assets/config

---

## 2. Angular Folder Structure

Evolve existing handover vertical (`src/features/builder-portal/handovers`) and keep additive structure.

```
src/features/builder-portal/handovers/
├── handovers.routes.ts
├── models/
│   ├── handover.model.ts                         (evolve status/invitation/activation fields)
│   ├── handover-document.model.ts                (NEW)
│   ├── handover-checklist.model.ts               (NEW)
│   ├── owner-invitation.model.ts                 (NEW)
│   └── handover-timeline.model.ts                (NEW)
├── config/
│   ├── handovers.config.ts                       (evolve)
│   ├── handover-document-types.config.ts         (NEW)
│   └── handover-checklist-template.config.ts     (NEW configurable checklist defaults)
├── repositories/
│   ├── handover.repository.ts                    (NEW abstraction)
│   ├── in-memory-handover.repository.ts
│   ├── handover-invitation.repository.ts         (NEW abstraction)
│   ├── in-memory-handover-invitation.repository.ts
│   └── handover.api.spec.ts
├── services/
│   ├── handover.service.ts                       (replaces direct store usage in pages)
│   ├── handover-document.service.ts              (upload/verify package docs)
│   ├── handover-checklist.service.ts             (configure/complete checklist)
│   ├── handover-invitation.service.ts            (generate/resend/cancel/accept)
│   ├── owner-activation.service.ts               (activate owner + property link)
│   ├── handover-timeline.service.ts              (read consolidated audit)
│   └── handover-dashboard.service.ts             (KPI aggregation)
├── pages/
│   ├── handover-workspace-page.*                 (evolve dashboard)
│   ├── handover-detail-page.*                    (evolve detail)
│   ├── handover-documents-page.*                 (NEW)
│   ├── handover-invitation-page.*                (NEW)
│   ├── handover-activation-page.*                (NEW)
│   └── handover-audit-page.*                     (NEW)
├── components/
│   ├── detail/                                   (evolve summary panels)
│   ├── documents/
│   │   ├── handover-document-upload-panel.component.ts
│   │   ├── handover-document-list.component.ts
│   │   └── handover-document-type-badge.component.ts
│   ├── checklist/
│   │   ├── handover-checklist-panel.component.ts
│   │   └── handover-checklist-item.component.ts
│   ├── invitation/
│   │   ├── invitation-status-panel.component.ts
│   │   ├── invitation-token-preview.component.ts
│   │   └── invitation-expiry-panel.component.ts
│   ├── activation/
│   │   ├── activation-readiness-panel.component.ts
│   │   ├── owner-activation-summary.component.ts
│   │   └── property-link-summary.component.ts
│   └── timeline/
│       ├── handover-timeline.component.ts
│       └── handover-audit-history-panel.component.ts
└── styles/
    └── _handovers.scss                           (evolve, keep global registration)
```

**Existing modules reused (no redesign):**

- `builder-portal/documents` for upload/version/approval mechanics
- `builder-portal/owners` for assignment and prospect info
- existing handover inspection/approval/completion pages where still valid

---

## 3. Routes

All routes remain under `/builder-portal/handovers/:id/*` to preserve existing navigation.

| Path | Component | Purpose |
|---|---|---|
| `/builder-portal/handovers` | `HandoverWorkspacePageComponent` | portfolio dashboard |
| `/builder-portal/handovers/:id` | `HandoverDetailPageComponent` | handover summary |
| `/builder-portal/handovers/:id/documents` | `HandoverDocumentsPageComponent` | upload/verify handover docs |
| `/builder-portal/handovers/:id/checklist` | existing checklist page (evolved) | checklist execution |
| `/builder-portal/handovers/:id/invitation` | `HandoverInvitationPageComponent` | generate/resend/cancel invitation |
| `/builder-portal/handovers/:id/activation` | `HandoverActivationPageComponent` | accept + activate owner/property |
| `/builder-portal/handovers/:id/timeline` | existing timeline view (evolved) | event timeline |
| `/builder-portal/handovers/:id/audit` | `HandoverAuditPageComponent` | immutable audit trail |

**Owner invite accept route (public/auth flow):**

- `/auth/owner-invitation?token=...` (new accept experience for buyer; keeps P7 token pattern)

---

## 4. Components

| Area | Components | Responsibility |
|---|---|---|
| Dashboard | `HandoverWorkspacePageComponent`, KPI cards/charts | available/reserved/booked/registered/handed-over counts + handover pipeline KPIs |
| Documents | upload panel, doc list, type badges | handover package completeness per unit |
| Checklist | checklist panel/items | configurable item tracking and blocking status |
| Invitation | status panel, token/expiry panels | secure invite lifecycle and controls |
| Activation | readiness panel, activation summary, property link summary | owner membership + property linking visibility |
| Timeline | timeline component + audit panel | full sequence visibility and compliance trail |

---

## 5. Services

| Service | Role |
|---|---|
| `HandoverService` | orchestrates end-to-end status machine |
| `HandoverDocumentService` | bind uploaded docs to handover package + verify |
| `HandoverChecklistService` | load template, toggle status, compute readiness |
| `HandoverInvitationService` | generate secure token, resend, cancel, accept |
| `OwnerActivationService` | create/attach owner membership + create/reuse property link |
| `HandoverTimelineService` | append/read timeline events |
| `HandoverDashboardService` | aggregate status counts |

---

## 6. Repositories

```typescript
abstract class HandoverRepository {
  abstract list(query: HandoverListQuery): HandoverListResult;
  abstract getById(id: string): Handover | undefined;
  abstract updateStatus(id: string, status: HandoverStatus): Handover | undefined;
  abstract attachDocument(handoverId: string, payload: HandoverDocumentPayload): HandoverDocument;
  abstract updateChecklistItem(handoverId: string, itemCode: string, status: ChecklistItemStatus): HandoverChecklistItem;
  abstract appendEvent(handoverId: string, event: TimelineEventInput): void;
}

abstract class HandoverInvitationRepository {
  abstract generate(handoverId: string, ttlHours: number): GeneratedInvitation;
  abstract resend(invitationId: string, ttlHours: number): GeneratedInvitation;
  abstract cancel(invitationId: string): OwnerInvitation;
  abstract accept(token: string): InvitationAcceptanceResult;
}

abstract class OwnerActivationRepository {
  abstract activateFromAcceptedInvitation(input: ActivationInput): ActivationResult;
  abstract getActiveUnitPropertyLink(unitId: string): UnitPropertyLink | undefined;
}
```

In-memory implementations mirror RPC behavior first; swap to SQL-backed client later.

---

## 7. API Contracts

| Endpoint / RPC | Purpose |
|---|---|
| `upload_handover_document` | add document to handover package |
| `verify_handover_document` | mark document verified |
| `list_handover_documents` | list package docs by handover/unit |
| `upsert_handover_checklist_items` | configure checklist items |
| `update_handover_checklist_item_status` | complete/block checklist item |
| `generate_owner_invitation` | create secure one-time invitation |
| `resend_owner_invitation` | rotate token + extend expiry |
| `cancel_owner_invitation` | invalidate invitation |
| `accept_owner_invitation` | one-time token accept transition |
| `activate_owner_from_handover` | create membership/link property |
| `get_handover_timeline` | full timeline events |
| `get_handover_dashboard_stats` | status counters |

---

## 8. Document Model

`handover_document_type` enum (required pack capable, multiple docs per unit):

- `sale_deed`
- `registration_document`
- `patta`
- `fmb`
- `survey_sketch`
- `encumbrance_certificate`
- `tax_receipt`
- `building_approval`
- `completion_certificate`
- `occupancy_certificate`
- `electrical_documents`
- `water_connection`
- `maintenance_documents`
- `builder_warranty_documents`
- `other_attachment`

Each `unit_handover_documents` row supports:

- multiple versions through existing document subsystem
- required/optional flag
- verification status
- audit notes

---

## 9. Invitation Flow

1. Builder clicks **Generate Invitation** (handover must be checklist-ready).
2. System creates `owner_invitations` row with hashed token and expiry.
3. Delivery channel = email in P12 (SMS/WhatsApp future).
4. Buyer opens `/auth/owner-invitation?token=...`.
5. `accept_owner_invitation` validates: exists, unexpired, pending, one-time.
6. Invitation status becomes `accepted`, handover status moves to `accepted`.
7. Timeline event emitted for each transition.

Security constraints:

- token hash only in DB
- one-time use
- explicit expiry
- cancellation and resend invalidate prior token

---

## 10. Activation Flow

1. Invitation accepted.
2. `activate_owner_from_handover` executes in transaction:
   - resolve/create owner membership in existing Flutter-aligned org model
   - ensure owner linked to correct organization
   - create or reuse `properties` record (no duplicate)
   - insert/update `unit_property_links`
   - mark handover `activated`
3. Unit ownership status and timeline updated.
4. Flutter app sees linked property through existing schema and owner membership.

No duplicate property policy:

- lookup by active `unit_property_links.unit_id`
- if exists, reuse linked property
- if not, create once and link

---

## 11. Timeline Flow

Mandatory event trail in `unit_handover_timeline_events`:

- `buyer_assigned`
- `handover_started`
- `document_uploaded`
- `document_verified`
- `checklist_completed`
- `invitation_generated`
- `invitation_resent`
- `invitation_cancelled`
- `invitation_accepted`
- `owner_activated`
- `property_linked`
- `handover_completed`

Timeline rules:

- append-only
- system and actor events supported
- metadata snapshot for audit/compliance

---

## 12. Validation Rules

| Rule | Enforcement |
|---|---|
| One active owner per unit | inherited from P11 + handover scope trigger |
| One active invitation token per handover | unique pending invitation + token rotation |
| Invitation one-time use | accept only from `pending` |
| Invitation expiry | accept rejected after `expires_at` |
| Handover activation prerequisite | accepted invitation + checklist complete + required docs verified |
| No duplicate property records | unique active unit/property links + transactional activate RPC |
| Soft delete only | cancel/close statuses; no hard deletes for handover history |
| Full audit | timeline event append on every state transition |

---

## 13. Verification Checklist

- [ ] Migration applies cleanly after P11
- [ ] Verify SQL verify script passes
- [ ] Document upload supports multiple docs per unit
- [ ] Required docs must be verified before invitation generation
- [ ] Checklist blocks invitation when mandatory items pending/blocked
- [ ] Invitation token generated, hashed, expires correctly
- [ ] Resend rotates token and invalidates previous token
- [ ] Cancelled invitation cannot be accepted
- [ ] Accepted invitation cannot be reused
- [ ] Activation creates/reuses owner membership correctly
- [ ] Activation creates/reuses property link without duplicates
- [ ] Property appears in Flutter data path via existing schema
- [ ] Timeline includes all mandatory events in order
- [ ] Audit page reflects immutable event history
- [ ] Unit tests/repository/API/integration/invitation/activation/document tests pass
- [ ] No white-label / notifications / subscription code added

---

## 14. Known Limitations

| Limitation | Notes |
|---|---|
| Email-only invitation in P12 | SMS/WhatsApp future |
| Document storage integration remains provider-dependent | uses existing document module scaffolding |
| Activation flow assumes existing Flutter auth/member conventions | production hardening needed during API wiring |
| Checklist template configurable per handover, not full global admin UI yet | global template management future enhancement |
| No background notification orchestration | intentionally out of scope |

---

## 15. Testing Plan

- Unit tests: invitation token validation, lifecycle transitions, activation guards
- Repository tests: uniqueness, status transitions, timeline append behavior
- API tests: generate/resend/cancel/accept/activate contracts
- Integration tests: assign buyer → docs/checklist → invitation → accept → activation → property link
- Invitation tests: expiry, one-time use, resend invalidation
- Activation tests: duplicate-prevention and rollback behavior
- Document upload tests: multi-document and required-type verification
- Smoke tests: end-to-end happy path and common failure path

---

## 16. Implementation Sequence (post-approval)

1. SQL migration + verify scripts (Batch 8)
2. models/config for documents/checklist/invitation/timeline
3. repository abstractions + in-memory parity
4. handover/invitation/activation services
5. route additions and page integration
6. timeline/audit wiring
7. test suite and smoke checks
8. docs updates for BUILDER-006 and P12 status

---

**STOP — Await approval before implementation.**

