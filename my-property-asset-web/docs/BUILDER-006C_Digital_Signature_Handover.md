# BUILDER-006C — Digital Signature, Owner Acceptance & Handover Approval

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** The owner-review → signature → approval-decision workflow nested under a specific handover — explicitly **not** a real e-signature integration. DocuSign/Adobe Sign integration, OTP service, identity verification service, and completion certificate generation are all named "DO NOT IMPLEMENT" because they are future modules (BUILDER-006D+) that plug into the placeholders/extension points this task defines.

---

## 1. Two things resolved before implementation

**Route prefix + param name**, same basis as every prior module: prompt asked for `/builder/handovers/:handoverId/{approval,review,signature}`. Real mount is `/builder-portal`, and the existing parent routes use `:id`, not `:handoverId` — resolved to `/builder-portal/handovers/:id/{approval,review,signature}`, added as three new flat sibling entries in the existing `HANDOVER_ROUTES` array (`loadComponent`), matching BUILDER-006B's inspection/checklist routes exactly.

**Route-count vs. feature-list tension, resolved the established way**: the prompt's "Handover Approval Dashboard" section (Pending/Approved/Rejected/Awaiting Owner/Awaiting Builder counts) reads like a cross-handover workspace, but ROUTING names only 3 paths, all nested under `:id`. Same resolution as BUILDER-006B's Inspection Dashboard: `/approval` is a per-handover page reinterpreting those cross-handover stat categories as per-handover KPIs. `/review` = the Owner Review screen. `/signature` = the 3-party signature workflow.

## 2. Architecture

**Second consumer of `HandoverStoreService.updateStageStatus()`** — the exact extension point BUILDER-006B built and documented as its own template: when both owner+builder signatures are collected, `ApprovalStoreService.signAs()` calls `updateStageStatus(handoverId, 'digital-signature', 'completed')`. When the builder-admin makes a final decision, `ApprovalStoreService.decide()` calls `updateStageStatus(handoverId, 'owner-acceptance', 'completed')` on approval, or `'delayed'` on rejection/cancellation. The `completion` stage is untouched — that's Certificate Generation, explicitly out of scope for a future module.

**`deriveApprovalStatus(signatures, currentStatus)`** (`approval.util.ts`) mirrors BUILDER-006B's `deriveInspectionResult` pattern exactly: terminal statuses (`approved`/`rejected`/`cancelled`) never auto-recompute; otherwise the status derives purely from the owner/builder signature array (`ready-for-signature` → `owner-signed`/`builder-signed` → `pending-approval`). Witness is never part of this derivation — it's optional and doesn't gate anything.

**Real mutations, matching Documents' approve/reject precedent exactly** (confirmed by reading that code before building this): `acceptTerms()`, `signAs()`, `updateReviewNotes()` are genuine `signal.update()`s. The final decision (`decide()`) reuses the exact same two confirmation patterns Documents established — `UiDialogService.confirm()` for the simple Approve/Cancel yes-no gates, and `ModalShellComponent` + a textarea (BUILDER-006B's `TextareaComponent` primitive, no new primitive needed) for Reject, which requires a reason. Only Identity Verification and OTP Verification stay static placeholders — explicitly named "Placeholder" in the prompt and explicitly future-scope.

