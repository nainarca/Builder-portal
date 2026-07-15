import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_HANDOVER_DETAIL_METADATA,
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
];
