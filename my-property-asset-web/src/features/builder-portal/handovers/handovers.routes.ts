import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_HANDOVER_APPROVAL_METADATA,
  BUILDER_PORTAL_HANDOVER_ACTIVATION_METADATA,
  BUILDER_PORTAL_HANDOVER_ARCHIVE_METADATA,
  BUILDER_PORTAL_HANDOVER_AUDIT_METADATA,
  BUILDER_PORTAL_HANDOVER_CERTIFICATE_METADATA,
  BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA,
  BUILDER_PORTAL_HANDOVER_COMPLETION_METADATA,
  BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  BUILDER_PORTAL_HANDOVER_DOCUMENTS_METADATA,
  BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA,
  BUILDER_PORTAL_HANDOVER_INVITATION_METADATA,
  BUILDER_PORTAL_HANDOVER_REVIEW_METADATA,
  BUILDER_PORTAL_HANDOVER_SIGNATURE_METADATA,
  BUILDER_PORTAL_HANDOVERS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { HandoverDetailPageComponent } from './pages/handover-detail-page.component';
import { HandoverWorkspacePageComponent } from './pages/handover-workspace-page.component';

export const HANDOVER_ROUTES: Routes = [
  {
    path: '',
    component: HandoverWorkspacePageComponent,
    data: BUILDER_PORTAL_HANDOVERS_METADATA,
  },
  {
    path: ':id',
    component: HandoverDetailPageComponent,
    data: BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  },
  {
    path: ':id/inspection',
    loadComponent: () =>
      import('./inspection/pages/inspection-overview-page.component').then((m) => m.InspectionOverviewPageComponent),
    data: BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA,
  },
  {
    path: ':id/checklist',
    loadComponent: () =>
      import('./inspection/pages/checklist-execution-page.component').then((m) => m.ChecklistExecutionPageComponent),
    data: BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA,
  },
  {
    path: ':id/documents',
    loadComponent: () =>
      import('./pages/handover-documents-page.component').then((m) => m.HandoverDocumentsPageComponent),
    data: BUILDER_PORTAL_HANDOVER_DOCUMENTS_METADATA,
  },
  {
    path: ':id/invitation',
    loadComponent: () =>
      import('./pages/handover-invitation-page.component').then((m) => m.HandoverInvitationPageComponent),
    data: BUILDER_PORTAL_HANDOVER_INVITATION_METADATA,
  },
  {
    path: ':id/activation',
    loadComponent: () =>
      import('./pages/handover-activation-page.component').then((m) => m.HandoverActivationPageComponent),
    data: BUILDER_PORTAL_HANDOVER_ACTIVATION_METADATA,
  },
  {
    path: ':id/audit',
    loadComponent: () =>
      import('./pages/handover-audit-page.component').then((m) => m.HandoverAuditPageComponent),
    data: BUILDER_PORTAL_HANDOVER_AUDIT_METADATA,
  },
  {
    path: ':id/approval',
    loadComponent: () =>
      import('./approval/pages/approval-workspace-page.component').then((m) => m.ApprovalWorkspacePageComponent),
    data: BUILDER_PORTAL_HANDOVER_APPROVAL_METADATA,
  },
  {
    path: ':id/review',
    loadComponent: () =>
      import('./approval/pages/owner-review-page.component').then((m) => m.OwnerReviewPageComponent),
    data: BUILDER_PORTAL_HANDOVER_REVIEW_METADATA,
  },
  {
    path: ':id/signature',
    loadComponent: () =>
      import('./approval/pages/signature-page.component').then((m) => m.SignaturePageComponent),
    data: BUILDER_PORTAL_HANDOVER_SIGNATURE_METADATA,
  },
  {
    path: ':id/completion',
    loadComponent: () =>
      import('./completion/pages/completion-workspace-page.component').then((m) => m.CompletionWorkspacePageComponent),
    data: BUILDER_PORTAL_HANDOVER_COMPLETION_METADATA,
  },
  {
    path: ':id/certificate',
    loadComponent: () =>
      import('./completion/pages/certificate-page.component').then((m) => m.CertificatePageComponent),
    data: BUILDER_PORTAL_HANDOVER_CERTIFICATE_METADATA,
  },
  {
    path: ':id/archive',
    loadComponent: () =>
      import('./completion/pages/archive-page.component').then((m) => m.ArchivePageComponent),
    data: BUILDER_PORTAL_HANDOVER_ARCHIVE_METADATA,
  },
];