**Mock-data seeding stays strictly consistent with existing stage data**: only `handover-001`/`002` (already fully completed) are seeded `approved` with both signatures signed. `handover-003` through `007` (none of which have reached the `digital-signature` stage per BUILDER-006A/006B's own seed data) are seeded `ready-for-signature`, no signatures, `termsAccepted: false` — deliberately not faking an "owner-signed" demo state that would contradict the handover's own stage array. The full workflow is fully exercisable live on any pending handover.

**One reusable `SignatureCardComponent`**, parametrized by `party`, used 3× (Owner/Builder mandatory, Witness optional). Owner and Builder show a "Sign as {known name}" button (name comes from the handover record / a fixed "Builder Admin"); Witness requires a name to be entered first. Each card carries a small, explicit "Future signature provider integration point" note satisfying the prompt's forward-compatibility requirement.

**New `ApprovalWorkflowTimelineComponent`**: 4 sequential steps (Ready for Signature → Owner Signed → Builder Signed → Pending Approval) plus a 5th branching step showing whichever terminal outcome occurred — reuses the exact same `.workflow-timeline`/`.workflow-timeline__dot` CSS classes BUILDER-006A's `WorkflowTimelineComponent` already defined globally, since the visual shape is identical and only the underlying steps differ. No new timeline CSS was needed.

**No new "Audit Card" component** — `TimelineCardComponent` (BUILDER-006A) is reused again for the audit timeline (`/approval`) and signature timeline (`/signature`), both fed by the same `HandoverApproval.activity` array. Same for "Statistics Card" → `KpiCardComponent` (dashboard-kit, 6th consumer).

**`OwnerReviewSummaryComponent` reuses existing components rather than rebuilding them**: `HandoverOverviewComponent` (BUILDER-006A) already renders Project/Unit/Owner summary panels, satisfying "Property Summary" + "Unit Summary" directly; `DocumentSummaryPanelComponent` (BUILDER-006A) satisfies "Document Summary" directly. Only one genuinely new panel was needed — `InspectionChecklistSummaryPanelComponent`, reading `InspectionStoreService.getByHandoverId()` — satisfying "Inspection Summary" + "Checklist Summary" together, since they're the same underlying data.

**CSS fix applied proactively a sixth time**: new `handovers/approval/styles/_approval.scss`, its own top-level `@use` line in `src/styles.scss`. Confirmed clean via compiled CSS grep.

**No new nav entry, no new RBAC resource** — reuses `id-09-handover-document`, same reasoning as Inspection/Checklist.

**One additive touch to existing code**: `handover-detail-page.component.html` gained a second header link, "Go to Approval & Signature," alongside BUILDER-006B's existing "Go to Inspection & Checklist" link — nothing else on that page changed.

## 3. Folder structure

```
src/features/builder-portal/handovers/approval/
├── models/approval.model.ts        (ApprovalStatus ×7, SignatureParty/Status, Signature, HandoverApproval —
│                                     reuses HandoverActivityItem from handovers/models, no duplicate type)
├── config/approval.config.ts       (MOCK_APPROVALS ×7 — only handover-001/002 seeded 'approved', rest
│                                     'ready-for-signature' with zero signatures, consistent with stage data)
├── services/
│   ├── approval.util.ts               (deriveApprovalStatus — pure function)
│   └── approval-store.service.ts      (getByHandoverId, acceptTerms(), signAs(), updateReviewNotes(),
│                                        decide() — all real mutations, calling
│                                        handoverStore.updateStageStatus() per §2)
├── styles/_approval.scss           (registered globally, own top-level line)
├── pages/
│   ├── approval-workspace-page.*   (:id/approval — KPIs, workflow timeline, audit timeline, acceptance
│   │                                 notes, Approve/Reject/Cancel decision actions)
│   ├── owner-review-page.*         (:id/review — ApprovalCard, OwnerReviewSummary, Terms & Conditions)
│   └── signature-page.*            (:id/signature — 3× SignatureCard, identity/OTP placeholders, timeline)
└── components/
    ├── shared/     ApprovalStatusBadge (7-value), ApprovalEmptyState, ApprovalLoadingState
    ├── workflow/   ApprovalWorkflowTimeline (4 steps + branch), ApprovalCard (header/context summary)
    ├── review/     OwnerReviewSummary (reuses HandoverOverview + DocumentSummaryPanel), 
    │               InspectionChecklistSummaryPanel, TermsAcceptancePanel, AcceptanceCard (editable review notes)
    └── signature/  SignatureCard (parametrized), IdentityVerificationPlaceholder, OtpVerificationPlaceholder
```

`HandoverStoreService`/`DocumentStoreService`/`InspectionStoreService` were not modified — all reused read-only (or, for `HandoverStoreService`, via the existing `updateStageStatus` method BUILDER-006B added).

## 4. Routing

Three new sibling entries appended to `HANDOVER_ROUTES` (additive — existing entries untouched):

| Path | Component | Load |
|---|---|---|
| `:id/approval` | `ApprovalWorkspacePageComponent` | `loadComponent` |
| `:id/review` | `OwnerReviewPageComponent` | `loadComponent` |
| `:id/signature` | `SignaturePageComponent` | `loadComponent` |

New `RouteMetadata` constants spreading `BUILDER_PORTAL_HANDOVER_DETAIL_METADATA`: `BUILDER_PORTAL_HANDOVER_APPROVAL_METADATA`, `BUILDER_PORTAL_HANDOVER_REVIEW_METADATA`, `BUILDER_PORTAL_HANDOVER_SIGNATURE_METADATA` — all keep `id-09-handover-document:read`.

## 5. Workflow architecture

`OwnerReviewPage` → owner reviews the 3 reused summary panels → checks Terms & Conditions → `acceptTerms()` → auto-navigates to `SignaturePage`. `SignaturePage` gates on `termsAccepted`; once true, shows the 3 `SignatureCard`s. Each sign action calls `signAs()`, which recomputes `ApprovalStatus` via `deriveApprovalStatus()` and — the moment both mandatory signatures are in — flips the handover's `digital-signature` stage to `completed` via the shared `HandoverStoreService`. `ApprovalWorkspacePage` then exposes the builder-admin's final Approve/Reject/Cancel decision (gated to the `pending-approval` state), which flips `owner-acceptance` accordingly. This is the concrete second demonstration that BUILDER-006A's stage-pipeline engine is genuinely reusable across independently-built sub-workflows — 006B drove `inspection`, 006C drives `digital-signature` and `owner-acceptance`, using the identical `updateStageStatus()` call shape both times.

## 6. Dependencies

- `@shared/ui` — no additions; reuses `TextareaComponent` (BUILDER-006B), `ModalShellComponent`, `UiDialogService`, `UiToastService`, `CheckboxComponent`, `InputTextComponent`, `ButtonComponent`, `KpiCardComponent`.
- `handovers/services/handover-store.service.ts` (BUILDER-006A/006B) — `updateStageStatus()`, read-only elsewhere.
- `handovers/components/detail` (BUILDER-006A) — `HandoverOverviewComponent`, `DocumentSummaryPanelComponent`, reused directly inside `OwnerReviewSummaryComponent`.
- `handovers/components/shared`/`workflow` (BUILDER-006A) — `WorkflowCardComponent`, `TimelineCardComponent`.
- `handovers/inspection/services/inspection-store.service.ts` (BUILDER-006B) — read-only `getByHandoverId()` for the Inspection & Checklist summary panel.
- `builder-portal/components/cards`, `builder-portal/models/dashboard.model` (BUILDER-001) — the 6th consumer of the dashboard-kit.

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code. Within Handovers, only the additive header link on the existing detail page was touched.

## 7. Extension points

- BUILDER-006D (Completion Certificate) should follow the identical pattern: its own store mutation, then `HandoverStoreService.updateStageStatus(handoverId, 'completion', ...)`.
- `SignatureCardComponent`'s "Sign" action and the identity/OTP placeholders are the named integration points for a real e-signature provider (DocuSign/Adobe Sign), OTP service, and identity verification service — swapping the mock `signAs()` call for a real provider callback should not require changing any other component.
- `Signature.status` supports `'declined'` in the type but no UI path currently sets it — a future module handling signature refusal could add that action without a model change.
- The Owner Mobile App would read `ApprovalStoreService.getByHandoverId()`'s output directly to show an owner their own signature/approval status — kept auth- and role-agnostic for exactly this reuse, same reasoning as every prior BUILDER-006x model.

## 8. Verification

- `npm run build` — succeeds, no TypeScript errors (one real type error caught and fixed: `SEQUENCE` needed `as const` rather than a `readonly ApprovalStatus[]` annotation, since `Record<(typeof SEQUENCE)[number], string>` needs the narrower 4-value literal union, not the full 7-value `ApprovalStatus`). Initial bundle: 2.14MB, unchanged from BUILDER-006B (fully lazy, so no measurable eager-bundle growth) — comfortable headroom against the 2.4MB ceiling.
- `npm run lint` — all files pass.
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.approval-status-badge`, `.signature-card__header`, `.approval-card__header`, `.approval-placeholder-panel` and other new classes compile as plain, unscoped selectors — the CSS-encapsulation fix held clean a sixth time.
- `ng serve` confirmed reachable (HTTP 200) for `/builder-portal/handovers/handover-003/{approval,review,signature}` and `/builder-portal/handovers/handover-001/approval` (already-approved terminal state). Full interactive walkthrough (accept terms → sign owner → sign builder → confirm `digital-signature` stage flips to completed → approve/reject/cancel → confirm `owner-acceptance` stage updates) was not exercised in an actual browser click-through in this pass — recommended as the next verification step, same caveat noted in BUILDER-006B's own doc.
