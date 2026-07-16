import { Routes } from '@angular/router';

import {
  BUILDER_PORTAL_PROJECT_CREATE_METADATA,
  BUILDER_PORTAL_PROJECT_DETAIL_METADATA,
  BUILDER_PORTAL_PROJECT_EDIT_METADATA,
  BUILDER_PORTAL_PROJECTS_LIST_METADATA,
  BUILDER_PORTAL_PROJECTS_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { projectUnsavedChangesGuard } from './guards/project-unsaved-changes.guard';
import { ProjectCreatePageComponent } from './pages/project-create-page.component';
import { ProjectDetailPageComponent } from './pages/project-detail-page.component';
import { ProjectEditPageComponent } from './pages/project-edit-page.component';
import { ProjectListPageComponent } from './pages/project-list-page.component';
import { ProjectWorkspacePageComponent } from './pages/project-workspace-page.component';
import { projectResolver } from './resolvers/project.resolver';

export const PROJECT_ROUTES: Routes = [
  {
    path: '',
    component: ProjectWorkspacePageComponent,
    data: BUILDER_PORTAL_PROJECTS_METADATA,
  },
  {
    path: 'list',
    component: ProjectListPageComponent,
    data: BUILDER_PORTAL_PROJECTS_LIST_METADATA,
  },
  {
    path: 'create',
    component: ProjectCreatePageComponent,
    canDeactivate: [projectUnsavedChangesGuard],
    data: BUILDER_PORTAL_PROJECT_CREATE_METADATA,
  },
  {
    path: ':id',
    component: ProjectDetailPageComponent,
    resolve: { project: projectResolver },
    data: BUILDER_PORTAL_PROJECT_DETAIL_METADATA,
  },
  {
    path: ':id/edit',
    component: ProjectEditPageComponent,
    resolve: { project: projectResolver },
    canDeactivate: [projectUnsavedChangesGuard],
    data: BUILDER_PORTAL_PROJECT_EDIT_METADATA,
  },
  {
    // Existing units mock route retained; P8 does not implement Units domain.
    path: ':id/units',
    loadChildren: () => import('./units/units.routes').then((m) => m.UNIT_ROUTES),
  },
];
