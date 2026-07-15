# BUILDER-006D — Handover Completion, Possession Certificate & Final Closure

**Status:** Implemented (code-first, see `BUILDER-001_Builder_Dashboard.md`'s governance note — same basis applies here)
**Date:** 2026-07-15
**Scope:** The final closure workflow — marking builder responsibility complete and owner possession started, previewing a mock possession certificate, and archiving the handover's full audit trail. This is the last module in the Handover sub-workflow series (006A–006D). PDF generation, QR generation, email/SMS/WhatsApp services, Flutter Owner App activation, and CRM integration are all named "DO NOT IMPLEMENT" — represented only as named placeholders and a consolidated future-integrations reference panel.

---

## 1. Two things resolved before implementation

**Route prefix + param name**, identical basis to every prior sub-module: prompt asked for `/builder/handovers/:handoverId/{completion,certificate,archive}`. Real mount is `/builder-portal`, existing routes use `:id` — resolved to `/builder-portal/handovers/:id/{completion,certificate,archive}`, three new flat `loadComponent` sibling entries appended to `HANDOVER_ROUTES` (now 10 entries total), exactly matching the shape of the 7 existing entries.

**Route-count vs. feature-list tension, resolved the established way (3rd time)**: the prompt's "Completion Dashboard" section (Completed Handovers/Today's Completions/Monthly Summary) reads like a portfolio-wide dashboard, but ROUTING names only 3 paths, all nested under `:id`. Per the 006B/006C pattern: `/completion` is a per-handover page reinterpreting those stats as per-handover KPIs. `/certificate` = the Possession Certificate preview. `/archive` = the closed-handover audit/retention view. "Owner Delivery Package" and "Future Integration Placeholders" (no dedicated route named) live on `/completion`.

## 2. Architecture

**Third and final consumer of `HandoverStoreService.updateStageStatus()`**, closing the pipeline BUILDER-006A defined: `CompletionStoreService.finalizeCompletion(handoverId, completedBy)` — a manual action gated on the approval record being `'approved'` — sets `completedAt`/`completedBy`/`builderResponsibilityCompleted`/`ownerPossessionStarted`, then calls `updateStageStatus(handoverId, 'completion', 'completed')`. Because `HandoverStoreService.deriveOverall()` (built by 006B, unchanged since) computes `overallStatus` purely from the stage array, finishing this last stage is what naturally makes the handover's `overallStatus` become `'completed'` — no new logic was needed in `HandoverStoreService` itself, only a new caller.

**`CompletionStatus` is never a stored field** — `deriveCompletionStatus(approvalStatus, completedAt)` (`completion.util.ts`) computes `'not-ready'` / `'ready'` / `'completed'` purely from the approval record's status and whether `completedAt` is set. This mirrors `approval.util.ts`'s `deriveApprovalStatus` and `inspection.util.ts`'s `deriveInspectionResult` exactly — applying the "seeded when it should be derived" lesson from day one rather than needing a later correction.

