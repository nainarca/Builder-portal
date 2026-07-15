import { Routes } from '@angular/router';

import { BUILDER_PORTAL_DASHBOARD_METADATA } from '../../core/constants/route-metadata.constants';
import { BuilderPortalLayoutComponent } from '../../layouts/builder-portal/builder-portal-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { BuilderDashboardComponent } from './builder-dashboard.component';

export const BUILDER_PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: BuilderPortalLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'builder-portal',
      navigationContext: 'builder-portal',
    },
    children: [
      {
        path: '',
        component: BuilderDashboardComponent,
        data: BUILDER_PORTAL_DASHBOARD_METADATA,
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.routes').then((m) => m.PROJECT_ROUTES),
      },
      {
        path: 'owners',
        loadChildren: () => import('./owners/owners.routes').then((m) => m.OWNER_ROUTES),
      },
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.routes').then((m) => m.DOCUMENT_ROUTES),
      },
      {
        path: 'handovers',
        loadChildren: () => import('./handovers/handovers.routes').then((m) => m.HANDOVER_ROUTES),
      },
    ],
  },
];
