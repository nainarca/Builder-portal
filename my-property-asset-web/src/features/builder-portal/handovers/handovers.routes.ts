import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_HANDOVER_APPROVAL_METADATA,
  BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA,
  BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA,
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
];