**`generateCertificate(handoverId)`** is a distinct follow-up mutation (not bundled into finalize) — sets a mock `certificateNumber`/`issuedAt`/`status: 'generated'`. This two-step "Finalize → Generate Certificate" flow gives the closure workflow a realistic, auditable shape (matching the prompt's "auditable business workflow" framing) and mirrors how a real PDF/QR service would eventually replace just this one mock action without touching anything else.

**Delivered Documents is read-only/derived, not a new mutation**: `DocumentStoreService.getByUnitId(unitId).filter(d => d.visibility === 'owner-visible' && d.approvalStatus === 'approved')`. Keys & Assets, by contrast, is a real interactive checklist (`toggleKeyAsset()`) — the prompt explicitly calls it a "Checklist," unlike Delivered Documents which is a "summary." Warranty Summary and the Future Integrations panel are static config-driven reference content (the same terms/roadmap apply to every handover), not per-handover mutable state.

**Heavy reuse across the whole page set, continuing 006C's discipline**: `HandoverOverviewComponent` + `DocumentSummaryPanelComponent` (006A) and `InspectionChecklistSummaryPanelComponent` (006C) are reused directly on `/completion`. `WorkflowTimelineComponent` (006A) is reused a second time to show the now-fully-completed 8-stage pipeline. `TimelineCardComponent` (006A) is reused again for the Completion timeline and — on `/archive` — fed a **merged, sorted array combining `handover.activity` + `approval.activity` + `completion.activity`**, the first genuinely cross-sub-feature merged audit trail in this series. `SuccessStateComponent` (confirmed already existing in `@shared/ui`, previously unused anywhere in this codebase) is reused directly for the "Handover complete!" banner — satisfying the "premium, not childish" celebration requirement with the platform's own existing sober success-state pattern rather than a bespoke confetti component.

**New components kept to what was genuinely missing**: `CompletionSummaryCardComponent` (header identity card, same shape as 006C's `ApprovalCardComponent`), `AcceptanceSummaryPanelComponent` (surfaces `HandoverApproval.decisionAt/decisionBy/signatures` — nothing showed these outside the Approval page itself before this), `OwnerPackageCardComponent` (one composed component grouping delivered docs, warranty, keys/assets, maintenance guide, download placeholder — same grouping discipline as 006C's `OwnerReviewSummaryComponent`), `CertificatePreviewComponent` (the certificate visual), `QrVerificationPlaceholderComponent`/`PdfDownloadPlaceholderComponent` (mirror 006C's `IdentityVerificationPlaceholderComponent` pattern exactly), `ArchiveSummaryCardComponent`, `FutureIntegrationsPanelComponent` (static grid of the 7 named future integrations). No separate certificate-status-badge component — the 2-value certificate status renders inline in `CertificatePreviewComponent`.

**Printable layout — genuinely new to this codebase** (confirmed zero `@media print` usage anywhere in `src/` before this, beyond one unrelated breakpoint token file): `_completion.scss` adds a `@media print` block hiding elements marked `.certificate-page-chrome` (header, action buttons) and cleaning up `.certificate-preview`'s box-shadow/border for print. A "Print certificate" button calls `window.print()` directly. This print scope is deliberately limited to this feature's own container classes — it does not attempt to hide the global app shell's sidebar/topbar, since their exact class names weren't verified; flagged as a worthwhile follow-up in the Extension Points section below.

**Mock-data seeding stays strictly consistent with the established chain** (006C's own rule, continued a third time): only `handover-001`/`002` (already `'approved'`) get a seeded `HandoverCompletion` with `completedAt` set and a pre-generated certificate. All other handovers get an empty completion record — `deriveCompletionStatus` naturally computes `'not-ready'` for them. The full finalize → generate-certificate flow is fully exercisable live once a handover is walked through 006B/006C's flow first.

**CSS fix applied proactively a seventh time**: new `handovers/completion/styles/_completion.scss`, own top-level `@use` line in `src/styles.scss`.

**No new nav entry, no new RBAC resource** — reuses `id-09-handover-document`.

**Two small additive touches to existing code**: `handover-detail-page.component.html` gained a third header link, "Go to Completion." `approval-workspace-page.component.html`'s `@case ('approved')` branch gained a "Go to completion" link next to its existing static message (plus a `goToCompletion()` method on that page's component) — both are additive insertions into existing conditional branches.

## 3. Folder structure

```
src/features/builder-portal/handovers/completion/
├── models/completion.model.ts       (CompletionStatus, CertificateStatus, KeyAssetItem, PossessionCertificate,
│                                      HandoverCompletion, WarrantyTerm, FutureIntegrationPoint)
├── config/completion.config.ts      (KEY_ASSET_TEMPLATE ×4, WARRANTY_TERMS ×4, FUTURE_INTEGRATION_POINTS ×7,
│                                      MOCK_COMPLETIONS ×7 — only 001/002 pre-completed)
├── services/
│   ├── completion.util.ts              (deriveCompletionStatus — pure function)
│   └── completion-store.service.ts     (getByHandoverId, toggleKeyAsset(), finalizeCompletion(),
│                                         generateCertificate() — real mutations; finalizeCompletion() calls
│                                         handoverStore.updateStageStatus())
├── styles/_completion.scss          (registered globally, own top-level line; includes @media print block)
├── pages/
│   ├── completion-workspace-page.*  (:id/completion — success banner / ready-notice / not-ready empty state,
│   │                                  KPIs, reused summaries, full pipeline timeline, owner package,
│   │                                  future-integrations panel, finalize action)
│   ├── certificate-page.*           (:id/certificate — CertificatePreview, generate/print actions, QR/PDF
│   │                                  placeholders, gated on completion.completedAt)
│   └── archive-page.*               (:id/archive — ArchiveSummaryCard, merged 3-source audit trail)
└── components/
    ├── shared/       CompletionStatusBadge, CompletionEmptyState, CompletionLoadingState
    ├── summary/      CompletionSummaryCard, AcceptanceSummaryPanel, FutureIntegrationsPanel
    ├── package/      OwnerPackageCard
    ├── certificate/  CertificatePreview, QrVerificationPlaceholder, PdfDownloadPlaceholder
    └── archive/      ArchiveSummaryCard
```

`HandoverStoreService`, `ApprovalStoreService`, `InspectionStoreService`, `DocumentStoreService`, `OwnerStoreService` were not modified — all reused read-only (or via `HandoverStoreService.updateStageStatus`, unchanged since 006B).

## 4. Routing

Three new sibling entries appended to `HANDOVER_ROUTES` (additive — existing 7 entries untouched):

| Path | Component | Load |
|---|---|---|
| `:id/completion` | `CompletionWorkspacePageComponent` | `loadComponent` |
| `:id/certificate` | `CertificatePageComponent` | `loadComponent` |
| `:id/archive` | `ArchivePageComponent` | `loadComponent` |

New `RouteMetadata` constants spreading `BUILDER_PORTAL_HANDOVER_DETAIL_METADATA`: `BUILDER_PORTAL_HANDOVER_COMPLETION_METADATA`, `BUILDER_PORTAL_HANDOVER_CERTIFICATE_METADATA`, `BUILDER_PORTAL_HANDOVER_ARCHIVE_METADATA` — all keep `id-09-handover-document:read`.

## 5. Workflow (Completion Domain)

`CompletionWorkspacePage` computes `status = deriveCompletionStatus(approval.status, completion.completedAt)` and branches its top banner accordingly: `'not-ready'` → `CompletionEmptyState` + link to `/approval`; `'ready'` → a notice + "Finalize completion" button (behind a `UiDialogService.confirm()` gate, since this is a one-way action); `'completed'` → `SuccessStateComponent`. Finalizing calls `CompletionStoreService.finalizeCompletion()`, which flips the `completion` stage and (via the unchanged `HandoverStoreService.deriveOverall()`) the handover's own `overallStatus`. `CertificatePage` is separately gated on `completion.completedAt` — before that, it shows the empty state; after, it shows `CertificatePreviewComponent` plus a "Generate certificate" action (only before `certificate.status === 'generated'`) and a "Print certificate" action (only after). `ArchivePage` is always viewable and shows the full cross-module audit trail regardless of completion state.

## 6. Certificate Architecture

`PossessionCertificate` (`certificateNumber?`, `issuedAt?`, `status`) is deliberately minimal — everything else the certificate displays (property, unit, owner, builder, signatures) is composed on read from `Handover` + `HandoverApproval` + `Owner`, not duplicated onto the certificate record itself. `CertificatePreviewComponent` takes all three as inputs and renders a self-contained, bordered "certificate" visual (`.certificate-preview`) styled as its own print-safe unit — the print CSS hides everything outside it (`.certificate-page-chrome`) rather than trying to style the certificate differently for print vs. screen.

## 7. Dependencies

- `@shared/ui` — no new primitives; reuses `SuccessStateComponent` (previously unused anywhere in this codebase), `CheckboxComponent`, `ButtonComponent`, `UiDialogService`, `UiToastService`, `KpiCardComponent`.
- `handovers/services/handover-store.service.ts` (006A/006B) — `updateStageStatus()`, read-only elsewhere.
- `handovers/components/detail`/`shared`/`workflow` (006A) — `HandoverOverviewComponent`, `DocumentSummaryPanelComponent`, `WorkflowCardComponent`, `WorkflowTimelineComponent`, `TimelineCardComponent`.
- `handovers/approval/services/approval-store.service.ts` (006C) — read-only `getByHandoverId()`.
- `handovers/approval/components/review` (006C) — `InspectionChecklistSummaryPanelComponent`, reused directly.
- `handovers/inspection/services/inspection-store.service.ts` (006B) — read-only `getByHandoverId()`.
- `owners/services/owner-store.service.ts` (004) — read-only `getById()` for the certificate's Owner Information section.
- `builder-portal/components/cards`, `builder-portal/models/dashboard.model` (001) — the 7th consumer of the dashboard-kit.

**Not touched**: `src/features/super-admin/**`, any Supabase/API/backend code. Within Handovers, only the two additive header/quick-action links on existing pages were touched.

## 8. Extension points

- PDF Generator, QR Verification, Email/SMS/WhatsApp Notification, Flutter Owner App Activation, and CRM Integration are all represented in `FutureIntegrationsPanelComponent`'s config-driven grid — each is the named replacement for a specific mock action already in place (`generateCertificate()` → PDF Generator; `QrVerificationPlaceholderComponent` → QR Verification, etc.).
- The print CSS currently only hides this feature's own chrome (`.certificate-page-chrome`) — a future pass could also hide the global app shell's sidebar/topbar for an even cleaner print output, once those class names are confirmed; not attempted here to avoid guessing at shell internals.
- `HandoverCompletion` has no "restore" mutation — `ArchiveSummaryCardComponent` states this explicitly as a future placeholder rather than silently omitting it.
- The Owner Mobile App would read `CompletionStoreService.getByHandoverId()` and `CertificatePreviewComponent`'s same inputs directly to show the owner their own possession certificate — kept auth- and role-agnostic for exactly this reuse, same reasoning as every prior BUILDER-006x model.
- **This closes the entire BUILDER-006 sub-series.** A future BUILDER-007 (Snag Management, deferred since 006A) would be the next logical addition to the stage pipeline, following the identical `updateStageStatus()` pattern for `snag-resolution`.

## 9. Verification

- `npm run build` — succeeds, no TypeScript errors. Initial bundle: 2.15MB (up ~10KB from 006C's 2.14MB, still fully lazy — comfortable headroom against the 2.4MB ceiling).
- `npm run lint` — all files pass.
- Confirmed via compiled build output (`dist/.../styles-*.css`) that `.completion-status-badge`, `.certificate-preview` (including its `@media print` override), `.owner-package-card__section-title`, `.future-integrations-grid` and other new classes compile as plain, unscoped selectors — the CSS-encapsulation fix held clean a seventh time.
- `ng serve` confirmed reachable (HTTP 200) for `/builder-portal/handovers/handover-001/{completion,certificate,archive}` (pre-seeded complete) and `/builder-portal/handovers/handover-003/completion` (not-ready state). Full interactive walkthrough (finalize → generate certificate → print → archive) was not exercised in an actual browser click-through in this pass — recommended as the next verification step, same caveat noted in 006B/006C's own docs.

---

## Final Review

Per this module's own "FINAL REVIEW (MANDATORY)" instruction, a complete review of the Digital Property Handover domain (006A–006D) was performed and is recorded separately in **`docs/DIGITAL_HANDOVER_READINESS_REPORT.md`** — covering workflow consistency, navigation, UI/theme/white-label consistency, component reuse, routing, extension points, technical debt, and UX improvement suggestions across all four sub-modules.
