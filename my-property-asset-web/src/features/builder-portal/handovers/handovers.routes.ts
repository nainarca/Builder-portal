import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_HANDOVER_CHECKLIST_METADATA,
  BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
  BUILDER_PORTAL_HANDOVER_INSPECTION_METADATA,
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
];
