import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_ORGANIZATION_CREATE_METADATA,
  SUPER_ADMIN_ORGANIZATION_DETAIL_METADATA,
  SUPER_ADMIN_ORGANIZATION_EDIT_METADATA,
  SUPER_ADMIN_ORGANIZATIONS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { organizationUnsavedChangesGuard } from './guards/organization-unsaved-changes.guard';
import { OrganizationCreatePageComponent } from './pages/organization-create-page.component';
import { OrganizationDetailPageComponent } from './pages/organization-detail-page.component';
import { OrganizationEditPageComponent } from './pages/organization-edit-page.component';
import { OrganizationListPageComponent } from './pages/organization-list-page.component';

export const ORGANIZATION_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: OrganizationListPageComponent,
    data: SUPER_ADMIN_ORGANIZATIONS_METADATA,
  },
  {
    path: 'new',
    component: OrganizationCreatePageComponent,
    canDeactivate: [organizationUnsavedChangesGuard],
    data: SUPER_ADMIN_ORGANIZATION_CREATE_METADATA,
  },
  {
    path: ':id',
    component: OrganizationDetailPageComponent,
    data: SUPER_ADMIN_ORGANIZATION_DETAIL_METADATA,
  },
  {
    path: ':id/edit',
    component: OrganizationEditPageComponent,
    canDeactivate: [organizationUnsavedChangesGuard],
    data: SUPER_ADMIN_ORGANIZATION_EDIT_METADATA,
  },
];
