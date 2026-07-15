import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_OWNER_ASSIGN_METADATA,
  BUILDER_PORTAL_OWNER_DETAIL_METADATA,
  BUILDER_PORTAL_OWNER_EDIT_METADATA,
  BUILDER_PORTAL_OWNERS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { ownerUnsavedChangesGuard } from './guards/owner-unsaved-changes.guard';
import { OwnerAssignPageComponent } from './pages/owner-assign-page.component';
import { OwnerDetailPageComponent } from './pages/owner-detail-page.component';
import { OwnerEditPageComponent } from './pages/owner-edit-page.component';
import { OwnerWorkspacePageComponent } from './pages/owner-workspace-page.component';

export const OWNER_ROUTES: Routes = [
  {
    path: '',
    component: OwnerWorkspacePageComponent,
    data: BUILDER_PORTAL_OWNERS_METADATA,
  },
  {
    path: 'assign',
    component: OwnerAssignPageComponent,
    canDeactivate: [ownerUnsavedChangesGuard],
    data: BUILDER_PORTAL_OWNER_ASSIGN_METADATA,
  },
  {
    path: ':id',
    component: OwnerDetailPageComponent,
    data: BUILDER_PORTAL_OWNER_DETAIL_METADATA,
  },
  {
    path: ':id/edit',
    component: OwnerEditPageComponent,
    canDeactivate: [ownerUnsavedChangesGuard],
    data: BUILDER_PORTAL_OWNER_EDIT_METADATA,
  },
];
