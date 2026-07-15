import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_UNIT_CREATE_METADATA,
  BUILDER_PORTAL_UNIT_DETAIL_METADATA,
  BUILDER_PORTAL_UNIT_EDIT_METADATA,
  BUILDER_PORTAL_UNITS_METADATA,
} from '../../../../core/constants/route-metadata.constants';
import { unitUnsavedChangesGuard } from './guards/unit-unsaved-changes.guard';
import { UnitCreatePageComponent } from './pages/unit-create-page.component';
import { UnitDetailPageComponent } from './pages/unit-detail-page.component';
import { UnitEditPageComponent } from './pages/unit-edit-page.component';
import { UnitWorkspacePageComponent } from './pages/unit-workspace-page.component';

export const UNIT_ROUTES: Routes = [
  {
    path: '',
    component: UnitWorkspacePageComponent,
    data: BUILDER_PORTAL_UNITS_METADATA,
  },
  {
    path: 'create',
    component: UnitCreatePageComponent,
    canDeactivate: [unitUnsavedChangesGuard],
    data: BUILDER_PORTAL_UNIT_CREATE_METADATA,
  },
  {
    path: ':unitId',
    component: UnitDetailPageComponent,
    data: BUILDER_PORTAL_UNIT_DETAIL_METADATA,
  },
  {
    path: ':unitId/edit',
    component: UnitEditPageComponent,
    canDeactivate: [unitUnsavedChangesGuard],
    data: BUILDER_PORTAL_UNIT_EDIT_METADATA,
  },
];
