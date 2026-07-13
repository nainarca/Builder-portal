import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_BUILDER_CREATE_METADATA,
  SUPER_ADMIN_BUILDER_DETAIL_METADATA,
  SUPER_ADMIN_BUILDER_EDIT_METADATA,
  SUPER_ADMIN_BUILDERS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { builderUnsavedChangesGuard } from './guards/builder-unsaved-changes.guard';
import { BuilderCreatePageComponent } from './pages/builder-create-page.component';
import { BuilderDetailPageComponent } from './pages/builder-detail-page.component';
import { BuilderEditPageComponent } from './pages/builder-edit-page.component';
import { BuilderListPageComponent } from './pages/builder-list-page.component';

export const BUILDER_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: BuilderListPageComponent,
    data: SUPER_ADMIN_BUILDERS_METADATA,
  },
  {
    path: 'new',
    component: BuilderCreatePageComponent,
    canDeactivate: [builderUnsavedChangesGuard],
    data: SUPER_ADMIN_BUILDER_CREATE_METADATA,
  },
  {
    path: ':id',
    component: BuilderDetailPageComponent,
    data: SUPER_ADMIN_BUILDER_DETAIL_METADATA,
  },
  {
    path: ':id/edit',
    component: BuilderEditPageComponent,
    canDeactivate: [builderUnsavedChangesGuard],
    data: SUPER_ADMIN_BUILDER_EDIT_METADATA,
  },
];
